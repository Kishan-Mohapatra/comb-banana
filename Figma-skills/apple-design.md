# Apple Design — Fluid Interfaces for the Web

Source skill: `apple-design` (installed from github.com/emilkowalski/skills). Apple's approach to interface design and fluid, physical motion, translated for the web — from Apple's WWDC design talks (chiefly *Designing Fluid Interfaces*, WWDC 2018), distilled into CSS, Pointer Events, `requestAnimationFrame`, and spring libraries (Motion/Framer Motion).

The through-line: **an interface feels alive when motion starts from the current on-screen value, inherits the user's velocity, projects momentum forward, and can be grabbed and reversed at any instant.** Springs make this natural because they're inherently interruptible and velocity-aware.

## The Core Idea

> "When we align the interface to the way we think and move, something magical happens — it stops feeling like a computer and starts feeling like a seamless extension of us."

An interface is fluid when it behaves like the physical world: instant response, continuous movement, momentum, resistance at boundaries, redirectable mid-motion.

Apple frames design as serving four human needs: **safety/predictability, understanding, achievement, and joy.** Every rule below serves one of them.

## 1. Response — Kill Latency

The moment lag appears, directness "falls off a cliff."

- Respond on pointer-down, not release. Highlight the instant it's pressed.
- Be vigilant about every latency — debounces, artificial timers, transition waits, the ~300ms tap delay.
- Feedback must be continuous *during* the interaction (drag/slider/drawer updates 1:1 with the pointer the whole way through), never just at the end.

```css
.button:active { transform: scale(0.97); transition: transform 100ms ease-out; }
```

## 2. Direct Manipulation — 1:1 Tracking

> "Touch and content should move together."

Dragged elements stay glued to the finger, respecting the offset from where they were grabbed — snapping to center on grab breaks the illusion immediately.

- Use Pointer Events with `setPointerCapture` so tracking continues past the element's bounds.
- Track a short velocity/position history (last few `pointermove` events) — you need velocity at release.

## 3. Interruptibility — The Single Most Important Principle

> "The thought and the gesture happen in parallel."

Every animation must be interruptible and redirectable at any moment.

- Never lock out input during a transition.
- Always animate from the *presentation* (current) value, never the target — read the element's live on-screen transform on interrupt.
- Avoid CSS transitions/`@keyframes` for gesture-driven motion — springs animate from the current value by default.
- When a gesture reverses, blend velocity — don't hard-cut it (a "brick wall"). Choose a spring library that re-targets from current velocity.
- Decompose 2D motion into independent X and Y springs — a single spring on 2D distance desyncs when velocities differ per axis.

## 4. Behavior Over Animation — Use Springs

> "Think of animation as a conversation between you and the object, not something prescribed by the interface."

Springs respond to new input mid-flight (new target, continuous motion); fixed-duration animations can't.

Apple's two designer-friendly parameters (replacing mass/stiffness/damping):
- **Damping ratio** — controls overshoot. `1.0` = critically damped, no bounce. `<1.0` = overshoots/oscillates.
- **Response** — how quickly the value reaches target, in seconds. Not "duration" — no fixed duration, settle time emerges.

**Defaults:** Start most UI at damping `1.0` (graceful, non-distracting). Add bounce (damping ~`0.8`) only when the gesture itself carried momentum (flick, throw, drag release).

| Interaction | Damping | Response |
| --- | --- | --- |
| Move/reposition (e.g. PiP) | 1.0 | 0.4 |
| Rotation | 0.8 | 0.4 |
| Drawer/sheet | 0.8 | 0.3 |

```js
import { animate } from 'motion';
// Critically damped default (no overshoot)
animate(el, { y: 0 }, { type: 'spring', bounce: 0, duration: 0.4 });
// Momentum interaction — bounce only because a flick preceded it
animate(el, { y: target }, { type: 'spring', bounce: 0.2, duration: 0.4 });
```

