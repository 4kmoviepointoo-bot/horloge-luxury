/* ============================================
   HORLOGE — Shared Overlay & Navigation Logic
   ============================================ */
(function () {
    'use strict';

    var isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -------------------------------------------
       MOBILE MENU
       ------------------------------------------- */
    function initMobileMenu() {
        var menuBtn = document.querySelector('.nav__menu-btn');
        var mobileMenu = document.querySelector('.mobile-menu');
        var closeBtn = document.querySelector('.mobile-menu__close');
        if (!menuBtn || !mobileMenu) return;

        function openMenu() {
            menuBtn.classList.add('is-open');
            menuBtn.setAttribute('aria-label', 'Close menu');
            mobileMenu.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuBtn.classList.remove('is-open');
            menuBtn.setAttribute('aria-label', 'Toggle menu');
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
        });

        if (closeBtn) closeBtn.addEventListener('click', closeMenu);

        // Close on link click
        mobileMenu.querySelectorAll('.glass-radio-group--mobile label').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        if (isTouch && menuBtn) {
            menuBtn.addEventListener('touchstart', function () { menuBtn.style.transform = 'scale(0.92)'; }, { passive: true });
            menuBtn.addEventListener('touchend', function () { menuBtn.style.transform = ''; }, { passive: true });
        }
    }

    /* -------------------------------------------
       SEARCH OVERLAY
       ------------------------------------------- */
    function initSearchOverlay() {
        var overlay = document.getElementById('searchOverlay');
        var closeBtn = document.getElementById('searchOverlayClose');
        var searchInput = document.getElementById('searchInput');
        var searchResults = document.getElementById('searchResults');
        if (!overlay || !closeBtn) return;

        // Product database
        var products = [
            { name: 'Chronograph Lunar', price: '$42,500', image: 'images/chronograph-lunar.jpg', link: 'product-details.html' },
            { name: 'Classique 1920', price: '$28,000', image: 'images/classique-1920.jpg', link: 'product-details.html' },
            { name: 'Tourbillon Squelette', price: '$115,000', image: 'images/tourbillon-squelette.jpg', link: 'product-details.html' },
            { name: 'Aero Titanium', price: '$35,200', image: 'images/aero-titanium.jpg', link: 'product-details.html' },
            { name: 'Tradition Automatique', price: '$22,500', image: 'images/tradition-automatique.jpg', link: 'product-details.html' },
            { name: 'Quantième Perpétuel', price: '$85,000', image: 'images/quantieme-perpetuel.jpg', link: 'product-details.html' },
            { name: 'Oceanic AquaTerra', price: '$31,800', image: 'images/oceanic-aquaterra.jpg', link: 'product-details.html' },
            { name: 'Slimline Elegance', price: '$18,900', image: 'images/slimline-elegance.jpg', link: 'product-details.html' },
            { name: 'Tourbillon Masterpiece', price: '$245,000', image: 'images/tourbillon-masterpiece.jpg', link: 'product-details.html' },
            { name: 'Stealth Chrono', price: '$38,500', image: 'images/stealth-chrono.jpg', link: 'product-details.html' }
        ];

        function searchProducts(query) {
            if (!query || query.length < 2) return [];
            var q = query.toLowerCase();
            return products.filter(function (p) {
                return p.name.toLowerCase().indexOf(q) !== -1;
            });
        }

        function renderResults(results, query) {
            if (!searchResults) return;
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-overlay__no-results"><p>No watches found for "' + query + '"</p><p class="search-overlay__no-results-hint">Try searching by name (e.g. "Chronograph", "Titanium")</p></div>';
                return;
            }
            var html = '';
            results.forEach(function (product) {
                html += '<a href="' + product.link + '" class="search-overlay__result-item">' +
                    '<img class="search-overlay__result-img" src="' + product.image + '" alt="' + product.name + '" loading="lazy">' +
                    '<div class="search-overlay__result-info">' +
                        '<div class="search-overlay__result-name">' + highlightMatch(product.name, query) + '</div>' +
                        '<div class="search-overlay__result-price">' + product.price + '</div>' +
                    '</div>' +
                '</a>';
            });
            searchResults.innerHTML = html;
        }

        function highlightMatch(name, query) {
            if (!query) return name;
            var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            return name.replace(regex, '<strong>$1</strong>');
        }

        // Open search
        var triggers = document.querySelectorAll('.nav__icon-btn[aria-label="Search"], .mobile-menu__icon-btn[aria-label="Search"]');
        triggers.forEach(function (btn) {
            btn.addEventListener('click', function () {
                overlay.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                if (searchInput) {
                    setTimeout(function () { searchInput.focus(); }, 300);
                }
            });
        });

        // Close search
        function closeSearch() {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
        }
        closeBtn.addEventListener('click', closeSearch);

        // Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeSearch();
        });

        // Search on input
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                var query = searchInput.value.trim();
                var results = searchProducts(query);
                renderResults(results, query);
            });

            // Also search on Enter
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var query = searchInput.value.trim();
                    var results = searchProducts(query);
                    renderResults(results, query);
                }
            });
        }
    }

    /* -------------------------------------------
       CART OVERLAY
       ------------------------------------------- */
    function initCartOverlay() {
        var overlay = document.getElementById('cartOverlay');
        var closeBtn = document.getElementById('cartOverlayClose');
        var backdrop = document.querySelector('.cart-overlay__backdrop');
        if (!overlay || !closeBtn) return;

        function closeCart() {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        }

        var triggers = document.querySelectorAll('.nav__icon-btn[aria-label="Shopping bag"], .mobile-menu__icon-btn[aria-label="Shopping bag"]');
        triggers.forEach(function (btn) {
            btn.addEventListener('click', function () {
                overlay.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', closeCart);
        if (backdrop) backdrop.addEventListener('click', closeCart);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeCart();
        });
    }

    /* -------------------------------------------
       ACCOUNT OVERLAY
       ------------------------------------------- */
    function initAccountOverlay() {
        var overlay = document.getElementById('accountOverlay');
        var closeBtn = document.getElementById('accountOverlayClose');
        if (!overlay || !closeBtn) return;

        var triggers = document.querySelectorAll('.nav__icon-btn[aria-label="Account"], .mobile-menu__icon-btn[aria-label="Account"]');
        triggers.forEach(function (btn) {
            btn.addEventListener('click', function () {
                overlay.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', function () {
            overlay.classList.remove('is-open');
            document.body.style.overflow = '';
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
                overlay.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        });
    }

    /* -------------------------------------------
       GLASS RADIO NAVIGATION
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
                var route = routes[label.getAttribute('for')];
                if (route && route !== '#') window.location.href = route;
            });

            if (isTouch) {
                label.addEventListener('touchstart', function () { label.style.transform = 'scale(0.97)'; label.style.transition = 'transform 0.15s ease'; }, { passive: true });
                label.addEventListener('touchend', function () { label.style.transform = ''; }, { passive: true });
            }
        });

        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var initialMap = { 'collection.html': 'nav-collection', 'heritage.html': 'nav-heritage', 'craftsmanship.html': 'nav-craftsmanship' };
        var initialId = initialMap[currentPage];
        if (initialId) {
            var desktopInput = document.getElementById(initialId);
            var mobileInput = document.getElementById(initialId + '-mobile');
            if (desktopInput) desktopInput.checked = true;
            if (mobileInput) mobileInput.checked = true;
        }
    }

    /* -------------------------------------------
       TOUCH FEEDBACK
       ------------------------------------------- */
    function initTouchFeedback() {
        if (!isTouch) return;
        var selectors = '.hero__btn, .load-more__btn, .auth__submit, .checkout__submit, .cart-overlay__checkout, .account-overlay__btn';
        document.querySelectorAll(selectors).forEach(function (btn) {
            btn.addEventListener('touchstart', function () { btn.style.transform = 'scale(0.96)'; btn.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'; }, { passive: true });
            btn.addEventListener('touchend', function () { btn.style.transform = ''; }, { passive: true });
            btn.addEventListener('touchcancel', function () { btn.style.transform = ''; }, { passive: true });
        });

        document.querySelectorAll('.search-overlay__close, .cart-overlay__close, .account-overlay__close').forEach(function (btn) {
            btn.addEventListener('touchstart', function () { btn.style.transform = 'scale(0.88)'; btn.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'; }, { passive: true });
            btn.addEventListener('touchend', function () { btn.style.transform = ''; }, { passive: true });
        });
    }

    /* -------------------------------------------
       INIT
       ------------------------------------------- */
    function init() {
        initMobileMenu();
        initSearchOverlay();
        initCartOverlay();
        initAccountOverlay();
        initGlassRadioNav();
        initTouchFeedback();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
