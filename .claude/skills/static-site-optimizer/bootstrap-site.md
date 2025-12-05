# Skill: Bootstrap Site - Créateur de Site Statique Frugal

## Description

Ce skill permet de créer un site web statique from scratch, optimisé pour l'hébergement frugal, le SEO, et la maintenabilité. Il guide l'utilisateur à travers une série de questions pour personnaliser le site selon ses besoins.

**Synergie avec les autres skills:**
- Le site généré est directement compatible avec `optimize-dev` pour validation
- Prêt pour `package-prod` pour mise en production
- Structure optimisée pour tous les modules d'optimisation existants

---

## Instructions

### PHASE 1: Questionnaire Interactif

Pose les questions suivantes à l'utilisateur **UNE PAR UNE** et attends sa réponse avant de continuer:

#### Question 1: Nom du Projet
```
🏷️ QUESTION 1/8: Nom du Projet

Quel est le nom de votre site/projet?
Ce nom sera utilisé pour:
- Le titre des pages
- Le dossier du projet
- Les métadonnées SEO

Exemple: "Mon Portfolio", "Boulangerie Dupont", "Association Nature"
```

#### Question 2: Type de Site
```
🎯 QUESTION 2/8: Type de Site

Quel type de site souhaitez-vous créer?

1. 🖼️  Portfolio / CV - Présentation personnelle ou professionnelle
2. 🏪 Vitrine - Présentation d'une entreprise/association
3. 📝 Blog - Articles et publications
4. 📄 Landing Page - Page unique promotionnelle
5. 📚 Documentation - Documentation technique ou guide
6. 🎨 Galerie - Présentation visuelle (photos, art)
7. 🛠️ Personnalisé - Définir manuellement

Répondez par le numéro (1-7):
```

#### Question 3: Style Visuel
```
🎨 QUESTION 3/8: Style Visuel

Quel style visuel souhaitez-vous pour votre site?

1. 🌟 Moderne - Clean, épuré, typographie sans-serif, couleurs vives
2. 📜 Rétro/Vintage - Couleurs sépia, typographie serif, textures papier
3. ⬜ Minimaliste - Blanc/noir dominant, espace négatif, ultra-simple
4. 🔲 Brutaliste - Brut, contrasté, typographie bold, anti-design assumé
5. 🌿 Organique/Nature - Tons verts/terreux, formes douces, naturel
6. 🎭 Artistique - Créatif, asymétrique, typographie expressive
7. 💼 Corporate - Professionnel, structuré, confiance, sérieux
8. 🖥️ Terminal/Hacker - Monospace, fond sombre, style code

Répondez par le numéro (1-8):
```

#### Question 4: Palette de Couleurs
```
🎨 QUESTION 4/8: Palette de Couleurs

Souhaitez-vous une palette prédéfinie ou personnalisée?

1. 🔵 Bleu Confiance - #1a365d, #3182ce, #e2e8f0
2. 🟢 Vert Nature - #1a4731, #38a169, #f0fff4
3. 🟣 Violet Créatif - #44337a, #805ad5, #faf5ff
4. 🟠 Orange Énergie - #7c2d12, #ed8936, #fffaf0
5. ⚫ Monochrome - #000000, #4a5568, #f7fafc
6. 🌈 Personnalisée - Définir vos propres couleurs

Répondez par le numéro (1-6):
```

*Si option 6 choisie, demander:*
```
Entrez vos couleurs au format hexadécimal:
- Couleur primaire (ex: #1a365d):
- Couleur accent (ex: #3182ce):
- Couleur fond (ex: #ffffff):
```

#### Question 5: Pages du Site
```
📄 QUESTION 5/8: Structure des Pages

Quelles pages souhaitez-vous créer?

Option rapide (configurations pré-définies):
1. Page unique (landing page)
2. Standard 3 pages (Accueil, À propos, Contact)
3. Standard 5 pages (Accueil, À propos, Services, Portfolio, Contact)
4. Blog (Accueil, Articles, À propos, Contact)
5. Personnalisé (définir manuellement)

Répondez par le numéro (1-5):
```

*Si option 5 choisie, demander:*
```
Listez vos pages (séparées par des virgules):
Exemple: Accueil, Nos Services, L'équipe, Réalisations, Contact
```

