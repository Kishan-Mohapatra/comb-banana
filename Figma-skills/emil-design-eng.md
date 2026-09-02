# Design Engineering (Emil Kowalski)

Source skill: `emil-design-eng` (installed from github.com/emilkowalski/skills). Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great. Figma Make-importable as-is (pure markdown, no external file references).

## Core Philosophy

### Taste is trained, not innate

Good taste is not personal preference. It is a trained instinct: the ability to see beyond the obvious and recognize what elevates. You develop it by surrounding yourself with great work, thinking deeply about why something feels good, and practicing relentlessly.

When building UI, don't just make it work. Study why the best interfaces feel the way they do. Reverse engineer animations. Inspect interactions. Be curious.

### Unseen details compound

Most details users never consciously notice. That is the point. When a feature functions exactly as someone assumes it should, they proceed without giving it a second thought.

> "All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune." - Paul Graham

Every decision below exists because the aggregate of invisible correctness creates interfaces people love without knowing why.

### Beauty is leverage

People select tools based on the overall experience, not just functionality. Good defaults and good animations are real differentiators. Beauty is underutilized in software. Use it as leverage to stand out.

## Review Format (Required)

When reviewing UI code, use a markdown table with Before/After/Why columns:

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; avoid `all` |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |
| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish; `ease-out` gives instant feedback |
| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |
| `transform-origin: center` on popover | `transform-origin: var(--transform-origin)` | Popovers should scale from their trigger (not modals — modals stay centered) |

## The Animation Decision Framework

Before writing any animation code, answer these in order.

### 1. Should this animate at all?

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, command palette toggle) | No animation. Ever. |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, feedback forms, celebrations) | Can add delight |

Never animate keyboard-initiated actions — repeated hundreds of times daily, animation makes them feel slow and disconnected. Raycast has no open/close animation; that is the optimal experience.

### 2. What is the purpose?

Valid purposes: spatial consistency, state indication, explanation, feedback, preventing jarring changes. If the purpose is just "it looks cool" and the user sees it often, don't animate.

### 3. What easing should it use?

- Entering/exiting → `ease-out` (starts fast, feels responsive)
- Moving/morphing on screen → `ease-in-out`
- Hover/color change → `ease`
- Constant motion (marquee, progress) → `linear`
- Default → `ease-out`

