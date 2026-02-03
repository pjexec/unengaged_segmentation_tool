// Partner tracking analytics

let trackingInitialized = false;

export function initAnalytics() {
    if (typeof window === 'undefined') return;
    if (trackingInitialized) return;

    trackingInitialized = true;

    // 1. Capture Ref from URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        // First-touch attribution: only store if not already set
        if (!localStorage.getItem('reengage_ref')) {
            localStorage.setItem('reengage_ref', ref);
        }
    }

    // 2. Visitor ID (persistent anonymous ID)
    let vid = localStorage.getItem('reengage_vid');
    if (!vid) {
        vid = crypto.randomUUID();
        localStorage.setItem('reengage_vid', vid);
    }
}

export async function trackEvent(eventName: string, props: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    const ref = localStorage.getItem('reengage_ref');
    const vid = localStorage.getItem('reengage_vid');

    const payload = {
        eventType: eventName,
        ref,
        visitorId: vid,
        asset: props.asset || null,
        ...props
    };

    console.log('[Analytics] Tracking:', payload);

    // POST to tracking API
    try {
        const response = await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('[Analytics] Track failed:', response.status);
        }
    } catch (error) {
        console.error('[Analytics] Track error:', error);
    }
}

// Helper to get the current referral key (for debugging)
export function getReferralKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('reengage_ref');
}

// Helper to get visitor ID
export function getVisitorId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('reengage_vid');
}
