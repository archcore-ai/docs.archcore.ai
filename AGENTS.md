# Repository agent instructions

## Purpose

This repository holds the Archcore documentation site published at `docs.archcore.ai`.

Write documentation so that a reader can find the page from search, identify the subject in the first
paragraph, and complete the task without guessing. The site serves three audiences at once: engineers
evaluating Archcore, engineers using it, and AI agents reading the generated `llms.txt` bundles.

Use:

- **ISO 24495-1-inspired plain-language principles** for every page under `src/content/docs/` and every
  changelog entry. This is the default style for the site.
- **An ASD-STE100-inspired controlled style** only for text that exists solely for machine readers. In
  this repository that means `.archcore/**/*.md` documents, which agents read through the Archcore MCP
  tools. Do not apply the controlled style to reader-facing pages.

This policy is an internal writing profile. It is not a claim of compliance, certification, or approval
by ASD, ISO, or any standards organization.

## Scope

Apply this policy when creating or updating:

- `src/content/docs/**/*.{md,mdx}`;
- `src/content/changelog/**/*.md`;
- `README.md` and `DESIGN.md`;
- copy inside `src/components/**/*.astro`;
- `.archcore/**/*.md` (controlled style, see the section on Archcore documents).

Do not rewrite or translate:

- commands, flags, and paths;
- configuration keys and JSON fields;
- MCP tool names and argument names;
- document type names;
- literal values and generated output;
- Astro or Starlight component names, props, and frontmatter keys;
- exact quotations from the CLI or plugin repositories.

## Precedence

Apply instructions in this order:

1. Explicit user requirements.
2. Accepted rules and decisions in `.archcore/`.
3. Factual accuracy against the source repositories, per the `docs-from-cli-context` rule.
4. This writing policy.
5. General stylistic preferences.

When accuracy and style conflict, accuracy wins. A clear sentence that misstates the CLI is worse than
an awkward sentence that describes it correctly.

## Source of truth

All content comes from the Archcore CLI and plugin repositories and their `.archcore/` context. Do not
invent features, flags, defaults, or behavior. When a claim cannot be verified in a source repository,
omit it rather than hedge it.

See the `docs-from-cli-context` rule for the full obligation.

## Plain-language principles

These are the defaults for every reader-facing page.

### Structure

1. Put the answer, result, or definition in the first paragraph. Do not open with background.
2. Order sections by what the reader needs first, not by how the system is built.
3. Give each section one job. When a section covers two topics, split it.
4. Write headings that name the reader's question or task, not an abstract noun.
5. Keep paragraphs short enough that the logical structure is visible without reading every word.
6. Use a table when the reader compares values across a fixed set of fields. Use prose when the reader
   needs the reasoning.

### Sentences

7. Express one primary idea in each sentence.
8. Put a condition before the action or result that depends on it.
9. Prefer active voice and name the actor when responsibility matters. "The MCP server refuses the
   write" beats "the write is refused".
10. Use `is` and `has` instead of `serves as`, `stands as`, `represents`, `boasts`, or `features`.
11. Replace qualitative claims with facts, versions, thresholds, units, or observable outcomes.
12. Cut filler. "In order to" becomes "to"; "has the ability to" becomes "can"; "it is important to
    note that the data shows" becomes "the data shows".

### Terminology

13. Use one term for one concept, in every page. Do not reach for a synonym to avoid repetition.
14. Define a term before the page relies on it, or link to the page that defines it.
15. Preserve the canonical Archcore terms:

- Archcore CLI
- Archcore plugin
- Archcore MCP server
- MCP tool
- document type
- document category (vision, knowledge, experience; the API field `category` — not "layer", which
  names the requirements layers A and B)
- relation type
- host wiring
- lifecycle hook (`SessionStart`, `PreToolUse`, `PostToolUse`)
- managed block
- local document
- global source
- project context
- `.archcore/`

16. When two terms in the repository appear to name the same concept, raise the conflict instead of
    silently normalizing it.

## Removing AI writing patterns

Apply these to reader-facing pages. They are the patterns that make documentation read as generated
rather than written.

Remove:

1. **Filler and hedging.** "It could potentially be argued that" becomes the claim itself. Say what is
   true; when something is uncertain, name the specific uncertainty.
