# Prototyping Variants

Source skill: `prototype` (installed from github.com/emilkowalski/skills). A divergence skill: build multiple genuinely different versions of a described UI piece, rendered behind a visual picker so you can flip through live and promote the winner.

## Operating Posture

The entire value is **divergence** — three tints of the same idea waste the picker. Each variant must be a direction defensible to ship on its own, exploring a genuinely different answer to the same brief. Divergence isn't an excuse to drop the craft bar: every variant individually meets a high standard (right easing, sub-300ms UI motion, correct `transform-origin`, `transform`/`opacity` only, reduced-motion handled).

## Hard Rules

1. Never touch production code during exploration — everything lives in an isolated prototype surface. Integration happens only when a variant is picked.
2. Variants diverge on a named axis — layout, density, personality, motion, interaction model. State each variant's axis in a phrase before building. Sharing the project's tokens is not convergence — variants should feel native to the product.
3. Every variant fully works — real interactions, real motion, realistic content (actual product-shaped copy, plausible names/numbers). No lorem ipsum, no dead buttons.
4. The picker is chrome, not a contestant — its look never adapts to the project.
5. Clean up after the choice — delete the prototype surface unless asked to keep it.

## Workflow

### Phase 1 — Scope
One thing per run. If the description spans multiple components, narrow it: pick the single highest-leverage piece, say which and why.

### Phase 2 — Recon
Map: stack (framework, styling system, motion library), tokens (colors, radii, spacing, fonts, easing/duration — variants should look shippable tomorrow), personality (playful vs. crisp — bounds how far the boldest variant may go), context (where it renders, at what sizes).

### Phase 3 — Choose directions
Default 3 variants; up to 5 for a genuinely wide design space. Name each direction by its axis ("Quiet," "Editorial," "Playful," "Dense") — never "Option A/B/C." If two directions would differ only in accent color or copy, they're one direction — replace one with a real alternative.

### Phase 4 — Build the picker harness
An isolated route/page, one file per variant plus a small harness — nothing imports from the prototype surface into production code. Render one variant at a time, full size, in realistic surrounding context (never postage-stamp thumbnails). Switching is instant, no animation on the swap itself (100+/session action).

### Phase 5 — Verify and hand off
Confirm every variant renders, every interaction responds, console is clean. Present the set and stop:

| # | Variant | Axis | When it's the right choice | Its cost |
| --- | --- | --- | --- | --- |
| 1 | Quiet | Minimal motion, borders over shadows | The product is a daily-use tool | Least memorable |
| 2 | Editorial | Large type, generous whitespace | The moment deserves weight | Eats vertical space |

### Phase 6 — Promote on selection
Integrate the chosen variant following the project's existing conventions, then delete the prototype surface. If the user wants another round, keep the harness and diverge again around the direction they gravitated to.

## Invocation Variants

| Invocation | Behavior |
| --- | --- |
| `<description>` | Full workflow: scope → recon → 3 variants → picker → wait for choice |
| `<description> x5` | Same, with that many variants (capped at 5) |
| `riff <variant>` | New round diverging around the named variant's direction |
| `keep <variant>` | Promote into the codebase, delete the prototype surface |
| `keep <variant>, leave the picker` | Promote, keep the prototype surface |

## Tone

Sell each variant honestly — one line on when it wins, one on what it costs. Never pre-pick a favorite in the table. If two variants converged while building, cut one and say so.
