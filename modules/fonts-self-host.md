# Font Self-Hosting Module

## Purpose

Auto-héberger les fonts externes (Google Fonts, Bunny Fonts, etc.) pour:
- ✅ **GDPR/RGPD compliance**: Aucune requête vers des serveurs tiers
- ✅ **Performance**: Élimination des requêtes bloquantes (-200 à -800ms)
- ✅ **Reliability**: Pas de dépendance aux CDN externes
- ✅ **Privacy**: Aucun tracking IP possible

## Detection Strategy

### 1. Scan HTML for External Font Links

Détecter tous les liens vers des fournisseurs de fonts externes:

```bash
# Patterns à détecter dans le HTML
grep -E '<link[^>]*href=["\']https?://fonts\.(google|bunny|googleapis)' *.html
grep -E '@import.*url\(["\']https?://fonts\.(google|bunny)' css/*.css
```

**Providers supportés**:
- `fonts.google.com` (Google Fonts)
- `fonts.googleapis.com` (Google Fonts API)
- `fonts.bunny.net` (Bunny Fonts)
- `fonts.gstatic.com` (Google Fonts static files)

### 2. Extract Font Information

Pour chaque lien détecté, extraire:
- **Famille de font**: `Inter`, `Roboto`, `Open Sans`, etc.
- **Poids**: `400` (regular), `600` (semi-bold), `700` (bold)
- **Styles**: `normal`, `italic`
- **Subset**: `latin`, `latin-ext`, `cyrillic`, etc.

**Exemple de parsing**:
```
URL: https://fonts.bunny.net/css2?family=Inter:wght@400;600;700&display=swap

Extrait:
- Famille: Inter
- Poids: 400, 600, 700
- Display: swap
```

## Download Strategy

### Option A: Bunny Fonts (Recommandé)

**Avantages**:
- API simple et prévisible
- Direct download des fichiers woff2
- Déjà GDPR-compliant (peut rester si besoin)
- Chemins standardisés

**Download URLs**:
```bash
# Pattern Bunny Fonts:
# https://fonts.bunny.net/{family}/files/{family}-{subset}-{weight}-{style}.woff2

# Exemples:
curl -sL "https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff2" \
  -o assets/fonts/inter-400.woff2

curl -sL "https://fonts.bunny.net/inter/files/inter-latin-600-normal.woff2" \
  -o assets/fonts/inter-600.woff2

curl -sL "https://fonts.bunny.net/inter/files/inter-latin-700-normal.woff2" \
  -o assets/fonts/inter-700.woff2
```

**Famille → slug mapping** (Bunny Fonts):
```javascript
const fontSlugs = {
  'Inter': 'inter',
  'Roboto': 'roboto',
  'Open Sans': 'open-sans',
  'Montserrat': 'montserrat',
  'Lato': 'lato',
  'Poppins': 'poppins',
  'Source Sans Pro': 'source-sans-pro',
  'Nunito': 'nunito',
  'Raleway': 'raleway',
  'Ubuntu': 'ubuntu'
};
```

### Option B: Google Fonts (Fallback)

**Si Bunny Fonts échoue**, utiliser Google Fonts Web Font Loader:

```bash
# 1. Récupérer le CSS avec bon User-Agent (pour woff2)
curl -sL -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" \
  -o temp-fonts.css

# 2. Extraire les URLs woff2 du CSS
grep -oE 'https://fonts.gstatic.com/[^)]+\.woff2' temp-fonts.css

# 3. Télécharger chaque fichier woff2
# (parser et boucler sur les URLs extraites)
```

## File Organization

### Directory Structure

```
assets/fonts/
├── {family-slug}-{weight}.woff2      # Fichiers font
└── {family-slug}.css                  # CSS @font-face
```

**Exemple pour Inter**:
```
assets/fonts/
├── inter-400.woff2       # 23 KB
├── inter-600.woff2       # 24 KB
├── inter-700.woff2       # 24 KB
└── inter.css             # 1.5 KB
```

### Generated CSS Structure

Créer un fichier CSS pour chaque famille avec tous les @font-face:

**Template `{family-slug}.css`**:
```css
/* {Family} Font - Auto-hébergé pour GDPR et performance */
/* Généré automatiquement par static-site-optimizer */

@font-face {
    font-family: '{Family}';
    font-style: normal;
    font-weight: {weight};
    font-display: swap;
    src: url('{family-slug}-{weight}.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

**Exemple concret pour Inter (400, 600, 700)**:
```css
/* Inter Font - Auto-hébergé pour GDPR et performance */
/* Généré automatiquement par static-site-optimizer */

