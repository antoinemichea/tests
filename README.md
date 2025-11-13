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

## ⚡ Deux Workflows Distincts

Ce système propose **DEUX workflows spécialisés** pour les différentes phases de votre projet :

### 🔧 Workflow DÉVELOPPEMENT (`optimize-dev`)
**Pour**: Qualité du code, conformité, maintenabilité
**Quand**: Pendant le développement, avant la production
**Caractéristiques**:
- ✅ Validation et corrections du code
- ✅ Conformité RGPD/GDPR
- ✅ Améliorations accessibilité
- ✅ Structure SEO
- ✅ **Code reste LISIBLE et MODIFIABLE**
- ❌ PAS de minification
- ❌ PAS de conversion d'images
- ❌ PAS de compression agressive

**Output**: Code propre, validé, conforme RGPD - prêt pour le développement

### 🚀 Workflow PRODUCTION (`package-prod`)
**Pour**: Performance maximale et optimisation bande passante
**Quand**: Packaging final avant déploiement
**Caractéristiques**:
- ✅ Minification agressive (HTML, CSS, JS)
- ✅ Conversion images (AVIF + WebP + variantes responsives)
- ✅ Pre-compression (Brotli + Gzip)
- ✅ Optimisation du code (tree-shaking)
- ✅ Scores PageSpeed 95-100
- ❌ Code devient ILLISIBLE
- ❌ NON modifiable

**Output**: Build production entièrement optimisé avec performance maximale

### 📋 Comment choisir ?

**Choisissez DÉVELOPPEMENT si:**
- ✅ Vous développez encore le site
- ✅ Vous devez lire et modifier le code
- ✅ Vous travaillez en équipe
- ✅ Vous devez debugger

**Choisissez PRODUCTION si:**
- ✅ Le développement est terminé
- ✅ Le code est validé et testé
- ✅ Vous êtes prêt à déployer
- ✅ Vous voulez la performance maximale

**Approche recommandée:**
1. D'abord: Workflow **DÉVELOPPEMENT**
2. Tester et valider
3. Ensuite: Workflow **PRODUCTION** pour le déploiement

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

### Via les Skills Claude Code (Recommandé)

#### Option 1: Skill principal avec choix interactif

```
static-site-optimizer:optimize
```

Claude vous demandera de choisir :
- **DEVELOPMENT** (optimize-dev) - Code lisible, conformité RGPD
- **PRODUCTION** (package-prod) - Optimisation maximale pour déploiement
- **BOTH** - Les deux workflows en séquence (recommandé)

#### Option 2: Workflow DÉVELOPPEMENT direct

```
static-site-optimizer:optimize-dev
```

**Processus en 10 étapes :**
1. Analyse du répertoire et backup
2. Validation du code (HTML, CSS, JS)
3. Corrections automatiques des erreurs
4. **RGPD/GDPR Compliance** ⚠️ (Google Fonts → Bunny Fonts)
5. Optimisation basique des images (lossless uniquement)
6. Améliorations accessibilité (WCAG AA)
7. Structure SEO (meta tags, sitemap, robots.txt)
8. **Vérification et création Favicon** 🎨 - SVG avec support dark mode + variantes PNG/ICO
9. **Audit PageSpeed (Baseline)** 📊 - Scores attendus: 70-85 performance, 90-100 accessibilité/SEO
10. Rapport de développement

**Résultat**: Code propre, validé, conforme - **LISIBLE et MODIFIABLE** + baseline performance établi

#### Option 3: Workflow PRODUCTION direct

```
static-site-optimizer:package-prod
```

**Processus en 10 étapes :**
1. Vérifications pré-vol (code production-ready)
2. Setup répertoire de production
3. **Optimisation agressive des images** (AVIF + WebP + responsive)
4. **Optimisation CSS** (minify, unused removal, critical CSS)
5. **Optimisation JavaScript** (minify, tree-shake, mangle)
6. **Minification HTML** (inline critical CSS)
7. **Pre-Compression** 📦 (Brotli 11 + Gzip 9)
8. Optimisations performance (resource hints, async)
9. Audit PageSpeed (vérification 95-100 scores)
10. Rapport de build production

**Résultat**: Build production optimisé - **ILLISIBLE mais PERFORMANT**

