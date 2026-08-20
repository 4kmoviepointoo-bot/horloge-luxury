/* ============================================
   HORLOGE — Animation Controller
   ============================================ */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    var isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    /* -------------------------------------------
       1. HEADER SCROLL — Smooth follow on scroll
       ------------------------------------------- */
    function initHeaderScroll() {
        var nav = document.querySelector('.nav');
        if (!nav) return;

        var scrollThreshold = 60;
        var lastScrollY = 0;
        var ticking = false;
        var navHeight = nav.offsetHeight;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    var currentScrollY = window.scrollY;

                    // Add scrolled state
                    if (currentScrollY > scrollThreshold) {
                        nav.classList.add('nav--scrolled');
                    } else {
                        nav.classList.remove('nav--scrolled');
                    }

                    // Mobile: hide/show on scroll direction
                    if (isMobile) {
                        if (currentScrollY > lastScrollY && currentScrollY > navHeight) {
                            nav.style.transform = 'translateY(-100%)';
                        } else {
                            nav.style.transform = 'translateY(0)';
                        }
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* -------------------------------------------
       2. SALE POPUP — Timed elegant notification
       ------------------------------------------- */
    function initSalePopup() {
        if (prefersReducedMotion) return;

        var POPUP_KEY = 'horloge_sale_popup_dismissed';
        var POPUP_DELAY = 6000;
        var POPUP_DURATION = 12000;

        if (sessionStorage.getItem(POPUP_KEY)) return;

        var offers = [
            {
                badge: 'Limited Time',
                title: 'Heritage Series — 15% Off',
                text: 'Use code HERITAGE15 at checkout. Ends tonight.',
                icon: 'sell'
            },
            {
                badge: 'Exclusive Offer',
                title: 'Free Engraving on All Orders',
                text: 'Personalize your timepiece. Limited availability.',
                icon: 'premium'
            },
            {
                badge: 'Flash Sale',
                title: 'Complimentary Watch Winder',
                text: 'With purchases over $5,000. While supplies last.',
                icon: 'redeem'
            }
        ];

        var offer = offers[Math.floor(Math.random() * offers.length)];

        var popup = document.createElement('div');
        popup.className = 'sale-popup';
        popup.setAttribute('role', 'status');
        popup.setAttribute('aria-live', 'polite');
        popup.innerHTML =
            '<div class="sale-popup__icon">' +
                '<span class="material-symbols-outlined">' + offer.icon + '</span>' +
            '</div>' +
            '<div class="sale-popup__content">' +
                '<span class="sale-popup__badge">' + offer.badge + '</span>' +
                '<div class="sale-popup__title">' + offer.title + '</div>' +
                '<div class="sale-popup__text">' + offer.text + '</div>' +
            '</div>' +
            '<button class="sale-popup__close" aria-label="Dismiss">' +
                '<span class="material-symbols-outlined">close</span>' +
            '</button>' +
            '<div class="sale-popup__timer"></div>';

        document.body.appendChild(popup);

        var timer = popup.querySelector('.sale-popup__timer');
        var closeBtn = popup.querySelector('.sale-popup__close');
        var dismissTimeout;
        var closeTimeout;

        function dismiss() {
            clearTimeout(dismissTimeout);
            clearTimeout(closeTimeout);
            popup.classList.add('is-closing');
            popup.classList.remove('is-visible');
            sessionStorage.setItem(POPUP_KEY, '1');
            closeTimeout = setTimeout(function () {
                if (popup.parentNode) popup.parentNode.removeChild(popup);
            }, 400);
        }

        closeBtn.addEventListener('click', dismiss);

        // Touch feedback for close button
        if (isTouch) {
            closeBtn.addEventListener('touchstart', function () {
                closeBtn.style.transform = 'scale(0.85)';
            }, { passive: true });
            closeBtn.addEventListener('touchend', function () {
                closeBtn.style.transform = '';
            }, { passive: true });
        }

        dismissTimeout = setTimeout(function () {
            popup.classList.add('is-visible');

            if (!prefersReducedMotion) {
                timer.style.width = '100%';
                timer.style.transitionDuration = POPUP_DURATION + 'ms';
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        timer.style.width = '0%';
                    });
                });
            }

            closeTimeout = setTimeout(dismiss, POPUP_DURATION);
        }, POPUP_DELAY);
    }

    /* -------------------------------------------
       3. MOBILE MENU — Icon morph on open/close
       ------------------------------------------- */
    function initMenuMorph() {
        var menuBtn = document.querySelector('.nav__menu-btn');
        var mobileMenu = document.querySelector('.mobile-menu');
        var closeBtn = document.getElementById('mobileMenuClose');
        if (!menuBtn || !mobileMenu) return;

        function openMenu() {
            menuBtn.classList.add('is-open');
            menuBtn.setAttribute('aria-label', 'Close menu');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuBtn.classList.remove('is-open');
            menuBtn.setAttribute('aria-label', 'Toggle menu');
            document.body.style.overflow = '';
        }

        // Hook into existing toggle logic via MutationObserver
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.attributeName === 'class') {
                    if (mobileMenu.classList.contains('is-open')) {
                        openMenu();
                    } else {
                        closeMenu();
                    }
                }
            });
        });
        observer.observe(mobileMenu, { attributes: true });

        // Mobile: touch feedback on menu button
        if (isTouch && menuBtn) {
            menuBtn.addEventListener('touchstart', function () {
                menuBtn.style.transform = 'scale(0.92)';
            }, { passive: true });
            menuBtn.addEventListener('touchend', function () {
                menuBtn.style.transform = '';
            }, { passive: true });
        }

        // Close button functionality
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                mobileMenu.classList.remove('is-open');
            });

            if (isTouch) {
                closeBtn.addEventListener('touchstart', function () {
                    closeBtn.style.transform = 'scale(0.88)';
                }, { passive: true });
                closeBtn.addEventListener('touchend', function () {
                    closeBtn.style.transform = '';
                }, { passive: true });
            }
        }
    }

    /* -------------------------------------------
       4. GLASS RADIO NAVIGATION — Click to navigate
       ------------------------------------------- */
    function initGlassRadioNav() {
        var routes = {
            'nav-collection': 'collection.html',
            'nav-heritage': 'heritage.html',
            'nav-craftsmanship': 'craftsmanship.html',
            'nav-collection-mobile': 'collection.html',
            'nav-heritage-mobile': 'heritage.html',
            'nav-craftsmanship-mobile': 'craftsmanship.html'
        };

        document.querySelectorAll('.glass-radio-group label, .glass-radio-group--mobile label').forEach(function (label) {
            label.addEventListener('click', function () {
                var inputId = label.getAttribute('for');
                var route = routes[inputId];
                if (route && route !== '#') {
                    window.location.href = route;
                }
            });

            // Touch feedback for glass radio labels
            if (isTouch) {
                label.addEventListener('touchstart', function () {
                    label.style.transform = 'scale(0.97)';
                    label.style.transition = 'transform 0.15s ease';
                }, { passive: true });
                label.addEventListener('touchend', function () {
                    label.style.transform = '';
                }, { passive: true });
            }
        });

        // Set initial checked state based on current page
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var initialMap = {
            'collection.html': 'nav-collection',
            'heritage.html': 'nav-heritage',
            'craftsmanship.html': 'nav-craftsmanship'
        };
        var initialId = initialMap[currentPage];
        if (initialId) {
            var desktopInput = document.getElementById(initialId);
            var mobileInput = document.getElementById(initialId + '-mobile');
            if (desktopInput) desktopInput.checked = true;
            if (mobileInput) mobileInput.checked = true;
        }
    }

    /* -------------------------------------------
       5. BUTTON TOUCH FEEDBACK — Mobile interactions
       ------------------------------------------- */
    function initButtonTouchFeedback() {
        if (!isTouch) return;

        var buttons = document.querySelectorAll(
            '.hero__btn, .load-more__btn, .auth__submit, .checkout__submit, ' +
            '.collection-cta__btn, .nav__icon-btn, .mobile-menu__icon-btn, ' +
            '.product-card__btn, .cart-overlay__checkout, .account-overlay__btn'
        );

        buttons.forEach(function (btn) {
            btn.addEventListener('touchstart', function () {
                btn.style.transform = 'scale(0.96)';
                btn.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, { passive: true });

            btn.addEventListener('touchend', function () {
                btn.style.transform = '';
            }, { passive: true });

            btn.addEventListener('touchcancel', function () {
                btn.style.transform = '';
            }, { passive: true });
        });
    }

    /* -------------------------------------------
       6. OVERLAY TOUCH FEEDBACK — Mobile close buttons
       ------------------------------------------- */
    function initOverlayTouchFeedback() {
        if (!isTouch) return;

        var closeButtons = document.querySelectorAll(
            '.search-overlay__close, .cart-overlay__close, .account-overlay__close'
        );

        closeButtons.forEach(function (btn) {
            btn.addEventListener('touchstart', function () {
                btn.style.transform = 'scale(0.88)';
                btn.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, { passive: true });

            btn.addEventListener('touchend', function () {
                btn.style.transform = '';
            }, { passive: true });
        });
    }

    /* -------------------------------------------
       7. FOOTER MODALS — Policy & info overlays
       ------------------------------------------- */
    function initFooterModals() {
        var modalContent = {
            'privacy-policy': {
                title: 'Privacy Policy',
                content:
                    '<h3>Information We Collect</h3>' +
                    '<p>At HORLOGE, we collect information you provide directly, including your name, email address, shipping address, and payment information when you make a purchase or create an account.</p>' +
                    '<p>We automatically collect certain information about your device, including your web browser, IP address, time zone, and cookies that are installed on your device.</p>' +
                    '<h3>How We Use Your Information</h3>' +
                    '<ul>' +
                        '<li>To process and fulfill your orders, including sending emails to confirm your order status and shipment</li>' +
                        '<li>To communicate with you about products, services, offers, and events</li>' +
                        '<li>To provide customer support and respond to your inquiries</li>' +
                        '<li>To detect, prevent, and address fraud and technical issues</li>' +
                    '</ul>' +
                    '<h3>Data Security</h3>' +
                    '<p>We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology.</p>' +
                    '<h3>Contact Us</h3>' +
                    '<p>For questions about this Privacy Policy, please contact us at <a href="mailto:privacy@horloge.com">privacy@horloge.com</a>.</p>'
            },
            'terms-of-service': {
                title: 'Terms of Service',
                content:
                    '<h3>Acceptance of Terms</h3>' +
                    '<p>By accessing and using the HORLOGE website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>' +
                    '<h3>Products and Pricing</h3>' +
                    '<p>All timepieces displayed on our website are subject to availability. We reserve the right to modify prices without notice. Product images are for illustration purposes and may differ slightly from the actual product.</p>' +
                    '<h3>Orders and Payment</h3>' +
                    '<ul>' +
                        '<li>By placing an order, you are making an offer to purchase a product subject to these terms</li>' +
                        '<li>We reserve the right to refuse or cancel any order for any reason</li>' +
                        '<li>Payment must be received in full before shipment of your order</li>' +
                    '</ul>' +
                    '<h3>Warranty</h3>' +
                    '<p>All HORLOGE timepieces come with a 5-year international warranty covering manufacturing defects. This warranty does not cover damage from misuse, accident, or unauthorized service.</p>' +
                    '<h3>Governing Law</h3>' +
                    '<p>These Terms of Service are governed by and construed in accordance with the laws of the State of New York.</p>'
            },
            'sustainability': {
                title: 'Sustainability',
                content:
                    '<h3>Our Commitment</h3>' +
                    '<p>At HORLOGE, we believe that luxury and sustainability are not mutually exclusive. We are committed to creating timepieces that stand the test of time while minimizing our environmental impact.</p>' +
                    '<h3>Responsible Sourcing</h3>' +
                    '<ul>' +
                        '<li>All precious metals are sourced from certified ethical suppliers</li>' +
                        '<li>Diamonds and gemstones are conflict-free and Kimberley Process certified</li>' +
                        '<li>Leather straps are sourced from tanneries with responsible environmental practices</li>' +
                    '</ul>' +
                    '<h3>Carbon Neutral Operations</h3>' +
                    '<p>Our manufacturing facility in Switzerland operates on 100% renewable energy. We offset all carbon emissions from shipping through verified carbon offset programs.</p>' +
                    '<h3>Circular Economy</h3>' +
                    '<p>We offer a lifetime service program for all HORLOGE timepieces, ensuring they can be repaired, restored, and passed down through generations rather than replaced.</p>' +
                    '<h3>Packaging</h3>' +
                    '<p>Our packaging is made from recycled and recyclable materials, using soy-based inks and FSC-certified paper products.</p>'
            },
            'contact': {
                title: 'Contact Us',
                content:
                    '<h3>Customer Service</h3>' +
                    '<p>Our concierge team is available to assist you with any inquiries about our timepieces, orders, or services.</p>' +
                    '<ul>' +
                        '<li>Email: <a href="mailto:concierge@horloge.com">concierge@horloge.com</a></li>' +
                        '<li>Phone: +1 (800) 555-0199</li>' +
                        '<li>Hours: Monday – Friday, 9:00 AM – 6:00 PM EST</li>' +
                    '</ul>' +
                    '<h3>Boutique Locations</h3>' +
                    '<p>Visit our boutiques for a personal consultation:</p>' +
                    '<ul>' +
                        '<li>New York — 712 Fifth Avenue, New York, NY 10019</li>' +
                        '<li>London — 141 New Bond Street, London W1S 2BS</li>' +
                        '<li>Tokyo — Ginza Six, 6-10-1 Ginza, Chuo-ku, Tokyo</li>' +
                    '</ul>' +
                    '<h3>Press Inquiries</h3>' +
                    '<p>For media and press inquiries, please contact <a href="mailto:press@horloge.com">press@horloge.com</a>.</p>' +
                    '<h3>Service & Repairs</h3>' +
                    '<p>For service requests, please email <a href="mailto:service@horloge.com">service@horloge.com</a> or visit your nearest boutique.</p>'
            }
        };

        // Create modal element
        var modal = document.createElement('div');
        modal.className = 'footer-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML =
            '<div class="footer-modal__backdrop"></div>' +
            '<div class="footer-modal__container">' +
                '<div class="footer-modal__header">' +
                    '<h2 class="footer-modal__title"></h2>' +
                    '<button class="footer-modal__close" aria-label="Close">' +
                        '<span class="material-symbols-outlined">close</span>' +
                    '</button>' +
                '</div>' +
                '<div class="footer-modal__body">' +
                    '<div class="footer-modal__content"></div>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        var backdrop = modal.querySelector('.footer-modal__backdrop');
        var closeBtn = modal.querySelector('.footer-modal__close');
        var titleEl = modal.querySelector('.footer-modal__title');
        var contentEl = modal.querySelector('.footer-modal__content');

        function openModal(key) {
            var data = modalContent[key];
            if (!data) return;
            titleEl.textContent = data.title;
            contentEl.innerHTML = data.content;
            modal.classList.add('is-open');
            modal.classList.remove('is-closing');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.add('is-closing');
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
            setTimeout(function () {
                modal.classList.remove('is-closing');
            }, 350);
        }

        backdrop.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

        // Attach to footer links
        var linkMap = {
            'Privacy Policy': 'privacy-policy',
            'Terms of Service': 'terms-of-service',
            'Sustainability': 'sustainability',
            'Contact': 'contact'
        };

        document.querySelectorAll('.footer__link').forEach(function (link) {
            var text = link.textContent.trim();
            var key = linkMap[text];
            if (key) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    openModal(key);
                });
            }
        });
    }

    /* -------------------------------------------
       INIT
       ------------------------------------------- */
    function init() {
        initHeaderScroll();
        initSalePopup();
        initMenuMorph();
        initGlassRadioNav();
        initButtonTouchFeedback();
        initOverlayTouchFeedback();
        initFooterModals();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
