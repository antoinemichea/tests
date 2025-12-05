#!/usr/bin/env node

/**
 * Site Generator - Générateur de Structure de Site Statique Frugal
 *
 * Ce script génère une structure de site complète basée sur les paramètres fournis.
 * Utilisé en synergie avec le skill bootstrap-site.md
 *
 * Usage:
 *   node site-generator.js --config config.json
 *   node site-generator.js --interactive
 *
 * @version 1.0.0
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ==========================================================================
// CONFIGURATION PAR DÉFAUT
// ==========================================================================

const DEFAULT_CONFIG = {
    projectName: 'mon-site',
    siteName: 'Mon Site',
    siteType: 'vitrine',
    style: 'moderne',
    palette: 'bleu-confiance',
    pages: ['Accueil', 'À propos', 'Contact'],
    features: ['nav-responsive'],
    contentType: 'placeholder',
    lang: 'fr',
    locale: 'fr_FR',
    description: 'Description du site',
    keywords: 'mot-clé1, mot-clé2',
    location: '',
    author: 'Auteur'
};

// ==========================================================================
// PALETTES DE COULEURS
// ==========================================================================

const PALETTES = {
    'bleu-confiance': {
        primary: '#1a365d',
        accent: '#3182ce',
        background: '#ffffff',
        surface: '#f7fafc',
        text: '#1a202c',
        textMuted: '#718096',
        border: '#e2e8f0',
        theme: '#3182ce'
    },
    'vert-nature': {
        primary: '#1a4731',
        accent: '#38a169',
        background: '#ffffff',
        surface: '#f0fff4',
        text: '#1a202c',
        textMuted: '#718096',
        border: '#c6f6d5',
        theme: '#38a169'
    },
    'violet-creatif': {
        primary: '#44337a',
        accent: '#805ad5',
        background: '#ffffff',
        surface: '#faf5ff',
        text: '#1a202c',
        textMuted: '#718096',
        border: '#e9d8fd',
        theme: '#805ad5'
    },
    'orange-energie': {
        primary: '#7c2d12',
        accent: '#ed8936',
        background: '#ffffff',
        surface: '#fffaf0',
        text: '#1a202c',
        textMuted: '#718096',
        border: '#feebc8',
        theme: '#ed8936'
    },
    'monochrome': {
        primary: '#000000',
        accent: '#4a5568',
        background: '#ffffff',
        surface: '#f7fafc',
        text: '#1a202c',
        textMuted: '#718096',
        border: '#e2e8f0',
        theme: '#4a5568'
    }
};

// ==========================================================================
// STYLES VISUELS
// ==========================================================================

const STYLES = {
    'moderne': {
        name: 'Moderne',
        fontPrimary: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontHeading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        borderRadius: '0.5rem',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    'retro': {
        name: 'Rétro/Vintage',
        fontPrimary: "Georgia, 'Times New Roman', serif",
        fontHeading: "'Palatino Linotype', 'Book Antiqua', serif",
        borderRadius: '0',
        shadow: '2px 2px 0 rgba(0, 0, 0, 0.2)',
        shadowLg: '4px 4px 0 rgba(0, 0, 0, 0.2)'
    },
    'minimaliste': {
        name: 'Minimaliste',
        fontPrimary: "-apple-system, BlinkMacSystemFont, sans-serif",
        fontHeading: "-apple-system, BlinkMacSystemFont, sans-serif",
        borderRadius: '0',
        shadow: 'none',
        shadowLg: 'none'
    },
    'brutaliste': {
        name: 'Brutaliste',
        fontPrimary: "'Courier New', monospace",
        fontHeading: "Impact, Haettenschweiler, sans-serif",
        borderRadius: '0',
        shadow: '5px 5px 0 #000',
        shadowLg: '8px 8px 0 #000'
    },
    'organique': {
        name: 'Organique/Nature',
        fontPrimary: "'Segoe UI', Tahoma, Geneva, sans-serif",
        fontHeading: "Georgia, serif",
        borderRadius: '1rem',
        shadow: '0 10px 30px rgba(26, 71, 49, 0.1)',
        shadowLg: '0 20px 40px rgba(26, 71, 49, 0.15)'
    },
    'artistique': {
        name: 'Artistique',
        fontPrimary: "'Trebuchet MS', Helvetica, sans-serif",
        fontHeading: "'Lucida Handwriting', cursive, serif",
        borderRadius: '0.75rem',
        shadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        shadowLg: '0 15px 35px rgba(0, 0, 0, 0.2)'
    },
    'corporate': {
        name: 'Corporate',
        fontPrimary: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        fontHeading: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        borderRadius: '0.25rem',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        shadowLg: '0 4px 8px rgba(0, 0, 0, 0.15)'
    },
    'terminal': {
        name: 'Terminal/Hacker',
        fontPrimary: "'Fira Code', 'Consolas', 'Monaco', monospace",
        fontHeading: "'Fira Code', 'Consolas', 'Monaco', monospace",
        borderRadius: '0',
        shadow: '0 0 10px rgba(0, 255, 0, 0.3)',
        shadowLg: '0 0 20px rgba(0, 255, 0, 0.4)'
    }
};

// ==========================================================================
// TYPES DE SITE - SCHEMA.ORG
// ==========================================================================

const SCHEMA_TYPES = {
    'portfolio': 'Person',
    'vitrine': 'Organization',
    'blog': 'Blog',
    'landing': 'WebPage',
    'documentation': 'TechArticle',
    'galerie': 'ImageGallery'
};

// ==========================================================================
// FONCTIONS UTILITAIRES
// ==========================================================================

/**
 * Convertit un nom en slug URL-friendly
 */
