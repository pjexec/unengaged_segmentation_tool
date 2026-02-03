# Anti-Gravity Build Prompt — Unengaged Segmentation Builder (Single-Page Tool)

ACT AS: A world-class product engineer + UX writer building a fast, trustworthy, deliverability-savvy micro-tool for email marketers.

## THE GOAL
Build a **zero-friction**, **ESP-agnostic** web tool called:

**Unengaged Segmentation Tool**  
> “Define ‘unengaged’ correctly for your list — in under 60 seconds.”

Users answer a few simple questions and receive:
1) a recommended plain-English “unengaged” definition  
2) three segmentation tiers (Cooling / Unengaged / Dormant) with recommended handling  
3) tailored “common mistakes” based on their inputs  
4) level-2 actions: Download checklist (email capture optional), DFY, Waitlist

**No login required to use the tool.**  
The tool must feel professional, not salesy, and fast on mobile.

---

## TECH STACK / CONSTRAINTS
- Next.js (App Router)
- TypeScript
- Tailwind
- shadcn/ui components
- No database required for v1 (local state only)
- No external API calls required
- Must be responsive and accessible (keyboard + ARIA labels)
- Keep the UI clean, modern, and calm (dark mode optional but not required)

Deliverables:
- Working page at `/` (single page is fine)
- Components organized cleanly
- Logic encapsulated in a pure function so it’s easy to test

---

## UI REQUIREMENTS (SINGLE PAGE)
Layout:
- Header: tool name + tagline
- Left/Top: Input form (6 inputs max)
- Right/Bottom: Results panel (renders after “Generate”)
- Sticky “Generate Segments” button on mobile (optional)
- Provide “Reset” button

### INPUTS (MAX 6)
1) **Primary engagement signal** (radio)
   - Opens + clicks
   - Clicks only
   - Purchases / conversions
   - Replies (B2B)
   - Multiple signals

2) **Tracking reliability** (radio)
   - Reliable
   - Somewhat reliable (Apple MPP, etc.)
   - Not reliable

3) **Time window** you care about (select)
   - 60 days
   - 90 days
   - 120 days
   - 180 days
   - Custom (optional numeric input shown only when “Custom” selected)

4) **Email frequency** (select)
   - Daily
   - 2–3x per week
   - Weekly
   - Less than weekly

5) **Business type** (select)
   - Ecommerce
   - SaaS
   - Info / creator
   - Agency / B2B
   - Other

6) **List maturity** (radio, optional but included)
   - Mostly recent subscribers
   - Mixed (old + new)
   - Mostly legacy / old list

Microcopy requirements:
- Each field needs one short helper line.
- Avoid fear language; keep it “experienced pro” tone.
- Don’t mention ReEngage Pro in the form.

---

## OUTPUT REQUIREMENTS (RENDER AFTER GENERATE)
Render four sections in this order:

### 1) Recommended “Unengaged” Definition (Plain English)
A short title and 3–5 bullet rules.
- Must be ESP-agnostic
- Must consider tracking reliability:
  - If reliability is “Not reliable,” de-emphasize opens; prefer clicks/replies/purchases or “no meaningful engagement signals.”
- Must incorporate time window and frequency.
- Must incorporate business type where appropriate.

### 2) Segmentation Tiers (Cooling / Unengaged / Dormant)
Each tier includes:
- time range label (derived)
- what it means (1–2 lines)
- recommended handling (2–4 bullets)

**Default baseline ranges** (adjust by frequency + maturity):
- Cooling: 30–60 days inactive
- Unengaged: 60–120 days inactive
- Dormant: 120+ days inactive

Adjustments:
- If frequency is Daily, tighten ranges (shorter windows).
- If frequency is Less than weekly, loosen ranges (longer windows).
- If list maturity is Mostly legacy, be more conservative (push users toward suppression for Dormant).

### 3) Common Mistakes (Tailored)
Show 3–5 bullets depending on inputs.
Examples:
- If tracking reliability ≠ Reliable: “Over-weighting opens when opens aren’t trustworthy.”
- If signal includes opens: “Treating opens as intent instead of a weak proxy.”
- If business type = Ecommerce: “Not excluding recent purchasers from re-engagement.”
- If business type = B2B: “Ignoring replies as a high-quality engagement signal.”
- If frequency high: “Mailing dormant segments in standard broadcasts.”

### 4) Next Actions (Level-2)
Three cards/buttons:
- **Download: Unengaged Safety Checklist** (email capture optional modal)
- **Request DFY Implementation** (simple form modal: name, email, company, ESP, note)
- **Join the Waitlist** (simple modal: email + optional role)

Important:
- These are *optional* and must not block results.
- Keep language calm and professional.

---

## ATTRIBUTION / PARTNER TRACKING HOOKS (NO BACKEND REQUIRED YET)
Implement a minimal **client-side** attribution capture + event logger stub, so it’s easy to wire up later.

Requirements:
1) On page load, read URL param `ref` (e.g. `?ref=alex`) and store it as first-touch in:
   - `localStorage` key: `reengage_ref`
   - Only set if not already present (first-touch wins)

2) Also generate/store an anonymous visitor id:
   - `localStorage` key: `reengage_vid` (uuid)

3) Create a function `trackEvent(name, props)` that:
   - currently `console.log`s a structured object
   - includes `vid`, `ref`, timestamp, and event name
   - Later will POST to an endpoint, but do NOT build the endpoint now

Track these events:
- `tool_viewed` (once on load)
- `tool_generated` (when results are generated)
- `checklist_modal_opened`
- `dfy_modal_opened`
- `waitlist_modal_opened`
- `checklist_submitted` (if email submitted)
- `dfy_submitted`
- `waitlist_submitted`

---

## LOGIC IMPLEMENTATION DETAILS
Create a pure function like:

`buildSegmentationPlan(input: ToolInput): ToolOutput`

Where:
- `ToolInput` includes the 6 input values
- `ToolOutput` contains:
  - definition bullets
  - tiers with headings + bullets
  - mistakes bullets
  - recommended next step emphasis (optional)

Keep the logic deterministic, readable, and easy to adjust.

---

## UX / POLISH REQUIREMENTS
- Results appear with a subtle transition (Framer Motion optional)
- Add “Copy results” button (copies definition + tiers + mistakes as plain text)
- Add “Share link” button that appends `?ref=` if present and copies URL
- Add lightweight validation (e.g., custom days must be 30–365)
- Ensure the page is fast, clean, and not cluttered

---

## WHAT TO PRODUCE
- Implement the page and components.
- Keep code clean and documented.
- Do not over-engineer.
- Output should look good enough to ship.

When done, verify:
- Works on mobile
- Keyboard navigable
- No required signup
- Generates sensible output for different combinations
