# Skill: Bootstrap Site - Créateur de Site Statique Frugal

## Description

Ce skill permet de créer un site web statique optimisé pour l'hébergement frugal, le SEO, et la maintenabilité. Deux modes sont disponibles:

1. **From Scratch**: Création guidée via questionnaire interactif
2. **Clone Design**: Analyse d'un site existant pour reproduire son style avec du code propre

**Synergie avec les autres skills:**
- Le site généré est directement compatible avec `optimize-dev` pour validation
- Prêt pour `package-prod` pour mise en production
- Structure optimisée pour tous les modules d'optimisation existants

---

## Instructions

### PHASE 0: Choix du Mode de Création

Commence par demander à l'utilisateur quel mode il souhaite utiliser:

```
🚀 BOOTSTRAP SITE - Créateur de Site Statique Frugal

Comment souhaitez-vous créer votre site?

1. 🆕 FROM SCRATCH - Création guidée avec questionnaire
   → Je vous pose 8 questions pour personnaliser votre site

2. 🎨 CLONE DESIGN - Reproduire le style d'un site existant
   → Donnez-moi une URL, j'analyse le design et le reproduis
   → Code propre, bonnes pratiques, zéro copie de code source

Répondez par le numéro (1 ou 2):
```

**Si l'utilisateur choisit 1 (FROM SCRATCH):** Passer directement à la PHASE 1.

**Si l'utilisateur choisit 2 (CLONE DESIGN):** Passer à la PHASE 0-B (Analyse de Design).

---

### PHASE 0-B: Clone Design - Analyse de Site Existant

#### Étape 1: Demander l'URL

```
🔗 CLONE DESIGN - Étape 1/3: URL du Site Source

Entrez l'URL du site dont vous souhaitez reproduire le design:

Exemple: https://example.com

Note: Je vais analyser uniquement les éléments visuels (couleurs, typographie,
mise en page). Le contenu et le code ne seront PAS copiés.
```

#### Étape 2: Analyser le Site Source

**UTILISER WebFetch** pour récupérer et analyser la page avec ce prompt:

```
Analyse cette page web et extrais les informations de design suivantes en format structuré:

1. PALETTE DE COULEURS:
   - Couleur de fond principale (background)
   - Couleur de texte principale
   - Couleur d'accent/primaire (boutons, liens)
   - Couleur secondaire (si présente)
   - Couleurs additionnelles notables

2. TYPOGRAPHIE:
   - Police des titres (ou famille générique: serif, sans-serif, monospace)
   - Police du corps de texte
   - Tailles relatives (grands titres? texte compact?)
   - Style général (léger, bold, mixte)

3. MISE EN PAGE:
   - Type de layout (centré, full-width, sidebar, grid)
   - Largeur maximale du contenu (étroit ~800px, medium ~1200px, large)
   - Style de navigation (horizontale, hamburger, sidebar)
   - Présence de hero section

4. ÉLÉMENTS DE STYLE:
   - Border-radius (aucun, léger, arrondi, très arrondi)
   - Ombres (aucune, subtile, prononcée)
   - Espacement général (compact, aéré, très espacé)
   - Animations/transitions visibles

5. AMBIANCE GÉNÉRALE:
   - Style dominant (moderne, minimaliste, corporate, créatif, rétro, brutaliste)
   - Ton visuel (professionnel, décontracté, luxueux, technique)

Format de réponse souhaité:
```json
{
  "colors": {
    "background": "#ffffff",
    "text": "#333333",
    "primary": "#0066cc",
    "secondary": "#f5f5f5",
    "accent": "#ff6600"
  },
  "typography": {
    "headings": "sans-serif",
    "body": "sans-serif",
    "style": "modern-clean"
  },
  "layout": {
    "type": "centered",
    "maxWidth": "1200px",
    "navigation": "horizontal-sticky"
  },
  "style": {
    "borderRadius": "medium",
    "shadows": "subtle",
    "spacing": "comfortable"
  },
  "mood": {
    "category": "moderne",
    "tone": "professionnel"
  }
}
```
```