function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

/**
 * Crée un répertoire récursivement
 */
function mkdirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Génère la date au format ISO
 */
function getISODate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Génère l'année courante
 */
function getCurrentYear() {
    return new Date().getFullYear();
}

// ==========================================================================
// GÉNÉRATEURS DE FICHIERS
// ==========================================================================

/**
 * Génère le contenu du fichier main.css avec les variables de style
 */
function generateMainCSS(config, palette, style) {
    const templatePath = path.join(__dirname, '../skills/static-site-optimizer/templates/styles/main.css');

    if (fs.existsSync(templatePath)) {
        let template = fs.readFileSync(templatePath, 'utf8');

        // Remplacer les variables
        template = template
            .replace(/\{\{STYLE_NAME\}\}/g, style.name)
            .replace(/\{\{COLOR_PRIMARY\}\}/g, palette.primary)
            .replace(/\{\{COLOR_ACCENT\}\}/g, palette.accent)
            .replace(/\{\{COLOR_BACKGROUND\}\}/g, palette.background)
            .replace(/\{\{COLOR_SURFACE\}\}/g, palette.surface)
            .replace(/\{\{COLOR_TEXT\}\}/g, palette.text)
            .replace(/\{\{COLOR_TEXT_MUTED\}\}/g, palette.textMuted)
            .replace(/\{\{COLOR_BORDER\}\}/g, palette.border)
            .replace(/\{\{FONT_PRIMARY\}\}/g, style.fontPrimary)
            .replace(/\{\{FONT_HEADING\}\}/g, style.fontHeading)
            .replace(/\{\{BORDER_RADIUS\}\}/g, style.borderRadius)
            .replace(/\{\{SHADOW\}\}/g, style.shadow)
            .replace(/\{\{SHADOW_LG\}\}/g, style.shadowLg)
            .replace(/\{\{#if DARK_MODE\}\}[\s\S]*?\{\{\/if\}\}/g,
                config.features.includes('dark-mode') ? generateDarkModeCSS(palette) : '');

        return template;
    }

    // Fallback si le template n'existe pas
    return generateFallbackCSS(config, palette, style);
}

/**
 * Génère le CSS pour le mode sombre
 */
function generateDarkModeCSS(palette) {
    return `
@media (prefers-color-scheme: dark) {
    :root {
        --color-background: #0f172a;
        --color-surface: #1e293b;
        --color-text: #e2e8f0;
        --color-text-muted: #94a3b8;
        --color-border: #334155;
        --color-primary: #f1f5f9;
    }
}

[data-theme="dark"] {
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-text: #e2e8f0;
    --color-text-muted: #94a3b8;
    --color-border: #334155;
    --color-primary: #f1f5f9;
}
`;
}

/**
 * Génère un CSS minimal de fallback
 */
function generateFallbackCSS(config, palette, style) {
    return `/* Main Styles - ${config.siteName} */

:root {
    --color-primary: ${palette.primary};
    --color-accent: ${palette.accent};
    --color-background: ${palette.background};
    --color-surface: ${palette.surface};
    --color-text: ${palette.text};
    --color-text-muted: ${palette.textMuted};
    --color-border: ${palette.border};

    --font-primary: ${style.fontPrimary};
    --font-heading: ${style.fontHeading};
    --border-radius: ${style.borderRadius};
    --shadow: ${style.shadow};
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    font-family: var(--font-primary);
    color: var(--color-text);
    background: var(--color-background);
    line-height: 1.6;
}
`;
}

/**
 * Génère une page HTML
 */
function generateHTML(config, pageName, isHome, palette) {
    const pageSlug = isHome ? 'index' : slugify(pageName);
    const pageTitle = isHome ? 'Accueil' : pageName;

    // Navigation
    const navItems = config.pages.map(p => {
        const slug = p === 'Accueil' ? 'index.html' : slugify(p) + '.html';
        const isCurrent = (p === 'Accueil' && isHome) || (p === pageName);
        return `                    <li><a href="${slug}"${isCurrent ? ' aria-current="page"' : ''}>${p}</a></li>`;
    }).join('\n');

    // Contenu selon le type
    let mainContent = '';
    if (isHome) {
        mainContent = generateHomeContent(config);
    } else if (pageName.toLowerCase().includes('contact')) {
        mainContent = generateContactContent(config);
    } else if (pageName.toLowerCase().includes('propos') || pageName.toLowerCase().includes('about')) {
        mainContent = generateAboutContent(config);
    } else {
        mainContent = generateGenericContent(config, pageName);
    }

    // Features conditionnelles
    const cookieBanner = config.features.includes('cookie-banner') ? `
    <!-- Bannière Cookies RGPD -->
    <div id="cookie-banner" class="cookie-banner" role="alert" aria-live="polite" hidden>
        <p>Ce site utilise uniquement des cookies essentiels. Aucun tracking.</p>
        <button type="button" onclick="acceptCookies()" class="btn btn--small">Compris</button>
    </div>` : '';

    const backToTop = config.features.includes('back-to-top') ? `
    <!-- Bouton Retour en Haut -->
    <button id="back-to-top" class="back-to-top" aria-label="Retour en haut de page" hidden>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    </button>` : '';

    const navToggle = config.features.includes('nav-responsive') ? `
            <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Menu">
                <span class="nav-toggle__bar"></span>
                <span class="nav-toggle__bar"></span>
                <span class="nav-toggle__bar"></span>
            </button>` : '';

    const socialLinks = config.features.includes('social-links') ? `
                <div class="footer-section">
                    <h2 class="footer-heading">Suivez-nous</h2>
                    <ul class="social-links" aria-label="Réseaux sociaux">
                        <!-- REMPLACER: Ajoutez vos liens réseaux sociaux -->
                        <li><a href="#" aria-label="LinkedIn" rel="noopener noreferrer">LinkedIn</a></li>
                        <li><a href="#" aria-label="Twitter" rel="noopener noreferrer">Twitter</a></li>
                    </ul>
                </div>` : '';

    return `<!DOCTYPE html>
<html lang="${config.lang}" dir="ltr">
<head>
    <!-- Encodage et Viewport -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Essentiels -->
    <title>${pageTitle} | ${config.siteName}</title>
    <meta name="description" content="${config.description}">
    <meta name="keywords" content="${config.keywords}">
    <meta name="author" content="${config.author}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://example.com/${pageSlug}.html">

    <!-- Open Graph -->
    <meta property="og:title" content="${pageTitle} | ${config.siteName}">
    <meta property="og:description" content="${config.description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://example.com/${pageSlug}.html">
    <meta property="og:image" content="https://example.com/assets/images/og-image.jpg">
    <meta property="og:locale" content="${config.locale}">
    <meta property="og:site_name" content="${config.siteName}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle} | ${config.siteName}">
    <meta name="twitter:description" content="${config.description}">

    <!-- Favicon -->
    <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
    <meta name="theme-color" content="${palette.theme}">

    <!-- Preload -->
    <link rel="preload" href="styles/main.css" as="style">

    <!-- Styles -->
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/components.css">
    <link rel="stylesheet" href="styles/utilities.css">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "${SCHEMA_TYPES[config.siteType] || 'WebSite'}",
        "name": "${config.siteName}",
        "description": "${config.description}",
        "url": "https://example.com"${config.location ? `,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "${config.location}"
        }` : ''}
    }
    </script>
</head>
<body>
    <!-- Skip Link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
${cookieBanner}
    <!-- Header -->
    <header class="site-header" role="banner">
        <div class="container">
            <a href="index.html" class="site-logo" aria-label="${config.siteName} - Accueil">
                ${config.siteName}
            </a>
${navToggle}
            <nav id="main-nav" class="main-nav" role="navigation" aria-label="Navigation principale">
                <ul class="nav-list">
${navItems}
                </ul>
            </nav>
        </div>
    </header>

    <!-- Contenu Principal -->
    <main id="main-content" class="main-content" role="main">
${mainContent}
    </main>

    <!-- Footer -->
    <footer class="site-footer" role="contentinfo">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <p class="footer-brand">${config.siteName}</p>
                    <p class="footer-tagline">${config.description.substring(0, 100)}${config.description.length > 100 ? '...' : ''}</p>
                </div>
${socialLinks}
                <div class="footer-section">
                    <h2 class="footer-heading">Navigation</h2>
                    <ul class="footer-nav">
${config.pages.map(p => `                        <li><a href="${p === 'Accueil' ? 'index.html' : slugify(p) + '.html'}">${p}</a></li>`).join('\n')}
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; ${getCurrentYear()} ${config.siteName}. Tous droits réservés.</p>
                <p class="footer-credits">
                    <a href="humans.txt">Crédits</a>
                </p>
            </div>
        </div>
    </footer>
${backToTop}
    <!-- JavaScript -->
    <script src="scripts/main.js" defer></script>
</body>
</html>`;
}

/**
 * Génère le contenu de la page d'accueil
 */
function generateHomeContent(config) {
    const placeholder = config.contentType === 'placeholder';
    const hasGallery = config.features.includes('gallery');
    const hasTestimonials = config.features.includes('testimonials');

    return `
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <h1 class="hero__title">${placeholder ? 'Bienvenue sur ' + config.siteName : '<!-- REMPLACER: Titre principal -->'}</h1>
                <p class="hero__subtitle">${placeholder ? 'Une description accrocheuse de votre site qui capte l\'attention des visiteurs et les incite à en découvrir plus.' : '<!-- REMPLACER: Sous-titre accrocheur -->'}</p>
                <div class="flex gap-md justify-center">
                    <a href="${config.pages.some(p => p.toLowerCase().includes('contact')) ? 'contact.html' : '#'}" class="btn btn--primary">Nous contacter</a>
                    <a href="${config.pages.some(p => p.toLowerCase().includes('propos')) ? 'a-propos.html' : '#'}" class="btn btn--secondary">En savoir plus</a>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-2xl">
            <div class="container">
                <h2 class="text-center mb-xl">${placeholder ? 'Nos atouts' : '<!-- REMPLACER: Titre section -->'}</h2>
                <div class="features">
                    <div class="feature">
                        <div class="feature__icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                        </div>
                        <h3 class="feature__title">${placeholder ? 'Rapidité' : '<!-- TITRE -->'}</h3>
                        <p class="feature__description">${placeholder ? 'Des résultats rapides et efficaces pour répondre à vos besoins.' : '<!-- DESCRIPTION -->'}</p>
                    </div>
                    <div class="feature">
                        <div class="feature__icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <h3 class="feature__title">${placeholder ? 'Fiabilité' : '<!-- TITRE -->'}</h3>
                        <p class="feature__description">${placeholder ? 'Une solution fiable sur laquelle vous pouvez compter.' : '<!-- DESCRIPTION -->'}</p>
                    </div>
                    <div class="feature">
                        <div class="feature__icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3 class="feature__title">${placeholder ? 'Expertise' : '<!-- TITRE -->'}</h3>
                        <p class="feature__description">${placeholder ? 'Une équipe d\'experts à votre service.' : '<!-- DESCRIPTION -->'}</p>
                    </div>
                </div>
            </div>
        </section>
${hasTestimonials ? generateTestimonialsSection(placeholder) : ''}
${hasGallery ? generateGallerySection(placeholder) : ''}
        <!-- CTA Section -->
        <section class="py-2xl">
            <div class="container">
                <div class="cta">
                    <h2 class="cta__title">${placeholder ? 'Prêt à commencer ?' : '<!-- TITRE CTA -->'}</h2>
                    <p class="cta__description">${placeholder ? 'Contactez-nous dès aujourd\'hui pour discuter de votre projet.' : '<!-- DESCRIPTION CTA -->'}</p>
                    <a href="${config.pages.some(p => p.toLowerCase().includes('contact')) ? 'contact.html' : '#'}" class="btn btn--primary btn--large">Nous contacter</a>
                </div>
            </div>
        </section>`;
}

/**
 * Génère le contenu de la page À propos
 */
function generateAboutContent(config) {
    const placeholder = config.contentType === 'placeholder';

    return `
        <section class="py-2xl">
            <div class="container">
                <h1>${placeholder ? 'À propos de ' + config.siteName : '<!-- REMPLACER: Titre -->'}</h1>
                <div class="grid grid--2 gap-xl mt-xl">
                    <div>
                        <h2>${placeholder ? 'Notre histoire' : '<!-- TITRE -->'}</h2>
                        <p>${placeholder ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' : '<!-- VOTRE HISTOIRE -->'}</p>
                        <p>${placeholder ? 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' : ''}</p>
                    </div>
                    <div>
                        <div class="aspect-ratio aspect-ratio--4-3 rounded overflow-hidden">
                            <div class="placeholder-image">
                                <!-- REMPLACER: Ajoutez votre image ici -->
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-2xl">
                    <h2>${placeholder ? 'Nos valeurs' : '<!-- TITRE VALEURS -->'}</h2>
                    <div class="grid grid--3 gap-lg mt-lg">
                        <div class="card">
                            <h3 class="card__title">${placeholder ? 'Qualité' : '<!-- VALEUR 1 -->'}</h3>
                            <p class="card__content">${placeholder ? 'Nous nous engageons à fournir un travail de la plus haute qualité.' : '<!-- DESCRIPTION -->'}</p>
                        </div>
                        <div class="card">
                            <h3 class="card__title">${placeholder ? 'Innovation' : '<!-- VALEUR 2 -->'}</h3>
                            <p class="card__content">${placeholder ? 'Nous cherchons constamment de nouvelles façons de nous améliorer.' : '<!-- DESCRIPTION -->'}</p>
                        </div>
                        <div class="card">
                            <h3 class="card__title">${placeholder ? 'Transparence' : '<!-- VALEUR 3 -->'}</h3>
                            <p class="card__content">${placeholder ? 'Une communication claire et honnête avec nos clients.' : '<!-- DESCRIPTION -->'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
}

/**
 * Génère le contenu de la page Contact
 */
function generateContactContent(config) {
    const placeholder = config.contentType === 'placeholder';
    const hasForm = config.features.includes('contact-form');

    const formHTML = hasForm ? `
                    <form class="form form--contact" action="https://formspree.io/f/VOTRE_ID" method="POST">
                        <div class="form-group">
                            <label for="name" class="form-label form-label--required">Nom</label>
                            <input type="text" id="name" name="name" class="form-input" required>
                            <span class="form-error" hidden></span>
                        </div>
                        <div class="form-group">
                            <label for="email" class="form-label form-label--required">Email</label>
                            <input type="email" id="email" name="email" class="form-input" required>
                            <span class="form-error" hidden></span>
                        </div>
                        <div class="form-group">
                            <label for="subject" class="form-label">Sujet</label>
                            <input type="text" id="subject" name="subject" class="form-input">
                        </div>
                        <div class="form-group">
                            <label for="message" class="form-label form-label--required">Message</label>
                            <textarea id="message" name="message" class="form-textarea" required></textarea>
                            <span class="form-error" hidden></span>
                        </div>
                        <button type="submit" class="btn btn--primary btn--large btn--full">Envoyer</button>
                        <p class="form-help mt-sm">
                            <!-- REMPLACER: Adaptez l'action du formulaire (Formspree, Netlify Forms, etc.) -->
                        </p>
                    </form>` : `
                    <p>${placeholder ? 'Vous pouvez nous contacter par email ou téléphone.' : '<!-- INFORMATIONS DE CONTACT -->'}</p>
                    <ul class="mt-md">
                        <li><strong>Email:</strong> <!-- REMPLACER: votre@email.com --></li>
                        <li><strong>Téléphone:</strong> <!-- REMPLACER: +33 1 23 45 67 89 --></li>
                    </ul>`;

    return `
        <section class="py-2xl">
            <div class="container">
                <h1>${placeholder ? 'Contactez-nous' : '<!-- TITRE -->'}</h1>
                <p class="text-lg text-muted mb-xl">${placeholder ? 'Une question ? Un projet ? N\'hésitez pas à nous contacter.' : '<!-- SOUS-TITRE -->'}</p>

                <div class="grid grid--2 gap-2xl">
                    <div>
                        <h2>${placeholder ? 'Envoyez-nous un message' : '<!-- TITRE -->'}</h2>
${formHTML}
                    </div>

                    <div>
                        <h2>${placeholder ? 'Nos coordonnées' : '<!-- TITRE -->'}</h2>
                        <div class="card">
                            <h3 class="card__title">${placeholder ? 'Adresse' : '<!-- TITRE -->'}</h3>
                            <p class="card__content">
                                <!-- REMPLACER: Votre adresse --><br>
                                ${config.location || '<!-- Ville, Pays -->'}
                            </p>
                        </div>
                        <div class="card mt-lg">
                            <h3 class="card__title">${placeholder ? 'Horaires' : '<!-- TITRE -->'}</h3>
                            <p class="card__content">
                                ${placeholder ? 'Lundi - Vendredi: 9h00 - 18h00<br>Samedi - Dimanche: Fermé' : '<!-- HORAIRES -->'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
}

/**
 * Génère le contenu d'une page générique
 */
function generateGenericContent(config, pageName) {
    const placeholder = config.contentType === 'placeholder';

    return `
        <section class="py-2xl">
            <div class="container">
                <h1>${pageName}</h1>
                <p class="text-lg text-muted mb-xl">${placeholder ? 'Description de la page ' + pageName : '<!-- DESCRIPTION -->'}</p>

                <div class="mt-xl">
                    ${placeholder ? `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                    <p class="mt-md">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>` : '<!-- CONTENU DE LA PAGE -->'}
                </div>
            </div>
        </section>`;
}

/**
 * Génère la section témoignages
 */
function generateTestimonialsSection(placeholder) {
    return `
        <!-- Témoignages -->
        <section class="py-2xl bg-surface">
            <div class="container">
                <h2 class="text-center mb-xl">${placeholder ? 'Ce que disent nos clients' : '<!-- TITRE -->'}</h2>
                <div class="testimonials">
                    <div class="testimonial">
                        <p class="testimonial__content">${placeholder ? '"Un service exceptionnel ! Je recommande vivement."' : '<!-- TÉMOIGNAGE -->'}</p>
                        <div class="testimonial__author">
                            <div class="testimonial__avatar placeholder-image" style="width:48px;height:48px;border-radius:50%;">
                                <!-- REMPLACER: Photo -->
                            </div>
                            <div>
                                <p class="testimonial__name">${placeholder ? 'Marie Dupont' : '<!-- NOM -->'}</p>
                                <p class="testimonial__role">${placeholder ? 'Entrepreneuse' : '<!-- RÔLE -->'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial">
                        <p class="testimonial__content">${placeholder ? '"Professionnalisme et réactivité au rendez-vous."' : '<!-- TÉMOIGNAGE -->'}</p>
                        <div class="testimonial__author">
                            <div class="testimonial__avatar placeholder-image" style="width:48px;height:48px;border-radius:50%;">
                                <!-- REMPLACER: Photo -->
                            </div>
                            <div>
                                <p class="testimonial__name">${placeholder ? 'Jean Martin' : '<!-- NOM -->'}</p>
                                <p class="testimonial__role">${placeholder ? 'Directeur' : '<!-- RÔLE -->'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
}

/**
 * Génère la section galerie
 */
function generateGallerySection(placeholder) {
    return `
        <!-- Galerie -->
        <section class="py-2xl">
            <div class="container">
                <h2 class="text-center mb-xl">${placeholder ? 'Notre galerie' : '<!-- TITRE -->'}</h2>
                <div class="gallery">
                    <div class="gallery-item">
                        <a href="#lightbox-1">
                            <div class="aspect-ratio aspect-ratio--1-1 placeholder-image">
                                <!-- REMPLACER: Image 1 -->
                            </div>
                        </a>
                    </div>
                    <div class="gallery-item">
                        <a href="#lightbox-2">
                            <div class="aspect-ratio aspect-ratio--1-1 placeholder-image">
                                <!-- REMPLACER: Image 2 -->
                            </div>
                        </a>
                    </div>
                    <div class="gallery-item">
                        <a href="#lightbox-3">
                            <div class="aspect-ratio aspect-ratio--1-1 placeholder-image">
                                <!-- REMPLACER: Image 3 -->
                            </div>
                        </a>
                    </div>
                    <div class="gallery-item">
                        <a href="#lightbox-4">
                            <div class="aspect-ratio aspect-ratio--1-1 placeholder-image">
                                <!-- REMPLACER: Image 4 -->
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>`;
}

/**
 * Génère robots.txt
 */
function generateRobotsTxt(config) {
    return `# Robots.txt - ${config.siteName}
# Généré le ${getISODate()}

User-agent: *
Allow: /

# Sitemap
Sitemap: https://example.com/sitemap.xml

# Crawl-delay (optionnel)
# Crawl-delay: 10
`;
}

/**
 * Génère sitemap.xml
 */
function generateSitemapXml(config) {
    const urls = config.pages.map(page => {
        const slug = page === 'Accueil' ? 'index.html' : slugify(page) + '.html';
        const priority = page === 'Accueil' ? '1.0' : '0.8';
        return `    <url>
        <loc>https://example.com/${slug}</loc>
        <lastmod>${getISODate()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${priority}</priority>
    </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Génère humans.txt
 */
function generateHumansTxt(config) {
    return `/* TEAM */
Creator: ${config.author}
Site: ${config.siteName}
Location: ${config.location || 'Non spécifié'}

/* THANKS */
Optimized with: Static Site Optimizer v2.0
Generated by: Claude Code

/* SITE */
Last update: ${getISODate()}
Language: ${config.lang}
Standards: HTML5, CSS3, ES6
Software: Claude Code Skills
Doctype: HTML5
IDE: Claude Code

/* NOTE */
This site follows frugal hosting principles:
- No external dependencies
- System fonts only
- Minimal JavaScript
- GDPR compliant
`;
}

/**
 * Génère .htaccess
 */
function generateHtaccess() {
    return `# .htaccess - Configuration Apache
# Site Statique Frugal

# ============================================
# COMPRESSION
# ============================================
<IfModule mod_deflate.c>
    # Compresser les ressources texte
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE application/xml
</IfModule>

# Servir les fichiers pré-compressés si disponibles
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Brotli
    RewriteCond %{HTTP:Accept-Encoding} br
    RewriteCond %{REQUEST_FILENAME}.br -f
    RewriteRule ^(.*)$ $1.br [L]

    # Gzip
    RewriteCond %{HTTP:Accept-Encoding} gzip
    RewriteCond %{REQUEST_FILENAME}.gz -f
    RewriteRule ^(.*)$ $1.gz [L]
</IfModule>

<FilesMatch "\\.br$">
    Header set Content-Encoding br
</FilesMatch>

<FilesMatch "\\.gz$">
    Header set Content-Encoding gzip
</FilesMatch>

# ============================================
# CACHE
# ============================================
<IfModule mod_expires.c>
    ExpiresActive On

    # HTML - Cache court
    ExpiresByType text/html "access plus 1 hour"

    # CSS & JS - Cache long
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"

    # Images - Cache très long
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"

    # Fonts - Cache très long
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"

    # Favicon
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

# ============================================
# SÉCURITÉ
# ============================================
<IfModule mod_headers.c>
    # Empêcher le sniffing MIME
    Header set X-Content-Type-Options "nosniff"

    # Protection contre le clickjacking
    Header set X-Frame-Options "SAMEORIGIN"

    # Protection XSS
    Header set X-XSS-Protection "1; mode=block"

    # Referrer Policy
    Header set Referrer-Policy "strict-origin-when-cross-origin"

    # Permissions Policy (désactiver les APIs non utilisées)
    Header set Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
</IfModule>

# ============================================
# TYPES MIME
# ============================================
<IfModule mod_mime.c>
    AddType image/avif .avif
    AddType image/webp .webp
    AddType font/woff2 .woff2
    AddType application/manifest+json .webmanifest
</IfModule>

# ============================================
# ERREURS PERSONNALISÉES
# ============================================
ErrorDocument 404 /404.html
`;
}

/**
 * Génère le favicon SVG
 */
function generateFaviconSVG(config, palette) {
    const initials = config.siteName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <style>
        @media (prefers-color-scheme: dark) {
            .bg { fill: ${palette.accent}; }
            .text { fill: #ffffff; }
        }
    </style>
    <rect class="bg" width="32" height="32" rx="6" fill="${palette.primary}"/>
    <text class="text" x="16" y="22" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#ffffff">${initials}</text>
</svg>`;
}

/**
 * Génère le README du projet
 */
function generateProjectReadme(config) {
    return `# ${config.siteName}

${config.description}

## Structure du Projet

\`\`\`
${config.projectName}/
├── index.html                    # Page d'accueil
${config.pages.filter(p => p !== 'Accueil').map(p => `├── ${slugify(p)}.html${' '.repeat(Math.max(0, 25 - slugify(p).length - 5))}# ${p}`).join('\n')}
├── styles/
│   ├── main.css                  # Styles principaux
│   ├── components.css            # Composants réutilisables
│   └── utilities.css             # Classes utilitaires
├── scripts/
│   └── main.js                   # JavaScript minimal
├── assets/
│   ├── images/                   # Images du site
│   ├── icons/                    # Favicon et icônes
│   └── fonts/                    # Polices locales (si nécessaire)
├── robots.txt                    # Instructions robots
├── sitemap.xml                   # Plan du site
├── humans.txt                    # Crédits
├── .htaccess                     # Config Apache
└── README.md                     # Ce fichier
\`\`\`

## Informations

- **Style:** ${STYLES[config.style]?.name || config.style}
- **Palette:** ${config.palette}
- **Langue:** ${config.lang}
- **Pages:** ${config.pages.length}

## Démarrage

1. Personnalisez le contenu des pages HTML
2. Ajoutez vos images dans \`assets/images/\`
3. Modifiez les URLs canoniques et liens sociaux
4. Configurez le formulaire de contact (si présent)

## Optimisation

Ce site est conçu pour être optimisé avec les skills Static Site Optimizer:

\`\`\`bash
# Validation
/static-site-optimizer:validate

# Optimisation DEV
/static-site-optimizer:optimize-dev

# Package Production
/static-site-optimizer:package-prod
\`\`\`

## Principes Frugaux

Ce site respecte les principes d'hébergement frugal:
- ✅ Aucune dépendance externe (CDN, frameworks)
- ✅ Polices système uniquement
- ✅ JavaScript minimal
- ✅ RGPD compliant (pas de tracking)
- ✅ Accessible (WCAG AA)
- ✅ SEO optimisé

## Crédits

Généré avec [Static Site Optimizer](https://github.com/...) v2.0
`;
}

// ==========================================================================
// GÉNÉRATEUR PRINCIPAL
// ==========================================================================

/**
 * Génère la structure complète du site
 */
function generateSite(config) {
    const projectDir = path.resolve(config.projectName);
    const palette = PALETTES[config.palette] || PALETTES['bleu-confiance'];
    const style = STYLES[config.style] || STYLES['moderne'];

    console.log('\n🚀 Génération du site...\n');

    // Créer les répertoires
    const dirs = [
        projectDir,
        path.join(projectDir, 'styles'),
        path.join(projectDir, 'scripts'),
        path.join(projectDir, 'assets'),
        path.join(projectDir, 'assets', 'images'),
        path.join(projectDir, 'assets', 'icons'),
        path.join(projectDir, 'assets', 'fonts')
    ];

    dirs.forEach(dir => mkdirSync(dir));
    console.log('📁 Répertoires créés');

    // Générer les fichiers CSS
    const templateDir = path.join(__dirname, '../skills/static-site-optimizer/templates');

    // main.css avec variables
    fs.writeFileSync(
        path.join(projectDir, 'styles', 'main.css'),
        generateMainCSS(config, palette, style)
    );

    // components.css
    const componentsPath = path.join(templateDir, 'styles', 'components.css');
    if (fs.existsSync(componentsPath)) {
        fs.copyFileSync(componentsPath, path.join(projectDir, 'styles', 'components.css'));
    }

    // utilities.css
    const utilitiesPath = path.join(templateDir, 'styles', 'utilities.css');
    if (fs.existsSync(utilitiesPath)) {
        fs.copyFileSync(utilitiesPath, path.join(projectDir, 'styles', 'utilities.css'));
    }

    console.log('🎨 Fichiers CSS créés');

    // Générer main.js
    const mainJsPath = path.join(templateDir, 'scripts', 'main.js');
    if (fs.existsSync(mainJsPath)) {
        fs.copyFileSync(mainJsPath, path.join(projectDir, 'scripts', 'main.js'));
    }
    console.log('📜 JavaScript créé');

    // Générer les pages HTML
    config.pages.forEach((page, index) => {
        const isHome = page === 'Accueil' || index === 0;
        const filename = isHome ? 'index.html' : slugify(page) + '.html';
        fs.writeFileSync(
            path.join(projectDir, filename),
            generateHTML(config, page, isHome, palette)
        );
    });
    console.log(`📄 ${config.pages.length} pages HTML créées`);

    // Fichiers SEO et techniques
    fs.writeFileSync(path.join(projectDir, 'robots.txt'), generateRobotsTxt(config));
    fs.writeFileSync(path.join(projectDir, 'sitemap.xml'), generateSitemapXml(config));
    fs.writeFileSync(path.join(projectDir, 'humans.txt'), generateHumansTxt(config));
    fs.writeFileSync(path.join(projectDir, '.htaccess'), generateHtaccess());
    console.log('🔧 Fichiers SEO/techniques créés');

    // Favicon SVG
    fs.writeFileSync(
        path.join(projectDir, 'assets', 'icons', 'favicon.svg'),
        generateFaviconSVG(config, palette)
    );
    console.log('🎭 Favicon SVG créé');

    // .gitkeep pour répertoires vides
    fs.writeFileSync(path.join(projectDir, 'assets', 'images', '.gitkeep'), '');
    fs.writeFileSync(path.join(projectDir, 'assets', 'fonts', '.gitkeep'), '');

    // README du projet
    fs.writeFileSync(path.join(projectDir, 'README.md'), generateProjectReadme(config));
    console.log('📚 README créé');

    // Rapport final
    console.log('\n' + '═'.repeat(60));
    console.log('                  🎉 SITE GÉNÉRÉ AVEC SUCCÈS');
    console.log('═'.repeat(60));
    console.log(`\n📁 Projet: ${projectDir}`);
    console.log(`🎨 Style: ${style.name}`);
    console.log(`🎨 Palette: ${config.palette}`);
    console.log(`📄 Pages: ${config.pages.join(', ')}`);
    console.log(`⚙️  Features: ${config.features.join(', ') || 'Aucune'}`);
    console.log('\n✅ Prochaines étapes:');
    console.log('   1. Personnaliser le contenu (remplacer les placeholders)');
    console.log('   2. Ajouter vos images dans assets/images/');
    console.log('   3. Valider: /static-site-optimizer:validate');
    console.log('   4. Optimiser: /static-site-optimizer:optimize-dev');
    console.log('   5. Packager: /static-site-optimizer:package-prod');
    console.log('\n' + '═'.repeat(60) + '\n');

    return projectDir;
}

// ==========================================================================
// EXPORT & CLI
// ==========================================================================

// Si exécuté directement
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Site Generator - Générateur de Site Statique Frugal

Usage:
  node site-generator.js --config config.json
  node site-generator.js --name "Mon Site" --style moderne --palette bleu-confiance

Options:
  --config <file>     Fichier de configuration JSON
  --name <name>       Nom du site
  --style <style>     Style visuel (moderne, retro, minimaliste, brutaliste, organique, artistique, corporate, terminal)
  --palette <palette> Palette de couleurs (bleu-confiance, vert-nature, violet-creatif, orange-energie, monochrome)
  --pages <pages>     Pages séparées par des virgules
  --help, -h          Afficher cette aide
        `);
        process.exit(0);
    }

    // Configuration depuis arguments
    const config = { ...DEFAULT_CONFIG };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--config' && args[i + 1]) {
            const configFile = JSON.parse(fs.readFileSync(args[i + 1], 'utf8'));
            Object.assign(config, configFile);
            i++;
        } else if (args[i] === '--name' && args[i + 1]) {
            config.siteName = args[i + 1];
            config.projectName = slugify(args[i + 1]);
            i++;
        } else if (args[i] === '--style' && args[i + 1]) {
            config.style = args[i + 1];
            i++;
        } else if (args[i] === '--palette' && args[i + 1]) {
            config.palette = args[i + 1];
            i++;
        } else if (args[i] === '--pages' && args[i + 1]) {
            config.pages = args[i + 1].split(',').map(p => p.trim());
            i++;
        }
    }

    generateSite(config);
}

module.exports = {
    generateSite,
    PALETTES,
    STYLES,
    DEFAULT_CONFIG,
    slugify
};
