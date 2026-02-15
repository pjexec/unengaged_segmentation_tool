# Cold-Traffic Tool — Hero + Persuasion Layer (Doc 2)
# Anti-Gravity Build Prompt: Phase 2 of 4

---

## Prerequisites
- Read `anti-gravity-doc0-design-system.md` FIRST — all visual decisions are defined there.
- Complete Doc 1 (Source Audit + Extraction) FIRST — the engine must be extracted before you build the shell around it.

---

## What This Doc Covers

Stage 1 of the cold-traffic tool: everything the visitor sees BEFORE they interact with the form. This includes:

1. The full-width hero/persuasion section
2. The frosted form column on the left edge
3. The "Prove It" CTA button that reveals the tool
4. The below-fold thought paper link (safety net)

---

## Page Architecture — Initial Load State

When the page loads, the visitor sees:

```
┌─────────────────────────────────────────────────┐
│  FROSTED FORM COLUMN  │    HERO / PERSUASION    │
│  (left edge, ~420px)  │    (full remaining width)│
│                       │                          │
│  Form is visible but  │  Headline                │
│  frosted/blurred and  │  Attribution             │
│  non-interactive.     │  Subhead                 │
│  Communicates "real   │  Credibility line         │
│  tool exists" without │  [PROVE IT] button        │
│  creating cognitive   │                          │
│  load.                │  Static visual (deferred) │
│                       │                          │
└─────────────────────────────────────────────────┘
│          Below the fold (scrolling down):        │
│  Thought paper link — safety net for hesitaters  │
└─────────────────────────────────────────────────┘
```

### Key Behavior
- The frosted form column is visible but uses the `.frosted` class from Doc 0 — blurred, low opacity, no pointer events
- The hero section takes up the remaining width and is the primary focus
- The "Prove It" button is the ONLY interactive element above the fold (besides nav if any)
- Clicking "Prove It" triggers the frost reveal: the form column unblurs, becomes interactive, and the page transitions to the tool interaction state (covered in Doc 3)

---

## Hero Copy — All Locked, Do Not Modify

These are exact. Character for character. Do not rephrase, reorder, or "improve" any of this copy.

**Headline:**
"You're paying your ESP to destroy your sender reputation and lose your best customers. And I can prove it."

**Attribution (visually dimmer/smaller, styled like a quote attribution):**
— Chuck Mullaney, 25-year email deliverability veteran

**Subhead:**
"Gmail knows which subscribers are real. Your ESP doesn't."

**Credibility line:**
"97% of our clients had this problem. Almost none knew."

**CTA Button:**
"Prove It"

### Copy Hierarchy and Styling

| Element | Treatment |
|---|---|
| Headline | Largest text on page. `2.5rem` / `md:3.5rem`, weight 600, sentence case, white. This is a gut punch, not a shout. |
| Attribution | Small, muted. `0.9rem`, weight 400, `--text-muted` color. Styled like "— Author Name" under a quote. Quiet confidence. |
| Subhead | `1.25rem` / `md:1.5rem`, weight 300 (light), `--text-body` color. Short and ominous. |
| Credibility line | `1rem`, weight 500, `--text-body` color. Slightly more present than the subhead but not competing with the headline. |
| CTA Button | Uses `.cta-hero` from Doc 0. Uppercase, bold, large. The only uppercase text in the hero section. |

### Visual Spacing
- Headline to attribution: `1rem` gap
- Attribution to subhead: `1.5rem` gap
- Subhead to credibility line: `1rem` gap
- Credibility line to CTA button: `2rem` gap

### Static Visual (Deferred)
A static visual element is planned for the hero but the specific design is deferred to Anti-Gravity exploration during the build phase. The copy does not depend on it. If you want to prototype options:

**Constraints:**
1. Instantly recognizable to email marketers
2. Triggers "that's my account" feeling
3. Does not compete with headline copy for attention
4. Requires no labels or explanation to land
5. Works on mobile
6. Does not look like generic stock graphic
7. Static — no interaction required

**Concept direction:** Something showing the open rate / click rate gap that every email marketer sees in their dashboard (40-50% opens, 1-6% clicks). The visual triggers recognition, the copy explains it.

If you cannot confidently execute a visual that meets all 7 constraints, omit it. The copy carries the hero on its own. A bad visual is worse than no visual.

---

## Frosted Form Column

### Desktop (1024px+)
- Fixed width: `420px` on the left edge of the viewport
- Background: `--bg-secondary` (`#0a1817`)
- Contains the full 6-question form (same form as the existing tool, extracted in Doc 1)
- On initial load: `.frosted` class applied — blurred, low opacity, non-interactive
- The form's technical density (helper text, specific parameters) IS the credibility signal — the visitor can see through the frost that this is a real diagnostic instrument, not a quiz funnel
- Border right: `1px solid var(--border-subtle)`

### Tablet/Mobile (below 1024px)
- The frosted form column is NOT visible on initial load at mobile breakpoints
- The form appears below the hero section after "Prove It" is clicked
- On mobile, "Prove It" scrolls the page down to reveal the form section

