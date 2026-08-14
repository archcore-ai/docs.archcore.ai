---
title: "Plain-language and SEO policy for docs site content"
status: accepted
tags:
  - "docs-style"
  - "seo"
---

## Rule

`@AGENTS.md` is the canonical writing policy for this repository. This rule states the obligations it
creates and points to that file. It does not restate the policy.

1. WHEN an author creates or updates a page under `src/content/docs/` or an entry under
   `src/content/changelog/`, the author MUST apply the plain-language profile in `@AGENTS.md`.
2. The author MUST apply the ASD-STE100-inspired controlled style only to `.archcore/**/*.md`
   documents, which exist for machine readers.
3. The author MUST NOT apply the controlled style to reader-facing pages.
4. The author MUST NOT state or imply that this repository complies with ISO 24495-1, ASD-STE100, or
   any other external standard. The policy is an internal writing profile.
5. The author MUST keep the register neutral on reference and technical pages. The author MUST NOT add
   opinions, first-person commentary, or deliberate roughness to those pages.
6. The author MUST write at most one em dash per paragraph, and MUST NOT write an em dash inside a
   list item, a table cell, or a heading.
7. The author MUST write section headings in sentence case.
8. The author MUST NOT change a page's frontmatter `title` casing for style reasons, because that
   value feeds the H1, the sidebar, `og:title`, and the search snippet.
9. The author MUST keep a page's `description` at 120 characters or fewer.
10. IF a `description` exceeds 120 characters, THEN its first 117 characters MUST read as a complete
    statement, and the whole string MUST stay under 155 characters.
11. Each page MUST carry a `title` and a `description` that no other page uses.
12. Each page MUST carry at least one outbound link to a related page.
13. IF a page moves or is removed, THEN the author MUST add an entry to the `redirects` table in
    `@astro.config.mjs`.
14. IF a claim cannot be verified against the Archcore CLI or plugin repository, THEN the author MUST
    omit it.
15. WHEN an author writes a positioning sentence, a page `title`, or a `description` that states what
    Archcore is, the author MUST take the wording from the shared `product/canonical-narrative` and
    `product/surface-descriptors` rather than composing a variant for this site.
16. The author MUST NOT append the site's brand suffix inside a page's frontmatter `title`. The suffix
    `— Archcore` is applied site-wide by `@astro.config.mjs`.

## Rationale

The site has three readers: an engineer evaluating Archcore, an engineer using it, and an agent
reading the generated `llms.txt` bundles. Plain language serves all three, because a front-loaded,
consistently termed page is what a search index, a language model, and a hurried human all resolve
most reliably.

The controlled style is deliberately scoped out of reader-facing pages. It optimizes for machine
parsing at the cost of readability, which is the wrong trade for a page a person lands on from search.
The `.archcore/` documents are the opposite case, so they keep it.

Requirement 6 exists because a single em dash is ordinary punctuation while a run of them is the most
reliable signal of generated prose. Banning the mark outright would cost legitimate typography across
roughly 600 existing uses; bounding the density removes the signal without the churn.

Requirements 9 and 10 encode a constraint the build imposes. `@scripts/generate-og-image.mts` renders
the description onto the card unchanged when it is 120 characters or fewer, and otherwise cuts it to
117 characters and appends an ellipsis. Starlight passes the full string to the HTML meta description
either way, so the limit constrains the card, not the search snippet. Staying under the threshold is
the simple form; front-loading is the fallback when a longer description earns its length.

## Examples

Non-normative examples.

### Good

```markdown
---
title: Session hooks
description: The three lifecycle events the Archcore CLI installs and what each one guards.
---

Hooks are how Archcore injects project context into an agent session and blocks direct writes to
`.archcore/` documents. Three events are active.
```

### Bad

```markdown
---
title: Hooks
description: Learn all about the powerful and seamless hooks system that Archcore provides for you.
---

## Hooks Overview

Hooks are important.

Let's dive into how Archcore's robust hook system works — it's not just a feature, it's a
game-changer — ensuring your agents always stay perfectly in sync.
```

The bad example carries a generic title, a promotional description that promises rather than
describes, a fragmented header, a signposting sentence, two em dashes in one paragraph, a negative
parallelism, and an `-ing` tail.

## Enforcement

- `@CLAUDE.md` routes agents to `@AGENTS.md` before any content edit.
- `@AGENTS.md` carries the review checklist an author verifies before returning a page.
- `npm run build` fails on a broken link or an invalid frontmatter field.
- Review rejects a page that introduces a claim absent from the CLI or plugin repository.

## References

- `product/canonical-narrative` and `product/surface-descriptors` — the fixed positioning strings
- `product/seo-information-architecture` — cross-surface title and description conventions, keyword ownership
- `@AGENTS.md` — the canonical writing policy
- `@CLAUDE.md` — agent routing and Archcore operation rules
- `@DESIGN.md` — voice definition: direct, technical, confident, minimal, calm, specific
- `@scripts/generate-og-image.mts` — the 120-character threshold and 117-character cut