@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('inter-400.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('inter-600.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('inter-700.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

### Unicode Range Notes

**Latin standard** (recommandé par défaut):
```
U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
```

**Si latin-ext nécessaire** (français étendu, européen de l'est):
```
U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF
```

**Si besoin d'autres subsets**, ajouter selon:
- Cyrillic: `U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`
- Greek: `U+0370-03FF`
- Vietnamese: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`

## HTML Update Strategy

### 1. Detect Current Font Links

Rechercher dans chaque fichier HTML:
```html
<!-- Pattern 1: Link externe -->
<link href="https://fonts.bunny.net/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

<!-- Pattern 2: Preconnect associé (à supprimer aussi) -->
<link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Pattern 3: DNS-prefetch associé (à supprimer aussi) -->
<link rel="dns-prefetch" href="//fonts.bunny.net">
<link rel="dns-prefetch" href="//fonts.googleapis.com">
```

### 2. Remove External Font References

Supprimer toutes les lignes contenant:
- `<link.*fonts\.(google|bunny|googleapis|gstatic)`
- `<link.*preconnect.*fonts\.(google|bunny|googleapis|gstatic)`
- `<link.*dns-prefetch.*fonts\.(google|bunny|googleapis|gstatic)`

### 3. Add Local Font CSS

Ajouter le nouveau lien vers le CSS local, dans le `<head>`, après les meta tags:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>...</title>

  <!-- Fonts auto-hébergées (GDPR compliant) -->
  <link rel="stylesheet" href="assets/fonts/inter.css">

  <!-- Other stylesheets -->
  <link rel="stylesheet" href="css/styles.css">
</head>
```

**Important**:
- ✅ Charger les fonts **avant** les feuilles de style principales
- ✅ Utiliser `rel="stylesheet"` (pas de preload nécessaire avec font-display: swap)
- ✅ Chemin relatif correct selon la structure du site

## Implementation Script Template

```bash
#!/bin/bash
# Font Self-Hosting Script
# Part of static-site-optimizer

set -e

FONT_DIR="assets/fonts"
FAMILY="$1"        # Ex: "Inter"
WEIGHTS="$2"       # Ex: "400,600,700"
SLUG="$3"          # Ex: "inter"

# Create directory
mkdir -p "$FONT_DIR"

# Download fonts from Bunny Fonts
IFS=',' read -ra WEIGHT_ARRAY <<< "$WEIGHTS"
for weight in "${WEIGHT_ARRAY[@]}"; do
  echo "Downloading ${FAMILY} ${weight}..."

  url="https://fonts.bunny.net/${SLUG}/files/${SLUG}-latin-${weight}-normal.woff2"
  output="${FONT_DIR}/${SLUG}-${weight}.woff2"

  if curl -sL "$url" -o "$output"; then
    size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
    echo "  ✓ Downloaded: $output (${size} bytes)"
  else
    echo "  ✗ Failed to download $url"
    rm -f "$output"
  fi
done

# Generate CSS file
css_file="${FONT_DIR}/${SLUG}.css"
echo "/* ${FAMILY} Font - Auto-hébergé pour GDPR et performance */" > "$css_file"
echo "/* Généré automatiquement par static-site-optimizer */" >> "$css_file"
echo "" >> "$css_file"

for weight in "${WEIGHT_ARRAY[@]}"; do
  cat >> "$css_file" <<EOF
@font-face {
    font-family: '${FAMILY}';
    font-style: normal;
    font-weight: ${weight};
    font-display: swap;
    src: url('${SLUG}-${weight}.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

EOF
done

echo "✓ Generated: $css_file"
```

## Verification Checklist

After self-hosting fonts, verify:

- [ ] **Files downloaded**: All woff2 files present in `assets/fonts/`
- [ ] **CSS generated**: CSS file created with all @font-face declarations
- [ ] **HTML updated**: External font links removed, local CSS added
- [ ] **Preconnect removed**: All font-related preconnect/dns-prefetch removed
- [ ] **Paths correct**: Relative paths work from all HTML files
- [ ] **Fonts loading**: Visual inspection in browser
- [ ] **No 404s**: Browser console shows no missing font files
- [ ] **Performance**: Lighthouse shows fonts loading from origin

## Performance Impact

### Before (External Fonts)
```
1. DNS lookup:        ~50ms
2. TCP connection:    ~100ms
3. TLS handshake:     ~150ms
4. CSS request:       ~200ms
5. CSS parse:         ~10ms
6. Font download:     ~200ms
Total:                ~710ms (render-blocking)
```

### After (Self-Hosted)
```
1. CSS request:       ~20ms (same origin, cached)
2. CSS parse:         ~5ms
3. Font download:     ~50ms (same origin, HTTP/2)
Total:                ~75ms (-89% latency)
```

**Additional benefits**:
- ✅ HTTP/2 multiplexing (same origin)
- ✅ No cross-origin overhead
- ✅ Better caching control
- ✅ No GDPR consent required

## Reporting

Add to optimization report:

```markdown
### Fonts Auto-Hébergées

✅ {Family} ({weights}): {total_size} téléchargés
  - Suppression: fonts.{provider}.net (-{latency}ms requête bloquante)
  - Ajout: font-display: swap
  - Fichiers créés:
    • assets/fonts/{slug}-400.woff2 ({size} KB)
    • assets/fonts/{slug}-600.woff2 ({size} KB)
    • assets/fonts/{slug}-700.woff2 ({size} KB)
    • assets/fonts/{slug}.css ({size} KB)

Impact GDPR: ✓ Compliant (aucune requête tierce)
Impact Performance: -{latency}ms LCP, +{score} PageSpeed
```

**Example**:
```markdown
### Fonts Auto-Hébergées

✅ Inter (400, 600, 700): 71KB téléchargés
  - Suppression: fonts.bunny.net (-790ms requête bloquante)
  - Ajout: font-display: swap
  - Fichiers créés:
    • assets/fonts/inter-400.woff2 (23KB)
    • assets/fonts/inter-600.woff2 (24KB)
    • assets/fonts/inter-700.woff2 (24KB)
    • assets/fonts/inter.css (1.5KB)

Impact GDPR: ✓ Compliant (aucune requête tierce)
Impact Performance: -790ms LCP, +8 PageSpeed
```

## Edge Cases & Troubleshooting

### Issue 1: Font Not Available on Bunny Fonts

**Solution**: Fallback to Google Fonts download
```bash
# Use google-webfonts-helper API (manual process)
# Or warn user to provide custom font files
```

### Issue 2: Multiple Font Families

**Solution**: Create separate CSS files for each family
```
assets/fonts/
├── inter.css
├── inter-400.woff2
├── inter-600.woff2
├── roboto.css
├── roboto-400.woff2
└── roboto-700.woff2
```

HTML:
```html
<link rel="stylesheet" href="assets/fonts/inter.css">
<link rel="stylesheet" href="assets/fonts/roboto.css">
```

### Issue 3: Different File Structure

Si le site utilise `/fonts/` au lieu de `/assets/fonts/`:
- Adapter les chemins selon la structure existante
- Vérifier les chemins relatifs dans le CSS généré

### Issue 4: Font Variants (Italic)

Si besoin d'italic (`font-style: italic`):
```bash
# Bunny Fonts pattern:
# {family}-{subset}-{weight}-italic.woff2
curl -sL "https://fonts.bunny.net/inter/files/inter-latin-400-italic.woff2" \
  -o assets/fonts/inter-400-italic.woff2
```

CSS:
```css
@font-face {
    font-family: 'Inter';
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url('inter-400-italic.woff2') format('woff2');
}
```

## Best Practices

1. **Only download needed weights**: Ne pas télécharger 100-900 si seul 400,700 utilisé
2. **Use font-display: swap**: Éviter FOIT (Flash Of Invisible Text)
3. **Keep unicode-range**: Permet au navigateur de ne charger que si nécessaire
4. **Use woff2 only**: Support navigateurs modernes (95%+), pas besoin de woff/ttf
5. **Relative paths**: Utiliser chemins relatifs pour portabilité
6. **Version control fonts**: Commiter les fonts avec le code (petits fichiers)

## Integration with DEV Workflow

This module should be invoked in **Step 4** of `optimize-dev.md`, alongside GDPR compliance:

```markdown
### Step 4: GDPR/RGPD Compliance + Font Self-Hosting

Invoke:
1. `static-site-optimizer:gdpr-responsive` (Google Fonts → Bunny Fonts)
2. `static-site-optimizer:fonts-self-host` (Bunny Fonts → Self-Hosted)

Result:
- Google Fonts → Bunny Fonts → Self-Hosted
- Zero external font requests
- Full GDPR compliance
```

---

**Module ready for integration into optimize-dev workflow.**
