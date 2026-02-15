/**
 * Cold-Traffic Re-Engagement Planner — script.js
 * 
 * ENGINE EXTRACTION NOTES (Doc 1 Audit):
 * ──────────────────────────────────────────────────────────────
 * This file contains the calculation engine extracted from the existing tool's script.js.
 * 
 * SOURCE: /uodated_02072026/script.js (434 lines)
 * 
 * appState object:
 *   inputs: { frequency, listSize, unengaged, signals{opens,clicks,replies,purchases}, health, attempts }
 *   hasGenerated, lastGeneratedAt, generatedPlan, errorMessage
 * 
 * Core calculations (handleGenerate):
 *   - waveSize / dailyCap = Math.round(unengaged * 0.05)   // 5% of unengaged
 *   - observationWindow: daily→45d, weekly→60d, monthly/irregular→90d
 *   - unengagedPct = (unengaged / listSize) * 100
 *   - remainingCount = listSize - unengaged
 *   - repairReasons: health='declined' OR attempts='recent-30'/'recent-90'
 *   - opensOnly flag: opens && !clicks && !replies && !purchases
 *   - signalList: human-readable Oxford-comma list of selected signals
 *   - Dynamic good-news paragraph (block3-good-news-p1) for has-signals condition
 * 
 * Conditional rendering (8 blocks):
 *   attempts-no/recent-30/recent-90/long-ago
 *   health-healthy/mostly-fine/declined/unsure
 *   block3-opens-only / block3-has-signals
 *   bucket-b-qualifier-opens / bucket-b-qualifier-signals (inline)
 *   cta2-large-list / cta2-small-list  (NOT used in cold-traffic; replaced with DFY CTAs)
 *   section-repair (show/hide)
 * 
 * populateVarSpans pattern: injects values into all elements with a CSS class.
 *   var-freq-lowercase, var-list-size, var-unengaged-count, var-unengaged-pct,
 *   var-remaining-count, var-obs-window, var-daily-cap, var-signal-list
 * 
 * CHANGES FROM EXISTING TOOL:
 *   1. "Generate" button flow: validate → calculate → render frosted results → show email gate
 *   2. Email gate modal replaces safety checklist modal
 *   3. Results reveal only after email submission
 *   4. New CTA blocks and inline sprint mentions in results (Doc 4 scope)
 *   5. "Prove It" button reveals frosted form column (Doc 2 scope)
 * 
 * ALL MATH IS IDENTICAL. Do not change any calculation.
 * ──────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════
    // STAGE 1: "PROVE IT" BUTTON — FROST REVEAL
    // ═══════════════════════════════════════════════

    const proveItBtn = document.getElementById('prove-it-btn');
    const formPanel = document.getElementById('form-panel');
    const heroSection = document.getElementById('hero');

    proveItBtn.addEventListener('click', () => {
        // Lift the frost — remove blur, restore opacity, enable interaction
        formPanel.classList.remove('frosted');
        formPanel.classList.add('revealed');

        // On mobile, scroll to the form
        if (window.innerWidth < 1024) {
            formPanel.scrollIntoView({ behavior: 'smooth' });
        }

        // Activate guided mode after frost transition completes
        setTimeout(() => {
            initGuidedMode();
        }, 700); // after the 0.6s frost transition completes
    });

    // ═══════════════════════════════════════════════
    // GUIDED FORM FOCUS MODE
    // ═══════════════════════════════════════════════

    const questionGroups = Array.from(document.querySelectorAll('#planning-form .form-group'));
    const generateBtn = document.getElementById('generate-btn');
    const generateCoaching = document.getElementById('generate-coaching');

    function isQuestionComplete(group, index) {
        switch (index) {
            case 0: // Q1: Sending Frequency (radio)
            case 4: // Q5: Deliverability Health (radio)
            case 5: // Q6: Re-Engagement Attempts (radio)
                return group.querySelector('input[type="radio"]:checked') !== null;
            case 1: // Q2: Total List Size (number)
            case 2: // Q3: Unengaged Size (number)
                const numInput = group.querySelector('input[type="number"]');
                return numInput && numInput.value.trim() !== '';
            case 3: // Q4: Engagement Signals (checkbox)
                return group.querySelector('input[type="checkbox"]:checked') !== null;
            default:
                return false;
        }
    }

    let lastScrolledTo = -1;   // track which question we last scrolled to
    let scrollTimer = null;    // track pending scroll timeout

    function updateGuidedFocus(shouldScroll = true) {
        if (!formPanel.classList.contains('guided-mode')) return;

        let earliestIncomplete = -1;

        questionGroups.forEach((group, i) => {
            const complete = isQuestionComplete(group, i);
            group.classList.remove('active');

            if (complete) {
                group.classList.add('completed');
            } else {
                group.classList.remove('completed');
                if (earliestIncomplete === -1) {
                    earliestIncomplete = i;
                }
            }
        });

        if (earliestIncomplete !== -1) {
            // Activate the earliest incomplete question
            const activeGroup = questionGroups[earliestIncomplete];
            activeGroup.classList.add('active');

            // Keep generate button dimmed
            generateBtn.classList.add('dimmed');
            generateBtn.classList.remove('ready');
            generateCoaching.classList.remove('visible');

            // Only scroll if the active question changed
            if (shouldScroll && earliestIncomplete !== lastScrolledTo) {
                lastScrolledTo = earliestIncomplete;
                // Cancel any pending scroll
                clearTimeout(scrollTimer);
                // Wait for CSS transitions to settle before scrolling
                scrollTimer = setTimeout(() => {
                    const scrollTarget = activeGroup.offsetTop - (formPanel.clientHeight * 0.35);
                    formPanel.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
                }, 420);
            }
        } else {
            // All questions complete — activate generate button
            generateBtn.classList.remove('dimmed');
            generateBtn.classList.add('ready');
            generateCoaching.classList.add('visible');

            if (shouldScroll && lastScrolledTo !== -2) {
                lastScrolledTo = -2; // sentinel for "scrolled to generate"
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    const scrollTarget = generateBtn.offsetTop - (formPanel.clientHeight * 0.2);
                    formPanel.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
                }, 420);
            }
        }
    }

    function initGuidedMode() {
        formPanel.classList.add('guided-mode');
        generateBtn.classList.add('dimmed');

        // Check if any questions are already filled (shouldn't be, but handle it)
        updateGuidedFocus();
    }

    // Listen for all form interactions to update guided focus
    let numberDebounceTimer = null;

    // Q4 (index 3) is the checkbox group — needs special handling so users
    // can check multiple boxes before the guided mode advances to Q5.
    const q4Group = questionGroups[3];

    questionGroups.forEach((group, idx) => {
        // Radio changes — instant advance
        group.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                updateGuidedFocus();
            });
        });

        // Checkbox changes — Q4 gets deferred advance, others instant
        group.querySelectorAll('input[type="checkbox"]').forEach(input => {
            if (idx === 3) {
                // Q4 only: update classes (completion state) but do NOT scroll
                input.addEventListener('change', () => {
                    updateGuidedFocus(false); // update visual state, no scroll
                });
            } else {
                input.addEventListener('change', () => {
                    updateGuidedFocus();
                });
            }
        });

        // Number input changes — debounced (wait until user stops typing)
        group.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(numberDebounceTimer);
                numberDebounceTimer = setTimeout(() => {
                    updateGuidedFocus();
                }, 800);
            });

            // When leaving the field, update state but don't re-scroll
            // (the debounced input handler or the next interaction will handle scrolling)
            input.addEventListener('blur', () => {
                clearTimeout(numberDebounceTimer);
                updateGuidedFocus(false); // update classes only, no scroll
            });

            // Prevent browser's native scroll-into-view when clicking into a field
            input.addEventListener('focus', () => {
                // Brief delay to override browser's automatic scroll
                setTimeout(() => {
                    // Don't fight an ongoing guided scroll — only suppress the browser's
                }, 0);
            });
        });
    });

    // Q4 special behavior: advance to Q5 only when mouse leaves the checkbox area
    if (q4Group) {
        q4Group.addEventListener('mouseleave', () => {
            // Only advance if Q4 actually has at least one checkbox checked
            if (isQuestionComplete(q4Group, 3)) {
                updateGuidedFocus(true); // now scroll to the next question
            }
        });
    }


    // ═══════════════════════════════════════════════
    // STAGE 2: FORM ENGINE (Extracted from existing tool)
    // ═══════════════════════════════════════════════

    // DOM Elements — Form
    const form = document.getElementById('planning-form');
    // generateBtn already declared in guided mode section above

    // DOM Elements — Results
    const resultsSection = document.getElementById('results-section');

    // Dynamic text elements
    const bucketBWindow = document.getElementById('bucket-b-window');
    const bucketBDaysRepeat = document.getElementById('bucket-b-days-repeat');
    const reengageVol = document.getElementById('reengage-vol');
    const repairSection = document.getElementById('section-repair');
    const repairReasonSpan = document.getElementById('repair-reason');

    // Bucket B qualifier spans
    const bucketBQualOpens = document.getElementById('bucket-b-qualifier-opens');
    const bucketBQualSignals = document.getElementById('bucket-b-qualifier-signals');

    // --- SINGLE SOURCE OF TRUTH (PARENT STATE) ---
    const appState = {
        inputs: {
            frequency: null,
            listSize: 0,
            unengaged: 0,
            signals: { opens: false, clicks: false, replies: false, purchases: false },
            health: null,
            attempts: null
        },
        hasGenerated: false,
        lastGeneratedAt: null,
        generatedPlan: null,
        errorMessage: null,
        emailGatePassed: false
    };

    // Helper: Normalize Numeric Input
    function parseNumber(value) {
        if (!value) return 0;
        const cleaned = value.toString().replace(/[, ]/g, '');
        const parsed = parseInt(cleaned, 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    // Helper: Populate all spans with a given CSS class
    function populateVarSpans(className, value) {
        document.querySelectorAll('.' + className).forEach(el => {
            el.textContent = value;
        });
    }

    // Helper: Show one conditional block, hide its siblings
    function activateConditional(activeId, allIds) {
        allIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });
        const active = document.getElementById(activeId);
        if (active) active.classList.add('active');
    }

    // --- CONTROLLED INPUT HANDLERS ---
    form.addEventListener('input', (e) => {
        const target = e.target;
        const name = target.name;

        if (name === 'frequency') {
            appState.inputs.frequency = target.value;
        } else if (name === 'list-size') {
            appState.inputs.listSize = parseNumber(target.value);
        } else if (name === 'unengaged-size') {
            appState.inputs.unengaged = parseNumber(target.value);
        } else if (name === 'health') {
            appState.inputs.health = target.value;
        } else if (name === 'attempts') {
            appState.inputs.attempts = target.value;
        } else if (name === 'signals') {
            const signals = { opens: false, clicks: false, replies: false, purchases: false };
            const checkedBoxes = form.querySelectorAll('input[name="signals"]:checked');
            checkedBoxes.forEach(box => {
                if (signals.hasOwnProperty(box.value)) {
                    signals[box.value] = true;
                }
            });
            appState.inputs.signals = signals;
        }
    });

    // Handle initial state sync (in case browser retains values)
    function syncInitialState() {
        const formData = new FormData(form);
        appState.inputs.frequency = formData.get('frequency') || null;
        appState.inputs.listSize = parseNumber(formData.get('list-size'));
        appState.inputs.unengaged = parseNumber(formData.get('unengaged-size'));
        appState.inputs.health = formData.get('health') || null;
        appState.inputs.attempts = formData.get('attempts') || null;
    }
    syncInitialState();


    // --- VALIDATION ---
    function validateInputs() {
        const missing = [];

        // Check radio groups
        if (!appState.inputs.frequency) {
            const grp = form.querySelector('input[name="frequency"]');
            if (grp) missing.push(grp.closest('.form-group'));
        }

        // Check numeric inputs
        if (!appState.inputs.listSize || appState.inputs.listSize <= 0) {
            const el = document.getElementById('list-size');
            if (el) missing.push(el.closest('.form-group'));
        }
        if (appState.inputs.unengaged < 0 || (appState.inputs.unengaged > appState.inputs.listSize && appState.inputs.listSize > 0)) {
            const el = document.getElementById('unengaged-size');
            if (el) missing.push(el.closest('.form-group'));
        }

        // Check signals (at least one)
        const anySignal = Object.values(appState.inputs.signals).some(v => v);
        if (!anySignal) {
            const grp = form.querySelector('input[name="signals"]');
            if (grp) missing.push(grp.closest('.form-group'));
        }

        // Check deliverability health
        if (!appState.inputs.health) {
            const grp = form.querySelector('input[name="health"]');
            if (grp) missing.push(grp.closest('.form-group'));
        }

        // Check re-engagement attempts
        if (!appState.inputs.attempts) {
            const grp = form.querySelector('input[name="attempts"]');
            if (grp) missing.push(grp.closest('.form-group'));
        }

        return missing;
    }


    // --- GENERATION LOGIC ---
    function handleGenerate() {
        // Clear previous error outlines
        form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

        // Validate and highlight
        const missingFields = validateInputs();
        if (missingFields.length > 0) {
            missingFields.forEach(el => el.classList.add('field-error'));
            missingFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Mark as generated
        appState.errorMessage = null;
        appState.hasGenerated = true;
        appState.lastGeneratedAt = new Date().toLocaleTimeString();

        const listSize = appState.inputs.listSize;
        const unengaged = appState.inputs.unengaged;

        // ── Core Calculations (IDENTICAL to existing tool) ──
        const waveSize = Math.max(0, Math.round(unengaged * 0.05));

        let bucketBDays = 90;
        let bucketBFreqText = "Monthly or Sporadic sending: classify after 90 days.";
        if (appState.inputs.frequency === 'daily') {
            bucketBDays = 45;
            bucketBFreqText = "Daily sending: classify after 45 days.";
        } else if (appState.inputs.frequency === 'weekly') {
            bucketBDays = 60;
            bucketBFreqText = "Weekly sending: classify after 60 days.";
        }

        let repairReasons = [];
        if (appState.inputs.health === 'declined') {
            repairReasons.push("declining deliverability health");
        }
        if (appState.inputs.attempts === 'recent-30' || appState.inputs.attempts === 'recent-90') {
            repairReasons.push("recent re-engagement activity");
        }

        // Computed variables
        const unengagedPct = listSize > 0
            ? ((unengaged / listSize) * 100).toFixed(1)
            : '0.0';
        const remainingCount = listSize - unengaged;
        const dailyCap = waveSize;
        const observationWindow = bucketBDays;

        // Signal flags
        const hasClickSignals = appState.inputs.signals.clicks;
        const hasReplySignals = appState.inputs.signals.replies;
        const hasPurchaseSignals = appState.inputs.signals.purchases;
        const opensOnly = appState.inputs.signals.opens
            && !hasClickSignals && !hasReplySignals && !hasPurchaseSignals;

        // Human-readable signal list
        const signalNames = [];
        if (appState.inputs.signals.opens) signalNames.push('opens');
        if (hasClickSignals) signalNames.push('clicks');
        if (hasReplySignals) signalNames.push('replies');
        if (hasPurchaseSignals) signalNames.push('purchase data');
        let signalList = '';
        if (signalNames.length === 1) {
            signalList = signalNames[0];
        } else if (signalNames.length === 2) {
            signalList = signalNames.join(' and ');
        } else if (signalNames.length > 2) {
            signalList = signalNames.slice(0, -1).join(', ') + ', and ' + signalNames[signalNames.length - 1];
        }

        // Frequency lowercase
        const freqMap = {
            daily: 'daily',
            weekly: 'weekly',
            monthly: 'monthly or less frequently',
            irregular: 'on an irregular schedule'
        };
        const frequencyLowercase = freqMap[appState.inputs.frequency] || appState.inputs.frequency;

        // Conditional ID mappings
        const attemptsMap = {
            'no': 'attempts-no',
            'recent-30': 'attempts-recent-30',
            'recent-90': 'attempts-recent-90',
            'long-ago': 'attempts-long-ago'
        };
        const healthMap = {
            'healthy': 'health-healthy',
            'mostly-fine': 'health-mostly-fine',
            'declined': 'health-declined',
            'unsure': 'health-unsure'
        };

        appState.generatedPlan = {
            waveSize,
            bucketBDays,
            bucketBFreqText,
            repairReasons,
            unengagedPct,
            remainingCount,
            dailyCap,
            observationWindow,
            opensOnly,
            signalList,
            frequencyLowercase,
            attemptsConditionalId: attemptsMap[appState.inputs.attempts] || 'attempts-no',
            healthConditionalId: healthMap[appState.inputs.health] || 'health-healthy'
        };

        // Render results into the DOM
        renderResults();

        // ── NEW COLD-TRAFFIC FLOW ──
        // Results are rendered but frosted. Show email gate.
        resultsSection.style.display = 'block';

        if (!appState.emailGatePassed) {
            resultsSection.classList.add('frosted');
            showEmailGate();
        } else {
            // User already passed gate (re-generating), reveal immediately
            resultsSection.classList.remove('frosted');
            resultsSection.classList.add('revealed');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Scroll form panel to top
        formPanel.scrollTop = 0;
    }


    // --- RENDER PIPELINE ---
    function renderResults() {
        const plan = appState.generatedPlan;
        const listSize = appState.inputs.listSize;
        const unengaged = appState.inputs.unengaged;

        // Populate all variable spans
        populateVarSpans('var-freq-lowercase', plan.frequencyLowercase);
        populateVarSpans('var-list-size', listSize.toLocaleString());
        populateVarSpans('var-unengaged-count', unengaged.toLocaleString());
        populateVarSpans('var-unengaged-pct', plan.unengagedPct);
        populateVarSpans('var-remaining-count', plan.remainingCount.toLocaleString());
        populateVarSpans('var-obs-window', plan.observationWindow);
        populateVarSpans('var-daily-cap', plan.dailyCap.toLocaleString());
        populateVarSpans('var-signal-list', plan.signalList);

        // Conditional: recent_attempts
        const allAttemptIds = ['attempts-no', 'attempts-recent-30', 'attempts-recent-90', 'attempts-long-ago'];
        activateConditional(plan.attemptsConditionalId, allAttemptIds);

        // Conditional: health
        const allHealthIds = ['health-healthy', 'health-mostly-fine', 'health-declined', 'health-unsure'];
        activateConditional(plan.healthConditionalId, allHealthIds);

        // Conditional: opens_only
        if (plan.opensOnly) {
            activateConditional('block3-opens-only', ['block3-opens-only', 'block3-has-signals']);
        } else {
            activateConditional('block3-has-signals', ['block3-opens-only', 'block3-has-signals']);
        }

        // Bucket B qualifier (inline conditional)
        if (bucketBQualOpens && bucketBQualSignals) {
            if (plan.opensOnly) {
                bucketBQualOpens.style.display = 'inline';
                bucketBQualSignals.style.display = 'none';
            } else {
                bucketBQualOpens.style.display = 'none';
                bucketBQualSignals.style.display = 'inline';
            }
        }

        // Bucket B renders
        if (bucketBWindow) bucketBWindow.textContent = `${plan.bucketBDays} Days`;
        if (bucketBDaysRepeat) bucketBDaysRepeat.textContent = plan.bucketBDays;

        // Dynamic good-news paragraph (Block 3)
        const goodNewsP1 = document.getElementById('block3-good-news-p1');
        if (goodNewsP1 && !plan.opensOnly) {
            const verifiableSignals = [];
            if (appState.inputs.signals.clicks) verifiableSignals.push('clicks');
            if (appState.inputs.signals.replies) verifiableSignals.push('replies');
            if (appState.inputs.signals.purchases) verifiableSignals.push('purchases');

            let signalPhrase = '';
            if (verifiableSignals.length === 1) {
                signalPhrase = verifiableSignals[0];
            } else if (verifiableSignals.length === 2) {
                signalPhrase = verifiableSignals.join(' and ');
            } else {
                signalPhrase = verifiableSignals.slice(0, -1).join(', ') + ', and ' + verifiableSignals[verifiableSignals.length - 1];
            }

            const proofParts = [];
            if (appState.inputs.signals.clicks) proofParts.push('A click is a click.');
            if (appState.inputs.signals.replies) proofParts.push('A reply is a reply.');
            if (appState.inputs.signals.purchases) proofParts.push('A purchase is a purchase.');

            goodNewsP1.textContent = `The good news for your situation. Because you're tracking ${signalPhrase}, you have engagement signals that cannot be faked by a privacy proxy. ${proofParts.join(' ')} That's your Bucket A, confirmed engaged.`;
        }

        // Bucket C renders
        if (reengageVol) reengageVol.textContent = `${plan.waveSize.toLocaleString()} subscribers`;

        // Repair Logic
        if (repairSection && repairReasonSpan) {
            if (plan.repairReasons.length > 0) {
                repairSection.style.display = 'block';
                repairReasonSpan.textContent = plan.repairReasons.join(" and ");
            } else {
                repairSection.style.display = 'none';
            }
        }
    }


    // ═══════════════════════════════════════════════
    // STAGE 3: EMAIL GATE MODAL
    // ═══════════════════════════════════════════════

    const emailGateModal = document.getElementById('email-gate-modal');
    const emailGateForm = document.getElementById('email-gate-form');
    const gateSubmitBtn = document.getElementById('gate-submit-btn');
    const gateError = document.getElementById('gate-error');
    const gateCloseBtn = document.getElementById('gate-close-btn');

    function showEmailGate() {
        if (emailGateModal) {
            emailGateModal.classList.add('active');
            // Hide scrollbars behind the frosted overlay
            const fp = document.getElementById('form-panel');
            const hc = document.querySelector('.hero-content');
            if (fp) fp.style.overflowY = 'hidden';
            if (hc) hc.style.overflowY = 'hidden';
        }
    }

    function hideEmailGate() {
        if (emailGateModal) {
            emailGateModal.classList.remove('active');
            // Restore scrollbars
            const fp = document.getElementById('form-panel');
            const hc = document.querySelector('.hero-content');
            if (fp) fp.style.overflowY = 'auto';
            if (hc) hc.style.overflowY = 'auto';
        }
    }

    // Dismiss gate without submitting — hide results, restore hero
    function dismissGateWithoutSubmit() {
        hideEmailGate();
        // Hide the frosted results, restore the hero view
        if (resultsSection) {
            resultsSection.style.display = 'none';
            resultsSection.classList.remove('frosted');
            resultsSection.classList.remove('revealed');
        }
    }

    // Close on X
    if (gateCloseBtn) {
        gateCloseBtn.addEventListener('click', () => {
            dismissGateWithoutSubmit();
        });
    }

    // Close on overlay click
    if (emailGateModal) {
        emailGateModal.addEventListener('click', (e) => {
            if (e.target === emailGateModal) {
                dismissGateWithoutSubmit();
            }
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emailGateModal && emailGateModal.classList.contains('active')) {
            dismissGateWithoutSubmit();
        }
    });

    // Email gate form submission
    if (emailGateForm) {
        emailGateForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('gate-first-name').value.trim();
            const email = document.getElementById('gate-email').value.trim();

            if (!firstName || !email) return;

            // Disable button, show loading
            gateSubmitBtn.disabled = true;
            gateSubmitBtn.textContent = 'Processing…';
            if (gateError) gateError.style.display = 'none';

            try {
                const response = await fetch('/api/activecampaign/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, email })
                });

                if (!response.ok) throw new Error('Submission failed');

                // Success: close modal, reveal results
                appState.emailGatePassed = true;
                hideEmailGate();

                // Hide hero content and thought paper link
                const heroContent = document.querySelector('.hero-content');
                const thoughtPaper = document.querySelector('.thought-paper-link');
                if (heroContent) heroContent.style.display = 'none';
                if (thoughtPaper) thoughtPaper.style.display = 'none';

                // Show results in the same flex position (right side of form panel)
                resultsSection.style.display = 'block';
                resultsSection.classList.remove('frosted');
                resultsSection.classList.add('revealed');

                // Scroll results to top
                resultsSection.scrollTop = 0;

            } catch (err) {
                console.error('Email gate API error:', err);
                if (gateError) gateError.style.display = 'block';
                gateSubmitBtn.disabled = false;
                gateSubmitBtn.textContent = 'Show Me My Plan';
            }
        });
    }

    // TODO: Google OAuth integration
    // When implemented:
    // 1. Load Google Identity Services: <script src="https://accounts.google.com/gsi/client" async></script>
    // 2. On successful OAuth, extract given_name and email from Google profile
    // 3. Submit to /api/activecampaign/contact with { firstName: given_name, email }
    // 4. Proceed with same frost-reveal flow as manual form submission


    // ═══════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════

    generateBtn.addEventListener('click', handleGenerate);

    // If user already passed gate and re-clicks Generate, skip gate
    // (handled in handleGenerate via appState.emailGatePassed check)
});
