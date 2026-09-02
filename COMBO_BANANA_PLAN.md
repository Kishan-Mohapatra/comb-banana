# Combo Banana — Product & Dashboard Plan

## What this platform actually is

Combo Banana helps a company find the right industry summit/trade show, then plan and budget its participation in it. Core scenario: a user already knows roughly which summit they want to attend. They answer a short questionnaire that narrows the summit down to a specific package (booth size, location tier, dates, team size, goals), and the platform outputs a concrete plan: budget, constraints, and a participation checklist.

**Grounding reference for what "participation planning" output looks like**: `Pibit_20x20_ITC 2026_Op2_Rev1_29072026.pdf` — a real trade-show booth package for Pibit.ai at InsurTech Connect 2026. It shows exactly what a finished plan needs to contain:

- Exhibitor identity + booth metadata (booth #, size 20'×20', show name/dates, location, design reference #)
- Floor plan placement (booth position relative to entrance, neighboring exhibitors)
- Booth orientation / 3D perspective renders (front, side, back, aerial, backlit)
- Plan + elevation with grid dimensions (20'×20' footprint, 14' height)
- Itemized furniture/AV list with SKUs and quantities (flooring, TV monitors, counters, barstools, tables, sofas — each with a part number and count)
- Vendor capacity/reach: "13 locations, 3 continents, 1 global team, capacity of 1500 projects/year across 20 countries" — i.e., the booth vendor's own global fulfillment footprint

This is the shape of the **budget + constraints output** Combo Banana should generate at the end of its questionnaire flow — not vague pricing, but a real itemized package: booth tier → floor plan slot → furniture/AV line items → total cost → vendor/fulfillment capacity check (can this be delivered at this location in time).

## Optimized end-to-end flow

1. **Entry** — user already has a target summit in mind, or browses a ranked catalog (reuse the "Event Discovery" pattern already prototyped in `fieldnote_full_prototype.html`: filter panel + search + sortable result list with a match/fit score).
2. **Summit lock-in** — user selects one summit. Page shows the summit's known facts (dates, location, floor map, past attendee/exhibitor list) the same way the prototype's event-detail drawer does.
3. **Questionnaire (adaptive, not linear)** — branches on prior answers, same principle as a wizard/multi-step form already available in the codebase (`src/features/forms/components/multi-step-product-form.tsx`, `useAppForm` from `@/components/ui/tanstack-form`). Question groups:
   - Goals (lead gen / brand presence / partnerships / analyst briefings)
   - Team size attending + roles
   - Booth ambition (tabletop → 10×10 → 20×20 → custom)
   - Travel origin + date flexibility
   - Budget ceiling (soft constraint, used to rank options not hard-filter)
4. **Narrowing engine** — collapses the summit into one recommended package: booth tier, floor zone preference, furniture/AV bundle, travel+lodging estimate.
5. **Output — Plan & Budget** — the Pibit-deck-shaped deliverable: floor plan slot, 3D booth preview placeholder, itemized furniture/AV list, total budget broken into ticket/booth/travel/stay/misc, and constraints (deadlines, visa flags, capacity limits at that vendor location).
6. **Participation tracking** — once committed, the summit moves into an ongoing tracker: RSVP status per team member, task checklist (contract signed, deposit paid, shipping deadline), and a running spend-vs-budget view.
7. **Command Centre** — the daily/weekly home base once a user has multiple summits in flight (see below) — this is where flow optimization pays off, because steps 1–6 produce structured data (summit, budget, tasks, deadlines) that the Command Centre surfaces proactively instead of making the user re-navigate to each summit's page.

## Feature list

| Feature | Purpose | UI precedent to reuse |
|---|---|---|
| **Command Centre** | AI-assisted daily home base: morning brief, what needs attention, ask-anything | `src/features/command-centre/` (full pattern below) |
| **Summit Discovery** | Browse/filter/rank summits | Fieldnote's Event Discovery screen (filters panel, score ring, event rows) |
| **Questionnaire Wizard** | Narrow a chosen summit into a concrete package | `src/features/forms/components/multi-step-product-form.tsx` pattern, `useAppForm` |
| **Plan & Budget Output** | Itemized budget + constraints, styled after the Pibit PDF | New — data table + line-item cards + a floor-plan/booth visual slot |
| **Participation Tracker** | Per-summit checklist, RSVP, spend-vs-budget | `DataTable` (TanStack Table) pattern from `src/features/users/components/users-table/` |
| **Vendor/Fulfillment Capacity** | Check a vendor can deliver the chosen booth tier at that location/date | New — simple capacity-by-region view, modeled on the PDF's "13 locations / 3 continents / 20 countries" summary |
| **Reporting** | Spend across summits, ROI/attribution if usable | Fieldnote's Reporting screen (attribution window/model toggles, ROI bar chart via `recharts`) |

## Dashboard layout — Command Centre as the anchor

Reuse the existing Command Centre architecture in `src/features/command-centre/` almost as-is — it already solves "AI-assisted daily home base," it just needs its data source swapped from CRM/deals to summits/budgets/tasks:

- **`command-centre-shell.tsx`** — the main pattern: a landing state ("Good morning, {name} ☀️ — here's your AI morning brief") backed by `TodaysFocus`, a persistent AI prompt input (`LeoPromptInput`) that opens a chat thread, and a right-hand **`CommandCentreRail`** that becomes a dynamic contextual panel (KPI detail, team/member detail, activity log) depending on what's clicked.
- **`kpi-rail.tsx` / `kpi-detail-panel.tsx`** — swap deal/pipeline KPIs for: upcoming summit deadlines, total committed budget, budget-vs-actual variance, summits in the "decision pending" stage.
- **`todays-focus.tsx`** — surfaces the 2–3 things that actually need a decision today (e.g. "Early-bird deadline for InsurTech Connect closes in 3 days — lock booth tier now").
- **`live-feed.tsx`** — activity stream: "Budget approved for Summit X", "Booth tier changed to 20×20", "Sarah RSVP'd for InsurTech Connect".
- **`team-availability-panel.tsx` / `member-assign-control.tsx`** — who from the team is attending which summit, capacity to take on booth-staffing duty.
- **`schedule-panel.tsx`** — deadline calendar (early-bird cutoffs, shipping deadlines, RSVP cutoffs) across all summits in flight.
- **`summary-recap.tsx`** — end-of-day/week recap of what moved.
- The reasoning/AI-chat scaffolding (`Reasoning`, `ReasoningTrigger`, simulated thinking→analyzing→creating→done states) is reusable verbatim for an "Ask about your summits" assistant — same pattern as the current "Ask Leo" flow, just re-themed and re-scoped to summit/budget queries instead of CRM deal queries.

Page composition stays identical to today's `src/app/dashboard/command-centre/page.tsx` — `PageContainer` wrapping `<CommandCentreShell />` — only the underlying mock data module (`src/constants/command-centre-scenarios.ts` equivalent) changes domain.

## Sidebar navigation (proposed)

| Item | Route | Maps to |
|---|---|---|
| Command Centre | `/dashboard/command-centre` | daily home base |
| Discover Summits | `/dashboard/discover` | Fieldnote-style catalog/filter/search |
| Questionnaire | `/dashboard/plan/new` | wizard entry point (per summit) |
| My Summits | `/dashboard/summits` | participation tracker list |
| Budget & Vendors | `/dashboard/budget` | itemized plan output + vendor capacity |
| Reporting | `/dashboard/reporting` | spend/ROI across summits |

## Next step

This file is the plan only — no code changes made yet. Once you confirm this direction (and whether it supersedes or coexists with the earlier Fieldnote-clone plan), the implementation should follow the same "copy Assignment Real as reference, build fresh in Combo Banana" approach already agreed: copy the shell/layout/command-centre scaffolding across, then build the Discovery/Questionnaire/Budget/Tracker features as new `src/features/<name>/` modules following the existing `types.ts → service.ts → queries.ts → components/` layering.
