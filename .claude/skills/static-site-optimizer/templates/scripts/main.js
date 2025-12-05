/**
 * Main JavaScript - Site Statique Frugal
 *
 * Ce fichier contient le JavaScript minimal nécessaire.
 * Principes:
 * - Vanilla JS uniquement (pas de framework)
 * - Chargé en defer
 * - Progressive enhancement
 * - Accessibilité respectée
 */

(function() {
    'use strict';

    // ==========================================================================
    // NAVIGATION RESPONSIVE
    // ==========================================================================

    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('is-open');
        });

        // Fermer le menu si clic en dehors
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('is-open');
            }
        });

        // Fermer avec Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('is-open');
                navToggle.focus();
            }
        });
    }

    // ==========================================================================
    // BOUTON RETOUR EN HAUT
    // ==========================================================================

    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        // Afficher/masquer selon le scroll
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTop.removeAttribute('hidden');
            } else {
                backToTop.setAttribute('hidden', '');
            }
        }

        // Throttle pour performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    toggleBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Action du clic
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Vérifier l'état initial
        toggleBackToTop();
    }

    // ==========================================================================
    // BANNIÈRE COOKIES (RGPD)
    // ==========================================================================

    const cookieBanner = document.getElementById('cookie-banner');

    if (cookieBanner) {
        // Vérifier si déjà accepté
        if (!localStorage.getItem('cookies-accepted')) {
            cookieBanner.removeAttribute('hidden');
        }
    }

    // Fonction globale pour accepter les cookies
    window.acceptCookies = function() {
        localStorage.setItem('cookies-accepted', 'true');
        if (cookieBanner) {
            cookieBanner.setAttribute('hidden', '');
        }
    };

    // ==========================================================================
    // MODE SOMBRE (Optionnel)
    // ==========================================================================

    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (darkModeToggle) {
        // Charger la préférence sauvegardée
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.setAttribute('aria-pressed', 'true');
        }

        darkModeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                this.setAttribute('aria-pressed', 'false');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                this.setAttribute('aria-pressed', 'true');
            }
        });
    }

    // ==========================================================================
    // SMOOTH SCROLL POUR ANCRES
    // ==========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Ignorer les liens vides
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Mettre le focus sur l'élément cible pour accessibilité
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });

    // ==========================================================================
    // LAZY LOADING IMAGES (Fallback pour navigateurs anciens)
    // ==========================================================================

    if ('loading' in HTMLImageElement.prototype) {
        // Le navigateur supporte le lazy loading natif
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback avec IntersectionObserver
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.removeAttribute('loading');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    // ==========================================================================
    // FORMULAIRE DE CONTACT (Validation basique)
    // ==========================================================================

    const contactForm = document.querySelector('.form--contact');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');

            requiredFields.forEach(function(field) {
                const errorElement = field.parentElement.querySelector('.form-error');

                if (!field.value.trim()) {
                    isValid = false;
                    field.setAttribute('aria-invalid', 'true');
                    if (errorElement) {
                        errorElement.textContent = 'Ce champ est requis';
                        errorElement.removeAttribute('hidden');
                    }
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    field.setAttribute('aria-invalid', 'true');
                    if (errorElement) {
                        errorElement.textContent = 'Veuillez entrer une adresse email valide';
                        errorElement.removeAttribute('hidden');
                    }
                } else {
                    field.removeAttribute('aria-invalid');
                    if (errorElement) {
                        errorElement.setAttribute('hidden', '');
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Focus sur le premier champ en erreur
                const firstError = this.querySelector('[aria-invalid="true"]');
                if (firstError) {
                    firstError.focus();
                }
            }
        });

        // Validation email simple
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Effacer les erreurs lors de la saisie
        contactForm.querySelectorAll('input, textarea').forEach(function(field) {
            field.addEventListener('input', function() {
                this.removeAttribute('aria-invalid');
                const errorElement = this.parentElement.querySelector('.form-error');
                if (errorElement) {
                    errorElement.setAttribute('hidden', '');
                }
            });
        });
    }

    // ==========================================================================
    // ANIMATIONS AU SCROLL (Optionnel, respecte prefers-reduced-motion)
    // ==========================================================================

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const animatedElements = document.querySelectorAll('[data-animate]');

        if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            animatedElements.forEach(function(element) {
                animationObserver.observe(element);
            });
        }
    }

})();
