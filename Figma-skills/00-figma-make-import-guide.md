# How to import these skills into Figma Make

Meta-guide: the actual file format Figma Make accepts for custom guidance, and how to load every other file in this folder into it. Researched directly from Figma's own Help Center (Jul 2026) — not guessed.

## The mechanism: the `guidelines/` folder

Every Figma Make project has a built-in `guidelines/` folder, visible from the **Code** view of the editor. It works like a project-level system prompt:

- **`Guidelines.md`** is the entry point. Figma Make reads it automatically on every generation in that project — you never have to re-paste it into the chat.
- Figma seeds a new project with an **empty `Guidelines.md`** that includes inline instructions and examples for how to structure your own (general layout rules → design-system rules → component-specific rules, in that order of generality).
- You can add **as many additional `.md` files as you want** alongside it (e.g. `Guidelines/typography.md`, `Guidelines/motion.md`, `Guidelines/tokens.md`) for specific components or design tokens. Figma Make reads the whole folder, not just the entry file.

## Format constraints

- **Markdown only** (`.md`). No YAML frontmatter requirement, no schema, no size limit published by Figma — but their own guidance is explicit: **more context is not always better; it can confuse the LLM.** Keep each file scoped and avoid duplicating the same rule across files.
- Plain prose + headings + tables + code fences all render fine — Figma Make just feeds the raw markdown text as context, the same way this repo's own skill files work.
- **Audit for conflicts.** If two files state contradictory rules (e.g. one says "use shadows," another says "no shadows"), Figma Make has no tiebreaker — it's on you to keep the set consistent.

## How to upload (exact steps)

1. Open your Figma Make project.
2. Click **Code** at the top of the editor.
3. In the file explorer on the left, open the **`guidelines/`** folder.
4. Either:
   - Click **Upload**, and select one or more `.md` files from this folder, **or**
   - **Drag and drop** the `.md` file(s) directly from your desktop file explorer into the `guidelines/` folder pane.
5. Rename/organize as needed. `Guidelines.md` stays the entry point — if you want the other files to always apply, either merge their contents into `Guidelines.md` or add one line to `Guidelines.md` pointing at them (Figma Make reads the whole folder, but an explicit pointer removes any ambiguity).

## What to upload from this folder, and in what order

Recommended: don't dump all 13 files in unfiltered — Figma Make explicitly warns against over-stuffing context. Pick based on what you're doing in Make:

| You're doing this in Figma Make | Upload these files |
| --- | --- |
| General UI/product design work, any screen | `impeccable.md` (design system + anti-slop rules), `emil-design-eng.md` (polish/motion philosophy) |
| Anything with animation/motion | `apple-design.md`, `review-animations.md` (as a bar, not just a build guide) |
| Picking a chart/library/component approach | `pick-ui-library.md` |
| Naming an effect you're describing to Make in a prompt | `animation-vocabulary.md` (useful as *your* reference before you type the prompt, not necessarily uploaded) |
| Exploring multiple directions before committing | `prototype.md` |

`ponytail.md`, `caveman.md`, and `graphify.md` are **workflow/communication skills for the coding agent (Claude Code), not design-generation skills** — they don't describe visual output, so they add no value inside Figma Make's guidelines folder. They're included in this folder for completeness/reference only; don't upload them to Make.

## Why this project keeps them as separate root-level files too

Per your instruction, every skill in this folder is its own single `.md` file (not merged into one giant doc), so you can cherry-pick exactly which ones to drag into a given Figma Make project's `guidelines/` folder without editing anything.

---

Sources:
- [Add guidelines to Figma Make](https://help.figma.com/hc/en-us/articles/33665861260823-Add-guidelines-to-Figma-Make)
- [Bring style context from a Figma Design library to Make kits](https://help.figma.com/hc/en-us/articles/33024539096471-Bring-style-context-from-a-Figma-Design-library-to-Make-kits)
- [Get started with Make kits](https://help.figma.com/hc/en-us/articles/39241689698839-Get-started-with-Make-kits)