## 5. Velocity Handoff — The Seam Between Drag and Animation

The animation must continue at the finger's exact release velocity — the detail that most separates "fluid" from "fine."

```
relativeVelocity = gestureVelocity / (targetValue − currentValue)
```
Example: element at y=50, target y=150 (100px to go), finger at 50px/s → initial spring velocity = 0.5. Motion/Framer Motion usually take raw px/s velocity directly.

## 6. Momentum Projection — Animate To Where the Gesture Is Going

> "Take a small input and make a big output."

Don't snap to the nearest boundary from the release point — project the resting position from velocity, like scroll deceleration, then snap to the nearest target from that projection.

```js
// decelerationRate ≈ 0.998 for normal scroll feel; 0.99 for snappier
function project(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}
const projectedEndpoint = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projectedEndpoint);
animateSpringTo(target, { velocity: releaseVelocity });
```
Note: the physics-textbook `v²/(2·decel)` is NOT what Apple ships — use the exponential-decay form above.

## 7. Spatial Consistency — Symmetric Paths, Anchored Origins

> "If something disappears one way, we expect it to emerge from where it came."

- Enter and exit along the same path (right-in must exit right, not bottom).
- Anchor interactions to their source — set `transform-origin` to the trigger.
- Mirror the easing on reversible transitions (inverse cubic-bézier for the two directions).

## 8. Hint in the Direction of the Gesture

Humans predict a final state from a trajectory. Intermediate motion should telegraph where things are going (Control Center modules "grow up and out toward your finger") — not just interpolate blindly.

## 9. Rubber-Banding — Soft Boundaries

At an edge, resist progressively instead of stopping hard.

