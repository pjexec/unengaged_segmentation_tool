# Cold-Traffic Tool — Correction Prompt (Round 1)
# For Anti-Gravity

---

## CRITICAL PROCESS INSTRUCTION

**Do each fix ONE AT A TIME. After completing each fix, STOP and wait for my review before proceeding to the next fix.** Do not batch fixes. Do not move ahead without my explicit approval. I need to see each change in the browser before you touch anything else.

The order is:
1. Fix 1 (frosted form column)
2. Fix 2 (hero alignment — I will evaluate after Fix 1 changes the layout)
3. Fix 3 (results page heading)
4. Fix 4 + 5 combined (results page typography, readability, and emotional shift)

---

## Fix 1: Frosted Form Column on Initial Load

**The problem:** The form panel is currently hidden when the page loads. The visitor sees only the hero content centered on the page.

**The requirement:** The form panel must be VISIBLE but FROSTED on initial page load. Specifically:
- The form column (420px, left side) should be rendered in the DOM and visible
- Apply the `.frosted` CSS class: `filter: blur(6px); opacity: 0.5; pointer-events: none; user-select: none;`
- The visitor can see through the blur that a real diagnostic form exists (radio buttons, input fields, labels) — this is a deliberate credibility signal
- The form is NOT interactive in this state
- When "Prove It" is clicked, the `.frosted` class is removed (or `.revealed` is added), the blur and opacity transition over 0.6s, and the form becomes interactive

**What this changes about the layout:** With the form column visible on the left from the start, the hero content occupies the remaining width to the right of the form column — NOT the full page width. The hero is no longer centered on the full viewport. It sits to the right of the frosted form panel.

**STOP after this fix. I need to see the new layout before deciding on hero text alignment (Fix 2).**

---

## Fix 2: Hero Text Alignment

**DEFERRED — I will give you direction after reviewing Fix 1.**

The hero headline is currently centered. With the frosted form column now visible on the left, the layout has changed. I need to see how the centered text looks in the new layout before deciding whether to keep it centered or switch to left-aligned.

Wait for my direction on this one.

---

## Fix 3: Results Page Heading

**The problem:** "Your Customized Report and Action Steps" is a generic heading. The visitor just went through a confrontational hero, an emotional form experience, and gave up their email. This heading deflates all that energy.

**The fix:** Replace with a heading that continues the momentum and frames the results as the proof that was promised. The hero said "I can prove it." The results page delivers on that promise.

Propose 2-3 heading options that:
- Continue the emotional thread from the hero
- Frame the results as personalized (this is YOUR data, YOUR list, YOUR problem)
- Don't sound like a generic report title
- Are short (under 10 words)

Present the options to me. Do not implement until I choose one.

**STOP after presenting options.**

---

## Fix 4 + 5: Results Page Typography, Readability, and Emotional Shift

**The core problem:** The results page feels like a textbook. Dense text, small font, wide lines, no visual breathing room. Cold traffic will not read this. They just gave their email expecting something valuable and personal — what they got looks like documentation.

**The emotional shift requirement:** The page needs to transition from the heavy, dark, confrontational energy of the hero into something that feels like CLARITY ARRIVING. The visitor should feel rewarded for giving their email. The results should feel like a personalized report prepared specifically for them, not a wall of text.

This does NOT mean changing the color palette to light/white. It means using the same dark forest green palette but with a distinctly different energy:

### Typography Changes
- **Body text:** Increase to at least `1.05rem`, weight 300 (light), line-height 1.7 or even 1.8. The text should feel spacious and easy to read, not cramped.
- **Section headings:** `1.4rem` or larger, weight 600, with significant whitespace above (at least `3rem` margin-top) so each section feels like a new moment, not a continuation of a wall.
- **Content max-width:** Enforce `max-width: 42rem` (approximately 672px) on the text content column. This keeps line lengths readable (65-75 characters per line). The current layout lets text run too wide.
- **Paragraph spacing:** `margin-bottom: 1.25rem` between paragraphs minimum.

### Visual Breathing Room
- **Section spacing:** Each major section (Snapshot, Bucket A, Bucket B, Bucket C, etc.) needs a clear visual break — either a subtle border-top with generous padding, or significant whitespace (4rem+).
- **The bucket cards, rule boxes, and data visualizations** should have more padding and margin around them. They should feel like standalone visual moments, not squeezed between text paragraphs.
- **The Venn diagrams and circle visualizations** should be larger and more prominent. These are the most scannable elements on the page. Make them breathe.

### Emotional Shift Techniques
- **More teal/emerald accents.** Use `--accent-bright` (#10b981) more liberally on section headings, data labels, key numbers, and visual elements. The hero was dark and heavy. The results should feel lit up with color.
- **Key numbers should POP.** Subscriber counts, percentages, observation windows, daily caps — these personalized numbers are why they gave their email. Make them large, bright, and impossible to miss. The rule-box values should be even more prominent than they currently are.
- **The DFY CTA blocks** should feel like natural pauses, not interruptions. Generous whitespace above and below. The background treatment should distinguish them from educational content without making them look like banner ads.

### What NOT to Change
- Do not change ANY copy in the DFY CTA blocks, inline sprint mentions, or waitlist block. That copy is locked.
- Do not change the calculation engine or conditional rendering logic.
- Do not change the section ORDER of the results page.
- Do not add light/white background sections. Stay in the dark palette.

### Reference
Reread `anti-gravity-doc0-design-system.md` for the full design system specification. Many of these issues exist because the initial build did not fully follow Doc 0's type scale, spacing system, and component patterns.

**STOP after implementing. I need to review the full results page before we proceed.**

---

## Summary of Process

1. Implement Fix 1 → STOP → I review
2. I give direction on Fix 2 → you implement (or skip) → STOP → I review
3. You propose Fix 3 heading options → STOP → I choose → you implement → STOP → I review
4. Implement Fix 4+5 → STOP → I review

Do not skip steps. Do not batch. Each stop is a checkpoint.
