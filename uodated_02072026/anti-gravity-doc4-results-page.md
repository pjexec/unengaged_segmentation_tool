# Cold-Traffic Tool — Results Page (Doc 4)
# Anti-Gravity Build Prompt: Phase 4 of 4

---

## Prerequisites
- Read `anti-gravity-doc0-design-system.md` — all visual decisions
- Complete Doc 1 (Source Audit + Extraction) — engine extracted
- Complete Doc 2 (Hero + Persuasion Layer) — hero in place
- Complete Doc 3 (Tool Interaction + Email Gate) — form and email gate working

---

## What This Doc Covers

Stage 4 of the cold-traffic tool: everything the visitor sees after the email gate frost lifts and their personalized results are revealed. This is the longest and most complex stage because it contains:

1. The personalized results/framework (preserved from existing tool engine)
2. The corrected Bucket B protocol (critical content change)
3. Three DFY CTA blocks with locked copy
4. Three inline sprint mentions woven into educational content
5. The waitlist block at the bottom

---

## Results Page Structure

The results page structure follows the existing tool's section order. The engine from Doc 1 handles all conditional rendering, dynamic text injection, and section visibility. This doc defines what CHANGES from the existing tool.

### Section Order (Matching Existing Tool)

The existing tool's results page has these sections in order. Section numbers are reference labels, not displayed on the page:

1. **Snapshot** — "Your Engagement Snapshot" with Venn diagram and bucket size numbers
2. **What's Real** — The reality of their engaged segment (Phantom Engaged breakdown)
3. **The Three Buckets** — Bucket A / B / C card grid with definitions
4. **The Framework Explained** — How the A/B/C classification works conceptually
5. **>>> DFY CTA 1 GOES HERE <<<** (NEW — does not exist in current tool)
6. **Bucket A Handling** — What to do with Confirmed Engaged subscribers
7. **Bucket B Handling** — What to do with Phantom Engaged subscribers (CORRECTED — see below)
8. **Bucket B Inline Sprint Mention** (NEW — woven into section content)
9. **Observation Window** — The time-based classification window
10. **Bucket B Resolution** — What happens at end of observation window
11. **>>> DFY CTA 2 GOES HERE <<<** (NEW — does not exist in current tool)
12. **Bucket C Handling** — What to do with Unengaged subscribers
13. **Bucket C Inline Sprint Mention 1** (NEW — woven into section content)
14. **Re-Engagement Volume Cap** — Safe daily sending limits
15. **Warmest-First Sequencing** — Send order for re-engagement
16. **Two-Send Limit** — Exit rules for non-responders
17. **Bucket C Inline Sprint Mention 2** (NEW — woven into section content)
18. **Hard Stop** — Alert box about permanent suppression
19. **Conditional: Repair First** — Only shows if deliverability health is "Serious problems"
20. **>>> DFY CTA 3 GOES HERE <<<** (NEW — does not exist in current tool)
21. **>>> WAITLIST BLOCK GOES HERE <<<** (NEW — does not exist in current tool)

---

## Critical Content Change: Bucket B Handling (Section 7)

**THIS IS THE MOST IMPORTANT CHANGE IN THE ENTIRE BUILD.**

The existing tool's Bucket B action text is WRONG. It currently says:

> "Continue normal sending to this group during this window. If no provable signal (click, reply, or purchase) appears after [X] days, move to Bucket C."

**Replace with the corrected protocol:**

The correct Bucket B handling is an active diagnostic protocol, not passive observation:

1. **Reduce sending frequency** for this group specifically. Do not continue your normal cadence.
2. **Change the content strategy.** Every message sent to Bucket B during the observation window must require a human action to register engagement — a click, a reply, or a purchase. Opens alone cannot distinguish humans from bots, which is the entire reason these subscribers are in Bucket B.
3. **Observe for the classification window** ([X] days — this is dynamically populated by the engine based on sending frequency: 45 days for daily senders, 60 for weekly, 90 for monthly/sporadic).
4. **If they produce a verifiable human signal** (click, reply, purchase) during the window, **move them to Bucket A** (Confirmed Engaged).
5. **If they produce no human signal** after the window expires, **move them to Bucket C** (Unengaged).

The exact wording for this section needs to convey:
- This is NOT "keep doing what you're doing and see what happens"
- You are deliberately creating conditions where a real human would reveal themselves and a bot/proxy engagement would not
- The frequency reduction prevents further deliverability damage while the diagnostic runs
- The content change (requiring clicks/replies, not just opens) is the core mechanism

**Important:** The dynamically populated observation window value ([X] days) still comes from the engine. Do not hardcode this. The `var-` class spans that the engine populates must be preserved.

---

## DFY CTA Blocks — All Copy Locked, Do Not Modify

Three CTA blocks are inserted into the results page at the positions marked above. Each one links to `https://dfy.reengage.pro` in a new tab.

