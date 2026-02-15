# Cold-Traffic Tool — Tool Interaction + Email Gate (Doc 3)
# Anti-Gravity Build Prompt: Phase 3 of 4

---

## Prerequisites
- Read `anti-gravity-doc0-design-system.md` — all visual decisions
- Complete Doc 1 (Source Audit + Extraction) — engine extracted
- Complete Doc 2 (Hero + Persuasion Layer) — hero and frosted form in place

---

## What This Doc Covers

Stages 2 and 3 of the cold-traffic tool:

**Stage 2:** The visitor interacts with the form (frost has been lifted by "Prove It" click from Doc 2)
**Stage 3:** The visitor submits the form, results render but are frosted behind an email gate, visitor provides email, frost lifts on results

---

## Stage 2: Form Interaction

### Form Fields (Preserved from Existing Tool)

The form has 6 fields, extracted from the existing tool in Doc 1. The fields, their types, options, and helper text are identical to the existing tool. Do not change the form's functional behavior.

The 6 fields are:
1. **Sending Frequency** — radio buttons (Daily, Weekly, Monthly or less, Irregular/inconsistent)
2. **Total Email List Size** — number input
3. **Estimated Unengaged Subscribers** — number input
4. **Engagement Signals Available** — checkboxes (Opens, Clicks, Replies, Purchases)
5. **Current Deliverability Health** — radio buttons (Good/Stable, Some issues, Serious problems/blacklisted)
6. **Recent Re-Engagement Attempts** — radio buttons (None, Tried within last 6 months, Tried over 6 months ago)

### Visual Changes from Existing Tool