#### Étape 3: Présenter l'Analyse et Confirmer

Après l'analyse, présenter les résultats à l'utilisateur:

```
🎨 CLONE DESIGN - Étape 2/3: Analyse Terminée

J'ai analysé le design de {URL}. Voici ce que j'ai identifié:

╔══════════════════════════════════════════════════════════════╗
║ 🎨 PALETTE DE COULEURS                                       ║
╠══════════════════════════════════════════════════════════════╣
║ Fond:      {COULEUR_FOND}     ████                          ║
║ Texte:     {COULEUR_TEXTE}    ████                          ║
║ Primaire:  {COULEUR_PRIMAIRE} ████                          ║
║ Accent:    {COULEUR_ACCENT}   ████                          ║
╠══════════════════════════════════════════════════════════════╣
║ 📝 TYPOGRAPHIE                                               ║
╠══════════════════════════════════════════════════════════════╣
║ Titres: {POLICE_TITRES}                                      ║
║ Corps:  {POLICE_CORPS}                                       ║
║ Style:  {STYLE_TYPO}                                         ║
╠══════════════════════════════════════════════════════════════╣
║ 📐 MISE EN PAGE                                              ║
╠══════════════════════════════════════════════════════════════╣
║ Layout:     {TYPE_LAYOUT}                                    ║
║ Navigation: {STYLE_NAV}                                      ║
║ Ambiance:   {STYLE_GENERAL} / {TON}                         ║
╚══════════════════════════════════════════════════════════════╝

Souhaitez-vous:
1. ✅ Valider et continuer avec ces paramètres
2. 🔧 Modifier certains éléments (couleurs, style...)
3. 🔄 Analyser une autre URL

Répondez par le numéro (1-3):
```

**Si modifications demandées**, permettre à l'utilisateur de:
- Changer les couleurs individuellement
- Ajuster le style (plus minimaliste, plus corporate, etc.)
- Modifier le type de navigation

#### Étape 4: Questions Complémentaires

Après validation du design cloné, poser uniquement les questions nécessaires:

```
📋 CLONE DESIGN - Étape 3/3: Informations Complémentaires

Le design est validé! J'ai encore besoin de quelques informations:

1. 🏷️ Nom du projet:

2. 📄 Pages à créer (séparées par virgules):
   Exemple: Accueil, À propos, Services, Contact

3. ⚙️ Fonctionnalités (numéros séparés par virgules):
   1. 📱 Navigation responsive
   2. 🌙 Mode sombre
   3. 📬 Formulaire de contact
   4. 🔗 Liens réseaux sociaux
   5. 🍪 Bannière cookies
   6. ⬆️ Bouton retour en haut

4. 🔍 Description SEO (160 caractères):

5. 🌐 Langue: fr / en / autre
```

Ensuite, passer directement à la **PHASE 2** (Génération de la Structure) en utilisant:
- Les couleurs et styles extraits du site analysé
- Les informations complémentaires fournies par l'utilisateur

---

### PHASE 1: Questionnaire Interactif (Mode FROM SCRATCH)

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

##### Style 9: Clone Design (Généré dynamiquement)

Quand le mode **Clone Design** est utilisé, générer les variables CSS à partir des données extraites:

```css
/* Variables générées à partir de l'analyse du site source */
:root {
    /* Couleurs extraites */
    --color-bg: {colors.background};
    --color-text: {colors.text};
    --color-primary: {colors.primary};
    --color-secondary: {colors.secondary};
    --color-accent: {colors.accent};

    /* Typographie - Mapper vers polices système équivalentes */
    --font-primary: {MAPPED_BODY_FONT};
    --font-heading: {MAPPED_HEADING_FONT};

    /* Style visuel extrait */
    --border-radius: {MAPPED_BORDER_RADIUS};
    --shadow: {MAPPED_SHADOW};
    --spacing-unit: {MAPPED_SPACING};
    --transition: 0.2s ease;

    /* Largeur du contenu */
    --max-width: {layout.maxWidth};
}
```