### CTA Block 1 — After Framework Explanation (Section 4/5)

**Placement:** After the visitor has read the framework explanation and understands the A/B/C classification conceptually. Before they get into the specific handling for each bucket.

**Copy:**
"This framework exists inside a done-for-you sprint. Your list gets classified for real, your best customers stop getting buried, and the subscribers you've been afraid to touch get handled safely. One person built this framework, and one person runs every sprint."

**Button text:** "See How The Sprint Works"
**Button link:** `https://dfy.reengage.pro` (opens in new tab)
**Button style:** `.cta-primary` from Doc 0

**Block styling:** `.dfy-cta-block` from Doc 0. Centered text, surface background, medium border, generous padding.

---

### CTA Block 2 — After Bucket B Resolution (Section 10/11)

**Placement:** After the visitor has read through the Bucket B handling and the observation window. This is the "I don't want to do this myself" moment.

**Copy:**
"Everything you just read about handling Phantom Engaged subscribers is what the sprint does. 30 to 60 days of controlled re-engagement, monitored daily, using software built specifically for this. You don't run it. I do."

**Button text:** "See How The Sprint Works"
**Button link:** `https://dfy.reengage.pro` (opens in new tab)
**Button style:** `.cta-primary` from Doc 0

**Block styling:** `.dfy-cta-block` from Doc 0.

---

### CTA Block 3 — Bottom of Page (Section 20)

**Placement:** After all educational content, after the Hard Stop, after Repair First (if shown). The most direct version.

**Copy:**
"Right now, unengaged subscribers are hurting your sender reputation every time you hit send. Your biggest fans are getting buried because your ESP can't tell them apart from bots. And the subscribers you've been afraid to mail or delete are sitting there costing you money every month while you wait for a safe way to deal with them. The sprint resolves all three. Your list gets classified with real data. Your recoverable subscribers get re-engaged safely. And you stop guessing."

**Button text:** "See How The Sprint Works"
**Button link:** `https://dfy.reengage.pro` (opens in new tab)
**Button style:** `.cta-primary` from Doc 0

**Block styling:** `.dfy-cta-block` from Doc 0.

---

## Inline Sprint Mentions — No Buttons, No Links

Three inline mentions are woven into the educational content. These are contextual reminders, not CTAs. They do NOT have buttons or links. They warm the reader up so the actual CTA blocks land harder.

### Inline Mention 1: Inside Bucket B Section

**Placement:** After the corrected Bucket B observation window explanation and action steps.

**Text to insert (as a regular paragraph within the section):**
"This classification process is one of the three deliverables in the done-for-you sprint, built directly inside your ESP using your real subscriber data."

**Styling:** Same as surrounding body text. `--text-body` color, `1rem`, weight 300. It should feel like a natural part of the educational content, not a callout or card. No special background, no border, no icon.

---

### Inline Mention 2: Inside Bucket C Section

**Placement:** After the explanation of why mass re-engagement blasts are dangerous. Specifically, after any text about how a mass blast would compound deliverability problems, and before the explanation of the controlled approach.

**Text to insert:**
"This is exactly what the done-for-you sprint is built to manage. Every re-engagement send is individually monitored against live deliverability signals, with daily adjustments based on how ISPs are responding."

**Styling:** Same as surrounding body text. Natural paragraph within the section.

---

### Inline Mention 3: After Two-Send Limit Section

**Placement:** After the Two-Send Limit / exit rules section, after any text about re-engagement not repeating indefinitely.

**Text to insert:**
"The sprint runs this entire Bucket C process for you, including volume pacing, warmest-first sequencing, exit rule enforcement, and permanent suppression of non-responders. It uses proprietary software that isn't publicly available to monitor every send in real time."

**Styling:** Same as surrounding body text. Natural paragraph.

---

## Waitlist Block — Bottom of Page

**Placement:** Below the final DFY CTA (CTA 3). This is the last thing on the page.

**Copy:**
"ReEngage Pro is the software behind this sprint. It's the same system used to classify subscribers and run controlled re-engagement on client lists. It's not publicly available yet, but it will be. If you want to run this process on your own list when it launches, the waitlist is how you get early access."

**Button text:** "Join the ReEngage Pro Waitlist"
**Button link:** `[WAITLIST_URL]` — placeholder, Chuck will provide
**Button style:** `.cta-secondary` from Doc 0 (outline style, visually subordinate to DFY buttons)

**Block styling:** `.waitlist-block` from Doc 0. Border-top separator, more muted text, smaller treatment than the DFY blocks. This is NOT a footnote — it's a real block with a real button — but it is visually quieter than the three DFY CTAs above it.

---

## Results Page Design Treatment

The results page uses the same dark palette as the rest of the tool but with a LIGHTER TOUCH after the email gate. The visitor just gave you their email and got through the gate. The results should feel like clarity arriving, not more darkness.

