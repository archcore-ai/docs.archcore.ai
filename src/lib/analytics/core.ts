/**
 * Framework-agnostic PostHog wiring shared by every archcore.ai surface.
 *
 * Like events.ts this file is alias-free and imports nothing but posthog-js,
 * so the Astro content-site can import it by relative path and the docs
 * repository can vendor it unchanged.
 *
 * Three things it exists to guarantee:
 *
 * 1. posthog-js is loaded with a dynamic import, so ~170 kB of analytics
 *    lands in its own chunk fetched after the first interaction instead of
 *    riding along in the entry bundle and being parsed before first paint.
 * 2. `track()` is typed against AnalyticsEventMap and buffers calls made
 *    before the client finishes loading, so an install-command copy in the
 *    first second of a visit is still recorded.
 * 3. Link clicks, scroll depth, section visibility and code copies are
 *    instrumented once here rather than per component, so all three surfaces
 *    emit the same events without touching every file.
 */

import type { PostHog } from "posthog-js";
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
  ContentSection,
  NavLocation,
  Site,
} from "./events";

const DEFAULT_HOST = "https://us.i.posthog.com";

/** Hosts that belong to the project and must not count as outbound. */
const OWN_DOMAIN = "archcore.ai";

/** Path prefixes served by the Astro content-site build. */
const CONTENT_PREFIXES = ["/blog", "/learn", "/alternatives"] as const;

export interface AnalyticsConfig {
  site: Site;
  /** PostHog project API key. Analytics no-ops when absent. */
  key: string | undefined;
  /** PostHog ingestion host. Falls back to PostHog US cloud. */
  host?: string | undefined;
  /** UI language at init; `locale_switched` records later changes. */
  locale?: string;
  /**
   * Session replay. Off deliberately: /privacy enumerates exactly what we
   * collect ("pages viewed, referrer, country, approximate device type"), and
   * replay is none of those. Turning this on requires updating that copy
   * first — see .archcore/landing/analytics-event-taxonomy.doc.md.
   */
  enableSessionRecording?: boolean;
  /** Log to the console instead of sending. Used for dev builds. */
  debug?: boolean;
  /**
   * Milliseconds of inactivity after which analytics loads anyway, so a
   * visitor who never clicks or scrolls is still counted.
   */
  idleFallbackMs?: number;
}

interface QueuedEvent {
  name: string;
  properties: Record<string, unknown>;
  timestamp: Date;
}

let config: AnalyticsConfig | null = null;
let client: PostHog | null = null;
let loadPromise: Promise<PostHog | null> | null = null;
let queue: QueuedEvent[] = [];
let extraSuperProperties: Record<string, unknown> = {};

function resolvedColorScheme(): string {
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return typeof matchMedia === "function" &&
    matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function superProperties(cfg: AnalyticsConfig): Record<string, unknown> {
  return {
    site: cfg.site,
    locale: cfg.locale ?? document.documentElement.lang ?? "en",
    color_scheme: resolvedColorScheme(),
    ...extraSuperProperties,
  };
}

/**
 * Loads and initialises posthog-js at most once. Resolves to null when there
 * is no key or the script is blocked — analytics must never break the page.
 */
function loadClient(): Promise<PostHog | null> {
  if (client) return Promise.resolve(client);
  if (loadPromise) return loadPromise;

  const cfg = config;
  if (!cfg?.key || cfg.debug) return Promise.resolve(null);

  loadPromise = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(cfg.key as string, {
        api_host: cfg.host || DEFAULT_HOST,
        // PostHog's dated config preset. Gives us history-based pageviews
        // (so SPA route changes are captured without touching the router),
        // pageleave for bounce and time-on-page, rageclick detection, and
        // identified_only person profiles so anonymous traffic does not
        // create person records.
        defaults: "2025-11-30",
        // /privacy states analytics respect Do Not Track. posthog-js
        // defaults this to false, so the promise has to be set explicitly.
        respect_dnt: true,
        // Scopes the cookie to .archcore.ai so one visitor keeps a single
        // distinct_id across archcore.ai and docs.archcore.ai. This is the
        // current library default; pinned so a future flip in the default
        // cannot quietly split the cross-surface funnel in two.
        cross_subdomain_cookie: true,
        disable_session_recording: !cfg.enableSessionRecording,
        // Runs before the initial $pageview, which init schedules on a 1 ms
        // timeout after this callback. Registering here is what puts `site`
        // on the pageview rather than only on later events.
        loaded: (instance) => {
          instance.register(superProperties(cfg));
        },
      });
      client = posthog;
      flushQueue();
      return posthog;
    })
    .catch(() => {
      // Blocked by a content blocker or a failed chunk fetch. Drop the queue
      // so it cannot grow without bound over a long session.
      queue = [];
      return null;
    });

  return loadPromise;
}