**Mapping des polices vers équivalents système:**

| Police détectée | Équivalent système (frugal) |
|-----------------|----------------------------|
| Inter, Helvetica, Arial | `system-ui, -apple-system, BlinkMacSystemFont, sans-serif` |
| Roboto, Open Sans | `'Segoe UI', Roboto, sans-serif` |
| Playfair, Merriweather | `Georgia, 'Times New Roman', serif` |
| Lora, Libre Baskerville | `'Palatino Linotype', Georgia, serif` |
| Fira Code, Source Code | `'Fira Code', Consolas, Monaco, monospace` |
| Montserrat, Poppins | `system-ui, 'Segoe UI', sans-serif` |
| Cursive/Handwriting | `'Lucida Handwriting', cursive, serif` |

**Mapping du border-radius:**

| Valeur détectée | Variable CSS |
|-----------------|--------------|
| none / 0 | `0` |
| léger (2-4px) | `0.25rem` |
| medium (6-10px) | `0.5rem` |
| arrondi (12-20px) | `1rem` |
| très arrondi (>20px) | `1.5rem` |
| pill/full | `9999px` |

**Mapping des ombres:**

| Style détecté | Variable CSS |
|---------------|--------------|
| aucune | `none` |
| subtile | `0 1px 3px rgba(0,0,0,0.1)` |
| medium | `0 4px 6px -1px rgba(0,0,0,0.1)` |
| prononcée | `0 10px 25px rgba(0,0,0,0.15)` |
| brutale | `5px 5px 0 {color-text}` |

**Mapping de l'espacement:**

| Densité détectée | Variable CSS |
|------------------|--------------|
| compact | `1rem` |
| comfortable | `1.5rem` |
| aéré | `2rem` |
| très espacé | `3rem` |

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
║    └── SEO: robots.txt, sitemap.xml, humans.txt              ║
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

### Exemple 3: Clone Design - Reproduire le Style d'un Site

```
Étape 0: Mode de création
→ 2 (Clone Design)

Étape 1: URL du site source
→ https://stripe.com

Étape 2: Analyse (automatique via WebFetch)
→ Résultat:
   Couleurs: #0a2540 (fond sombre), #ffffff (texte), #635bff (accent violet)
   Typo: Sans-serif moderne (Inter → system-ui)
   Layout: Centré, max-width 1200px, navigation sticky
   Style: Border-radius medium, ombres subtiles, espacement aéré
   Ambiance: Moderne / Professionnel-Tech

Étape 3: Validation
→ 1 (Valider ces paramètres)

Étape 4: Informations complémentaires
→ Nom: "Mon SaaS"
→ Pages: Accueil, Fonctionnalités, Tarifs, Contact
→ Fonctionnalités: 1,2,3,4 (Nav + Dark mode + Formulaire + Réseaux)
→ Description: "Solution SaaS innovante pour..."
→ Langue: fr
```

**Résultat:** Un site avec le même style épuré de Stripe, mais:
- Code 100% original et propre
- Zéro dépendance externe
- Polices système (pas de Google Fonts)
- Contenu personnalisé

### Exemple 4: Clone Design avec Modifications

```
Étape 0: Mode de création
→ 2 (Clone Design)

Étape 1: URL
→ https://notion.so

Étape 2: Analyse automatique
→ Résultat: Minimaliste, noir/blanc, sans-serif, très espacé

Étape 3: Validation
→ 2 (Modifier certains éléments)
→ "Je voudrais garder le style minimaliste mais avec une touche de bleu #2563eb comme accent"

Étape 4: Informations complémentaires
→ Nom: "Mon Wiki Personnel"
→ Pages: Accueil, Notes, Projets, À propos
→ Fonctionnalités: 1,2,6 (Nav + Dark mode + Retour haut)
→ Description: "Wiki personnel pour organiser mes notes..."
→ Langue: fr
```

**Résultat:** Style Notion adapté avec la couleur accent personnalisée.

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
