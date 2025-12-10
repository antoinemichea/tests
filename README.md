# Static Site Optimizer - Claude Code Skills

Système complet de skills Claude pour optimiser des sites web statiques et atteindre des scores de performance proches de 100% sur Google PageSpeed Insights.

## 📚 Table des matières

- [RGPD/GDPR - Priorité absolue](#️-rgpdgdpr---priorité-absolue)
- [Deux Workflows Distincts](#-deux-workflows-distincts)
- [Objectifs](#-objectifs)
- [Fonctionnalités](#-fonctionnalités)
- [🚀 Installation](#-installation)
  - [Étape 1 : Installer Claude Code](#étape-1--installer-claude-code)
  - [Étape 2 : Installer les Skills](#étape-2--installer-les-skills-doptimisation)
  - [Étape 3 : Vérifier l'installation](#étape-3--vérifier-linstallation-des-skills)
  - [Étape 4 : Tester l'installation](#étape-4--tester-linstallation)
  - [Étape 5 : Configuration du projet](#étape-5--configuration-du-projet)
  - [Étape 6 : Installer les outils système](#étape-6--installer-les-outils-doptimisation)
- [📖 Utilisation](#-utilisation)
- [🔧 Workflow typique](#-workflow-typique)
  - [Cas concret : Site statique avec Git](#4-cas-concret--site-statique-avec-git-workflow-complet)
- [📊 Exemple de résultats](#-exemple-de-résultats)
- [📁 Structure du projet](#-structure-du-projet)
- [🔍 Core Web Vitals](#-core-web-vitals)
- [🌐 Support navigateurs](#-support-navigateurs)
- [🐛 Dépannage](#-dépannage)
- [✨ Fonctionnalités futures](#-fonctionnalités-futures)

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
- **Zéro overhead runtime** (pré-compressé au build)

### 📊 Audit de performance
- Intégration Google PageSpeed Insights
- Analyse Lighthouse (mobile et desktop)
- Métriques Core Web Vitals
- Recommandations actionnables
- Amélioration itérative jusqu'à atteinte des objectifs

## 🚀 Installation

### Étape 1 : Installer Claude Code

Claude Code est le CLI officiel d'Anthropic pour interagir avec Claude via la ligne de commande.

#### Installation de Claude Code

```bash
# Option 1 : Via npm (recommandé)
npm install -g @anthropic-ai/claude-code

# Option 2 : Via Homebrew (macOS)
brew install claude-code

# Option 3 : Téléchargement direct
# Visitez : https://github.com/anthropics/claude-code/releases
```

#### Configuration initiale de Claude Code

```bash
# 1. Configurer votre clé API Anthropic
# Obtenir une clé API sur : https://console.anthropic.com/
export ANTHROPIC_API_KEY="votre_clé_api_ici"

# Ou ajouter dans votre ~/.bashrc ou ~/.zshrc
echo 'export ANTHROPIC_API_KEY="votre_clé_api_ici"' >> ~/.bashrc

# 2. Vérifier l'installation
claude --version

# 3. Tester Claude Code
claude
# Vous devriez voir le prompt de Claude Code
```

### Étape 2 : Installer les Skills d'optimisation

Il existe **3 méthodes** pour installer ces skills dans votre projet.

#### Méthode 1 : Cloner depuis Git (Recommandé)

Si vous avez accès au dépôt contenant ces skills :

```bash
# 1. Cloner le dépôt des skills
git clone https://github.com/votre-username/static-site-optimizer-skills.git

# 2. Copier les skills dans votre projet
cd votre-projet-web
cp -r /chemin/vers/static-site-optimizer-skills/.claude ./.claude

# 3. Copier les fichiers de configuration
cp /chemin/vers/static-site-optimizer-skills/package.json ./
cp /chemin/vers/static-site-optimizer-skills/.eslintrc.json ./
cp /chemin/vers/static-site-optimizer-skills/.stylelintrc.json ./
cp /chemin/vers/static-site-optimizer-skills/postcss.config.js ./
cp /chemin/vers/static-site-optimizer-skills/purgecss.config.js ./

# 4. Vérifier la structure
ls -la .claude/
# Vous devriez voir :
# .claude/skills/static-site-optimizer/
# .claude/scripts/
```

#### Méthode 2 : Installation manuelle

Si vous créez les skills à partir de zéro :

```bash
# 1. Créer la structure des répertoires
cd votre-projet-web
mkdir -p .claude/skills/static-site-optimizer
mkdir -p .claude/scripts

# 2. Créer les fichiers de skills
# Copier le contenu de chaque skill depuis la documentation
touch .claude/skills/static-site-optimizer/optimize.md
touch .claude/skills/static-site-optimizer/optimize-dev.md
touch .claude/skills/static-site-optimizer/package-prod.md
touch .claude/skills/static-site-optimizer/validate.md
touch .claude/skills/static-site-optimizer/gdpr-responsive.md
touch .claude/skills/static-site-optimizer/optimize-images.md
touch .claude/skills/static-site-optimizer/minify.md
touch .claude/skills/static-site-optimizer/compress.md
touch .claude/skills/static-site-optimizer/pagespeed.md

# 3. Créer les scripts utilitaires
touch .claude/scripts/gdpr-optimizer.js
touch .claude/scripts/generate-favicon.js
touch .claude/scripts/cache-buster.js
touch .claude/scripts/compress-assets.js
touch .claude/scripts/compress-assets.sh
touch .claude/scripts/image-optimizer.js
touch .claude/scripts/html-updater.js
touch .claude/scripts/install-tools.sh

# 4. Rendre les scripts exécutables
chmod +x .claude/scripts/*.sh
chmod +x .claude/scripts/*.js
```

#### Méthode 3 : Installation via package (si disponible)

```bash
# Si les skills sont packagés en tant que module npm
cd votre-projet-web
npm install --save-dev static-site-optimizer-skills

# Les skills seront installés dans node_modules/
# Créer un lien symbolique
ln -s node_modules/static-site-optimizer-skills/.claude ./.claude
```

### Étape 3 : Vérifier l'installation des skills

```bash
# 1. Vérifier la structure des fichiers
tree .claude/
# Ou
find .claude -type f

# Structure attendue :
# .claude/
# ├── skills/
# │   └── static-site-optimizer/
# │       ├── optimize.md
# │       ├── optimize-dev.md
# │       ├── package-prod.md
# │       ├── validate.md
# │       ├── gdpr-responsive.md
# │       ├── optimize-images.md
# │       ├── minify.md
# │       ├── compress.md
# │       └── pagespeed.md
# └── scripts/
#     ├── gdpr-optimizer.js
#     ├── generate-favicon.js
#     ├── cache-buster.js
#     ├── compress-assets.js
#     ├── compress-assets.sh
#     ├── image-optimizer.js
#     ├── html-updater.js
#     └── install-tools.sh

# 2. Vérifier que les skills sont reconnus par Claude Code
cd votre-projet-web
claude

# Dans Claude Code, taper :
/skills

# Vous devriez voir la liste des skills disponibles :
# - static-site-optimizer:optimize
# - static-site-optimizer:optimize-dev
# - static-site-optimizer:package-prod
# - etc.
```

### Étape 4 : Tester l'installation

```bash
# 1. Lancer Claude Code dans votre projet
cd votre-projet-web
claude

# 2. Tester un skill simple
# Dans Claude Code, taper :
static-site-optimizer:validate

# Claude devrait :
# - Reconnaître le skill
# - Commencer l'analyse de votre site
# - Valider HTML/CSS/JS

# 3. Si tout fonctionne, vous êtes prêt !
# Sinon, vérifier les erreurs et la structure des fichiers
```

### Étape 5 : Configuration du projet

Après installation des skills, configurer votre projet :

```bash
# 1. Initialiser package.json si nécessaire
npm init -y

# 2. Ajouter les dépendances requises
npm install --save-dev \
  sharp \
  cheerio \
  terser \
  cssnano \
  postcss \
  autoprefixer \
  purgecss \
  html-minifier \
  lighthouse \
  eslint \
  stylelint

# 3. Créer le fichier .gitignore
cat > .gitignore << 'EOF'
# Node
node_modules/
npm-debug.log
package-lock.json

# Optimization outputs (ne pas commiter)
dist/
*_backup/
*_dev_optimized/
*_prod/
*.br
*.gz

# Lighthouse reports
lighthouse-report-*.html
lighthouse-report-*.json

# Logs
*.log

# OS
.DS_Store
Thumbs.db
EOF

# 4. Créer les fichiers de configuration ESLint
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn"
  }
}
EOF

# 5. Créer le fichier de configuration Stylelint
cat > .stylelintrc.json << 'EOF'
{
  "extends": "stylelint-config-standard",
  "rules": {
    "color-hex-length": "short",
    "declaration-block-no-duplicate-properties": true,
    "no-duplicate-selectors": true
  }
}
EOF
```

### 📋 Structure finale du projet

Après installation complète, votre projet devrait ressembler à :

```
votre-projet-web/
├── .claude/                          # Skills et scripts d'optimisation
│   ├── skills/
│   │   └── static-site-optimizer/   # Tous les skills (9 fichiers .md)
│   └── scripts/                     # Scripts utilitaires (7 fichiers)
├── .gitignore                       # Ignorer dist/, *_backup/, etc.
├── .eslintrc.json                   # Configuration ESLint
├── .stylelintrc.json                # Configuration Stylelint
├── postcss.config.js                # Configuration PostCSS
├── purgecss.config.js               # Configuration PurgeCSS
├── package.json                     # Dépendances du projet
├── index.html                       # Votre site web
├── css/
│   └── style.css
├── js/
│   └── app.js
└── images/
    └── *.jpg, *.png
```

### 🔍 Dépannage de l'installation

#### Les skills ne sont pas reconnus

```bash
# Vérifier que le répertoire .claude existe
ls -la .claude/

# Vérifier les permissions
chmod -R u+rw .claude/

# Relancer Claude Code dans le bon répertoire
cd votre-projet-web
claude
```

#### Erreur "Skill not found"

```bash
# Vérifier l'exactitude des noms de fichiers
ls .claude/skills/static-site-optimizer/

# Les fichiers doivent avoir l'extension .md
# Exemple : optimize.md (pas optimize.txt)

# Vérifier le contenu du fichier
head -n 5 .claude/skills/static-site-optimizer/optimize.md
# Devrait commencer par : # Static Site Optimizer...
```

#### Scripts ne s'exécutent pas

```bash
# Vérifier les permissions d'exécution
ls -l .claude/scripts/

# Ajouter les permissions si nécessaire
chmod +x .claude/scripts/*.sh
chmod +x .claude/scripts/*.js

# Vérifier le shebang dans les scripts
head -n 1 .claude/scripts/generate-favicon.js
# Devrait être : #!/usr/bin/env node
```

### 🎓 Tutoriel : Premier usage après installation

```bash
# 1. Naviguer vers votre projet
cd mon-site-web

# 2. Lancer Claude Code
claude

# 3. Dans Claude Code, invoquer le skill principal
static-site-optimizer:optimize

# 4. Claude vous demandera de choisir un workflow
# Tapez : 1 (pour DEVELOPMENT)

# 5. Claude va analyser votre site et lancer l'optimisation
# Suivez les instructions à l'écran

# 6. Une fois terminé, vérifier les résultats
ls -la
# Vous devriez voir des fichiers optimisés

# 7. Tester le site
npm run serve
# Ouvrir http://localhost:8000

# Félicitations ! Vos skills sont installés et fonctionnels ! 🎉
```

## 📦 Installation des outils système

### Étape 6 : Installer les outils d'optimisation

Une fois les skills installés, vous devez installer les outils système nécessaires.

### Installation automatique des outils

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

**Processus en 11 étapes :**
1. Vérifications pré-vol (code production-ready)
2. Setup répertoire de production
3. **Optimisation agressive des images** (AVIF + WebP + responsive)
4. **Optimisation CSS** (minify, unused removal, critical CSS)
5. **Optimisation JavaScript** (minify, tree-shake, mangle)
6. **Minification HTML** (inline critical CSS)
7. **Cache-Busting CSS/JS** 🏷️ (timestamp versioning)
8. **Pre-Compression** 📦 (Brotli 11 + Gzip 9)
9. Optimisations performance (resource hints, async)
10. Audit PageSpeed (vérification 95-100 scores)
11. Rapport de build production

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

#### 🏷️ Cache-Busting CSS/JS (NOUVEAU!)

```bash
# Ajouter des versions timestamp aux fichiers CSS et JS
node .claude/scripts/cache-buster.js ./dist

# Avec méthode query string (défaut)
node .claude/scripts/cache-buster.js ./dist --method=query

# Avec méthode renommage de fichiers
node .claude/scripts/cache-buster.js ./dist --method=filename

# Avec timestamp personnalisé
node .claude/scripts/cache-buster.js ./dist --timestamp=20231121000000

# Dry-run (prévisualisation sans modifications)
node .claude/scripts/cache-buster.js ./dist --dry-run

# Résultat :
# - Ajout de paramètres de version aux URLs CSS/JS
# - Invalidation du cache navigateur
# - Tracking de version pour debugging
# - Rapport de cache-busting en JSON

# Méthode Query String :
# <link rel="stylesheet" href="styles.css?v=20231121154530">
# <script src="app.js?v=20231121154530"></script>

# Méthode Filename :
# <link rel="stylesheet" href="styles.20231121154530.css">
# <script src="app.20231121154530.js"></script>

# Avantages du cache-busting :
# ✅ Force le rechargement des assets modifiés
# ✅ Évite les problèmes de cache obsolète
# ✅ Version tracking pour le debugging
# ✅ Aucune configuration serveur requise
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

# Cache-busting CSS/JS (NOUVEAU!)
npm run cache-bust ./dist

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
│       ├── cache-buster.js           # Cache-busting CSS/JS avec timestamps 🏷️
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

# 19. Vérifier le déploiement
curl -I https://votre-site.com
# Vérifier les headers : Content-Encoding: br ou gzip

# 20. Tester le site en production
# Ouvrir https://votre-site.com
# Vérifier que tout fonctionne

# 21. Lancer un audit PageSpeed final sur le site en production
# Aller sur https://pagespeed.web.dev/
# Entrer l'URL de votre site
# Vérifier les scores 95-100 ✅

# ============================================
# PHASE 5 : MAINTENANCE ET ITÉRATION
# ============================================

# 22. Pour chaque mise à jour du site :

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
