# Product Requirements Document (PRD)

## Product Name
**Phantom Engagement Re‑Engagement Tool**

---

## 1. Purpose & Problem Statement

Modern email privacy changes have fundamentally altered how engagement signals behave. Opens can no longer be reliably interpreted as human attention, which introduces a large gray area between traditionally defined “engaged” and “unengaged” subscribers.

The purpose of this tool is to help email senders:
- Safely classify subscribers in today’s environment
- Avoid damaging relationships with silent but engaged readers ("Phantom Engaged")
- Execute re‑engagement in a conservative, reputation‑safe manner
- Stop infinite re‑engagement loops that quietly harm deliverability

This tool prioritizes **human judgment encoded into process**, not automation for its own sake.

---

## 2. Core Design Principles (Non‑Negotiable)

1. **No reliance on opens as proof of engagement**
2. **No guessing internal list health beyond user‑reported inputs**
3. **Risk is controlled through exposure limits, not optimism**
4. **Re‑engagement is finite, not cyclical**
5. **Human intent outweighs all inferred signals**
6. **The tool must remain safe even if the user misunderstands their own data**

---

## 3. High‑Level Tool Flow

1. User answers a short set of structured questions (left side)
2. Tool generates a deterministic, conservative re‑engagement framework (right side)
3. Framework explains *why* rules exist before instructing *what* to do
4. Execution guidance emphasizes pacing, suppression, and stopping conditions

---

## 4. Left‑Side Inputs (Locked)

The tool collects **six inputs only**. These inputs are intentionally approximate and do not require precision.

### 4.1 Sending Frequency
Options:
- Daily
- Weekly
- Monthly or less
- Irregular / inconsistent

Used to:
- Set classification timeframes
- Adjust expectations for silence vs disengagement

---

### 4.2 Total Email List Size
Numeric estimate.

Used to:
- Contextualize scale
- Adjust caution language
- Frame risk exposure (not math precision)

---

### 4.3 Estimated Unengaged Subscriber Count
Numeric estimate.

Used to:
- Define Bucket C population
- Calculate rolling re‑engagement waves

---

### 4.4 Engagement Signals Available
Checkboxes:
- Opens
- Clicks
- Replies
- Purchases / conversions

Important rule:
- Selection indicates **access to data**, not correct usage or reliability

Used to:
- Adjust emphasis and wording
- Never used to remove guardrails

---

### 4.5 Deliverability Health (Self‑Reported)
Options:
- Healthy and stable
- Mostly fine, some inconsistencies
- Recently declined
- Unsure

Used to:
- Adjust conservatism
- Trigger repair‑first guidance when needed

---

### 4.6 Recent Re‑Engagement Attempts
Options:
- Yes, within the last 30 days
- Yes, within the last 90 days
- Yes, longer ago
- No

Used to:
- Prevent compounding damage
- Adjust pacing and messaging tone

---

## 5. Conceptual Model (Right Side)

### 5.1 Bucket Definitions

The tool introduces three conceptual buckets:

- **Bucket A: Confirmed Engaged**  
  Subscribers showing clear human intent (clicks, replies, purchases).

- **Bucket B: Phantom Engaged**  
  Subscribers who appear active due to opens but may or may not be paying attention.

- **Bucket C: Unengaged**  
  Subscribers showing no reliable human signals.

Important note:
- Buckets are not cleanly separable in modern environments.

---

### 5.2 Visual Explanation

A Venn diagram is shown at bucket introduction to illustrate:
- Historical clean separation
- Modern overlap driven by privacy behavior
- The existence and risk of Phantom Engagement

The overlap is intentionally emphasized.

---

## 6. Classification Rules

### 6.1 Bucket B Classification (Phantom Engaged)

Subscribers are classified as Bucket B based on **opens without other human intent**, adjusted by sending frequency:

- Daily sending: classify after **45 days**
- Weekly sending: classify after **60 days**
- Monthly or sporadic sending: classify after **90 days**

Rule:
- The more often you send, the sooner silence becomes meaningful.

---

## 7. Re‑Engagement Framework (Bucket C)

### 7.1 Rolling Exposure Rule (Locked)

Re‑engagement is handled in **controlled waves**.

At any given time:
- No more than **5% of the estimated unengaged segment** may be in re‑engagement
- This is a **concurrent exposure cap**, not a per‑campaign allowance

This assumes:
- The user’s current sending pattern is being accepted by mailbox providers
- Opens do not provide protection

---

### 7.2 Execution Rules

- Always start with the **warmest portion** of Bucket C
- Re‑engagement emails are sent **alongside normal campaigns**
- Each subscriber receives **exactly two re‑engagement emails**

---

### 7.3 Exit Rules (Non‑Negotiable)

After two re‑engagement attempts:

- Subscribers showing human intent exit re‑engagement
- Subscribers showing no intent are **suppressed permanently**

They must not be re‑engaged again.

---

## 8. Repair‑First Logic

If the user reports:
- Recent aggressive re‑engagement
- Declining deliverability

The tool prioritizes:
- Pausing
- Reducing exposure
- Stabilizing reputation before any re‑engagement

Repair overrides optimism.

---

## 9. Tone & Positioning Rules

- No AI‑generated tone
- No hype or urgency language
- Conservative, judgment‑driven phrasing
- Confidence without promises

The framework is explicitly positioned as **human‑generated** and experience‑driven.

---

## 10. Explicit Non‑Goals

This tool does not:
- Predict deliverability outcomes
- Optimize copy
- Replace ESP configuration
- Infer engagement accuracy
- Automate decisions without human oversight

---

## 11. Success Criteria

The tool is successful if users:
- Stop unsafe re‑engagement loops
- Reduce accidental damage to silent readers
- Execute re‑engagement in finite, controlled phases
- Understand *why* they are being conservative

---

## 12. Future Extensions (Out of Scope for v1)

- Visual scenario comparisons
- Advanced signal weighting
- Automated pacing enforcement
- Multi‑persona re‑engagement tracks

---

**End of PRD**

