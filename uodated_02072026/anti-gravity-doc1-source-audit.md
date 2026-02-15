# Cold-Traffic Tool: Source Audit + Extraction (Doc 1)
# Anti-Gravity Build Prompt: Phase 1 of 4

---

## Prerequisites
Read `anti-gravity-doc0-design-system.md` in this same directory FIRST. That document defines all visual decisions for this build.

---

## Context

You are building a new version of an existing Re-Engagement Planner tool. The new version is purpose-built for cold traffic (visitors who have never heard of this product or its creator). The existing tool lives in the same parent directory and must NOT be modified.

**This prompt (Doc 1) is about understanding and extracting the existing tool's engine before you build anything. Do not start building until you have completed the audit steps below.**

---

## File Locations

**Existing tool source (READ ONLY, do not modify):**
`/Users/chuckmullaney/Documents/PainlessAI/unengaged_segmentation_tool/uodated_02072026/`

Key files:
- `index.html` (45KB): All HTML structure, pre-generation content, post-generation content, conditional sections
- `script.js` (18KB): ALL calculation logic, state management, form handling, conditional rendering
- `styles.css`: Desktop styling (being replaced, but study for component understanding)
- `server.js`: Express server, ActiveCampaign API proxy for email capture
- `mobile.html` / `mobile.css` / `mobile.js`: Separate mobile version (NOT being carried forward)
- `assets/venn_darktheme.jpeg`: Venn diagram image

**New build destination:**
`/Users/chuckmullaney/Documents/PainlessAI/unengaged_segmentation_tool/uodated_02072026/cold-traffic-tool/`

Create this directory. The new tool lives here as `index.html` with its own CSS and JS files.

---

## Phase 1: Audit the Existing Tool

Before writing any code, read and understand these files completely:

### Step 1: Read script.js
This is the engine. Map out:

1. **The `appState` object** and every property it tracks
2. **Form input handling**: how each of the 6 form fields (frequency, list size, unengaged count, engagement signals, deliverability health, recent re-engagement attempts) is captured and validated
3. **The calculation logic**: what math happens when "Generate My Framework" is clicked. Specifically:
   - How the Confirmed Engaged / Phantom Engaged / Unengaged numbers are calculated
   - How the observation window (45/60/90 days) is determined based on sending frequency
   - How the daily re-engagement volume cap is calculated
   - How conditional content blocks are shown/hidden based on input combinations
4. **Dynamic text population**: the `populateVarSpans` pattern and every CSS class used to inject calculated values into the HTML
5. **Conditional rendering**: which sections of the results appear or hide based on which engagement signals are selected, what health status is chosen, etc.
6. **The repair/alert logic**: when does the "repair first" warning appear and what triggers it
7. **Post-generation animation**: how the results transition from hidden to visible

### Step 2: Read index.html
Map the HTML structure:

1. **Pre-generation content** (right panel before form submission): what educational content is shown, in what order
2. **Post-generation content** (right panel after form submission): every section of the results page, the order they appear, which ones are conditional
3. **All element IDs and classes** that script.js references for DOM manipulation
4. **The modal/overlay** for the safety checklist opt-in (this will be replaced with the email gate, but understand how it works)
5. **The three CTA sections** at the bottom of the results (these will be replaced with new CTAs)

### Step 3: Read server.js
Understand:

1. The ActiveCampaign API integration (contact creation + list subscription)
2. The API key handling (server-side proxy pattern)
3. The endpoint path (`/api/activecampaign/contact`)

This server.js will be extended (not replaced) to serve the cold-traffic-tool directory as well.

---

## Phase 2: Create the New Directory and Scaffold

After completing the audit:

1. Create `/cold-traffic-tool/` directory inside the existing tool's folder
2. Create the following empty files:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Copy `assets/venn_darktheme.jpeg` into `cold-traffic-tool/assets/` (may need this for results page)

---

## Phase 3: Extract and Adapt the Engine

Copy the calculation engine from the existing `script.js` into the new `cold-traffic-tool/script.js`. This includes:

1. **The entire `appState` object and state management**
2. **All form input capture and validation logic**
3. **All calculation functions** (bucket sizes, observation windows, volume caps, etc.)
4. **All `populateVarSpans` calls and dynamic text injection**
5. **All conditional rendering logic** (showing/hiding content blocks based on inputs)
6. **The repair/alert trigger logic**

### What to CHANGE in the extracted engine:

1. **DOM element IDs may change**: the new HTML structure will have different section IDs. The script needs to reference the new IDs. Map old IDs to new IDs as you build.
2. **The "Generate" button behavior**: in the existing tool, clicking "Generate My Framework" immediately shows results. In the new tool, clicking "Generate" triggers the email gate FIRST (frosted results visible behind it), and results only fully reveal after email submission.
3. **The modal**: the existing tool has a safety checklist opt-in modal. The new tool replaces this with an email gate modal that appears after form submission and before results are revealed. The modal's purpose changes from "optional opt-in" to "required email capture."
4. **Post-generation flow:**
   - Old: Form submit -> results appear immediately
   - New: Form submit -> results render but are frosted/blurred -> email gate modal appears -> user submits email -> API call to ActiveCampaign -> frost lifts on results -> results visible

### What to KEEP exactly as-is:

1. **All math.** Do not change any calculation. The numbers must match the existing tool exactly for identical inputs.
2. **All conditional logic.** If the existing tool shows/hides a section based on certain inputs, the new tool does the same.
3. **The `populateVarSpans` pattern.** Keep this approach for injecting calculated values into HTML. Just update the class names if the HTML structure changes.
4. **Form validation.** Same validation rules, same error states.

---

## Phase 4: Extend server.js

The existing `server.js` needs one addition to serve the cold-traffic tool:

Add a static file route for the `/cold-traffic-tool/` directory. The ActiveCampaign API proxy endpoint stays the same (both tools use the same endpoint). The only change is that the new tool's email gate will call this endpoint with the same payload format (`firstName`, `email`).

**Do NOT create a separate server.js for the cold-traffic tool.** One server serves both.

You may need to update the `AC_LIST_ID` or add a second list ID for cold-traffic leads vs existing tool leads. Flag this as a question for Chuck if the list ID needs to differ.

---

## Deliverable from Doc 1

When this phase is complete, you should have:

1. A clear mental map of the existing tool's engine (documented in comments at the top of the new script.js)
2. The `/cold-traffic-tool/` directory created with scaffolded files
3. The calculation engine extracted and adapted in `cold-traffic-tool/script.js`
4. The server.js extended to serve both tools
5. A list of any questions or ambiguities found during the audit

**Do not proceed to Doc 2 (Hero + Persuasion Layer) until this phase is complete and the engine extraction is verified.**

---

## Critical Reminders

- Do NOT modify any file in the parent directory. The existing tool must continue to work exactly as it does now.
- Do NOT rebuild calculation logic from scratch. Extract and adapt.
- Do NOT simplify or "improve" the calculation engine. Match it exactly.
- The new tool must produce identical numerical outputs for identical inputs.
- When in doubt about a calculation or conditional behavior, refer to the existing script.js as the source of truth.