function flushQueue() {
  if (!client) return;
  const pending = queue;
  queue = [];
  for (const event of pending) {
    client.capture(event.name, event.properties, { timestamp: event.timestamp });
  }
}

/**
 * Records an event. Type-checked against AnalyticsEventMap, so a renamed or
 * misspelled event fails the build instead of silently producing an empty
 * funnel. Safe to call before init and before the DOM is ready.
 */
export function track<K extends AnalyticsEventName>(
  name: K,
  ...args: Record<string, never> extends AnalyticsEventMap[K]
    ? [properties?: AnalyticsEventMap[K]]
    : [properties: AnalyticsEventMap[K]]
): void {
  const properties = (args[0] ?? {}) as Record<string, unknown>;

  if (config?.debug) {
    console.debug("[analytics]", name, properties);
    return;
  }
  if (!config?.key) return;

  if (client) {
    client.capture(name, properties);
    return;
  }

  // Cap the buffer so a blocked or very slow load cannot leak memory.
  if (queue.length < 50) {
    queue.push({ name, properties, timestamp: new Date() });
  }
  void loadClient();
}

/**
 * Adds or overrides super properties on all subsequent events — used when the
 * visitor switches language or theme mid-session.
 */
export function registerSuperProperties(props: Record<string, unknown>): void {
  extraSuperProperties = { ...extraSuperProperties, ...props };
  client?.register(props);
}

/** The loaded PostHog client, or null. For the rare call outside `track()`. */
export function getClient(): PostHog | null {
  return client;
}

// ---------------------------------------------------------------------------
// Location changes
//
// History-based pageviews are PostHog's job; this is only so the page-scoped
// trackers below (scroll depth, section views) can reset on SPA navigation.
// ---------------------------------------------------------------------------

const locationListeners = new Set<() => void>();
let historyPatched = false;

function onLocationChange(listener: () => void) {
  locationListeners.add(listener);

  if (historyPatched) return;
  historyPatched = true;

  const notify = () => {
    for (const fn of locationListeners) fn();
  };

  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method];
    history[method] = function patched(
      this: History,
      ...args: Parameters<typeof original>
    ) {
      const result = original.apply(this, args);
      notify();
      return result;
    };
  }
  addEventListener("popstate", notify);
}

// ---------------------------------------------------------------------------
// Automatic instrumentation
// ---------------------------------------------------------------------------

/**
 * Whether a hostname belongs to the project. The current host counts too, so
 * localhost and preview deployments classify their own links as internal
 * instead of reporting every in-site click as outbound traffic.
 */
function isOwnHost(hostname: string): boolean {
  return (
    hostname === OWN_DOMAIN ||
    hostname.endsWith(`.${OWN_DOMAIN}`) ||
    hostname === location.hostname
  );
}

/**
 * Which surface serves a given same-project URL.
 *
 * In production the docs are the only surface on their own subdomain, so the
 * hostname settles it. Locally every surface is served from localhost, where
 * that signal is missing — hence `currentSite`: a same-host link from a docs
 * page is still the docs, so development does not report phantom
 * docs → landing navigation.
 */
function siteForUrl(url: URL, currentSite: Site): Site {
  if (url.hostname.startsWith("docs.")) return "docs";
  if (currentSite === "docs" && url.hostname === location.hostname) {
    return "docs";
  }
  return CONTENT_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))
    ? "content"
    : "landing";
}

function navLocationFor(anchor: Element): NavLocation {
  if (anchor.closest('nav[aria-label*="Mobile" i]')) return "mobile-menu";
  if (anchor.closest("header")) return "header";
  if (anchor.closest("footer")) return "footer";
  if (anchor.closest("aside, .sidebar, nav.sidebar, starlight-menu-button")) {
    return "sidebar";
  }
  return "body";
}

/**
 * One delegated listener for every link on the page, applying three rules in
 * order:
 *
 *   0. An anchor inside [data-analytics-handled] already reports a richer,
 *      more specific event from its own handler — the GitHub star links, for
 *      instance. Skipped entirely, so one click never produces both a semantic
 *      event and a generic one.
 *   1. An anchor inside [data-analytics-cta] is a tracked call to action and
 *      reports `cta_clicked` under the id in that attribute. Declarative so a
 *      CTA is marked in markup instead of wiring an onClick per component,
 *      and so a CTA is never counted twice as navigation as well.
 *   2. A link leaving archcore.ai entirely reports `outbound_link_clicked`.
 *      docs.archcore.ai is explicitly not outbound.
 *   3. A link in the site chrome — header, footer, mobile menu, sidebar — or
 *      one crossing between landing, content hub and docs reports
 *      `nav_link_clicked`. Body links within one surface are left to
 *      autocapture, which is what stops in-content prose from flooding the
 *      navigation funnel.
 *
 * Capture phase, because some components stop propagation on click.
 */