2. **Promotional language.** `powerful`, `seamless`, `robust`, `vibrant`, `groundbreaking`,
   `blazing-fast`, `simply`, `just`, `effortlessly`. Replace with the measurement or the mechanism.
3. **Significance inflation.** "plays a crucial role", "is a testament to", "marks a pivotal shift".
   Show why something matters through what it does.
4. **Signposting.** "Let's dive in", "Here's what you need to know", "Now let's look at". Start with
   the content instead of announcing it.
5. **Fragmented headers.** A heading followed by a one-line restatement of the heading. Delete the
   restatement.
6. **Vague attributions.** "Experts recommend", "it is generally considered". Name the source
   repository, the ADR, or the code path, or drop the claim.
7. **Superficial `-ing` tails.** "…, ensuring reliability", "…, highlighting its importance". These add
   no information. Delete or convert to a real clause.
8. **Rule-of-three padding.** Three synonyms where one is accurate. Keep the accurate one.
9. **False ranges.** "from startups to enterprises". List what actually applies.
10. **Negative parallelisms.** "Not just X, but Y" and clipped tail negations such as "no guessing".
    State the claim directly.
11. **Emoji as decoration** in headings or list items.
12. **Curly quotes.** Use straight quotes in prose and code.
13. **Generic upbeat conclusions.** End on the next action or the constraint, not on encouragement.

Keep the register neutral. For reference and technical documentation, plain and neutral **is** the
correct human voice. Do not add opinions, first-person commentary, deliberate roughness, or tangents.
Both source style guides say the same thing for this genre, and `DESIGN.md` defines the voice as
direct, technical, confident, minimal, calm, and specific.

## Typography

### Em dashes

An em dash is legitimate punctuation. A run of them is the most reliable signal of generated prose.

1. Use at most one em dash per paragraph.
2. Do not use an em dash inside a list item, a table cell, or a heading.
3. Do not use a pair of em dashes as a parenthetical. Use commas, parentheses, or two sentences.
4. Do not use an em dash where a colon introduces an explanation or a period ends a thought.

A single em dash that introduces a definition after a term is fine:
`source_id` — the source's declared `id`.

### Headings

5. Write headings in sentence case. Capitalize only the first word and proper nouns, including product
   names, document type names, and code identifiers. "Choosing the right type", not "Choosing the
   Right Type". "MCP config locations" keeps `MCP` capitalized.
6. Do not change the frontmatter `title`. It feeds the H1, the sidebar, `og:title`, and the search
   snippet.
7. Do not skip heading levels. An `h2` is followed by `h2` or `h3`, never `h4`.

### Other marks

8. Use straight quotes and straight apostrophes.
9. Use bold for the first mention of a defined term, not to emphasize arbitrary phrases.
10. Prefer a plain list item over a `**Label:** description` item, unless the label is a literal value
    such as a flag, key, or type name.

## SEO requirements

The site must be findable. These requirements are additive to the plain-language rules, and they do
not conflict with them: search engines and language models both reward the same front-loaded, clearly
named, consistently termed structure.

### Frontmatter

1. Every page carries a unique `title` and a unique `description`. No two pages share either.
2. Write `title` to be readable in a search result at about 60 characters, including the site suffix.
   Name the subject, not a category. "Session hooks" beats "Hooks".
3. Keep `description` at **120 characters or fewer**. The build renders it into a per-page OG image.
   At 120 characters or fewer the card shows the whole string; from 121 characters the card shows the
   first 117 followed by an ellipsis. The HTML meta description always carries the full string, so
   this is a rendering constraint on the card, not a search constraint.
4. IF a description must exceed 120 characters, THEN write it so the first 117 characters read as a
   complete statement, and keep the whole string under about 155 characters.
5. Write `description` as a claim about the page's content, not a promise about the reader's feelings.
   "Compares the plugin and the CLI by install method and supported hosts" beats "Learn everything you
   need to choose".
6. IF a `title` or `description` contains a colon followed by a space, THEN wrap the whole value in
   double quotes. YAML reads an unquoted `: ` as the start of a new key, and the build fails with a
   frontmatter parse error rather than a warning. This is easy to introduce when replacing an em dash
   with a colon.