#### Option 4: Skills individuels

Pour des opérations spécifiques :

```
static-site-optimizer:validate        # Validation uniquement
static-site-optimizer:gdpr-responsive # RGPD/GDPR uniquement ⚠️
static-site-optimizer:optimize-images # Images uniquement
static-site-optimizer:minify          # Minification uniquement
static-site-optimizer:compress        # Pre-compression uniquement
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

#### 🎨 Génération de Favicon (NOUVEAU!)

```bash
# Générer un favicon SVG avec variantes PNG/ICO
node .claude/scripts/generate-favicon.js

# Le script est interactif et demande :
# - Initiales du site (1-2 caractères, ex: "MS")
# - Couleur principale (hex, ex: #2563eb)
# - Couleur du texte (default: #ffffff)
# - Support dark mode (oui/non)
# - Répertoire de sortie (default: répertoire courant)

# Résultat :
# - favicon.svg (scalable, ~500 bytes)
# - favicon-16x16.png
# - favicon-32x32.png
# - apple-touch-icon.png (180x180, iOS)
# - favicon.ico (legacy browsers)
# - Mise à jour automatique des fichiers HTML

# Avantages du favicon SVG :
# ✅ Scalable (parfait sur toutes résolutions)
# ✅ Petit fichier (~500 bytes)
# ✅ Facile à éditer
# ✅ Support dark mode (via CSS media queries)
# ✅ Moderne et net sur écrans retina
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
│   │       ├── optimize.md           # Skill principal (choix interactif)
│   │       ├── optimize-dev.md       # 🔧 Workflow DÉVELOPPEMENT
│   │       ├── package-prod.md       # 🚀 Workflow PRODUCTION
│   │       ├── gdpr-responsive.md    # RGPD/GDPR & Responsive Design ⚠️
│   │       ├── validate.md           # Validation HTML/CSS/JS
│   │       ├── minify.md             # Minification des assets
│   │       ├── compress.md           # Pre-Compression Brotli/Gzip 📦
│   │       ├── optimize-images.md    # Optimisation des images
│   │       └── pagespeed.md          # Audit PageSpeed Insights
│   └── scripts/
│       ├── gdpr-optimizer.js         # Script conformité RGPD ⚠️
│       ├── generate-favicon.js       # Génération favicon SVG + variantes 🎨
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

### 4. Cas concret : Site statique avec Git (Workflow complet)

Ce scénario montre comment optimiser un site statique hébergé sur Git, de la phase de développement au déploiement en production.

#### 📋 Contexte
Vous avez un site statique sur GitHub/GitLab et vous voulez :
- Améliorer la qualité du code
- Assurer la conformité RGPD
- Optimiser les performances
- Déployer une version production optimisée

#### 🚀 Étapes complètes