### Frost Reveal Trigger
When the visitor clicks "Prove It":
1. The `.frosted` class is removed from the form column (or replaced with `.frosted.revealed`)
2. The blur and opacity transition over 0.6s (defined in Doc 0)
3. The form becomes interactive (pointer events restored)
4. On desktop: the hero content may shift or resize to accommodate the active form — or the form panel may slide/expand. Keep the transition smooth and intentional.
5. On mobile: smooth scroll to the now-visible form section below the hero

---

## Below-the-Fold Thought Paper Link

This sits below the hero section. It is NOT a persuasion section. It is a quiet safety net for the small percentage of visitors who need more context before committing to the tool.

**Copy:**
"Want to understand the problem before you diagnose it? Read the research behind this tool."

**Link text:**
"The Phantom Engaged Problem"

**Behavior:**
- Link opens the thought paper in a new tab (`target="_blank"`)
- The visitor stays on the tool page

**Styling:**
- Centered text, small. `0.95rem`, weight 400, `--text-muted` color.
- Link text uses `--accent-primary` color with underline on hover.
- Generous whitespace above and below — this should feel like breathing room, not content.
- Section background: `--bg-primary` (no alternate bg), with `border-t var(--border-subtle)` top border.
- Padding: `py-12` — smaller than standard sections because this is minimal content.

**URL for the thought paper:** This needs to be provided by Chuck. Flag it as a placeholder in the build: `href="[THOUGHT_PAPER_URL]"`

---

## HTML Structure

```html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Re-Engagement Planner — Is Your ESP Lying to You?</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
</head>
<body>
    
    <!-- ============================================ -->
    <!-- STAGE 1: HERO + PERSUASION (Doc 2)          -->
    <!-- ============================================ -->
    
    <main class="hero-wrapper">
        
        <!-- Frosted Form Column (desktop only on initial load) -->
        <aside id="form-panel" class="form-panel frosted">
            <!-- Form content extracted from existing tool (Doc 1) -->
            <!-- All 6 form fields with helper text go here -->
            <!-- "Generate My Framework" button at bottom -->
        </aside>
        
        <!-- Hero Content -->
        <section id="hero" class="hero-content">
            
            <h1 class="hero-headline">
                You're paying your ESP to destroy your sender reputation and lose your best customers. And I can prove it.
            </h1>
            
            <p class="hero-attribution">
                — Chuck Mullaney, 25-year email deliverability veteran
            </p>
            
            <p class="hero-subhead">
                Gmail knows which subscribers are real. Your ESP doesn't.
            </p>
            
            <p class="hero-credibility">
                97% of our clients had this problem. Almost none knew.
            </p>
            
            <button id="prove-it-btn" class="cta-hero">
                Prove It
            </button>
            
            <!-- Static visual placeholder (deferred) -->
            
        </section>
        
    </main>
    
    <!-- Below-fold thought paper link -->
    <section class="thought-paper-link">
        <p>Want to understand the problem before you diagnose it? Read the research behind this tool.</p>
        <a href="[THOUGHT_PAPER_URL]" target="_blank" rel="noopener noreferrer">The Phantom Engaged Problem</a>
    </section>
    
    <!-- ============================================ -->
    <!-- STAGE 2-3: TOOL + EMAIL GATE (Doc 3)        -->
    <!-- ============================================ -->
    <!-- Content from Doc 3 goes here -->
    
    <!-- ============================================ -->
    <!-- STAGE 4: RESULTS (Doc 4)                    -->
    <!-- ============================================ -->
    <!-- Content from Doc 4 goes here -->
    
    <script src="script.js"></script>
</body>
</html>
```

This is a scaffold. The actual HTML will be more detailed as you integrate the extracted engine from Doc 1 and build out Docs 3 and 4. The key structural decisions are:
- `aside.form-panel.frosted` — the form column starts frosted
- `section.hero-content` — the persuasion copy
- `section.thought-paper-link` — the below-fold safety net
- Clear comment markers separating the four stages

---

## What "Prove It" Does (JavaScript)

Add this to `cold-traffic-tool/script.js`:

```javascript
// Stage 1 -> Stage 2 transition
document.getElementById('prove-it-btn').addEventListener('click', () => {
    const formPanel = document.getElementById('form-panel');
    formPanel.classList.add('revealed');
    
    // On mobile, scroll to the form
    if (window.innerWidth < 1024) {
        formPanel.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Optional: focus the first form field after transition
    setTimeout(() => {
        const firstField = formPanel.querySelector('input, select');
        if (firstField) firstField.focus();
    }, 700); // after the 0.6s frost transition completes
});
```

---

## Deliverable from Doc 2

When this phase is complete:
1. `cold-traffic-tool/index.html` has the full hero section with all locked copy
2. `cold-traffic-tool/styles.css` has all hero-specific styles following Doc 0's design system
3. The frosted form column is in place with the existing tool's form fields (from Doc 1 extraction)
4. The "Prove It" button triggers the frost reveal
5. The below-fold thought paper link is in place with placeholder URL
6. The page is responsive (no separate mobile files)

**Proceed to Doc 3 (Tool Interaction + Email Gate) after this is complete.**