function attachLinkTracking(site: Site) {
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.closest("[data-analytics-handled]")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const label = anchor.textContent?.trim().slice(0, 120) || undefined;
      const ctaHost = anchor.closest("[data-analytics-cta]");
      if (ctaHost) {
        track("cta_clicked", {
          cta: ctaHost.getAttribute("data-analytics-cta") || "unnamed",
          destination: href,
          surface: navLocationFor(anchor),
        });
        return;
      }

      if (href.startsWith("#")) return;

      if (/^(mailto|tel):/i.test(href)) {
        track("outbound_link_clicked", {
          url: href,
          domain: href.split(":")[0]?.toLowerCase() ?? "mailto",
          ...(label ? { label } : {}),
        });
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol)) return;

      if (!isOwnHost(url.hostname)) {
        track("outbound_link_clicked", {
          url: url.href,
          domain: url.hostname,
          ...(label ? { label } : {}),
          surface: navLocationFor(anchor),
        });
        return;
      }

      const destinationSite = siteForUrl(url, site);
      const navLocation = navLocationFor(anchor);
      if (destinationSite !== site || navLocation !== "body") {
        track("nav_link_clicked", {
          ...(label ? { label } : {}),
          // A path alone is ambiguous across hosts — docs.archcore.ai/ and
          // archcore.ai/ are both "/" — so a link to another host reports its
          // full URL and a same-host link reports the path.
          destination:
            url.hostname === location.hostname ? url.pathname : url.href,
          location: navLocation,
          ...(destinationSite !== site ? { to_site: destinationSite } : {}),
        });
      }
    },
    { capture: true, passive: true }
  );
}

/** Fires each of 25/50/75/100 % once per pageview. */
function attachScrollDepth() {
  const thresholds = [25, 50, 75, 100] as const;
  let reached = new Set<number>();

  const measure = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - innerHeight;
    // A page that barely scrolls would report 100 % instantly and drown the
    // real signal, so short pages are skipped entirely.
    if (scrollable < innerHeight * 0.2) return;

    const percent = ((scrollY + innerHeight) / doc.scrollHeight) * 100;
    for (const threshold of thresholds) {
      if (percent >= threshold && !reached.has(threshold)) {
        reached.add(threshold);
        track("scroll_depth_reached", {
          depth: threshold,
          page: location.pathname,
        });
      }
    }
  };

  let scheduled = false;
  addEventListener(
    "scroll",
    () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        measure();
      });
    },
    { passive: true }
  );

  onLocationChange(() => {
    reached = new Set();
  });
}

/**
 * Reports the first time each `<section id>` becomes meaningfully visible.
 * On a long landing page this is what shows where attention stops.
 */
function attachSectionViews() {
  if (typeof IntersectionObserver !== "function") return;

  let seen = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.id;
        if (!id || seen.has(id)) continue;
        seen.add(id);
        const sections = Array.from(document.querySelectorAll("section[id]"));
        track("section_viewed", {
          section: id,
          position: sections.indexOf(entry.target),
        });
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.3 }
  );

  const observeAll = () => {
    document
      .querySelectorAll("section[id]")
      .forEach((section) => observer.observe(section));
  };

  observeAll();
  onLocationChange(() => {
    seen = new Set();
    // Route components mount after the history entry changes.
    setTimeout(observeAll, 100);
  });
}

/**
 * Code copies, from either the copy button of a code block or a plain text
 * selection inside one.
 *
 * Copying the installer out of a docs page or a blog post is the same
 * conversion as copying it from the landing hero, so the copied text is
 * classified here and reported as `install_command_copied` when it is an
 * install command. That keeps one comparable conversion metric across all
 * three surfaces instead of a landing-only one.
 *
 * Elements marked data-analytics-install report the event themselves with
 * richer properties and are skipped.
 */