Custom easing curves:
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1); /* iOS-like drawer curve */
```

Never use `ease-in` for UI animations — it delays the moment the user is watching most closely.

### 4. How fast should it be?

| Element | Duration |
| --- | --- |
| Button press feedback | 100-160ms |
| Tooltips, small popovers | 125-200ms |
| Dropdowns, selects | 150-250ms |
| Modals, drawers | 200-500ms |
| Marketing/explanatory | Can be longer |

UI animations stay under 300ms. A faster spinner makes an app feel like it loads faster, even at identical load time.

## Spring Animations

Springs feel more natural because they simulate physics — no fixed duration, they settle based on physical parameters.

Use springs for: drag interactions with momentum, elements that should feel "alive," gestures interruptible mid-animation, decorative mouse-tracking.

```jsx
// Without spring: feels artificial, instant
const rotation = mouseX * 0.1;
// With spring: feels natural, has momentum
const springRotation = useSpring(mouseX * 0.1, { stiffness: 100, damping: 10 });
```

Configuration:
- Apple's approach (recommended): `{ type: "spring", duration: 0.5, bounce: 0.2 }`
- Traditional physics: `{ type: "spring", mass: 1, stiffness: 100, damping: 10 }`
- Keep bounce subtle (0.1-0.3); avoid in most UI, use for drag-to-dismiss and playful interactions.

Springs maintain velocity when interrupted — CSS animations/keyframes restart from zero. Ideal for gestures users might change mid-motion.

## Component Building Principles

### Buttons must feel responsive
```css
.button { transition: transform 160ms ease-out; }
.button:active { transform: scale(0.97); }
```
Scale should be subtle (0.95-0.98). Applies to any pressable element.

### Never animate from scale(0)
Start from `scale(0.9)` or higher, combined with opacity — like a balloon with visible shape even deflated.
```css
/* Bad */ .entering { transform: scale(0); }
/* Good */ .entering { transform: scale(0.95); opacity: 0; }
```

### Make popovers origin-aware
Popovers scale in from their trigger, not center. Exception: modals stay centered.
```css
.popover { transform-origin: var(--transform-origin); }
```

### Tooltips: skip delay on subsequent hovers
Delay before first appearance to prevent accidental activation; once one tooltip is open, adjacent ones open instantly.
```css
.tooltip { transition: transform 125ms ease-out, opacity 125ms ease-out; }
.tooltip[data-starting-style], .tooltip[data-ending-style] { opacity: 0; transform: scale(0.97); }
.tooltip[data-instant] { transition-duration: 0ms; }
```

### Use CSS transitions over keyframes for interruptible UI
Transitions retarget mid-animation; keyframes restart from zero. For anything triggered rapidly (toasts, toggles), transitions produce smoother results.

### Use blur to mask imperfect transitions
When a crossfade feels off despite tuning easing/duration, add `filter: blur(2px)` during the transition — blends old/new states so the eye perceives one smooth transformation. Keep blur under 20px (expensive, especially Safari).

### Animate enter states with @starting-style
```css
.toast {
  opacity: 1; transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```
Replaces the `useEffect`-sets-`mounted` React pattern where browser support allows.

## CSS Transform Mastery

- **`translateY(100%)`** — percentages are relative to the element's own size, works regardless of actual dimensions (how Sonner positions toasts, how Vaul hides drawers pre-animate).
- **`scale()` scales children too** — feature, not bug, when scaling a button on press (font, icons scale proportionally).
- **3D transforms** — `rotateX()`/`rotateY()` with `transform-style: preserve-3d` for real depth (orbits, coin flips) without JS.
- **`transform-origin`** — every element's anchor point for transforms; set to match the trigger for origin-aware interactions.

## clip-path for Animation

`clip-path: inset(top right bottom left)` — each value "eats" into the element from that side.

```css
.hidden { clip-path: inset(0 100% 0 0); }   /* fully hidden from right */
.visible { clip-path: inset(0 0 0 0); }      /* fully visible */
```

- **Tabs with perfect color transitions** — duplicate the tab list, style the copy as active, clip so only the active tab shows, animate the clip on change.
- **Hold-to-delete** — `inset(0 100% 0 0)` → `inset(0 0 0 0)` over 2s linear on `:active`; snap back 200ms ease-out on release; combine with `scale(0.97)` on the button.
- **Image reveals on scroll** — `inset(0 0 100% 0)` → `inset(0 0 0 0)` via IntersectionObserver / `useInView({ once: true, margin: "-100px" })`.
- **Comparison sliders** — overlay two images, clip the top with `inset(0 50% 0 0)`, adjust the right value on drag. No extra DOM, fully hardware-accelerated.

## Gesture and Drag Interactions

- **Momentum-based dismissal** — don't require a distance threshold; compute velocity (`Math.abs(dragDistance)/elapsedTime`); dismiss if velocity > ~0.11 regardless of distance.
- **Damping at boundaries** — the further past the natural boundary, the less it moves — real things slow before they stop.
- **Pointer capture** — once dragging starts, capture all pointer events so it continues even if the pointer leaves the element.
- **Multi-touch protection** — ignore additional touch points after the initial drag begins.
- **Friction instead of hard stops** — allow overdrag with increasing friction rather than an invisible wall.

## Performance Rules

- **Only animate `transform` and `opacity`** — skip layout/paint, run on GPU. `padding`/`margin`/`height`/`width` trigger all three rendering steps.
- **CSS variables are inheritable** — changing one on a parent recalculates styles for all children; update `element.style.transform` directly instead of a CSS variable on a shared ancestor.
- **Framer Motion shorthand caveat** — `x`/`y`/`scale` props are NOT hardware-accelerated (main-thread rAF). Use the full `transform` string for GPU acceleration under load.
- **CSS animations beat JS under load** — CSS runs off the main thread; Framer Motion (rAF) drops frames when the browser is busy loading/painting elsewhere.
- **WAAPI for programmatic CSS animations** — JS control with CSS performance, hardware-accelerated, interruptible, no library.

## Accessibility

- **`prefers-reduced-motion`** — gentler, not zero. Keep opacity/color transitions that aid comprehension; remove movement/position animation.
- **Touch device hover** — gate behind `@media (hover: hover) and (pointer: fine)`; touch triggers hover-on-tap otherwise, causing false positives.

## The Sonner Principles (Building Loved Components)

From building Sonner (13M+ weekly npm downloads):

1. **Developer experience is key.** No hooks, no context, no complex setup — `<Toaster />` once, `toast()` anywhere.
2. **Good defaults matter more than options.** Ship beautiful out of the box; most users never customize.
3. **Naming creates identity.** "Sonner" (French for "to ring") over "react-toast" — sacrifice discoverability for memorability when it fits.
4. **Handle edge cases invisibly.** Pause timers on hidden tabs, fill gaps between stacked toasts to maintain hover, capture pointer events during drag. Users never notice, and that's right.
5. **Use transitions, not keyframes, for dynamic UI.** Toasts add rapidly; transitions retarget smoothly, keyframes restart.
6. **Build a great documentation site.** Interactive examples with ready-to-use snippets lower the adoption barrier.

### Cohesion matters
Sonner's animation is slightly slower than typical UI and uses `ease` rather than `ease-out` to feel more elegant — matching the toast design, the page design, the name. A playful component can be bouncier; a professional dashboard stays crisp and fast.

### The opacity + height combination
When list items enter/exit (e.g. a drawer), opacity must work with the height animation — often trial and error, no formula.

### Review your work the next day
Fresh eyes catch imperfections. Play in slow motion / frame-by-frame to spot timing issues invisible at full speed.

### Asymmetric enter/exit timing
Pressing slow when deliberate (hold-to-delete: 2s linear), release always snappy (200ms ease-out). Slow where the user is deciding, fast where the system responds.

## Stagger Animations

Cascading entrance for multiple elements together:
```css
.item { opacity: 0; transform: translateY(8px); animation: fadeIn 300ms ease-out forwards; }
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
```
Keep delays short (30-80ms between items) — long delays feel slow.

## Debugging Animations

- **Slow motion testing** — 2-5x normal duration, or DevTools animation inspector. Check: do colors transition smoothly (vs. two states overlapping)? Does easing feel right? Is transform-origin correct? Are properties in sync?
- **Frame-by-frame inspection** — Chrome DevTools Animations panel reveals timing issues invisible at full speed.
- **Test on real devices** — for touch (drawers, swipes), Safari remote devtools over USB beats the simulator.

## Review Checklist

| Issue | Fix |
| --- | --- |
| `transition: all` | Specify exact properties |
| `scale(0)` entry | Start from `scale(0.95)` + `opacity: 0` |
| `ease-in` on UI | Switch to `ease-out` or custom curve |
| `transform-origin: center` on popover | Set to trigger location (modals exempt) |
| Animation on keyboard action | Remove entirely |
| Duration > 300ms on UI element | Reduce to 150-250ms |
| Hover animation without media query | Add `@media (hover: hover) and (pointer: fine)` |
| Keyframes on rapidly-triggered element | Use CSS transitions instead |
| Framer Motion `x`/`y` under load | Use `transform: "translateX()"` |
| Same enter/exit speed | Make exit faster than enter |
| Elements all appear at once | Add stagger (30-80ms) |
