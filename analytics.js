// Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX'); // Replace with actual GA4 Measurement ID

// Cookie Consent
(function() {
    const COOKIE_NAME = 'horloge_cookie_consent';
    const BANNER_ID = 'cookieConsentBanner';

    function getConsent() {
        try { return localStorage.getItem(COOKIE_NAME); } catch { return null; }
    }

    function setConsent(value) {
        try { localStorage.setItem(COOKIE_NAME, value); } catch {}
    }

    function createBanner() {
        if (document.getElementById(BANNER_ID)) return;
        const banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.style.cssText = `
            position: fixed; bottom: 0; left: 0; right: 0;
            background: #1A1A1A; border-top: 1px solid #D4AF37;
            padding: 20px 24px; z-index: 9999;
            font-family: 'Inter', sans-serif; font-size: 14px; color: #F9F9F9;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
        `;
        banner.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between;">
                <p style="margin: 0; flex: 1; min-width: 280px;">
                    We use cookies to enhance your experience and analyze traffic.
                    <a href="privacy.html" style="color: #D4AF37; text-decoration: underline;">Privacy Policy</a>
                </p>
                <div style="display: flex; gap: 12px;">
                    <button id="acceptCookies" style="
                        background: #D4AF37; color: #1A1A1A; border: none;
                        padding: 12px 24px; font-family: 'Inter', sans-serif;
                        font-size: 12px; font-weight: 600; letter-spacing: 1px;
                        text-transform: uppercase; cursor: pointer;
                    ">Accept All</button>
                    <button id="rejectCookies" style="
                        background: transparent; color: #F9F9F9; border: 1px solid #D4AF37;
                        padding: 12px 24px; font-family: 'Inter', sans-serif;
                        font-size: 12px; font-weight: 600; letter-spacing: 1px;
                        text-transform: uppercase; cursor: pointer;
                    ">Reject</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('acceptCookies').addEventListener('click', () => {
            setConsent('accepted');
            banner.remove();
            loadGA();
        });
        document.getElementById('rejectCookies').addEventListener('click', () => {
            setConsent('rejected');
            banner.remove();
        });
    }

    function loadGA() {
        if (window.gtagLoaded) return;
        window.gtagLoaded = true;
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        document.head.appendChild(script);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        const consent = getConsent();
        if (consent === 'accepted') {
            loadGA();
        } else if (consent === 'rejected') {
            // Do not load GA
        } else {
            createBanner();
        }
    });

    // Event tracking helper
    window.horlogeTrack = function(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    };
})();