#### Question 6: Fonctionnalités
```
⚙️ QUESTION 6/8: Fonctionnalités

Quelles fonctionnalités souhaitez-vous inclure? (plusieurs choix possibles)

1. 📱 Navigation responsive (menu hamburger mobile)
2. 🌙 Mode sombre (switch light/dark)
3. 📬 Formulaire de contact (statique, compatible Formspree/Netlify)
4. 🔗 Liens réseaux sociaux
5. 🍪 Bannière cookies minimaliste (RGPD)
6. ⬆️ Bouton retour en haut
7. 🖼️ Galerie images lightbox (CSS pure)
8. 📊 Section témoignages/avis

Répondez avec les numéros séparés par des virgules (ex: 1,3,4):
Ou tapez "aucune" pour un site ultra-minimaliste:
```

#### Question 7: Contenu Initial
```
📝 QUESTION 7/8: Contenu Initial

Souhaitez-vous que je génère du contenu placeholder?

1. ✅ Oui - Textes Lorem Ipsum structurés et images placeholder
2. 📋 Semi-rempli - Structure avec commentaires <!-- REMPLACER -->
3. ❌ Vide - Structure HTML uniquement, sans contenu

Répondez par le numéro (1-3):
```

#### Question 8: Informations SEO
```
🔍 QUESTION 8/8: Informations SEO et Contact

Pour optimiser le référencement, j'ai besoin de quelques informations:

1. Description courte du site (160 caractères max):
   Exemple: "Boulangerie artisanale à Lyon, pains bio et viennoiseries maison depuis 1985"

2. Mots-clés principaux (5-10 mots, séparés par virgules):
   Exemple: "boulangerie, lyon, pain bio, artisan, viennoiseries"

3. Langue du site:
   - fr (Français)
   - en (English)
   - Autre (préciser)

4. Localisation (optionnel, pour SEO local):
   Exemple: "Lyon, France" ou laisser vide
```

---

### PHASE 2: Génération de la Structure

Après avoir collecté toutes les réponses, générer la structure suivante:

```
{nom-projet}/
├── index.html                    # Page d'accueil
├── [autres-pages].html           # Pages additionnelles
├── styles/
│   ├── main.css                  # Styles principaux
│   ├── components.css            # Composants réutilisables
│   └── utilities.css             # Classes utilitaires
├── scripts/
│   └── main.js                   # JavaScript minimal (si nécessaire)
├── assets/
│   ├── images/
│   │   └── .gitkeep
│   ├── icons/
│   │   └── favicon.svg           # Favicon SVG généré
│   └── fonts/
│       └── .gitkeep
├── robots.txt                    # Instructions moteurs de recherche
├── sitemap.xml                   # Plan du site
├── humans.txt                    # Crédits humains
├── .htaccess                     # Config Apache (optionnel)
└── README.md                     # Documentation du projet
```

---

### PHASE 3: Génération du Code

#### 3.1 Template HTML de Base

Chaque page HTML DOIT respecter cette structure SEO-optimisée:

```html
<!DOCTYPE html>
<html lang="{LANGUE}" dir="ltr">
<head>
    <!-- Encodage et Viewport -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Essentiels -->
    <title>{TITRE_PAGE} | {NOM_SITE}</title>
    <meta name="description" content="{DESCRIPTION_PAGE}">
    <meta name="keywords" content="{MOTS_CLES}">
    <meta name="author" content="{AUTEUR}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph (Réseaux Sociaux) -->
    <meta property="og:title" content="{TITRE_PAGE}">
    <meta property="og:description" content="{DESCRIPTION_PAGE}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{URL_PAGE}">
    <meta property="og:image" content="{URL_IMAGE_OG}">
    <meta property="og:locale" content="{LOCALE}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{TITRE_PAGE}">
    <meta name="twitter:description" content="{DESCRIPTION_PAGE}">

    <!-- Favicon Multi-format -->
    <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">

    <!-- Preload Ressources Critiques -->
    <link rel="preload" href="styles/main.css" as="style">

    <!-- Styles -->
    <link rel="stylesheet" href="styles/main.css">

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "{TYPE_SCHEMA}",
        "name": "{NOM_SITE}",
        "description": "{DESCRIPTION}",
        "url": "{URL_SITE}"
    }
    </script>
</head>
<body>
    <!-- Skip Link Accessibilité -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- Header -->
    <header role="banner">
        <nav role="navigation" aria-label="Navigation principale">
            <!-- Navigation générée selon les pages choisies -->
        </nav>
    </header>

    <!-- Contenu Principal -->
    <main id="main-content" role="main">
        <!-- Contenu de la page -->
    </main>

    <!-- Footer -->
    <footer role="contentinfo">
        <!-- Pied de page -->
    </footer>

    <!-- JavaScript (chargé en différé) -->
    <script src="scripts/main.js" defer></script>
</body>
</html>
```

