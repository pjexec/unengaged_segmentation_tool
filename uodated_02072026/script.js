document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Left Panel
    const form = document.getElementById('planning-form');
    const generateBtn = document.getElementById('generate-btn');

    // DOM Elements - Right Panel
    const preGenPlaceholder = document.getElementById('pre-generation-placeholder');
    const postGenContent = document.getElementById('post-generation-content');

    // Existing Dynamic Text Elements
    const bucketBWindow = document.getElementById('bucket-b-window');
    const bucketBDaysRepeat = document.getElementById('bucket-b-days-repeat');
    const reengageVol = document.getElementById('reengage-vol');
    const repairSection = document.getElementById('section-repair');
    const repairReasonSpan = document.getElementById('repair-reason');

    // Bucket B qualifier spans (compliance edit)
    const bucketBQualOpens = document.getElementById('bucket-b-qualifier-opens');
    const bucketBQualSignals = document.getElementById('bucket-b-qualifier-signals');

    // --- 1. SINGLE SOURCE OF TRUTH (PARENT STATE) ---
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
        errorMessage: null
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

    // --- 2. CONTROLLED INPUT HANDLERS (LEFT PANEL) ---
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

    // --- 3. GENERATION LOGIC ---
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

        // Success Transition
        appState.errorMessage = null;
        appState.hasGenerated = true;
        appState.lastGeneratedAt = new Date().toLocaleTimeString();

        const listSize = appState.inputs.listSize;
        const unengaged = appState.inputs.unengaged;

        // Existing computations
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

        // --- New v2 computed variables ---
        const unengagedPct = listSize > 0
            ? ((unengaged / listSize) * 100).toFixed(1)
            : '0.0';
        const remainingCount = listSize - unengaged;
        const dailyCap = waveSize; // Same as waveSize (5% of unengaged)
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
            // v2 values
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

        renderUI();

        // Scroll left panel back to top
        document.querySelector('.left-panel').scrollTop = 0;
    }

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

    // --- 4. RENDER PIPELINE (RIGHT PANEL) ---
    function renderUI() {
        // Right Panel State Switch
        if (!appState.hasGenerated) {
            preGenPlaceholder.style.display = 'flex';
            postGenContent.style.display = 'none';
        } else {
            preGenPlaceholder.style.display = 'none';
            postGenContent.style.display = 'block';

            // Re-trigger animation
            postGenContent.classList.remove('post-generation-active');
            void postGenContent.offsetWidth;
            postGenContent.classList.add('post-generation-active');

            const plan = appState.generatedPlan;
            const listSize = appState.inputs.listSize;
            const unengaged = appState.inputs.unengaged;

            // --- Populate all variable spans ---
            populateVarSpans('var-freq-lowercase', plan.frequencyLowercase);
            populateVarSpans('var-list-size', listSize.toLocaleString());
            populateVarSpans('var-unengaged-count', unengaged.toLocaleString());
            populateVarSpans('var-unengaged-pct', plan.unengagedPct);
            populateVarSpans('var-remaining-count', plan.remainingCount.toLocaleString());
            populateVarSpans('var-obs-window', plan.observationWindow);
            populateVarSpans('var-daily-cap', plan.dailyCap.toLocaleString());
            populateVarSpans('var-signal-list', plan.signalList);

            // --- Block 1 conditionals: recent_attempts ---
            const allAttemptIds = ['attempts-no', 'attempts-recent-30', 'attempts-recent-90', 'attempts-long-ago'];
            activateConditional(plan.attemptsConditionalId, allAttemptIds);

            // --- Block 1 conditionals: health ---
            const allHealthIds = ['health-healthy', 'health-mostly-fine', 'health-declined', 'health-unsure'];
            activateConditional(plan.healthConditionalId, allHealthIds);

            // --- Block 3 conditional: opens_only ---
            if (plan.opensOnly) {
                activateConditional('block3-opens-only', ['block3-opens-only', 'block3-has-signals']);
            } else {
                activateConditional('block3-has-signals', ['block3-opens-only', 'block3-has-signals']);
            }

            // --- Bucket B qualifier (compliance edit) ---
            if (plan.opensOnly) {
                bucketBQualOpens.style.display = 'inline';
                bucketBQualSignals.style.display = 'none';
            } else {
                bucketBQualOpens.style.display = 'none';
                bucketBQualSignals.style.display = 'inline';
            }

            // --- Existing Bucket B renders ---
            bucketBWindow.textContent = `${plan.bucketBDays} Days`;
            bucketBDaysRepeat.textContent = plan.bucketBDays;

            // --- Dynamic good-news paragraph (Change 3) ---
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

            // --- Existing Bucket C renders ---
            reengageVol.textContent = `${plan.waveSize.toLocaleString()} subscribers`;

            // --- CTA 2 conditional: unengaged > 5000 ---
            if (unengaged > 5000) {
                activateConditional('cta2-large-list', ['cta2-large-list', 'cta2-small-list']);
            } else {
                activateConditional('cta2-small-list', ['cta2-large-list', 'cta2-small-list']);
            }

            // --- Existing Repair Logic ---
            if (plan.repairReasons.length > 0) {
                repairSection.style.display = 'block';
                repairReasonSpan.textContent = plan.repairReasons.join(" and ");
            } else {
                repairSection.style.display = 'none';
            }
        }
    }

    // --- 5. INITIALIZATION ---
    generateBtn.addEventListener('click', handleGenerate);
    renderUI();

    // --- 6. SAFETY CHECKLIST MODAL ---
    const modal = document.getElementById('checklist-modal');
    const optinForm = document.getElementById('checklist-optin-form');
    const modalSubmitBtn = document.getElementById('modal-submit-btn');
    const modalSuccess = document.getElementById('modal-success');
    const modalError = document.getElementById('modal-error');

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Form submission to ActiveCampaign
    if (optinForm) {
        optinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('optin-name').value.trim();
            const email = document.getElementById('optin-email').value.trim();

            if (!firstName || !email) return;

            // Disable button and show loading state
            modalSubmitBtn.disabled = true;
            modalSubmitBtn.textContent = 'Sending…';
            modalError.style.display = 'none';

            // ActiveCampaign API via server-side proxy
            try {
                const response = await fetch('/api/activecampaign/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, email })
                });

                if (!response.ok) throw new Error('Submission failed');

                // Show success state
                optinForm.style.display = 'none';
                modalSuccess.style.display = 'block';

            } catch (err) {
                console.error('ActiveCampaign error:', err);
                modalError.style.display = 'block';
                modalSubmitBtn.disabled = false;
                modalSubmitBtn.textContent = 'Send Me the Checklist';
            }
        });
    }
});