```js
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

## 10. Gesture Design Details

- **Tap** — highlight on touch-down (instant), commit on touch-up. ~10px hysteresis/hit padding; allow cancel-by-dragging-away.
- **Drag/swipe** — small movement threshold (~10px) before committing to a direction, then track 1:1.
- **Detect all plausible gestures in parallel** from the first move, cancel losers once intent is clear. Avoid recognizers reporting only a final state.
- **Minimize disambiguation delays** — double-tap detection delays single taps; only pay that cost where double-tap truly exists.

## 11. Frame-Level Smoothness

- Keep per-frame positional change below the perception threshold.
- For very fast motion, subtle motion blur/stretch encodes speed better than a hard sharp streak.
- `requestAnimationFrame` is the web's display-synced clock. Animate only `transform`/`opacity`, hint with `will-change`.

## 12. Materials & Depth — Translucency Conveys Hierarchy

- Build nav/toolbars/sheets as translucent floating layers (`backdrop-filter: blur()` + semi-transparent bg), content scrolling underneath.
- Material weight encodes hierarchy — darker/heavier for structural regions, lighter for interactive elements. Never stack light translucent surfaces (legibility collapses).
- Bigger surfaces read as thicker — stronger blur + deeper shadow than small chips.
- Dim to focus (modal + scrim + push background back), separate to keep flow (parallel panel: translucency + offset, no scrim).
- Vibrancy keeps text legible over changing backgrounds — higher contrast, slightly heavier weight, small letter-spacing bump; put color on a solid layer, not the translucent foreground.
- Scroll edge effects, not hard dividers — fade a blur/gradient mask where floating chrome overlaps content, instead of a 1px border.
- Materialize, don't just fade — animate blur radius and scale together on enter/exit for glass surfaces.

```css
.toolbar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
}
```

## 13. Multimodal Feedback — Motion + Sound + Haptics

1. **Causality** — obvious what caused the feedback; trigger on the actual causal event, match character to physicality.
2. **Harmony** — visual, sound, haptic fire on the *same frame*; no lag between them.
3. **Utility** — feedback only where it earns its place; reserve for meaningful moments (success, error, commit, snap).

## 14. Reduced Motion & Accessibility

Reduced motion means a gentler, non-vestibular equivalent, not zero feedback.

- `prefers-reduced-motion: reduce` — replace slides/springs/parallax with short opacity cross-fades. Drop overshoot. Keep opacity/color changes that aid comprehension.
- `prefers-reduced-transparency: reduce` — raise background opacity, drop the blur.
- `prefers-contrast: more` — near-solid backgrounds with a defined, contrasting border.

Also avoid: full-viewport moving backgrounds, slow looping oscillations (~0.2 Hz), abrupt brightness jumps. Make large moving objects semi-transparent while traveling; fade big surfaces during large repositions.

```css
@media (prefers-reduced-motion: reduce) {
  .sheet { transition: opacity 200ms ease; transform: none !important; }
}
@media (prefers-reduced-transparency: reduce) {
  .toolbar { background: white; backdrop-filter: none; }
}
```

## 15. Typography — Optical Sizing, Tracking, Leading

- **Tracking is size-specific** — negative tracking for large display text, slightly positive for small text. A fixed value is wrong somewhere.
- **Leading tracks size inversely** — tight on large headings, looser on body.
- **Build hierarchy from weight + size + leading as a set**, not size alone.
- **Respect Dynamic Type** — scale layout with the text (`rem`/`em`, not fixed px).
- **Default to the system font** before a custom face — it ships optical sizing, tracking tables, legibility tuning already.

```css
:root { font: 100%/1.5 system-ui, sans-serif; }
.display {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-optical-sizing: auto;
}
```

## 16. Design Foundations — The Eight Principles

From *Principles of Great Design* (WWDC 2026):

1. **Purpose** — make with intention; decide what *not* to build.
2. **Agency** — keep people in control; offer choices, back with forgiveness (easy undo, sparing confirmation dialogs).
3. **Responsibility** — act in the user's interest; privacy at the right moment; anticipate misuse (especially with AI).
4. **Familiarity** — build on what people know; consistent placement and behavior so people can predict what happens next.
5. **Flexibility** — design for different contexts, devices, abilities; let people personalize when no single layout fits everyone.
6. **Simplicity — not minimalism.** Strip the unnecessary so purpose shines; be concise and clear; every element earns its place.
7. **Craft** — uncompromising attention to detail; nothing random, every value a deliberate, defensible choice.
8. **Delight** — the result of getting the other seven right, not confetti tacked on top.

Tactical rules:
- Feedback comes in four kinds: status, completion, warning, error.
- Wayfinding — every screen answers: Where am I? Where can I go? What's there? How do I get out?
- Grouping & mapping — proximity implies relationship; place controls near what they affect.
- Direct, specific labels beat safe generic ones ("Progress"/"Library" over "Home").

## 17. Process

- Prototype interactively — build and play to discover the interface; sets a concrete bar preventing a mediocre final implementation.
- Design interaction and visuals together — "you shouldn't be able to tell where one ends and the other begins."
- Test with real people in real context; review motion with fresh eyes, slow motion / frame-by-frame.

## Quick Reference

| Need | Technique | Concrete value |
| --- | --- | --- |
| Default UI spring | Critically damped, no overshoot | damping 1.0, response 0.3-0.4 |
| Momentum/flick spring | Under-damped, slight bounce | damping ~0.8, response 0.3-0.4 |
| Gesture → spring velocity | Hand off release velocity | gestureVelocity / (target − current) |
| Flick landing point | Project momentum | current + (v/1000)·d/(1−d), d ≈ 0.998 |
| Interrupt cleanly | Start from presentation value | read on-screen transform |
| Reversible transition | Mirror the easing curve | inverse cubic-bézier |
| 1:1 drag | Pointer Events + capture | respect grab offset |
| Boundary | Rubber-band, don't hard-stop | progressive resistance |
| Type tracking | Size-specific, never fixed | tighten large (-0.02em), body near 0 |
| Reduced motion | Cross-fade, not slide/spring | @media (prefers-reduced-motion) |