#### 3.2 Styles CSS selon le Style Choisi

**IMPORTANT:** Le CSS généré doit être:
- 100% sans framework externe
- Utilisant CSS custom properties (variables)
- Mobile-first responsive
- Supportant prefers-reduced-motion
- Supportant prefers-color-scheme (si mode sombre activé)

**Styles Prédéfinis:**

##### Style 1: Moderne
```css
:root {
    --font-primary: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-heading: var(--font-primary);
    --border-radius: 0.5rem;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --transition: 0.2s ease;
}
```

##### Style 2: Rétro/Vintage
```css
:root {
    --font-primary: Georgia, 'Times New Roman', serif;
    --font-heading: 'Palatino Linotype', 'Book Antiqua', serif;
    --border-radius: 0;
    --shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    --texture: url('data:image/svg+xml,...'); /* Texture papier légère */
}
```

##### Style 3: Minimaliste
```css
:root {
    --font-primary: -apple-system, BlinkMacSystemFont, sans-serif;
    --font-heading: var(--font-primary);
    --border-radius: 0;
    --shadow: none;
    --spacing-unit: 2rem;
}
/* Aucune décoration, focus sur le contenu */
```

##### Style 4: Brutaliste
```css
:root {
    --font-primary: 'Courier New', monospace;
    --font-heading: Impact, Haettenschweiler, sans-serif;
    --border-radius: 0;
    --border: 3px solid currentColor;
    --shadow: 5px 5px 0 #000;
}
```

##### Style 5: Organique/Nature
```css
:root {
    --font-primary: 'Segoe UI', Tahoma, Geneva, sans-serif;
    --font-heading: Georgia, serif;
    --border-radius: 1rem;
    --shadow: 0 10px 30px rgba(26, 71, 49, 0.1);
}
```

##### Style 6: Artistique
```css
:root {
    --font-primary: 'Trebuchet MS', Helvetica, sans-serif;
    --font-heading: 'Lucida Handwriting', cursive, serif;
    --border-radius: 0.75rem;
    --shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
```

##### Style 7: Corporate
```css
:root {
    --font-primary: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    --font-heading: var(--font-primary);
    --border-radius: 0.25rem;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
```

##### Style 8: Terminal/Hacker
```css
:root {
    --font-primary: 'Fira Code', 'Consolas', 'Monaco', monospace;
    --font-heading: var(--font-primary);
    --color-bg: #0d1117;
    --color-text: #00ff00;
    --color-accent: #00d4ff;
    --border-radius: 0;
    --shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}
```

---

### PHASE 4: Fichiers SEO et Techniques

#### 4.1 robots.txt
```
User-agent: *
Allow: /

Sitemap: {URL_SITE}/sitemap.xml
```

#### 4.2 sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Générer une entrée pour chaque page -->
    <url>
        <loc>{URL_PAGE}</loc>
        <lastmod>{DATE_MODIFICATION}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>{PRIORITE}</priority>
    </url>
</urlset>
```

#### 4.3 humans.txt
```
/* TEAM */
Creator: {AUTEUR}
Site: {URL_SITE}
Location: {LOCALISATION}

/* THANKS */
Optimized with: Static Site Optimizer v2.0

/* SITE */
Last update: {DATE}
Language: {LANGUE}
Standards: HTML5, CSS3
Software: Claude Code
```

#### 4.4 .htaccess (Apache)
```apache
# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

### PHASE 5: Rapport de Génération

À la fin de la génération, afficher ce rapport:

