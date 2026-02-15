# Cold-Traffic Tool — Design System Reference (Doc 0)
# Referenced by all Anti-Gravity build prompts (Docs 1-4)

---

## Overview

This document defines the design system for the cold-traffic version of the Re-Engagement Planner tool. It is a NEW page with its own visual identity, distinct from both the existing tool (plannertool.phantomengaged.com) and the DFY sales page (dfy.reengage.pro). However, it shares a color family with the DFY page to create a smooth visual bridge when visitors click through.

**This document is the single source of truth for all visual decisions. If a build prompt contradicts this document, this document wins.**

---

## 1. Color Palette

### Base Colors
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0f2321` | Main page background (dark forest green, matches DFY page) |
| `--bg-secondary` | `#0a1817` | Alternate/darker sections, form panel background |
| `--bg-surface` | `#162d2a` | Cards, rule boxes, CTA callout backgrounds |
| `--border-subtle` | `rgba(255, 255, 255, 0.05)` | Section dividers, form field borders at rest |
| `--border-medium` | `rgba(255, 255, 255, 0.10)` | Card borders, active section dividers |

### Accent Colors
| Token | Hex | Usage |
|---|---|---|
| `--accent-primary` | `#007a6a` | Primary teal. Buttons, links, icon color, active states |
| `--accent-bright` | `#10b981` | Emerald green. Gradient endpoints, success states, highlights |
| `--accent-glow` | `rgba(0, 122, 106, 0.35)` | Button shadows, subtle glows on hover |

### Text Colors
| Token | Hex | Usage |
|---|---|---|
| `--text-heading` | `#ffffff` | All headings, names, strong emphasis |
| `--text-body` | `#94a3b8` | Body paragraphs, descriptions (slate-400 equivalent) |
| `--text-muted` | `#64748b` | Helper text, fine print, captions (slate-500 equivalent) |
| `--text-accent` | `#007a6a` | Labels, eyebrow text, icon-paired text |

### Data Visualization Colors (Results Page)
| Token | Hex | Usage |
|---|---|---|
| `--bucket-a` | `#3ecf8e` | Confirmed Engaged. Green. |
| `--bucket-b` | `#6b7280` | Phantom Engaged. Gray with blue glow. |
| `--bucket-b-glow` | `rgba(93, 156, 236, 0.35)` | Phantom circle ambient glow |
| `--bucket-c` | `#374151` | Unengaged. Dark gray. |
| `--alert-bg` | `#3b2a2a` | Warning/alert backgrounds |
| `--alert-border` | `#cc4444` | Alert left borders |
| `--alert-text` | `#ffcccc` | Alert text |

---

## 2. Typography

### Font
**Space Grotesk** (weights: 300, 400, 500, 600, 700)

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

This is the same font as the DFY page but used differently.

### Key Difference from DFY Page
The DFY page uses `uppercase tracking-tighter font-bold` on all headings. **This page does NOT.** Headings on this page use sentence case and normal/medium weight. The DFY page is a sales page with short punchy lines. This page makes an accusation, teaches a concept, and runs a diagnostic. The content needs to breathe.

### Type Scale
| Element | Size | Weight | Case | Color | Notes |
|---|---|---|---|---|---|
| Hero headline | `2.5rem` / `md:3.5rem` | 600 | Sentence case | `--text-heading` | Must be readable at length, not shouty |
| Hero attribution | `0.9rem` | 400 | Sentence case | `--text-muted` | Visually dimmer/smaller than headline |
| Hero subhead | `1.25rem` / `md:1.5rem` | 300 | Sentence case | `--text-body` | Light weight, ominous feel |
| Hero credibility line | `1rem` | 500 | Sentence case | `--text-body` | Medium weight for quiet authority |
| Section headings (results) | `1.25rem` | 600 | Sentence case | `--text-heading` | Clear but not aggressive |
| Body text | `1rem` | 300 | Sentence case | `--text-body` | Light weight, relaxed leading |
| Helper text (form) | `0.8rem` | 400 | Sentence case | `--text-muted` | Must be readable on dark bg |
| Form labels | `0.95rem` | 600 | Sentence case | `--text-heading` | Clear field identification |
| CTA button text | `0.875rem` | 600 | Uppercase | `#ffffff` | Buttons ARE uppercase, with tracking |
| Eyebrow labels | `0.75rem` | 600 | Uppercase | `--accent-primary` | Only eyebrows and buttons are uppercase |
| Rule box values | `2rem` | 700 | As needed | `--text-heading` | Big numbers that catch the eye |
| Rule box labels | `0.85rem` | 400 | Uppercase | `--text-muted` | Small caps for data labels |

### Line Heights
| Context | Line Height |
|---|---|
| Headings | `1.2` |
| Body text | `1.7` |
| Helper/muted text | `1.5` |
| Hero headline | `1.1` |

---

## 3. Spacing System

### Section Padding
| Section Type | Padding |
|---|---|
| Standard section | `py-20` / `md:py-24` |
| Hero section | `pt-32 pb-20` (accounts for fixed nav) |
| Close/final section | `pt-16 pb-24` |

### Content Width
| Context | Max Width |
|---|---|
| Hero content | `max-w-3xl` |
| Body content sections | `max-w-3xl` |
| Card grids | `max-w-5xl` |
| Form panel | `420px` fixed width on desktop |

### Component Spacing
| Between | Gap |
|---|---|
| Sections | `border-t` with `--border-subtle` |
| Paragraphs within a section | `1.5rem` (space-y-6) |
| Form fields | `2rem` |
| Cards in a grid | `1.5rem` |
| CTA block from preceding content | `2.5rem` |

---

## 4. Component Patterns