```bash
# ============================================
# PHASE 1 : SETUP ET PRÉPARATION
# ============================================

# 1. Cloner le dépôt Git de votre site statique
git clone https://github.com/votre-username/mon-site-web.git
cd mon-site-web

# 2. Vérifier la structure du projet
ls -la
# Exemple : index.html, css/, js/, images/, etc.

# 3. Copier les skills et scripts d'optimisation dans le projet
# (Si ce n'est pas déjà fait)
cp -r /chemin/vers/.claude ./.claude
cp package.json .
cp .eslintrc.json .
cp .stylelintrc.json .

# 4. Installer les dépendances
npm install

# 5. Créer une branche de développement pour l'optimisation
git checkout -b feature/optimize-site

# ============================================
# PHASE 2 : OPTIMISATION DÉVELOPPEMENT
# ============================================

# 6. Dans Claude Code, lancer le workflow DÉVELOPPEMENT
# Taper dans Claude Code :
static-site-optimizer:optimize-dev

# Claude va :
# - Analyser votre site (index.html, css/, js/, images/, etc.)
# - Créer un backup automatique
# - Valider HTML/CSS/JS et corriger les erreurs
# - Remplacer Google Fonts par Bunny Fonts (RGPD)
# - Optimiser les images (lossless)
# - Améliorer l'accessibilité (WCAG AA)
# - Ajouter/optimiser les meta tags SEO
# - Vérifier/créer le favicon
# - Lancer un audit PageSpeed baseline

# 7. Vérifier les changements
git status
git diff

# Vous devriez voir :
# - Modifications des fichiers HTML (Bunny Fonts, favicon, meta tags)
# - Corrections CSS/JS
# - Nouveaux fichiers favicon (favicon.svg, *.png, etc.)
# - Images optimisées (lossless)

# 8. Tester le site localement
npm run serve
# Ouvrir http://localhost:8000 dans le navigateur

# 9. Vérifier les scores PageSpeed
# Dans Claude Code :
static-site-optimizer:pagespeed

# Scores attendus après DEV :
# - Performance : 70-85
# - Accessibilité : 90-100
# - Bonnes pratiques : 90-100
# - SEO : 90-100

# 10. Commiter les changements DEV (code source optimisé)
git add .
git commit -m "chore: optimize site - DEV workflow

- Fix HTML/CSS/JS validation errors
- Replace Google Fonts with Bunny Fonts (GDPR compliant)
- Add missing favicon (SVG + variants)
- Improve accessibility (WCAG AA)
- Optimize SEO meta tags
- Baseline PageSpeed audit: 75/100"

# 11. Pousser la branche de développement
git push -u origin feature/optimize-site

# 12. Créer une Pull Request
# Sur GitHub/GitLab, créer une PR de feature/optimize-site vers main
# Faire reviewer les changements par l'équipe
# Merger après validation

# ============================================
# PHASE 3 : BUILD PRODUCTION
# ============================================

# 13. Basculer sur la branche principale (après merge)
git checkout main
git pull origin main

# 14. Créer une branche pour le build de production
git checkout -b release/v1.0.0-optimized

# 15. Dans Claude Code, lancer le workflow PRODUCTION
static-site-optimizer:package-prod

# Claude va créer un répertoire de production (ex: dist/) avec :
# - HTML minifié (70% plus petit)
# - CSS minifié et purgé (77% plus petit)
# - JavaScript minifié et tree-shaken (62% plus petit)
# - Images en AVIF + WebP + responsive variants (90% plus petit)
# - Pre-compression Brotli (.br) et Gzip (.gz)
# - Picture elements avec lazy loading
# - Optimisations performance maximales

# Structure après build :
# dist/
# ├── index.html (minifié)
# ├── index.html.br (Brotli)
# ├── index.html.gz (Gzip)
# ├── css/
# │   ├── style.min.css
# │   ├── style.min.css.br
# │   └── style.min.css.gz
# ├── js/
# │   ├── app.min.js
# │   ├── app.min.js.br
# │   └── app.min.js.gz
# └── images/
#     ├── hero-320w.avif
#     ├── hero-640w.avif
#     ├── hero-320w.webp
#     └── hero-1024w.jpg

# 16. Vérifier les scores PageSpeed production
static-site-optimizer:pagespeed

# Scores attendus après PROD :
# - Performance : 95-100 ✅
# - Accessibilité : 95-100 ✅
# - Bonnes pratiques : 95-100 ✅
# - SEO : 95-100 ✅

# ============================================
# PHASE 4 : DÉPLOIEMENT
# ============================================

# 17. NE PAS commiter le dossier dist/ dans Git
# Ajouter au .gitignore si ce n'est pas déjà fait
echo "dist/" >> .gitignore
echo "*_backup/" >> .gitignore
echo "*_dev_optimized/" >> .gitignore
echo "*_prod/" >> .gitignore

git add .gitignore
git commit -m "chore: add optimization directories to gitignore"

# 18. Déployer le contenu de dist/ vers votre hébergement

# Option A : Déploiement manuel (FTP/SFTP)
# Uploader le contenu de dist/ vers votre serveur web

# Option B : Netlify
netlify deploy --prod --dir=dist

# Option C : Vercel
vercel --prod dist

# Option D : GitHub Pages (avec GitHub Actions)
# Créer .github/workflows/deploy.yml :
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build production
        run: |
          # Lancer le script de build (adapter selon votre setup)
          npm run build:prod

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
EOF

# Option E : Serveur personnalisé (SSH + rsync)
rsync -avz --delete dist/ user@votre-serveur.com:/var/www/html/

# 19. Configurer le serveur pour utiliser les fichiers pre-compressés

# Pour Nginx, ajouter dans la config :
cat > nginx-brotli.conf << 'EOF'
# Brotli
brotli on;
brotli_static on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

# Gzip (fallback)
gzip on;
gzip_static on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
EOF

# Pour Apache, ajouter dans .htaccess :
cat > dist/.htaccess << 'EOF'
# Serve pre-compressed Brotli files
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP:Accept-Encoding} br
  RewriteCond %{REQUEST_FILENAME}.br -f
  RewriteRule ^(.*)$ $1.br [L]
</IfModule>

# Serve pre-compressed Gzip files
<IfModule mod_rewrite.c>
  RewriteCond %{HTTP:Accept-Encoding} gzip
  RewriteCond %{REQUEST_FILENAME}.gz -f
  RewriteRule ^(.*)$ $1.gz [L]
</IfModule>
EOF

# 20. Vérifier le déploiement
curl -I https://votre-site.com
# Vérifier les headers : Content-Encoding: br ou gzip

# 21. Tester le site en production
# Ouvrir https://votre-site.com
# Vérifier que tout fonctionne

# 22. Lancer un audit PageSpeed final sur le site en production
# Aller sur https://pagespeed.web.dev/
# Entrer l'URL de votre site
# Vérifier les scores 95-100 ✅

# ============================================
# PHASE 5 : MAINTENANCE ET ITÉRATION
# ============================================

# 23. Pour chaque mise à jour du site :

# A. Modifications de développement (contenu, features)
git checkout main
git pull
git checkout -b feature/nouvelle-fonctionnalite

# Faire vos modifications...

# Re-lancer le workflow DEV pour vérifier
static-site-optimizer:optimize-dev

git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push -u origin feature/nouvelle-fonctionnalite
# Créer PR, merger

# B. Rebuild production
git checkout main
git pull

# Re-lancer le workflow PROD
static-site-optimizer:package-prod

# Redéployer dist/
netlify deploy --prod --dir=dist
# ou
rsync -avz --delete dist/ user@serveur:/var/www/html/

# C. Monitoring continu
# Configurer des audits réguliers avec Lighthouse CI
npm install -g @lhci/cli

# Créer lighthouserc.json
cat > lighthouserc.json << 'EOF'
{
  "ci": {
    "collect": {
      "url": ["https://votre-site.com"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.95}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.95}]
      }
    }
  }
}
EOF

# Lancer l'audit
lhci autorun

# ============================================
# RÉSUMÉ DU WORKFLOW GIT
# ============================================

# Sources (à commiter dans Git) :
# - main/ ou src/ : Code source optimisé DEV
# - .claude/ : Skills et scripts d'optimisation
# - Configuration : package.json, .eslintrc.json, etc.

# Build (à NE PAS commiter dans Git) :
# - dist/ : Build production (déployé, non versionné)
# - *_backup/ : Backups automatiques
# - *_dev_optimized/ : Sorties DEV temporaires
# - *_prod/ : Sorties PROD temporaires

# Branches Git recommandées :
# - main : Code source optimisé et validé
# - feature/* : Développement de nouvelles features
# - release/* : Tags de versions déployées
# - hotfix/* : Corrections urgentes en production

# Tags Git pour les releases :
git tag -a v1.0.0 -m "Release v1.0.0 - Site optimisé"
git push origin v1.0.0
```

#### 🎯 Résultat final

Après ce workflow complet, vous obtenez :

**✅ Repository Git organisé :**
- Code source propre et validé dans `main`
- Historique clair des optimisations
- Séparation source (Git) / build (déployé)

**✅ Site optimisé en développement :**
- Code lisible et maintenable
- Conforme RGPD (Bunny Fonts)
- Accessibilité WCAG AA
- SEO optimisé
- Baseline performance établi

**✅ Site optimisé en production :**
- PageSpeed scores 95-100
- Réduction de 70-90% de la taille des fichiers
- Images en formats modernes (AVIF + WebP)
- Pre-compression (Brotli + Gzip)
- Core Web Vitals au vert

**✅ Workflow reproductible :**
- Automatisable via CI/CD
- Testable à chaque commit
- Déployable en un clic
- Maintenable sur le long terme

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
