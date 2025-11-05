# Static Site Optimizer - Claude Code Skills

Système complet de skills Claude pour optimiser des sites web statiques et atteindre des scores de performance proches de 100% sur Google PageSpeed Insights.

## ⚠️ RGPD/GDPR - PRIORITÉ ABSOLUE

**Ce système garantit une conformité totale avec le RGPD/GDPR :**

- ✅ **Remplacement automatique de Google Fonts par Bunny Fonts** (https://fonts.bunny.net/)
  - Bunny Fonts est 100% compatible RGPD/GDPR
  - Aucun tracking d'IP, hébergé en Europe
  - API identique à Google Fonts (remplacement transparent)
- ✅ **Auto-hébergement des ressources externes**
  - Téléchargement et hébergement local des bibliothèques JS/CSS
  - Minimisation des requêtes vers des domaines tiers
- ✅ **Détection et signalement des scripts de tracking**
  - Google Analytics, Facebook Pixel, etc.
  - Recommandation d'implémentation de bannière de consentement
- ✅ **Design 100% responsive**
  - Tests sur tous les formats d'écran
  - Meta viewport et media queries

**Important** : Ce système ne permettra JAMAIS l'utilisation de Google Fonts directement. Tout sera automatiquement converti vers Bunny Fonts.

## 🎯 Objectifs

- **🔒 RGPD/GDPR Compliance**: Conformité totale aux réglementations (PRIORITÉ #1)
- **📱 Responsive Design**: Adaptation parfaite à tous les appareils
- **⚡ Performance**: Scores PageSpeed Insights de 95-100
- **💾 Bande passante**: Réduction maximale des tailles de fichiers
- **🔍 SEO**: Optimisation complète pour les moteurs de recherche
- **♿ Accessibilité**: Conformité WCAG 2.1 AA

## 📦 Fonctionnalités

### 🔒 RGPD/GDPR Compliance (NOUVEAU)
- Remplacement automatique Google Fonts → Bunny Fonts
- Auto-hébergement des ressources externes
- Détection et signalement des scripts de tracking
- Minimisation des dépendances externes
- Rapport de conformité RGPD

### 📱 Responsive Design (NOUVEAU)
- Vérification viewport meta tags
- Audit des media queries
- Tests multi-dispositifs
- Images flexibles et containers adaptables

### ✅ Validation
- Validation HTML5 (W3C standards)
- Validation CSS
- Vérification JavaScript (syntaxe et bonnes pratiques)
- Audit d'accessibilité
- Vérification SEO

### 🖼️ Optimisation des images
- Conversion en formats modernes (AVIF, WebP)
- Génération de versions responsives
- Compression et optimisation
- Mise à jour HTML avec éléments `<picture>`
- Lazy loading automatique
- Dimensions explicites pour éviter le layout shift

### 🗜️ Minification
- HTML (suppression commentaires, espaces, optimisation)
- CSS (minification, suppression code inutilisé, fusion des règles)
- JavaScript (uglification, tree-shaking, suppression console.log)
- Extraction et inline du CSS critique
- Optimisation du chargement des ressources

### 📦 Pre-Compression (NOUVEAU)
- **Compression Brotli** (niveau 11 - qualité maximale)
  - 75-85% de réduction de taille
  - Support navigateurs modernes
  - Meilleure compression que Gzip
- **Compression Gzip** (niveau 9 - compression maximale)
  - 65-75% de réduction de taille
  - Fallback universel
  - Compatible tous navigateurs
- **Traitement des fichiers texte:**
  - HTML, CSS, JavaScript
  - JSON, SVG, XML
  - Source maps, manifests
- **Compression additive** (fichiers originaux préservés)
- **Configuration serveur** automatique
- **Zéro overhead runtime** (pré-compressé au build)

### 📊 Audit de performance
- Intégration Google PageSpeed Insights
- Analyse Lighthouse (mobile et desktop)
- Métriques Core Web Vitals
- Recommandations actionnables
- Amélioration itérative jusqu'à atteinte des objectifs

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm 9+
- Système Linux, macOS, ou Windows WSL

### Installation automatique

```bash
# Cloner ou copier les fichiers dans votre projet
cd votre-projet

# Installer tous les outils nécessaires
npm run install:tools

# Ou manuellement
bash .claude/scripts/install-tools.sh
```

Cela installera :
- Outils système : ImageMagick, jpegoptim, optipng, pngquant, WebP, AVIF
- Packages Node.js : sharp, terser, cssnano, lighthouse, etc.
- Navigateur : Chromium (pour Lighthouse)

### Installation manuelle

```bash
# 1. Installer les dépendances Node.js
npm install

# 2. Installer les packages globaux
npm install -g lighthouse html-minifier clean-css-cli terser

# 3. Installer les outils système (Ubuntu/Debian)
sudo apt-get install imagemagick jpegoptim optipng pngquant webp libavif-bin

# 4. Installer les outils système (macOS avec Homebrew)
brew install imagemagick jpegoptim optipng pngquant webp libavif
```

## 📖 Utilisation

### Via les Skills Claude Code

Les skills sont organisés dans `.claude/skills/static-site-optimizer/` :

#### 1. Optimisation complète (recommandé)

Dans Claude Code, invoquez le skill principal :

```
static-site-optimizer:optimize
```

Claude vous guidera à travers le processus complet :
1. Analyse du répertoire
2. Création de backup
3. Validation du code
4. **RGPD/GDPR Compliance & Responsive Design** ⚠️
5. Optimisation des images
6. Minification des assets
7. **Pre-Compression (Brotli + Gzip)** 📦
8. Audit PageSpeed
9. Améliorations itératives
10. Rapport final

#### 2. Skills individuels

Vous pouvez aussi invoquer les skills spécifiques :

```
static-site-optimizer:gdpr-responsive # RGPD/GDPR + Responsive (IMPORTANT!)
static-site-optimizer:validate        # Validation HTML/CSS/JS uniquement
static-site-optimizer:optimize-images # Optimisation images uniquement
static-site-optimizer:minify          # Minification uniquement
static-site-optimizer:compress        # Compression Brotli/Gzip (NOUVEAU!)
static-site-optimizer:pagespeed       # Audit PageSpeed uniquement
```

### Via les Scripts Node.js

#### ⚠️ RGPD/GDPR Compliance (À FAIRE EN PREMIER!)

```bash
# Optimiser le site pour la conformité RGPD
node .claude/scripts/gdpr-optimizer.js ./dist

# Ou avec un répertoire assets personnalisé
node .claude/scripts/gdpr-optimizer.js ./dist ./dist/assets

# Résultat :
# - Remplacement Google Fonts → Bunny Fonts
# - Auto-hébergement des ressources externes (JS, CSS)
# - Détection et signalement des scripts de tracking
# - Ajout des viewport meta tags
# - Rapport de conformité RGPD en JSON
```

#### Optimisation des images

```bash
# Optimiser toutes les images d'un répertoire
node .claude/scripts/image-optimizer.js ./src/images ./dist/images

# Résultat :
# - Génération de versions AVIF, WebP, et JPEG optimisées
# - Création de versions responsives (320w, 640w, 768w, 1024w, 1920w)
# - Rapport d'optimisation en JSON
# - Exemples HTML avec éléments <picture>
```

#### Mise à jour du HTML

```bash
# Remplacer les <img> par des <picture> optimisés
node .claude/scripts/html-updater.js ./dist ./dist/images/optimization-report.json

# Avec dry-run (test sans modification)
node .claude/scripts/html-updater.js ./dist ./dist/images/optimization-report.json --dry-run

# Résultat :
# - Remplacement automatique des balises <img>
# - Ajout de lazy loading (sauf premières images)
# - Ajout des dimensions width/height
# - Rapport des modifications
```

#### 📦 Pre-Compression Brotli/Gzip (NOUVEAU!)

```bash
# Compresser tous les fichiers texte pour le packaging
node .claude/scripts/compress-assets.js ./dist

# Ou avec le script bash
bash .claude/scripts/compress-assets.sh ./dist

# Résultat :
# - Fichiers .br (Brotli niveau 11) générés
# - Fichiers .gz (Gzip niveau 9) générés
# - Fichiers originaux préservés
# - Rapport de compression en JSON
# - 75-85% de réduction (Brotli)
# - 65-75% de réduction (Gzip)

# Exemple de résultat:
# index.html      45 KB
# index.html.br    9 KB  (-80%)
# index.html.gz   13 KB  (-71%)
```

### Via npm scripts

```bash
# Lancer un serveur local
npm run serve

# RGPD/GDPR Compliance (À FAIRE EN PREMIER!)
npm run gdpr:optimize ./dist

# Validation
npm run validate:html
npm run validate:css
npm run validate:js

# Minification
npm run minify:html
npm run minify:css
npm run minify:js

# Pre-Compression (NOUVEAU!)
npm run compress ./dist

# Audit Lighthouse
npm run audit:lighthouse

# Optimisation images
npm run optimize:images ./src/images ./dist/images

# Mise à jour HTML
npm run update:html ./dist ./dist/images/optimization-report.json
```

## 📁 Structure du projet

```
.
├── .claude/
│   ├── skills/
│   │   └── static-site-optimizer/
│   │       ├── optimize.md           # Skill principal (orchestration)
│   │       ├── gdpr-responsive.md    # RGPD/GDPR & Responsive Design ⚠️
│   │       ├── validate.md           # Validation HTML/CSS/JS
│   │       ├── minify.md             # Minification des assets
│   │       ├── compress.md           # Pre-Compression Brotli/Gzip 📦
│   │       ├── optimize-images.md    # Optimisation des images
│   │       └── pagespeed.md          # Audit PageSpeed Insights
│   └── scripts/
│       ├── gdpr-optimizer.js         # Script conformité RGPD ⚠️
│       ├── compress-assets.js        # Script compression Brotli/Gzip 📦
│       ├── compress-assets.sh        # Script compression (bash) 📦
│       ├── image-optimizer.js        # Script d'optimisation d'images
│       ├── html-updater.js           # Script de mise à jour HTML
│       └── install-tools.sh          # Script d'installation
├── package.json                      # Dépendances et scripts npm
├── .eslintrc.json                    # Configuration ESLint
├── .stylelintrc.json                 # Configuration Stylelint
├── postcss.config.js                 # Configuration PostCSS
├── purgecss.config.js                # Configuration PurgeCSS
└── README.md                         # Ce fichier
```

## 🔧 Workflow typique

### 1. Optimisation complète d'un site existant

```bash
# 1. Copier votre site dans un répertoire
cp -r mon-site-web ./src

# 2. Dans Claude Code, invoquer le skill principal
static-site-optimizer:optimize

# 3. Suivre les instructions interactives
# Claude va :
# - Créer un backup dans ./src_backup
# - Valider tout le code
# - Corriger les erreurs automatiquement
# - Optimiser toutes les images
# - Mettre à jour le HTML avec <picture>
# - Minifier HTML, CSS, JS
# - Ajouter les optimisations de performance
# - Lancer des audits PageSpeed
# - Itérer jusqu'à obtenir 95-100/100

# 4. Résultat dans ./src_optimized
```

### 2. Optimisation des images uniquement

```bash
# Via le skill
static-site-optimizer:optimize-images

# Ou via le script
node .claude/scripts/image-optimizer.js ./src/images ./dist/images

# Puis mettre à jour le HTML
node .claude/scripts/html-updater.js ./src ./dist/images/optimization-report.json
```

### 3. Audit et amélioration continue

```bash
# 1. Lancer un serveur local
npm run serve

# 2. Dans un autre terminal, lancer Lighthouse
lighthouse http://localhost:8000 --view

# 3. Ou via le skill Claude
static-site-optimizer:pagespeed

# 4. Appliquer les recommandations
# 5. Ré-auditer
# 6. Répéter jusqu'à satisfaction
```

## 📊 Exemple de résultats

### Avant optimisation
- HTML : 150 KB
- CSS : 80 KB
- JavaScript : 250 KB
- Images : 4.5 MB
- **Total : 4.98 MB**
- PageSpeed Score : 45/100 (mobile), 62/100 (desktop)

### Après optimisation
- HTML : 45 KB (70% de réduction)
- CSS : 18 KB (77% de réduction)
- JavaScript : 95 KB (62% de réduction)
- Images : 450 KB avec AVIF (90% de réduction)
- **Total : 608 KB (88% de réduction globale)**
- PageSpeed Score : 96/100 (mobile), 98/100 (desktop)

### Optimisations appliquées
- ✅ Images converties en AVIF + WebP avec fallback JPEG
- ✅ Génération de versions responsives
- ✅ Lazy loading sur toutes les images (sauf above-the-fold)
- ✅ Minification HTML/CSS/JS
- ✅ Suppression du CSS et JS inutilisés
- ✅ CSS critique inline
- ✅ Scripts en async/defer
- ✅ Resource hints (preconnect, dns-prefetch)
- ✅ Dimensions explicites sur les images
- ✅ Compression Gzip/Brotli
- ✅ Meta tags SEO optimisés
- ✅ Accessibilité WCAG AA
- ✅ Structured data (JSON-LD)

## 🎨 Exemple de transformation HTML

### Avant
```html
<img src="images/hero.jpg" alt="Hero image">
```

### Après
```html
<picture>
  <source
    type="image/avif"
    srcset="
      images/hero-320w.avif 320w,
      images/hero-640w.avif 640w,
      images/hero-768w.avif 768w,
      images/hero-1024w.avif 1024w,
      images/hero-1920w.avif 1920w
    "
    sizes="100vw"
  >
  <source
    type="image/webp"
    srcset="
      images/hero-320w.webp 320w,
      images/hero-640w.webp 640w,
      images/hero-768w.webp 768w,
      images/hero-1024w.webp 1024w,
      images/hero-1920w.webp 1920w
    "
    sizes="100vw"
  >
  <img
    src="images/hero-1024w.jpg"
    srcset="
      images/hero-320w.jpg 320w,
      images/hero-640w.jpg 640w,
      images/hero-768w.jpg 768w,
      images/hero-1024w.jpg 1024w,
      images/hero-1920w.jpg 1920w
    "
    sizes="100vw"
    alt="Hero image"
    width="1920"
    height="1080"
    loading="lazy"
    decoding="async"
  >
</picture>
```

## 🔍 Core Web Vitals

Le système optimise spécifiquement pour les métriques Core Web Vitals :

- **LCP (Largest Contentful Paint)** < 2.5s
  - Optimisation des images
  - CSS critique inline
  - Preload des ressources critiques

- **FID (First Input Delay)** < 100ms
  - JavaScript async/defer
  - Réduction du JavaScript
  - Suppression du code bloquant

- **CLS (Cumulative Layout Shift)** < 0.1
  - Dimensions explicites sur les images
  - Espaces réservés pour le contenu dynamique
  - Font-display: swap

- **FCP (First Contentful Paint)** < 1.8s
  - CSS inline critique
  - Élimination des ressources bloquantes
  - Optimisation du TTFB

## 🌐 Support navigateurs

Les optimisations assurent un support optimal :

- **AVIF** : Chrome 85+, Firefox 93+, Safari 16+
- **WebP** : Chrome 32+, Firefox 65+, Safari 14+, Edge 18+
- **Fallback JPEG/PNG** : Tous les navigateurs
- **Lazy loading natif** : Chrome 77+, Firefox 75+, Safari 15.4+
- **Picture element** : Tous les navigateurs modernes

## 📚 Ressources supplémentaires

### Documentation officielle
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web.dev](https://web.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Outils recommandés
- [ImageMagick](https://imagemagick.org/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [SVGO](https://github.com/svg/svgo)
- [PurgeCSS](https://purgecss.com/)
- [Terser](https://terser.org/)

### Standards et spécifications
- [W3C HTML Validator](https://validator.w3.org/)
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Schema.org](https://schema.org/)

## 🐛 Dépannage

### Les images ne se convertissent pas en AVIF
- Vérifier que `libavif-bin` ou `avifenc` est installé
- Sur certains systèmes, AVIF n'est pas disponible : le système utilisera WebP + JPEG

### Lighthouse ne fonctionne pas
- Vérifier que Chromium/Chrome est installé
- Essayer : `export CHROME_PATH=/usr/bin/chromium-browser`

### Les validateurs échouent
- Vérifier la connexion internet (certains utilisent des API en ligne)
- Installer les versions CLI locales

### Erreurs de permissions
- Utiliser `sudo` pour les installations système
- Ou installer dans un environnement virtuel (nvm, Docker)

## 🤝 Contribution

Ce système de skills est conçu pour être extensible. Vous pouvez :
- Ajouter de nouveaux skills dans `.claude/skills/static-site-optimizer/`
- Créer des scripts personnalisés dans `.claude/scripts/`
- Adapter les configurations (ESLint, Stylelint, PostCSS)

## 📝 Licence

MIT License - Libre d'utilisation et de modification

## ✨ Fonctionnalités futures

- [ ] Support pour les sites multi-pages (sitemap génération)
- [ ] Intégration CI/CD (GitHub Actions, GitLab CI)
- [ ] Dashboard web pour visualiser les métriques
- [ ] Support PWA (Service Worker, manifest.json)
- [ ] Optimisation pour HTTP/3 et QUIC
- [ ] Support pour les frameworks (React, Vue, Angular)
- [ ] Compression Brotli automatique
- [ ] CDN configuration generator

---

**Créé avec ❤️ pour Claude Code**

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou contribuer !