function attachCodeCopyTracking() {
  const CODE_BLOCK = "pre, figure.frame, .expressive-code, [data-code-block]";

  const report = (
    block: Element | null,
    text: string,
    surface: string,
    via: "button" | "selection"
  ) => {
    const install = classifyInstallCommand(text);
    if (install) {
      track("install_command_copied", {
        command: install.command,
        platform: install.platform,
        surface,
        install_target: "cli",
      });
      return;
    }
    track("code_snippet_copied", {
      surface,
      ...languageOf(block),
      page: location.pathname,
      via,
    });
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest("button");
      if (!button) return;
      if (button.closest("[data-analytics-install]")) return;

      // Covers our own markup (data-analytics-copy), Starlight/Expressive
      // Code (a `data-code` button wrapped in div.copy, labelled by title
      // rather than aria-label) and the generic `copy` class.
      const isCopyButton =
        button.hasAttribute("data-analytics-copy") ||
        button.hasAttribute("data-code") ||
        button.classList.contains("copy") ||
        Boolean(button.closest(".copy")) ||
        /copy/i.test(button.getAttribute("aria-label") ?? "") ||
        /copy/i.test(button.getAttribute("title") ?? "");
      if (!isCopyButton) return;

      const block = button.closest(CODE_BLOCK);
      const text =
        button.getAttribute("data-code") ??
        block?.querySelector("code")?.textContent ??
        "";
      report(
        block,
        text,
        button.getAttribute("data-analytics-copy") || "code_block",
        "button"
      );
    },
    { capture: true, passive: true }
  );

  document.addEventListener("copy", () => {
    const selection = getSelection();
    const anchorNode = selection?.anchorNode;
    if (!anchorNode) return;
    const element =
      anchorNode instanceof Element ? anchorNode : anchorNode.parentElement;
    const block = element?.closest(CODE_BLOCK);
    if (!block) return;
    if (block.closest("[data-analytics-install]")) return;

    report(block, selection?.toString() ?? "", "code_block", "selection");
  });
}

/**
 * Recognises the two installer one-liners archcore.ai publishes, wherever
 * they appear. Returns null for any other snippet.
 */
function classifyInstallCommand(
  text: string
): { command: string; platform: "unix" | "windows" } | null {
  const command = text.trim();
  if (/archcore\.ai\/install\.sh/.test(command)) {
    return { command, platform: "unix" };
  }
  if (/archcore\.ai\/install\.ps1/.test(command)) {
    return { command, platform: "windows" };
  }
  return null;
}

/**
 * Best-effort language of a code block. Starlight puts data-language on the
 * <pre> inside figure.frame, so descendants are checked as well as the block
 * itself, with the language-* class convention as a fallback.
 */
function languageOf(block: Element | null): { language?: string } {
  if (!block) return {};
  const host = block.matches("[data-language]")
    ? block
    : block.querySelector("[data-language]");
  const dataLanguage = host?.getAttribute("data-language");
  if (dataLanguage) return { language: dataLanguage };

  const source = block.querySelector("code") ?? block;
  const match = /(?:language|lang)-([a-z0-9+#-]+)/i.exec(source.className);
  return match?.[1] ? { language: match[1] } : {};
}

/**
 * Reports that a reader reached the end of an article body. Called by the
 * content-site layouts, which know the slug and section; there is no reliable
 * way to infer either from the DOM.
 */
export function trackArticleCompletion(
  endMarker: Element,
  slug: string,
  section: ContentSection
): void {
  if (typeof IntersectionObserver !== "function") return;
  let fired = false;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || fired) continue;
      fired = true;
      track("article_read_completed", { slug, section });
      observer.disconnect();
    }
  });
  observer.observe(endMarker);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Registers automatic instrumentation immediately and defers loading
 * posthog-js until the visitor interacts, hides the tab, or goes idle —
 * whichever happens first. Analytics never competes with first paint, and a
 * visitor who bounces without interacting is still counted.
 */
export function setupAnalytics(cfg: AnalyticsConfig): void {
  if (config) return;
  config = cfg;

  if (typeof document === "undefined") return;

  if (!cfg.key && !cfg.debug) {
    console.warn(
      "[analytics] No PostHog key configured — no events will be sent."
    );
  }

  attachLinkTracking(cfg.site);
  attachScrollDepth();
  attachSectionViews();
  attachCodeCopyTracking();

  if (cfg.debug || !cfg.key) return;

  const triggers = ["pointerdown", "keydown", "scroll"] as const;

  const start = () => {
    triggers.forEach((name) => removeEventListener(name, start));
    document.removeEventListener("visibilitychange", onVisibilityChange);
    clearTimeout(idleTimer);
    void loadClient();
  };

  function onVisibilityChange() {
    if (document.visibilityState === "hidden") start();
  }

  triggers.forEach((name) =>
    addEventListener(name, start, { once: true, passive: true })
  );
  document.addEventListener("visibilitychange", onVisibilityChange);
  // Declared last so it can be a const; `start` only closes over it and
  // cannot run before this line, since nothing dispatches synchronously
  // between registering the listeners above and this statement.
  const idleTimer = setTimeout(start, cfg.idleFallbackMs ?? 2500);
}
