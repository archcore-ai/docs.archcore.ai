/**
 * The single source of truth for every PostHog event fired by archcore.ai.
 *
 * This file is deliberately dependency-free and alias-free (no `@/` imports)
 * because it is shared verbatim across build systems: the Vite SPA imports it
 * directly, and the Astro content-site imports it by relative path. The docs
 * site lives in a separate repository and keeps a trimmed copy — see
 * .archcore/landing/analytics-event-taxonomy.doc.md for the sync contract.
 *
 * Naming rules, so funnels stay queryable:
 *   - snake_case, `object_verb` in the past tense (`install_command_copied`)
 *   - never bake a value into the name (`install_platform_switched` + a `to`
 *     property, not `install_switched_to_windows`)
 *   - every event carries the super properties registered in core.ts, so
 *     per-event props describe only what the super properties cannot.
 */

/** Which of the three deployed surfaces fired the event. Super property. */
export type Site = "landing" | "content" | "docs";

/** Platform an install command targets. */
export type InstallPlatform = "unix" | "windows";

/** Section of the content hub an article belongs to. */
export type ContentSection = "blog" | "learn" | "alternatives";

/**
 * Where a navigation click happened. Everything but "body" is site chrome;
 * "body" is in-content prose, reported only when the click crosses between
 * landing, content hub and docs.
 */
export type NavLocation =
  | "header"
  | "footer"
  | "mobile-menu"
  | "sidebar"
  | "body";

/**
 * Props attached to every event automatically. Registered once at init so
 * they land on autocaptured events and pageviews too, not just manual calls.
 */
export interface SuperProperties {
  site: Site;
  /** UI language at init. `locale_switched` records later changes. */
  locale: string;
  /** "light" | "dark" — resolved, not the "system" preference itself. */
  color_scheme: string;
}

/**
 * Event name → its properties. `track()` is typed against this map, so a
 * typo in a name or a missing property is a build error rather than a
 * silently-dropped event that only surfaces as an empty funnel weeks later.
 */
export interface AnalyticsEventMap {
  // ---------------------------------------------------------------- install
  /** The primary conversion signal across the whole project. */
  install_command_copied: {
    command: string;
    platform: InstallPlatform;
    /** Component or page region that owns the copy button. */
    surface: string;
    /** Which artifact the command installs, when distinguishable. */
    install_target?: "cli" | "plugin" | "custom";
  };
  install_platform_switched: {
    from: InstallPlatform;
    to: InstallPlatform;
    surface: string;
  };
  /** A non-install snippet copied from a walkthrough or docs code block. */
  code_snippet_copied: {
    surface: string;
    language?: string;
    /** Page path the snippet was copied from. */
    page: string;
    /** Set when the copy came from a text selection rather than a button. */
    via?: "button" | "selection";
  };

  // ------------------------------------------------------------ navigation
  /** Click on a link leaving archcore.ai entirely. */
  outbound_link_clicked: {
    url: string;
    domain: string;
    label?: string;
    surface?: string;
  };
  /** Click that moves between the three surfaces, or within site chrome. */
  nav_link_clicked: {
    label?: string;
    destination: string;
    location: NavLocation;
    /** Set when the click crosses a surface boundary, e.g. landing → docs. */
    to_site?: Site;
  };
  /** A tracked call-to-action button, as opposed to plain chrome navigation. */
  cta_clicked: {
    /** Stable identifier for the CTA, e.g. "hero_primary". */
    cta: string;
    destination?: string;
    surface: string;
  };
  github_star_clicked: {
    repo: "org" | "cli" | "plugin";
    /** Star count shown at click time, for correlating with the counter. */
    stars?: number;
    surface: string;
  };

  // ------------------------------------------------------------ engagement
  /** Fired once per section per pageview when it first becomes visible. */
  section_viewed: {
    section: string;
    /** 0-based order of the section within the page. */
    position: number;
  };
  /** Fired once per threshold per pageview. */
  scroll_depth_reached: {
    depth: 25 | 50 | 75 | 100;
    page: string;
  };
  faq_item_opened: {
    /**
     * The visible question text, so the event reads without a lookup table.
     * It is localised, so break down by the `locale` super property rather
     * than expecting one string per question across languages.
     */
    question: string;
    /** 0-based order in the list — stable across translations. */
    position: number;
    surface: string;
  };
  locale_switched: {
    from: string;
    to: string;
  };
  theme_switched: {
    to: string;
  };

  // --------------------------------------------------------------- content
  /** Reader reached the end of an article body. */
  article_read_completed: {
    slug: string;
    section: ContentSection;
  };
  //
  // There is deliberately no event for the raw-markdown twins (/blog/x.md).
  // They are only advertised through <link rel="alternate"> and served as
  // plain text, so nothing clicks them and no script runs on them — the
  // traffic is only visible in server logs, which GitHub Pages does not give
  // us. Add one here only if a visible link to them ever ships.

  // ------------------------------------------------------------------ docs
  docs_search_opened: Record<string, never>;
  /**
   * Docs search terms are the highest-signal content-backlog input available —
   * they are what readers expected to find and did not. Reported debounced,
   * once per settled query, not per keystroke.
   */
  docs_search_submitted: {
    query: string;
    query_length: number;
    /** Pagefind result count, when it can be read off the results list. */
    results?: number;
  };
  //
  // No event for the generated llms.txt / llms-full.txt / llms-small.txt sets:
  // nothing in the docs UI links to them, and they are served as plain text
  // where no script runs. Agents fetch them directly, which is only visible in
  // server logs that GitHub Pages does not expose.

  // ---------------------------------------------------------------- wizard
  //
  // Property names follow the walkthrough's own vocabulary — a "branch" is a
  // path through it, a "mode" is the plugin/CLI toggle — so the funnel in
  // PostHog reads the same way as src/content/how-to-use.
  /** Funnel entry: which path the visitor picked. */
  wizard_branch_started: {
    branch: string;
  };
  wizard_step_viewed: {
    branch: string;
    step: string;
    step_index: number;
    mode: string;
  };
  wizard_mode_switched: {
    branch: string;
    from: string;
    to: string;
  };
  wizard_completed: {
    branch: string;
    mode: string;
  };
  /** Restarting mid-walkthrough is the clearest signal a step confused someone. */
  wizard_restarted: {
    branch?: string;
    step?: string;
  };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
