/**
 * Docs-only instrumentation, layered on top of the shared analytics core.
 *
 * core.ts and events.ts in this directory are byte-for-byte copies of
 * landing/src/lib/analytics/. This file holds everything specific to
 * Starlight, so the copies stay diffable against their source:
 *
 *   diff docs/src/lib/analytics/core.ts landing/src/lib/analytics/core.ts
 *
 * Re-sync after any change to the shared core by copying both files over.
 * See .archcore/landing/analytics-event-taxonomy.doc.md.
 *
 * Everything else the docs need — pageviews, outbound and sidebar navigation,
 * scroll depth, code-block copies including the installer one-liners — is
 * already handled generically by the core.
 */

import { track } from "./core";

/** Ignore very short queries; they are mid-typing, not intent. */
const MIN_QUERY_LENGTH = 3;

/** Time a query must stay unchanged before it counts as settled. */
const SETTLE_MS = 800;

/**
 * Reports docs search usage. Starlight renders a `<button data-open-modal>`
 * that opens a dialog into which Pagefind injects its own input, so both are
 * bound through delegation rather than by querying elements that do not exist
 * at script time.
 */
export function attachDocsSearchTracking(): void {
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("button[data-open-modal]")) {
        track("docs_search_opened");
      }
    },
    { capture: true, passive: true }
  );

  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastReported = "";

  document.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (
      !input.matches(
        '.pagefind-ui__search-input, #starlight__search input[type="search"]'
      )
    ) {
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      const query = input.value.trim();
      if (query.length < MIN_QUERY_LENGTH || query === lastReported) return;
      lastReported = query;

      // Pagefind renders one .pagefind-ui__result per hit. Absent while a
      // search is still running, in which case the count is simply omitted.
      const results = document.querySelectorAll(".pagefind-ui__result").length;
      track("docs_search_submitted", {
        query,
        query_length: query.length,
        ...(results > 0 ? { results } : {}),
      });
    }, SETTLE_MS);
  });
}