### How to Achieve "Lighter Touch"

1. **More teal/emerald accents** — Use `--accent-bright` (#10b981) more liberally on data visualizations, bucket labels, and section markers
2. **Brighter data visualizations** — The Venn diagram circles, bucket cards, and number callouts should feel vivid against the dark background
3. **More white space** — Increase `margin-bottom` on results sections compared to the existing tool. Each section should feel like its own moment with breathing room.
4. **Rule boxes** use `--bg-surface` with `--accent-primary` left border (teal, not the old blue)
5. **Alert boxes** keep the red treatment (these are warnings, they should feel different)

### Preserved Visual Elements

- The Venn diagram (overlapping circles) — same structure, updated colors per Doc 0's data visualization tokens
- The bucket cards grid — same 3-column layout, updated border colors
- The rule boxes — same layout, updated colors
- The alert box / hard stop — same layout, kept red for warning emphasis

### Replaced Visual Elements

- **Old CTA callouts** (the existing tool's CTA sections at the bottom) — replaced with the three new DFY CTA blocks defined above
- **Old modal** (safety checklist opt-in) — already replaced by email gate in Doc 3
- **Old color scheme** — charcoal/blue → forest green/teal per Doc 0

---

## Conditional Sections

The engine from Doc 1 handles all conditional rendering. Key conditional behaviors to preserve:

1. **Repair First section** — only shows when deliverability health is "Serious problems/blacklisted." When it shows, it appears as a prominent alert before the re-engagement framework, warning the visitor to fix deliverability first. The engine handles the show/hide logic. Do not change it.

2. **Engagement signal conditional blocks** — certain content changes based on which engagement signals (opens, clicks, replies, purchases) the visitor selected. The engine handles this via the `conditional-block` / `conditional-block.active` class pattern. Preserve it.

3. **Bucket B qualifier text** — the engine adjusts Bucket B description text based on whether only opens are available vs. clicks/replies/purchases. This is a critical conditional that changes how Phantom Engaged is described. Preserve it.

---

## What to Carry Over vs. What to Rewrite

### Carry Over (from existing tool's index.html, preserving content and structure):
- All section headings and their order
- All educational content paragraphs (EXCEPT Bucket B action text — see correction above)
- All dynamic text spans with `var-` classes
- All conditional block markup
- The Venn diagram structure
- The bucket cards grid
- The rule boxes
- The alert boxes
- The repair-first section

### Rewrite:
- The Bucket B action text (corrected protocol)
- All CTA sections (replaced with three new DFY blocks)
- Add three inline sprint mentions at specified positions
- Add waitlist block at bottom
- All styling (new design system from Doc 0)

### Remove:
- The old safety checklist CTA / modal trigger (replaced by email gate in Doc 3)
- Any references to the old blue accent color (#5d9cec) — all accent is now teal/emerald
- The "Not AI-generated" trust banner from the top of the existing tool — this may or may not be needed on the cold-traffic version (flag as question for Chuck)
- The pre-generation placeholder content (right panel educational content before form submission) — this is replaced by the hero/persuasion layer from Doc 2

---

## Deliverable from Doc 4

When this phase is complete:
1. The full results page renders with all personalized data from the engine
2. Bucket B handling uses the corrected protocol (NOT "continue normal sending")
3. Three DFY CTA blocks are placed at correct positions with locked copy
4. Three inline sprint mentions are woven into educational content at correct positions
5. Waitlist block sits at the bottom with locked copy
6. All styling follows Doc 0 design system
7. Results page has the "lighter touch" treatment (more accents, more whitespace, vivid data vis)
8. All conditional rendering from the engine works correctly
9. All dynamic text injection from the engine works correctly
10. The page is responsive

---

## Final Build Verification

After all four docs are complete, verify:

1. **Calculation accuracy:** Enter the same inputs in both the existing tool and the cold-traffic tool. The numbers must match exactly.
2. **Conditional rendering:** Test all combinations of engagement signals and deliverability health. Sections that show/hide in the existing tool must show/hide identically in the cold-traffic tool.
3. **Bucket B content:** Confirm the corrected protocol is in place, NOT the old "continue normal sending" text.
4. **CTA placement:** Confirm all three DFY CTAs appear at the correct positions. Confirm all buttons link to `https://dfy.reengage.pro` and open in new tabs.
5. **Inline mentions:** Confirm all three are placed correctly and have no buttons or links.
6. **Waitlist:** Confirm it appears below the final DFY CTA with the correct copy and button style.
7. **Email gate:** Confirm results are frosted until email is submitted. Confirm ActiveCampaign API call works.
8. **Responsive:** Test at 1024px+, 900px, 640px, and 390px breakpoints.
9. **Frost transitions:** Confirm both frost reveals (form column and results) animate smoothly at 0.6s.
10. **Server:** Confirm both the existing tool and the cold-traffic tool are served by the same server.js without conflicts.
