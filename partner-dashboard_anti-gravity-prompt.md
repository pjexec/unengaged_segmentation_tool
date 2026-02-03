# Anti-Gravity Build Prompt — Partner / Affiliate Dashboard (V1)

ACT AS: A senior SaaS product engineer designing a **trust-first, money-centric partner dashboard** for experienced email marketers and operators.

This is **not** a marketing dashboard.
This is a **revenue attribution + commission visibility dashboard** that partners can trust and use daily.

---

## THE GOAL
Build a secure **Partner Dashboard** where approved partners can:

1) Log in securely  
2) See **real-time attribution + conversion stats**
3) See **commissions earned (DFY + future SaaS)**
4) Retrieve their **unique referral link**
5) Understand attribution rules clearly (no ambiguity)

This dashboard is required **Day 1** for partners to mail.

---

## PRODUCT CONTEXT
Partners are mailing a **free front-end tool** (Unengaged Segmentation Builder).

Attribution must persist across:
- Tool usage
- Checklist opt-in
- DFY conversion (immediate money)
- ReEngage Pro SaaS signup (future money)

First-touch attribution applies.

---

## TECH STACK / CONSTRAINTS
- Next.js (App Router)
- TypeScript
- Tailwind
- shadcn/ui
- Server Components where appropriate
- Simple database assumed (Postgres or equivalent)
- Auth: email + magic link (no passwords)
- No external affiliate platforms
- Clean, fast, professional UI

This is a **V1**, but must feel serious and reliable.

---

## ROUTES / PAGES

### `/partner/login`
- Email input
- “Send magic link” button
- Simple explanation:
  “Access your partner dashboard to view stats and commissions.”

---

### `/partner/dashboard`
Main dashboard page after login.

---

## AUTH REQUIREMENTS
- Magic link authentication
- Partner must already exist in `partners` table
- No self-signup in v1 (partners added manually)
- Session stored securely (HTTP-only cookie)

---

## PARTNER DATA MODEL (V1)

### `partners`
- id
- name
- email
- referral_key (used as ?ref=)
- status (active / paused)
- created_at

### `visitors`
- id (anonymous visitor id)
- referral_key
- first_seen
- last_seen

### `events`
- id
- visitor_id
- partner_id
- event_type
- asset
- created_at

### `conversions`
- id
- visitor_id
- partner_id
- offer_type (`dfy`, `saas`)
- status (`pending`, `approved`, `paid`)
- commission_amount
- created_at

### `payouts`
- id
- partner_id
- amount
- status (`pending`, `sent`)
- sent_at

---

## DASHBOARD UI REQUIREMENTS

### SECTION 1 — Partner Overview (Top)
Show clearly:

- Partner name
- Referral link (copy button)
  Example:
  `https://yourdomain.com/tool?ref=alex`
- Attribution window (e.g. “365-day first-touch attribution”)

---

### SECTION 2 — Performance Summary
Show **only money-relevant stats**:

- Visits attributed
- Tool completions
- Checklist opt-ins
- DFY requests
- Approved DFY conversions
- **Total commission earned**
- **Unpaid commission balance**

Use cards or a simple grid.
No charts required in v1.

---

### SECTION 3 — Conversion Log (Critical)
A table partners can audit.

Columns:
- Date
- Visitor ID (shortened / hashed)
- Event / Conversion
- Offer (Tool / DFY / SaaS)
- Status
- Commission

Examples:
- “DFY Request — Pending”
- “DFY Approved — $X”
- “ReEngage Pro Signup — Active — $Y”

Sorting:
- Most recent first

---

### SECTION 4 — Payout History
Table:
- Date
- Amount
- Status
- Notes (optional)

If none yet:
- Show “No payouts yet” with calm copy.

---

### SECTION 5 — Attribution Rules (Visible)
This section must be explicit and readable.

Copy example:
- First-touch attribution
- Attribution window: 365 days
- One partner per visitor
- Attribution applies across all ReEngage offers
- Manual dispute resolution during beta

This prevents future confusion.

---

## TRACKING + EVENTS (SERVER-SIDE)
Dashboard reads aggregated data from:

- `events` table
- `conversions` table

Key event types to support:
- tool_viewed
- tool_generated
- checklist_submitted
- dfy_submitted
- dfy_approved
- saas_signup
- saas_active

---

## COMMISSION LOGIC (V1)
- DFY commission recorded when DFY request is approved
- SaaS commission recorded when subscription becomes active
- Commission amounts stored per conversion
- No automatic payouts required yet

---

## UX / TRUST REQUIREMENTS
- Tables > charts
- Timestamps visible
- No hidden math
- Copy emphasizes clarity and fairness
- Professional tone (no hype, no emojis)

---

## NON-GOALS (DO NOT BUILD)
- Multi-tier affiliates
- Promo assets
- Automated payouts
- Fraud detection
- Public partner signup

---

## FINAL CHECKS
Before completion, ensure:
- Partner can log in and immediately see their link
- Stats reconcile logically
- Commission numbers are obvious
- Attribution rules are impossible to miss
- UI feels “founder-grade,” not hacky

Deliver clean, readable code that can evolve, but **do not overbuild**.

This dashboard must make experienced marketers comfortable mailing aggressively.