```
╔══════════════════════════════════════════════════════════════╗
║                  🚀 SITE GÉNÉRÉ AVEC SUCCÈS                  ║
╠══════════════════════════════════════════════════════════════╣
║ Projet: {NOM_PROJET}                                         ║
║ Style: {STYLE_CHOISI}                                        ║
║ Pages: {NOMBRE_PAGES}                                        ║
╠══════════════════════════════════════════════════════════════╣
║ 📁 STRUCTURE CRÉÉE:                                          ║
║    ├── {NOMBRE} fichiers HTML                                ║
║    ├── 3 fichiers CSS                                        ║
║    ├── 1 fichier JS (minimal)                                ║
║    ├── SEO: robots.txt, sitemap.xml, humans.txt              ║
║    └── Config: .htaccess                                     ║
╠══════════════════════════════════════════════════════════════╣
║ ✅ CONFORMITÉ:                                               ║
║    • HTML5 sémantique                                        ║
║    • Accessibilité WCAG AA                                   ║
║    • SEO optimisé (meta, OG, Schema.org)                     ║
║    • Mobile-first responsive                                 ║
║    • Hébergement frugal (0 dépendance externe)               ║
║    • RGPD compliant (pas de tracking)                        ║
╠══════════════════════════════════════════════════════════════╣
║ 🔧 PROCHAINES ÉTAPES:                                        ║
║                                                              ║
║ 1. Personnaliser le contenu (remplacer les placeholders)     ║
║ 2. Ajouter vos images dans assets/images/                    ║
║ 3. Valider avec: static-site-optimizer:validate              ║
║ 4. Optimiser DEV: static-site-optimizer:optimize-dev         ║
║ 5. Packager PROD: static-site-optimizer:package-prod         ║
╠══════════════════════════════════════════════════════════════╣
║ 📊 POIDS ESTIMÉ:                                             ║
║    HTML total: ~{X} KB                                       ║
║    CSS total: ~{Y} KB                                        ║
║    JS total: ~{Z} KB                                         ║
║    ─────────────────                                         ║
║    TOTAL: ~{TOTAL} KB (avant optimisation)                   ║
║                                                              ║
║ 💡 Après package-prod: estimation ~{OPTIMISE} KB (-{%}%)     ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Principes d'Hébergement Frugal

Le site généré respecte ces principes:

### 1. Zéro Dépendance Externe
- ❌ Pas de CDN (jQuery, Bootstrap, etc.)
- ❌ Pas de Google Fonts (polices système uniquement)
- ❌ Pas de tracking/analytics par défaut
- ❌ Pas d'iframes externes
- ✅ Tout est self-hosted

### 2. JavaScript Minimal
- JavaScript uniquement si fonctionnalité le requiert
- Pas de framework (React, Vue, etc.)
- Vanilla JS optimisé
- Chargement différé (defer)

### 3. CSS Optimisé
- Variables CSS natives (pas de Sass en runtime)
- Mobile-first (moins de CSS à charger sur mobile)
- Pas d'animations lourdes
- Support prefers-reduced-motion

### 4. Images Responsables
- Placeholders SVG légers
- Structure prête pour AVIF/WebP
- Lazy loading natif préparé
- Dimensions explicites (évite CLS)

### 5. HTML Sémantique
- Structure logique (header, main, footer, nav)
- Headings hiérarchiques (h1 > h2 > h3)
- Landmarks ARIA
- Skip links accessibilité

---

## Synergie avec les Skills Existants

Le site généré est **immédiatement compatible** avec:

| Skill | Action après bootstrap |
|-------|----------------------|
| `validate` | Valider HTML/CSS/JS du site généré |
| `optimize-dev` | Optimiser en gardant le code lisible |
| `gdpr-responsive` | Vérifier conformité RGPD (déjà OK) |
| `optimize-images` | Optimiser les images ajoutées |
| `minify` | Minifier pour production |
| `compress` | Pré-compresser en Brotli/Gzip |
| `package-prod` | Packager pour déploiement final |
| `pagespeed` | Auditer les performances |

---

## Exemples d'Utilisation

### Exemple 1: Portfolio Minimaliste
```
Réponses:
1. "Jean Dupont Portfolio"
2. 1 (Portfolio)
3. 3 (Minimaliste)
4. 5 (Monochrome)
5. 3 (5 pages standard)
6. 1,4 (Navigation + Réseaux sociaux)
7. 2 (Semi-rempli)
8. "Développeur web freelance à Paris...", "développeur, web, freelance, paris", "fr", "Paris, France"
```

### Exemple 2: Site Vitrine Entreprise
```
Réponses:
1. "Boulangerie Martin"
2. 2 (Vitrine)
3. 5 (Organique/Nature)
4. 3 (Vert Nature)
5. 4 (Personnalisé: Accueil, Nos Pains, L'Équipe, Contact)
6. 1,3,4,5 (Nav + Formulaire + Réseaux + Cookies)
7. 1 (Lorem Ipsum)
8. "Boulangerie artisanale bio...", "boulangerie, bio, pain, artisan", "fr", "Lyon, France"
```

---

## Notes Techniques

### Polices Système Utilisées
Le site utilise exclusivement des polices système pour éviter tout chargement externe:

```css
/* Sans-serif moderne */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

/* Serif classique */
font-family: Georgia, 'Times New Roman', Times, serif;

/* Monospace */
font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
```

### Performance Cible (avant optimisation)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2s
- Total Blocking Time: < 100ms
- Cumulative Layout Shift: 0

### Poids Cible
- HTML par page: 5-15 KB
- CSS total: 10-20 KB
- JS total: 0-5 KB
- **Total sans images: < 50 KB**
