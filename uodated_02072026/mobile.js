document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const appState = {
        inputs: {
            frequency: null,
            listSize: 0,
            unengaged: 0,
            signals: { opens: false, clicks: false, replies: false, purchases: false },
            health: null,
            attempts: null
        },
        hasGenerated: false
    };

    // --- WIZARD NAVIGATION ---
    window.goToStep = function (stepNum) {
        // Validate Step 1 before moving to Step 2
        if (stepNum === 2) {
            if (!validateStep1()) return;
        }

        document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
        document.getElementById(`step-${stepNum}`).classList.add('active');
        window.scrollTo(0, 0);
    };

    function validateStep1() {
        const freq = document.querySelector('input[name="frequency"]:checked');
        const listSize = document.getElementById('list-size').value;
        const unengaged = document.getElementById('unengaged-size').value;

        if (!freq || !listSize || !unengaged) {
            alert('Please fill in all fields to continue.');
            return false;
        }

        // Save to state
        appState.inputs.frequency = freq.value;
        appState.inputs.listSize = parseInt(listSize.replace(/,/g, '')) || 0;
        appState.inputs.unengaged = parseInt(unengaged.replace(/,/g, '')) || 0;
        return true;
    }

    // --- GENERATION LOGIC ---
    document.getElementById('mobile-generate-btn').addEventListener('click', () => {
        // Validate Step 2
        const health = document.querySelector('select[name="health"]').value;
        const attempts = document.querySelector('select[name="attempts"]').value;

        // Signals
        const signals = { opens: false, clicks: false, replies: false, purchases: false };
        document.querySelectorAll('input[name="signals"]:checked').forEach(cb => {
            if (signals.hasOwnProperty(cb.value)) signals[cb.value] = true;
        });
        const anySignal = Object.values(signals).some(v => v);

        if (!health || !attempts || !anySignal) {
            alert('Please complete all fields in this section.');
            return;
        }

        // Save State
        appState.inputs.health = health;
        appState.inputs.attempts = attempts;
        appState.inputs.signals = signals;

        // Perform Calculations
        calculateAndRender();
        goToStep(3);
    });

    function calculateAndRender() {
        const { listSize, unengaged, frequency } = appState.inputs;

        // Calculations
        const unengagedPct = listSize > 0
            ? ((unengaged / listSize) * 100).toFixed(1)
            : '0.0';

        const waveSize = Math.max(0, Math.round(unengaged * 0.05));

        let bucketBDays = 90;
        if (frequency === 'daily') bucketBDays = 45;
        if (frequency === 'weekly') bucketBDays = 60;

        // Repair Logic
        let repairReasons = [];
        if (appState.inputs.health === 'declined') repairReasons.push('declining deliverability');
        if (['recent-30', 'recent-90'].includes(appState.inputs.attempts)) repairReasons.push('recent activity');

        // Update DOM
        setText('var-unengaged-count', unengaged.toLocaleString());
        setText('var-unengaged-pct', unengagedPct);
        setText('bucket-b-window', `${bucketBDays} Days`);
        setText('bucket-b-days-repeat', bucketBDays);
        setText('reengage-vol', `${waveSize.toLocaleString()} / Day`);

        // Repair Section Visibility
        const repairSection = document.getElementById('mobile-repair-section');
        if (repairReasons.length > 0) {
            repairSection.style.display = 'block';
            document.getElementById('repair-reason').textContent = repairReasons.join(' and ');
        } else {
            repairSection.style.display = 'none';
        }
    }

    function setText(id, text) {
        document.querySelectorAll(`.${id}, #${id}`).forEach(el => el.textContent = text);
    }

    // --- MODAL LOGIC ---
    const modal = document.getElementById('mobile-modal');
    window.openModal = function () {
        modal.classList.add('active');
    };
    window.closeModal = function () {
        modal.classList.remove('active');
    };

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // API Submission
    document.getElementById('mobile-optin-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('mobile-modal-submit');
        const name = document.getElementById('mobile-optin-name').value;
        const email = document.getElementById('mobile-optin-email').value;

        btn.disabled = true;
        btn.textContent = 'Sending...';

        try {
            const response = await fetch('/api/activecampaign/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: name, email: email })
            });

            if (!response.ok) throw new Error('Failed');

            // Success
            document.getElementById('mobile-optin-form').style.display = 'none';
            document.getElementById('mobile-modal-success').style.display = 'block';

            setTimeout(() => {
                window.open('/reengage-safety-checklist-v2.html', '_blank');
                closeModal();
            }, 1500);

        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
            btn.disabled = false;
            btn.textContent = 'Send into Me';
        }
    });

});