7. Two indexable URLs must not share a `<title>`. Changelog entries and pages live in different
   collections but rank against each other, so a release note about a feature needs a title distinct
   from the page documenting that feature.

### On-page

6. State the page's subject and primary term in the first paragraph, in the same words a reader would
   search for.
7. Use the canonical term consistently rather than cycling synonyms. Consistency helps both a search
   index and a language model resolve the entity.
8. Give every page at least one inbound link from a related page and at least one outbound link to a
   related page. A page reachable only from the sidebar is weakly connected.
9. Link with descriptive anchor text. "See the global sources reference" beats "click here" and beats a
   bare URL.
10. Keep the existing "Next steps" sections and keep their links accurate.
11. When a page moves or is deleted, add a redirect in `astro.config.mjs` rather than breaking the URL.

### Do not

12. Do not repeat a keyword beyond what the sentence needs.
13. Do not add a synonym that contradicts rule 13 of the plain-language section purely for coverage.
14. Do not write a summary paragraph whose only purpose is to hold keywords.

## Archcore documents

`.archcore/**/*.md` documents in this repository are read by agents through the Archcore MCP tools.
They are the one place where the controlled, ASD-STE100-inspired style applies.

For those documents:

1. Put one requirement in each numbered item.
2. Use one uppercase BCP 14 modal (`MUST`, `MUST NOT`, `SHOULD`, `MAY`) in each requirement.
3. State the obligated actor explicitly.
4. Put the trigger or condition before the obligation.
5. Do not force normative modals into descriptive types such as `doc`, `guide`, `adr`, or `plan`.
6. Reference files with `@path/to/file` instead of reproducing their content.
7. State whether described behavior is current, deprecated, planned, or unsupported.
8. Create and update these documents through the Archcore MCP tools, not through direct file writes.

## Language

English is the default for this site.

The site currently has no Russian content. When Russian content is added, apply the structural,
terminology, and evidence rules above, and additionally:

1. Prefer verbs to verbal nouns. Write "внедрили систему", not "осуществили внедрение системы".
2. Drop the copula `является`. Russian does not need `быть` in the present tense.
3. Replace `данный` with `этот`, and delete `определённый` and `соответствующий` when they carry no
   information.
4. Remove English calques: `стоит отметить, что`, `важно понимать, что`, `можно сказать, что`.
5. Do not open with `В современном мире` or a similar empty generalization. Start with the fact.
6. Do not close with `Таким образом` or `Подводя итог` as a formulaic summary.
7. Do not use `не просто X, а Y` or `не только X, но и Y`.
8. Punctuate by Russian rules, not English ones. `Однако` at the start of a sentence takes no comma.
9. Apply the em dash rule above. In Russian technical prose prefer a comma, colon, or period.
10. Keep the documentation register. Do not add the conversational particles, idioms, or deliberate
    roughness that the Russian humanizer profile prescribes for marketing and blog text.

Do not translate identifiers, commands, flags, paths, configuration keys, MCP tool names, or document
type names.

## Managed blocks

Archcore delimits a managed block with `<!-- archcore:start -->` and `<!-- archcore:end -->` HTML
comments. `archcore init` and `archcore instructions install` own that span.

Do not edit content inside a managed block. Keep repository-specific instructions outside it.

## Review checklist

Before finalizing a page, verify:

- The subject and the reader's task are clear from the first paragraph.
- The `title` and `description` are unique, and the description is 120 characters or fewer (or, if
  longer, its first 117 characters stand alone).
- Terminology matches the canonical list and stays consistent within the page.
- Commands, flags, paths, keys, and tool names are unchanged and correct against the source repository.
- Conditions appear before the actions that depend on them.
- No paragraph carries more than one em dash, and no list item or table cell carries one.
- Headings are sentence case, and no heading level is skipped.
- No promotional adjective, filler phrase, signposting sentence, or `-ing` tail survives.
- Every claim traces to the CLI or plugin repository.
- The page links out to at least one related page, and the "Next steps" links resolve.
- `npm run build` succeeds.

Revise known violations before returning the text. Do not include the checklist or a writing-quality
score in the page itself.