The form fields use the new design system from Doc 0:
- Background: `--bg-secondary` for the form panel
- Input fields: `--bg-secondary` with `--border-medium` borders, white text
- Focus states: `--accent-primary` outline (teal, not the old blue #5d9cec)
- Radio/checkbox accent: `--accent-primary`
- Labels: `--text-heading` (white), 0.95rem, weight 600
- Helper text: `--text-muted`, 0.8rem
- All styling per Doc 0 design system

### Generate Button

The existing tool's "Generate My Framework" button sits at the bottom of the form. In the cold-traffic version:

**Button text:** "Generate My Framework" (unchanged)
**Button styling:** Uses `.cta-primary` from Doc 0 (teal background, not the old blue)

**Button behavior changes:**
- In the existing tool: clicking generates results and shows them immediately
- In the cold-traffic tool: clicking generates results, renders them in the DOM, THEN immediately applies the `.frosted` class to the results section and shows the email gate modal

### Form Validation

Same validation as the existing tool. If required fields are missing, show error states (red border using the existing `.field-error` class, adapted to new color scheme). Do not allow form submission until validation passes.

---

## Stage 3: Email Gate

### Flow

1. Visitor fills out form and clicks "Generate My Framework"
2. The calculation engine runs (same as existing tool)
3. Results are rendered in the DOM but the results section has `.frosted` class applied — blurred, low opacity, non-interactive
4. The email gate modal appears as a centered overlay
5. Visitor sees their frosted/blurred results in the background (this creates urgency — "my plan is RIGHT THERE")
6. Visitor enters first name and email (or uses Google OAuth)
7. On submit: API call to ActiveCampaign via server.js proxy
8. On success: modal closes, `.frosted` class removed from results, results transition to visible over 0.6s
9. On error: show error message in modal, allow retry

### Email Gate Modal Design

```
┌──────────────────────────────────────────┐
│                                     [X]  │
│                                          │
│         Your plan is ready.              │
│                                          │
│  We built a personalized re-engagement   │
│  framework based on the data you         │
│  entered. Enter your details below to    │
│  see your results.                       │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ First Name                        │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Email Address                     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │       Show Me My Plan             │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  [G] Continue with Google         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  We don't sell your data. This gives     │
│  you access to your results.             │
│                                          │
└──────────────────────────────────────────┘
```

### Modal Copy — All Locked, Do Not Modify

**Title:** "Your plan is ready."

**Description:** "We built a personalized re-engagement framework based on the data you entered. Enter your details below to see your results."

**Primary button:** "Show Me My Plan"

**Google OAuth button:** "Continue with Google"

**Privacy line:** "We don't sell your data. This gives you access to your results."

### Modal Styling

- Overlay background: `rgba(0, 0, 0, 0.7)` with `backdrop-filter: blur(4px)` — same pattern as existing tool's modal
- Modal container: `--bg-secondary` background, `--border-medium` border, rounded corners, centered
- Max width: `480px`, width: `90%`
- Title: `1.3rem`, weight 700, white
- Description: `0.9rem`, `--text-muted`, line-height 1.6
- Form fields: same `.form-field` styling from Doc 0
- Primary button: `.cta-primary` from Doc 0
- Google OAuth button: white background, dark text, Google "G" icon, standard Google sign-in styling
- Privacy line: `0.75rem`, `--text-muted`, centered
- Close button (X): top-right, subtle, `--text-muted` color
- Entry animation: `modalSlideIn` (same as existing tool — fade up + scale)

### Google OAuth Integration

The Google OAuth button provides a frictionless alternative to manual form entry. Implementation:

1. Use Google Identity Services (GIS) library
2. On successful OAuth: extract `given_name` and `email` from the Google profile
3. Submit to the same ActiveCampaign endpoint (`/api/activecampaign/contact`) with the extracted `firstName` and `email`
4. Proceed with the same frost-reveal flow

```html
<script src="https://accounts.google.com/gsi/client" async></script>
```

If Google OAuth implementation is too complex for the initial build, make it a clearly marked TODO in the code with a comment explaining the intended flow. The manual first name + email form is the MVP. Google OAuth is a nice-to-have.

### Close Button (X) Behavior

If the visitor clicks the X to close the modal without entering their email:
- The modal closes
- The results remain frosted/blurred
- The form remains filled with their data
- They can re-trigger the email gate by clicking "Generate My Framework" again (the calculation doesn't need to re-run, just re-show the modal)
- This is NOT a dead end — the visitor can still enter their email at any time

### ActiveCampaign API Call

Same endpoint and payload format as the existing tool:

```javascript
const response = await fetch('/api/activecampaign/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        firstName: firstNameValue,
        email: emailValue
    })
});
```

**Note:** The `AC_LIST_ID` in server.js may need to be different for cold-traffic leads vs existing tool leads. This is flagged as a question for Chuck (see Doc 1). For now, use the same endpoint and list. If a second list is needed, it's a one-line change in server.js.

### Post-Submission Flow

1. API call succeeds
2. Modal shows brief success state (optional — can skip straight to reveal)
3. Modal fades out
4. Results section: `.frosted` class removed, transition to full visibility over 0.6s
5. Page scrolls smoothly to the top of the results section
6. Visitor is now in Stage 4 (Results Page, covered in Doc 4)

### Error Handling

- If API call fails: show error message inside the modal ("Something went wrong. Please try again.")
- Do not close the modal on error
- Do not reveal results on error
- Allow retry
- If the server is unreachable: same error message, same behavior

---

## Technical Integration Notes

### How Stages 2-3 Connect to the Extracted Engine (Doc 1)

The calculation engine from Doc 1 does the heavy lifting. The new code you're writing in Doc 3 is:

1. **A wrapper around the "Generate" button** that adds the email gate step between form submission and results reveal
2. **The email gate modal** (HTML, CSS, JS for the modal interaction)
3. **The ActiveCampaign API call** (same as existing tool, just triggered from the modal instead of the old safety checklist modal)
4. **The frost management** on the results section

The actual calculation, conditional rendering, dynamic text population — all of that is the engine from Doc 1. You are NOT rewriting any of that. You are inserting a gate between the "calculate" step and the "reveal" step.

### Suggested Code Architecture

```javascript
// In the extracted engine, find where the "Generate" button click handler is.
// The existing flow looks like:
//   1. Validate form
//   2. Run calculations
//   3. Populate results HTML
//   4. Show results (remove hidden class, run animation)
//
// Change step 4 to:
//   4. Apply .frosted to results section
//   5. Show email gate modal
//   6. On email submission success: remove .frosted, run reveal animation
```

Do not restructure the engine. Just intercept the final "reveal" step.

---

## Deliverable from Doc 3

When this phase is complete:
1. The form is fully interactive with the new design system styling
2. "Generate My Framework" runs the extracted calculation engine
3. Results render in the DOM but are frosted
4. Email gate modal appears with all locked copy
5. First name + email form works and calls ActiveCampaign API
6. Google OAuth is implemented or clearly marked as TODO
7. On successful email submission, frost lifts and results are revealed
8. Error handling works for API failures
9. Close (X) behavior leaves results frosted but form data intact
10. Everything is responsive (single build, no separate mobile files)

**Proceed to Doc 4 (Results Page) after this is complete.**
