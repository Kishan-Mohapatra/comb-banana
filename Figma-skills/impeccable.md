# Impeccable — Frontend Design System & Anti-Slop Rules

Source skill: `impeccable` v3.8.0 (Claude Code skill). Covers UX review, visual hierarchy, information architecture, accessibility, theming, anti-patterns, typography, spacing, layout, color, motion, micro-interactions, UX copy, error states, and reusable design tokens. Figma Make-importable: the "General rules," "Absolute bans," and "New projects only" sections below translate directly into Guidelines.md content — the "Setup"/"Commands" machinery is Claude-Code-specific tooling and can be skipped when importing into Figma Make.

## Design Guidance

Produce ready-to-ship, production-grade code, not prototypes or starting points. Take no shortcuts unless asked. Don't stop until arriving at a complete implementation: beautiful, responsive, fast, precise, bug-free, on brand.

### Color

- **Verify contrast.** Body text ≥4.5:1 against its background; large text (≥18px or bold ≥14px) needs ≥3:1. Placeholder text needs the same 4.5:1, not a muted-gray default.
- **The most common failure:** muted gray body text on a tinted near-white. If contrast is even close, bump the body color toward the ink end of the ramp — light gray "for elegance" is the single biggest reason AI designs feel hard to read.
- Gray text on a colored background looks washed out — use a darker shade of the background's own hue, or a transparency of the text color.

### Typography

- Cap body line length at 65-75ch.
- Don't pair fonts that are similar but not identical (two geometric sans, two humanist sans). Pair on a contrast axis (serif + sans, geometric + humanist), or use one family in multiple weights.
- Hero/display heading ceiling: `clamp()` max ≤ 6rem (~96px). Above that the page is shouting, not designing.
- Display heading letter-spacing floor: ≥ -0.04em. Tighter and letters touch — cramped, not "designed."
- `text-wrap: balance` on h1-h3 for even line lengths; `text-wrap: pretty` on long prose to reduce orphans.

### Layout