### Primary CTA Button (DFY links)
```css
.cta-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    height: 3.5rem;
    padding: 0 3rem;
    background-color: var(--accent-primary);
    color: #ffffff;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px var(--accent-glow);
}

.cta-primary:hover {
    background-color: rgba(0, 122, 106, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 10px 40px -10px rgba(0, 122, 106, 0.5);
}
```

### Secondary CTA Button (Waitlist)
Same structure as primary but visually lighter:
```css
.cta-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    height: 3rem;
    padding: 0 2rem;
    background-color: transparent;
    color: var(--accent-primary);
    border: 1px solid var(--accent-primary);
    border-radius: 0.25rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-secondary:hover {
    background-color: rgba(0, 122, 106, 0.1);
    transform: translateY(-1px);
}
```

### "Prove It" Hero Button
Larger, more aggressive treatment:
```css
.cta-hero {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    padding: 0 3.5rem;
    background-color: var(--accent-primary);
    color: #ffffff;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px var(--accent-glow);
}
```

### Form Fields on Dark Background
```css
.form-field {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-medium);
    border-radius: 0.375rem;
    color: #ffffff;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1rem;
    transition: border-color 0.2s, outline 0.2s;
}

.form-field:focus {
    outline: 2px solid var(--accent-primary);
    border-color: transparent;
}

.form-field::placeholder {
    color: #4a5568;
}
```

### Rule Box (Results Page)
```css
.rule-box {
    background-color: var(--bg-surface);
    padding: 1.75rem;
    border-left: 4px solid var(--accent-primary);
    border-radius: 0.25rem;
    margin-bottom: 1.5rem;
}
```

### Alert Box (Results Page)
```css
.alert-box {
    background-color: var(--alert-bg);
    color: var(--alert-text);
    padding: 1.25rem 1.5rem;
    border-radius: 0.375rem;
    border-left: 4px solid var(--alert-border);
    font-size: 1rem;
}
```

### DFY CTA Block (Inline in Results)
These are not just buttons. They are short copy blocks with a button. They need their own visual container that feels like a natural pause in the educational content without looking like an ad.

```css
.dfy-cta-block {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-medium);
    border-radius: 0.5rem;
    padding: 2rem;
    margin: 2.5rem 0;
    text-align: center;
}

.dfy-cta-block p {
    font-size: 1rem;
    font-weight: 300;
    color: var(--text-body);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
```

### Waitlist Block (Bottom of Results)
```css
.waitlist-block {
    border-top: 1px solid var(--border-subtle);
    padding-top: 2rem;
    margin-top: 3rem;
    text-align: center;
}

.waitlist-block p {
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
}
```

---

## 5. Frosted Glass Effect

Used in two places: the frosted form column on initial load, and the frosted results behind the email gate.

```css
.frosted {
    filter: blur(6px);
    opacity: 0.5;
    pointer-events: none;
    user-select: none;
    transition: filter 0.6s ease, opacity 0.6s ease;
}

.frosted.revealed {
    filter: blur(0);
    opacity: 1;
    pointer-events: auto;
    user-select: auto;
}
```

---

## 6. Responsive Breakpoints

Single responsive build. No separate mobile files.

| Breakpoint | Target |
|---|---|
| Default | Desktop (1024px+) |
| `max-width: 900px` | Tablet. Form panel goes full-width above content. |
| `max-width: 640px` | Mobile. Reduced padding, smaller type scale, stacked layouts. |
| `max-width: 390px` | Small phones. Further size reductions. |

### Key Responsive Behaviors
- **Hero:** Full-width on all screens. Frosted form column hidden on mobile (form reveals below hero instead).
- **Tool (split layout):** Side-by-side on desktop, stacked on tablet/mobile (form on top, results below).
- **Email gate:** Centered overlay on all screens. Fields stack vertically.
- **Results:** Single column on all screens. Card grids collapse to single column on mobile.
- **CTA blocks:** Full-width on mobile with appropriate padding.

---

## 7. Icon System

Google Material Symbols Outlined (same as DFY page):

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
```

Usage: `<span class="material-symbols-outlined" style="font-size: 1.5rem; color: var(--accent-primary);">icon_name</span>`

Use sparingly. This page is not icon-heavy. Icons appear on CTA buttons and section markers only.

---

## 8. Animation

### Page Transitions
- Frost reveal (form column): `transition: filter 0.6s ease, opacity 0.6s ease`
- Frost reveal (results): same treatment
- Results content: `fadeInSlide` animation (0.6s, ease-out) as sections appear

### Hover States
- Buttons: `translateY(-2px)` + enhanced shadow
- Links: color shift to `--accent-bright`

### No Animations
- No parallax
- No scroll-triggered animations
- No loading spinners (form submission is instant, gate is the only pause)

---

## 9. What This Page Is NOT

To prevent scope creep or "improvements" that break the design intent:

1. **NOT the DFY page's design.** Do not use all-caps bold compressed headings. Do not use the DFY page's section eyebrow pattern with icon + uppercase label. The tool page has its own quieter, more readable type treatment.

2. **NOT a light-theme page.** The dark background is intentional (see Decision 24 in brainstorm doc). Do not add light sections or white backgrounds anywhere.

3. **NOT the existing tool's design.** The charcoal/slate palette (#24282a, #1e2122) of the existing tool is being replaced with the forest green family (#0f2321, #0a1817). The blue accent (#5d9cec) of the existing tool is being replaced with the teal/emerald (#007a6a, #10b981).

4. **NOT a long-scroll marketing page.** The hero section's job is to make them emotional and click "Prove It." The below-fold thought paper link is a quiet safety net, not a persuasion section.
