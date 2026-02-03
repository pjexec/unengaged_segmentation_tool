export function initAnalytics() {
    if (typeof window === 'undefined') return;

    // 1. Capture Ref
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        if (!localStorage.getItem('reengage_ref')) {
            localStorage.setItem('reengage_ref', ref);
        }
    }

    // 2. Visitor ID
    let vid = localStorage.getItem('reengage_vid');
    if (!vid) {
        vid = crypto.randomUUID();
        localStorage.setItem('reengage_vid', vid);
    }

    // 3. Track Tool View
    // We handle this via explicit event call in page.tsx useEffect
}

export function trackEvent(eventName: string, props: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    const ref = localStorage.getItem('reengage_ref');
    const vid = localStorage.getItem('reengage_vid');

    const payload = {
        event: eventName,
        timestamp: new Date().toISOString(),
        vid,
        ref,
        ...props
    };

    console.log('[Analytics]', payload);

    // Future: POST to endpoint
}