- Vary spacing for rhythm.
- **Cards are the lazy answer.** Use them only when truly the best affordance. Nested cards are always wrong.
- Flexbox for 1D, Grid for 2D. Don't default to Grid when `flex-wrap` would be simpler.
- Responsive grids without breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`.
- Build a semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip). Never arbitrary values like 999 or 9999.

### Motion

- Motion is intentional, part of the build — not an afterthought.
- Don't animate CSS layout properties unless truly needed.
- Ease out with exponential curves (ease-out-quart/quint/expo). No bounce, no elastic.
- Use libraries for advanced motion needs (motion, gsap, anime.js, lenis).
- Reduced motion is not optional — every animation needs a `@media (prefers-reduced-motion: reduce)` alternative (typically crossfade or instant transition).
- Staggering items within one list is legitimate. The tell is a *uniform reflex* (one identical entrance applied to every section), not motion itself — each reveal should fit what it reveals.
- Reveal animations must enhance an already-visible default. Don't gate content visibility on a class-triggered transition (it pauses on hidden tabs/headless renderers, so the reveal never fires and the section ships blank).
- Premium motion materials aren't just transform/opacity — blur, backdrop-filter, clip-path, mask, and shadow/glow belong in the palette when they materially improve the effect and stay smooth.

### Interaction

- Dropdowns rendered with `position: absolute` inside an `overflow: hidden`/`overflow: auto` container get clipped. Use native `<dialog>`/popover API, `position: fixed`, or a portal to escape the stacking context.

## New Projects Only (No Prior Work Exists)

### Color & Theme

- Use OKLCH.
- **The cream/sand/beige body bg is the saturated AI default of 2026.** The whole warm-neutral band (OKLCH L 0.84-0.97, C < 0.06, hue 40-100) reads as cream/sand/paper/parchment regardless of what you call it. Token names like `--paper`, `--cream`, `--sand`, `--bone`, `--flour`, `--linen`, `--parchment`, `--wheat`, `--biscuit`, `--ivory` are tells in themselves. If the brief is "warm, traditional" or "editorial-restraint," do NOT translate that into a near-white warm-tinted bg — that's the AI move. Pick: (a) a saturated brand color as the body (terracotta, oxblood, deep ochre, near-black), (b) a true off-white at chroma 0 (or toward the brand's own hue, not warmth-by-default), or (c) a darker mid-tone tinted neutral clearly the brand's own. Warmth is carried by accent + typography + imagery, not body bg.
- Tinted neutrals: add 0.005-0.015 chroma toward the brand's hue — don't default-tint warm/cool "because the brand feels that way."
- Dark vs. light is never a default. Write one sentence of physical scene (who uses this, where, under what ambient light, in what mood) before choosing. If the sentence doesn't force the answer, it's not concrete enough.
- Pick a **color strategy** before picking colors:
  - **Restrained** — tinted neutrals + one accent ≤10%. Product default; brand minimalism.
  - **Committed** — one saturated color carries 30-60% of the surface. Brand default for identity-driven pages.
  - **Full palette** — 3-4 named roles, each used deliberately. Brand campaigns; product data viz.
  - **Drenched** — the surface IS the color. Brand heroes, campaign pages.

## Absolute Bans

Match-and-refuse. If about to write any of these, rewrite the element with different structure.

- **Side-stripe borders.** `border-left`/`border-right` >1px as a colored accent on cards, list items, callouts, alerts. Never intentional — rewrite with full borders, background tints, leading numbers/icons, or nothing.
- **Gradient text.** `background-clip: text` + gradient background. Decorative, never meaningful. Use a single solid color; emphasis via weight or size.
- **Glassmorphism as default.** Blurs/glass cards used decoratively. Rare and purposeful, or nothing.
- **The hero-metric template.** Big number, small label, supporting stats, gradient accent. SaaS cliché.
- **Identical card grids.** Same-sized cards with icon + heading + text, repeated endlessly.
- **Tiny uppercase tracked eyebrow above every section.** The 2023-era kicker (small all-caps, wide tracking, "ABOUT"/"PROCESS"/"PRICING" above each heading) is the saturated AI scaffold — appears on 55-95% of generations regardless of brief. One named kicker as a deliberate brand system is voice; an eyebrow on every section is AI grammar.
- **Numbered section markers as default scaffolding (01/02/03).** The eyebrow trope one tier deeper. Numbers earn their place when the section actually IS a sequence and the order carries real information. One deliberate numbered sequence is voice; numbered eyebrows everywhere is AI grammar.
- **Text that overflows its container.** Long heading words + large clamp scales + narrow grids cause overflow on tablet/mobile. Test at every breakpoint; if it overflows, reduce the clamp max or rewrite the copy.

## The AI Slop Test

If someone could look at this interface and say "AI made that" without doubt, it's failed.

**Category-reflex check**, run at two altitudes:

- **First-order** — if someone could guess the theme + palette from the category alone, it's the first training-data reflex. Rework the scene sentence and color strategy until the answer isn't obvious from the domain.
- **Second-order** — if someone could guess the aesthetic family from category-plus-anti-references ("AI workflow tool that's not SaaS-cream → editorial-typographic"), it's the trap one tier deeper. The first reflex was avoided; the second wasn't. Rework until both answers are not obvious.

## Product Register (App UI, Admin, Dashboards, Tools)

Use when design SERVES the product (as opposed to Brand register, where design IS the product — marketing/landing/campaign/portfolio).

### The product slop test

Not "would someone say AI made this." Familiarity is often a feature here. The test: would a user fluent in the category's best tools (Linear, Figma, Notion, Raycast, Stripe) sit down and trust this interface, or pause at every subtly-off component? Product UI's failure mode isn't flatness, it's *strangeness without purpose* — over-decorated buttons, mismatched form controls, gratuitous motion, display fonts where labels should be, invented affordances for standard tasks. The bar is earned familiarity; the tool should disappear into the task.

### Typography (product)

- One family is often right — a well-tuned sans carries headings, buttons, labels, body, data.
- Fixed rem scale, not fluid — clamp-sized headings don't serve product UI; a fluid h1 that shrinks in a sidebar looks worse, not better.
- Tighter scale ratio: 1.125-1.2 between steps.
- Line length still applies for prose (65-75ch); data/compact UI can run denser, tables at 120ch+ are fine.

### Color (product)

- Defaults to **Restrained.** A single surface can earn Committed, but Restrained is the floor.
- State-rich semantic vocabulary: hover, focus, active, disabled, selected, loading, error, warning, success, info — standardize these.
- Accent color for primary actions, current selection, and state indicators only — not decoration.
- A second neutral layer for sidebars/toolbars/panels (slightly cooler or warmer than the content surface).

### Layout (product)

- Responsive behavior is structural (collapse sidebar, responsive table, breakpoint-driven columns), not fluid typography.

### Components (product)

- Every interactive component: default, hover, focus, active, disabled, loading, error. Don't ship with half of these.
- Skeleton states for loading, not spinners in the middle of content.
- Empty states that teach the interface, not "nothing here."
- Consistent affordances across the surface — same button shape, same form-control vocabulary, same icon style.

### Motion (product)

- 150-250ms on most transitions — users are in flow, don't make them wait for choreography.
- Motion conveys state, not decoration: state change, feedback, loading, reveal — nothing else.
- No orchestrated page-load sequences — product loads into a task, users don't want to watch it load.

### Product bans (on top of the shared absolute bans)

- Decorative motion that doesn't convey state.
- Inconsistent component vocabulary across screens (if "save" looks different in two places, one is wrong).
- Display fonts in UI labels, buttons, data.
- Reinventing standard affordances for flavor (custom scrollbars, weird form controls, non-standard modals).
- Heavy color or full-saturation accents on inactive states.
- Modal as first thought — usually laziness; exhaust inline/progressive alternatives first.

### Product permissions

- System fonts and familiar sans defaults (Inter, SF Pro, system-ui stacks).
- Standard navigation patterns: top bar + side nav, breadcrumbs, tabs, command palettes.
- Density — tables with many rows, panels with many labels, dense information when users need it.
- Consistency over surprise — same visual vocabulary screen to screen is a virtue; delight is saved for moments, not pages.

## Design System Documentation (PRODUCT.md / DESIGN.md pattern)

Impeccable's own workflow writes two root-level docs before any design work: this pairing is a genuinely reusable pattern worth importing into any project (Figma Make or otherwise), not just this skill's own tooling.

- **PRODUCT.md** — strategic register: Register (`brand` or `product`, bare value), Users (who, their context, job-to-be-done), Product Purpose (what it does, why, what success looks like), Brand Personality (voice, tone, 3-word personality, emotional goals), Anti-references (named sites/patterns to explicitly avoid and why), Design Principles (3-5 strategic, not visual — "practice what you preach," not "use OKLCH"), Accessibility & Inclusion (WCAG level, known needs).
- **DESIGN.md** — visual register: color palette, typography scale, component inventory, layout system. Generated from existing code when code exists; seeded from a short interview when pre-implementation.

Register decides everything downstream — always establish it first, before any color/type/spacing decision.
