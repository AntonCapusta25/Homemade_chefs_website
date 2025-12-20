/**
 * Facebook Pixel tracking helper
 * Passes tracking cookies to signup website for cross-domain CAPI tracking
 */

declare global {
    interface Window {
        fbq?: (
            action: string,
            eventName: string,
            params?: Record<string, any>
        ) => void;
    }
}

// Get Facebook browser cookies
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export const trackFBEvent = (
    eventName: string,
    params?: Record<string, any>
) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params);
        console.log(`FB Pixel: ${eventName}`, params);
    }
};

// Track when user clicks signup button - passes cookies to signup website
export const trackSignupClick = (source: string) => {
    // Fire pixel event on this site
    trackFBEvent('InitiateCheckout', {
        content_name: 'Chef Signup',
        content_category: 'Signup',
        source,
    });

    // Get Facebook cookies to pass to signup website
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    console.log('🍪 Cookies found:', { fbp, fbc });

    // Build signup URL with tracking parameters
    const targetUrl = new URL('https://signup.homemadechefs.com/');
    if (fbp) targetUrl.searchParams.set('fbp', fbp);
    if (fbc) targetUrl.searchParams.set('fbc', fbc);

    console.log('🔗 Redirecting to:', targetUrl.toString());

    // Redirect to signup website with cookies
    // Note: This should be called from onClick handler, not automatically
    return targetUrl.toString();
};

// Track when user clicks download app button
export const trackAppDownload = (platform: string) => {
    trackFBEvent('Lead', {
        content_name: 'App Download',
        content_category: 'Download',
        platform,
    });
};
