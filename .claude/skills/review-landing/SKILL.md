---
name: review-landing
description: >
  Review a documentation page for both code quality and content quality.
  Use when the user wants to review, audit, or get feedback on a docs page.
  Also triggered by: "review landing page," "review index page," "review docs page,"
  "page review," "review this page," "audit page quality."
  Runs two parallel reviews: technical (code, SEO, config, components) and
  editorial (copy, structure, voice, clarity). Returns a unified report.
---

# Review Documentation Page

You review a documentation page by running two specialized agents in parallel and combining their findings into a single actionable report.

**This is a read-only review. Do not modify any files.**

## 1. Identify the Target Page

- If the user specified a page, use that path (relative to project root).
- Otherwise, default to `src/content/docs/index.mdx`.

## 2. Gather Context Files

Before launching agents, read these files to build the context payload that both agents will need:

1. **Target page** — the MDX/MD file to review
2. **Astro config** — `astro.config.mjs`
3. **Package.json** — `package.json`
4. **Global CSS** — glob for `src/**/*.css` and include any matches
5. **Custom components** — glob for `src/components/**/*.astro` and include any matches
6. **Sidebar/nav config** — already in astro config, but note the structure

Assemble the content of all gathered files into a single context block to pass to each agent.

## 3. Launch Two Agents in Parallel

Use the Agent tool to launch both agents **in a single message** (parallel execution).

### Agent 1 — Code Review (`documentation-developer`)

```
subagent_type: documentation-developer
```

Prompt the agent with the full context and these instructions:

> You are reviewing (NOT fixing) the documentation page at `{page_path}`.
> Your job is a **code-level review** of the page and its supporting files.
>
> Review these areas and produce findings for each:
>
> **1. Project Patterns** — Does the page follow conventions used elsewhere in the project? Check component usage, import style, frontmatter format, file naming.
>
> **2. Starlight Correctness** — Are Starlight components used correctly? Are there missed opportunities to use built-in components (Tabs, Cards, Aside, Steps, LinkCard)? Is MDX syntax valid?
>
> **3. SEO Implementation** — Frontmatter title/description quality, heading hierarchy (H1 from title, then H2/H3 without skips), meta tags, canonical URL setup, Open Graph readiness.
>
> **4. Config & Build** — Is the page properly registered in sidebar config? Any config issues that affect this page? Check astro.config.mjs for relevant settings.
>
> **5. Performance** — Unnecessary JS imports, unoptimized images, render-blocking resources, bundle impact of components used.
>
> **6. Accessibility** — Semantic HTML, heading order, alt text, link text quality, ARIA where needed.
>
> **Format each finding as:**
> - **Category**: (one of the 6 above)
> - **Severity**: error | warning | suggestion
> - **Location**: file path and line number or section
> - **Issue**: what's wrong (one sentence)
> - **Fix**: how to fix it (specific, actionable)
>
> At the end, give a **Code Health Score** out of 10 with a one-line justification.
>
> Do NOT modify any files. This is a review only.

### Agent 2 — Content Review (`documentation-writer`)

```
subagent_type: documentation-writer
```

Prompt the agent with the full context and these instructions:

> You are reviewing (NOT fixing) the documentation page at `{page_path}`.
> Your job is an **editorial and content review** of the page.
>
> Review these areas and produce findings for each:
>
> **1. Clarity & Scannability** — Can a developer scan the page and get the key message in 10 seconds? Are paragraphs short? Is the structure logical?
>
> **2. Content Structure** — Does the page follow progressive disclosure (overview -> details)? Is each H2 section one concept? Are there gaps or redundancies?
>
> **3. Frontmatter Quality** — Is the title short, specific, and action-oriented? Does the description accurately summarize what the reader learns?
>
> **4. Voice & Tone** — Second person, active voice, present tense, confident (no hedging). Consistent with the rest of the docs site.
>
> **5. Copywriting** — Front-loaded value? Concrete nouns and strong verbs? Passes the "so what?" test? No filler or meta-commentary?
>
> **6. Code Examples** — Complete and runnable? Language specified in fenced blocks? Simplest example first? Properly annotated?
>
> **7. Cross-references & Navigation** — Links to related pages? Correct link format? "Next Steps" section? No orphan page risk?
>
> **8. Conciseness** — Can any sentence be removed without losing meaning? Any redundant sections? Wall-of-text issues?
>
> **Format each finding as:**
> - **Category**: (one of the 8 above)
> - **Severity**: error | warning | suggestion
> - **Location**: section heading or line reference
> - **Issue**: what's wrong (one sentence)
> - **Rewrite**: suggested improved text (when applicable)
>
> At the end, give a **Content Quality Score** out of 10 with a one-line justification.
>
> Do NOT modify any files. This is a review only.

## 4. Combine Into Unified Report

After both agents complete, combine their outputs into this format:

```markdown
# Page Review: {page_path}

## Executive Summary
{2-3 sentences: overall page health, biggest strengths, most critical issues}

## Scores
| Dimension       | Score | Notes                    |
|-----------------|-------|--------------------------|
| Code Health     | X/10  | {one-line from agent 1}  |
| Content Quality | X/10  | {one-line from agent 2}  |
| **Overall**     | X/10  | {average, rounded}       |

## Code Review Findings
{All findings from Agent 1, grouped by severity: errors first, then warnings, then suggestions}

## Content Review Findings
{All findings from Agent 2, grouped by severity: errors first, then warnings, then suggestions}

## Priority Actions
{Top 5 items across both reviews, ordered by impact. Each item:}
1. **[severity]** {issue} — {fix} _(source: code/content review)_
```

## Important Rules

- **Do not modify any files** — this skill produces a report only.
- Every finding must reference a specific file, line, or section — no vague feedback.
- If an agent returns no findings for a severity level, omit that severity group.
- Keep the executive summary honest — don't inflate or deflate the assessment.
