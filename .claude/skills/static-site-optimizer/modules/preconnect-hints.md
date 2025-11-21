# Preconnect & DNS-Prefetch Hints Module

## Purpose

Ajouter automatiquement des resource hints (preconnect, dns-prefetch, preload) pour:
- ✅ **Performance**: -200 à -500ms latence connexion
- ✅ **LCP**: Amélioration du Largest Contentful Paint
- ✅ **User Experience**: Ressources externes chargées plus rapidement
- ✅ **Third-party content**: Iframes, fonts, images optimisés

## Problem Statement

### Without Resource Hints

Quand le navigateur rencontre une ressource externe:
1. **DNS lookup**: ~50ms (résolution du nom de domaine)
2. **TCP connection**: ~100ms (handshake TCP)
3. **TLS negotiation**: ~150ms (si HTTPS)
4. **Total**: ~300ms avant de commencer le téléchargement

**Example**:
```html
<!-- Aucun hint -->
<iframe src="https://external-widget.com/embed"></iframe>
<!-- Le navigateur découvre l'iframe au parsing, puis:
     1. DNS lookup (50ms)
     2. TCP (100ms)
     3. TLS (150ms)
     Total: 300ms de latence évitable -->
```

### With Resource Hints

Avec preconnect/dns-prefetch dans le `<head>`:
1. **DNS lookup**: Fait en avance (parallèle)
2. **TCP connection**: Établie avant besoin
3. **TLS negotiation**: Complétée en avance
4. **Total**: ~0ms quand la ressource est demandée

**Example**:
```html
<head>
  <!-- Hints ajoutés -->
  <link rel="preconnect" href="https://external-widget.com" crossorigin>
</head>
<body>
  <!-- L'iframe utilise la connexion déjà établie -->
  <iframe src="https://external-widget.com/embed"></iframe>
  <!-- Latence: ~0ms (connexion déjà prête) -->
</body>
```

## Resource Hint Types

### 1. dns-prefetch

**Purpose**: Résoudre le DNS uniquement (le plus léger)

**When to use**:
- Ressources dont on n'est pas sûr qu'elles seront utilisées
- Beaucoup de domaines externes (>3)
- Connexion lente ou DNS lent

**Example**:
```html
<link rel="dns-prefetch" href="//cdn.example.com">
```

**Cost**: Très faible (~1KB)
**Benefit**: -50ms latence DNS

### 2. preconnect

**Purpose**: DNS + TCP + TLS (connexion complète)

**When to use**:
- Ressources critiques (fonts, iframes)
- Ressources garanties d'être utilisées
- CORS resources (besoin du `crossorigin`)

**Example**:
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Cost**: Modéré (~10KB + socket ouvert)
**Benefit**: -300ms latence totale

**IMPORTANT**: Limiter à 4-6 preconnect max (coût réseau/mémoire)

### 3. preload

**Purpose**: Télécharger la ressource immédiatement

**When to use**:
- Ressources critiques above-the-fold
- Fonts utilisées immédiatement
- Images hero

**Example**:
```html
<link rel="preload" href="hero.jpg" as="image">
<link rel="preload" href="font.woff2" as="font" crossorigin>
```

**Cost**: Élevé (télécharge la ressource)
**Benefit**: LCP réduit de 500-1000ms

## Detection Strategy

### 1. Scan HTML for External Resources

Identifier tous les domaines externes utilisés:

```bash
# Extraire tous les domaines HTTPS externes
grep -ohE 'https://[^/"]+' index.html | sort -u > external-domains.txt

# Exclure le domaine actuel (si connu)
grep -v 'mysite.com' external-domains.txt
```

### 2. Classify Resources by Type

**Iframes** (haute priorité - preconnect):
```html
<iframe src="https://www.youtube.com/embed/..."></iframe>
<iframe src="https://www.google.com/maps/embed?..."></iframe>
<iframe src="https://widget.trustpilot.com/..."></iframe>
```

**Fonts** (haute priorité - preconnect):
```html
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">
<!-- Détection: fonts.googleapis.com, fonts.gstatic.com -->
```

**Images externes** (moyenne priorité - dns-prefetch):
```html
<img src="https://cdn.example.com/image.jpg">
<!-- Détection: img[src^="https://"] -->
```

**Scripts/CSS externes** (moyenne priorité):
```html
<script src="https://cdn.jsdelivr.net/..."></script>
<link href="https://cdn.jsdelivr.net/..." rel="stylesheet">
```

**Vidéos externes** (haute priorité - preconnect):
```html
<video poster="https://cdn.video.com/poster.jpg">
  <source src="https://cdn.video.com/video.mp4">
</video>
```

### 3. Determine Hint Type

**Decision tree**:

```
Is resource used above-the-fold AND critical?
├─ Yes → preload
└─ No ↓

Is resource guaranteed to be used (iframe, font)?
├─ Yes → preconnect (with crossorigin if needed)
└─ No ↓

Is resource likely to be used (images)?
├─ Yes → dns-prefetch
└─ No → No hint
```

**Specific rules**:

| Resource Type | Hint Type | Crossorigin | Priority |
|--------------|-----------|-------------|----------|
| Iframes | preconnect | Yes | High |
| Fonts (external) | preconnect | Yes | High |
| Hero images | preload | No | High |
| CDN scripts | preconnect | No | Medium |
| Third-party images | dns-prefetch | No | Low |
| Analytics | dns-prefetch | No | Low |

## Common External Domains

### Iframes

```javascript
const iframeDomains = [
  'www.youtube.com',           // YouTube embeds
  'player.vimeo.com',          // Vimeo embeds
  'www.google.com',            // Google Maps
  'www.openstreetmap.org',     // OpenStreetMap
  'roundshot.com',             // Webcams (ex: roundshot.com)
  'widget.trustpilot.com',     // Trustpilot
  'www.facebook.com',          // Facebook embeds
  'platform.twitter.com',      // Twitter embeds
];
```

### Fonts

```javascript
const fontDomains = [
  'fonts.googleapis.com',      // Google Fonts CSS
  'fonts.gstatic.com',         // Google Fonts files
  'fonts.bunny.net',           // Bunny Fonts
  'use.typekit.net',           // Adobe Fonts
];
```

### CDNs

```javascript
const cdnDomains = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'cdn.skypack.dev',
];
```

### Analytics & Tracking

```javascript
const analyticsDomains = [
  'www.google-analytics.com',
  'www.googletagmanager.com',
  'plausible.io',
  'analytics.google.com',
];
```

## HTML Generation Strategy

### Placement in `<head>`

Resource hints doivent être placés **tôt** dans le `<head>`, avant les stylesheets:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 1. Resource hints (as early as possible) -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://www.youtube.com" crossorigin>
  <link rel="dns-prefetch" href="//cdn.example.com">

  <!-- 2. Preloads (critical resources) -->
  <link rel="preload" href="hero.jpg" as="image">

  <!-- 3. Stylesheets -->
  <link rel="stylesheet" href="css/styles.css">

  <!-- 4. Title, meta tags, etc. -->
  <title>Page Title</title>
</head>
```

### Template Structure

Générer un bloc organisé:

```html
<!-- ============================================
     Performance Optimizations - Resource Hints
     Auto-generated by static-site-optimizer
     ============================================ -->

<!-- Critical third-party connections -->
<link rel="preconnect" href="https://www.skaping.com" crossorigin>
<link rel="preconnect" href="https://serrechevalier.roundshot.com" crossorigin>

<!-- Additional external resources -->
<link rel="dns-prefetch" href="//meteo-serre-chevalier.fr">

<!-- Critical resource preloads -->
<link rel="preload" href="images/hero.jpg" as="image">

<!-- ============================================ -->
```

### Grouping Strategy

Grouper les hints par type pour lisibilité:

```html
<!-- Group 1: Preconnect (critical connections) -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.example.com" crossorigin>

<!-- Group 2: DNS-prefetch (optional connections) -->
<link rel="dns-prefetch" href="//analytics.google.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">

<!-- Group 3: Preload (critical resources) -->
<link rel="preload" href="hero.avif" as="image" type="image/avif">
<link rel="preload" href="fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
```

## Crossorigin Attribute Rules

**When to add `crossorigin`**:

✅ **Always crossorigin**:
- Fonts (CORS required)
- Iframes (établir connexion CORS)
- Preload for fonts

✅ **Usually crossorigin**:
- Third-party APIs
- CDN resources with CORS
- Analytics (si utilise fetch/XHR)

❌ **No crossorigin**:
- Simple images
- Same-origin resources
- DNS-prefetch (n'a pas de crossorigin)

**Examples**:
```html
<!-- Fonts: MUST have crossorigin -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="font.woff2" as="font" crossorigin>

<!-- Iframes: Should have crossorigin -->
<link rel="preconnect" href="https://www.youtube.com" crossorigin>

<!-- Images: Usually NO crossorigin (unless CORS needed) -->
<link rel="dns-prefetch" href="//cdn.images.com">
<link rel="preload" href="hero.jpg" as="image">  <!-- No crossorigin -->

<!-- DNS-prefetch: NEVER has crossorigin -->
<link rel="dns-prefetch" href="//analytics.com">
```

## Implementation Logic

### Pseudo-Code

```javascript
function generateResourceHints(html) {
  const domains = extractExternalDomains(html);
  const hints = {
    preconnect: [],
    dnsPrefetch: [],
    preload: []
  };

  domains.forEach(domain => {
    const classification = classifyDomain(domain, html);

    switch (classification.type) {
      case 'iframe':
      case 'font':
        hints.preconnect.push({
          href: domain,
          crossorigin: true
        });
        break;

      case 'critical-image':
        hints.preload.push({
          href: classification.path,
          as: 'image',
          type: classification.mimeType
        });
        break;

      case 'cdn':
      case 'analytics':
        hints.dnsPrefetch.push({
          href: domain
        });
        break;
    }
  });

  return buildHintsHTML(hints);
}

function classifyDomain(domain, html) {
  // Check if domain hosts iframes
  if (html.includes(`<iframe[^>]*src="${domain}`)) {
    return { type: 'iframe', priority: 'high' };
  }

  // Check if domain hosts fonts
  if (domain.includes('font') || html.includes(`${domain}.*\\.woff2`)) {
    return { type: 'font', priority: 'high' };
  }

  // Check if domain is CDN
  if (domain.includes('cdn') || domain.includes('jsdelivr')) {
    return { type: 'cdn', priority: 'medium' };
  }

  // Check if domain is analytics
  if (domain.includes('analytics') || domain.includes('google-analytics')) {
    return { type: 'analytics', priority: 'low' };
  }

  // Default: external image/resource
  return { type: 'external', priority: 'low' };
}
```

### Deduplication

Éviter les doublons:

```javascript
function deduplicateHints(existingHints, newHints) {
  const existing = extractHrefFromHints(existingHints);

  return newHints.filter(hint => {
    return !existing.includes(hint.href);
  });
}
```

## Examples

### Example 1: Website with YouTube Embed

**HTML détecté**:
```html
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
```

**Hint généré**:
```html
<link rel="preconnect" href="https://www.youtube.com" crossorigin>
```

**Impact**:
- Latence réduite de ~300ms
- LCP amélioré si iframe above-the-fold

### Example 2: Website with External Images

**HTML détecté**:
```html
<img src="https://cdn.example.com/images/hero.jpg">
<img src="https://cdn.example.com/images/logo.png">
```

**Hint généré**:
```html
<link rel="dns-prefetch" href="//cdn.example.com">
```

**Impact**:
- DNS lookup réduit de ~50ms
- Première image charge plus vite

### Example 3: Website with Webcam Iframe

**HTML détecté**:
```html
<iframe src="https://serrechevalier.roundshot.com/..."></iframe>
```

**Hint généré**:
```html
<link rel="preconnect" href="https://serrechevalier.roundshot.com" crossorigin>
```

### Example 4: Multiple External Domains

**HTML détecté**:
```html
<iframe src="https://www.skaping.com/widget"></iframe>
<iframe src="https://serrechevalier.roundshot.com/cam"></iframe>
<img src="https://meteo-serre-chevalier.fr/icon.png">
```

**Hints générés**:
```html
<!-- Critical third-party connections (iframes) -->
<link rel="preconnect" href="https://www.skaping.com" crossorigin>
<link rel="preconnect" href="https://serrechevalier.roundshot.com" crossorigin>

<!-- Additional external resources (images) -->
<link rel="dns-prefetch" href="//meteo-serre-chevalier.fr">
```

## Special Cases

### Case 1: Google Fonts

Si Google Fonts détecté:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">
```

**Hints requis** (2 domaines):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Why 2 domains?**:
- `fonts.googleapis.com`: CSS file
- `fonts.gstatic.com`: Font files (woff2)

### Case 2: Self-Hosted Fonts

Si fonts auto-hébergées (après module fonts-self-host):
```html
<link rel="stylesheet" href="assets/fonts/inter.css">
```

**Hints**: **AUCUN** (same-origin, pas besoin de preconnect)

### Case 3: Multiple Iframes Same Domain

**HTML**:
```html
<iframe src="https://www.youtube.com/embed/video1"></iframe>
<iframe src="https://www.youtube.com/embed/video2"></iframe>
<iframe src="https://www.youtube.com/embed/video3"></iframe>
```

**Hint** (1 seul, dédupliqué):
```html
<link rel="preconnect" href="https://www.youtube.com" crossorigin>
```

### Case 4: Lazy-Loaded Images

**HTML**:
```html
<img src="placeholder.jpg" data-src="https://cdn.com/real.jpg" loading="lazy">
```

**Detection**: Chercher aussi `data-src`, `data-lazy`, etc.

**Hint**: `dns-prefetch` (car lazy, pas critique)

## Verification Checklist

After adding hints:

- [ ] **Hints placement**: Dans `<head>`, avant stylesheets
- [ ] **Crossorigin correct**: Présent pour fonts/iframes
- [ ] **No duplicates**: Chaque domaine une seule fois
- [ ] **Limit preconnect**: Max 4-6 preconnect
- [ ] **Protocol correct**: `https://` pour preconnect, `//` OK pour dns-prefetch
- [ ] **Resource types**: `as` attribute correct pour preload
- [ ] **Visual test**: Ressources chargent correctement
- [ ] **DevTools**: Vérifier les connexions dans Network tab

## Testing Strategy

### Chrome DevTools Network Tab

1. **Ouvrir DevTools** → Network
2. **Recharger la page** (Cmd+R)
3. **Vérifier la colonne "Waterfall"**:
   - ✅ Domaines avec preconnect: connexion établie tôt (ligne bleue)
   - ✅ Ressources externes: pas de latence DNS/TCP

### Lighthouse

**Avant**:
```
⚠ Preconnect to required origins
  Potential savings: 300ms
```

**Après**:
```
✓ All critical origins have preconnect hints
```

### WebPageTest

- **Before**: DNS + Connect time: 300ms
- **After**: DNS + Connect time: 0ms (cached connection)

## Reporting

Add to optimization report:

```markdown
### Resource Hints Ajoutés

✅ {count} domaines externes optimisés
  - Preconnect: {preconnect_count} domaines (iframes, fonts)
  - DNS-prefetch: {dnsPrefetch_count} domaines (images, analytics)
  - Preload: {preload_count} ressources critiques

Domaines optimisés:
  • {domain1} (preconnect + crossorigin) - iframe
  • {domain2} (preconnect + crossorigin) - iframe
  • {domain3} (dns-prefetch) - images externes

Impact Performance:
  - Latence connexion: -{latency_reduction}ms
  - LCP: -{lcp_improvement}ms (si iframes above-fold)
  - PageSpeed: +{score} points
```

**Example**:
```markdown
### Resource Hints Ajoutés

✅ 3 domaines externes optimisés
  - Preconnect: 2 domaines (iframes)
  - DNS-prefetch: 1 domaine (images)

Domaines optimisés:
  • www.skaping.com (preconnect + crossorigin) - iframe booking
  • serrechevalier.roundshot.com (preconnect + crossorigin) - iframe webcam
  • meteo-serre-chevalier.fr (dns-prefetch) - icônes météo

Impact Performance:
  - Latence connexion: -600ms (2 iframes × 300ms)
  - LCP: -450ms (iframe above-fold)
  - PageSpeed: +3 points (LCP improved)
```

## Edge Cases & Troubleshooting

### Issue 1: Too Many Preconnect

**Problem**: Plus de 6 preconnect ajoutés

**Solution**: Limiter aux 4-6 plus critiques, reste en dns-prefetch
```javascript
if (preconnectDomains.length > 6) {
  // Keep top 6, convert others to dns-prefetch
  const topDomains = preconnectDomains.slice(0, 6);
  const otherDomains = preconnectDomains.slice(6);
  // Convert otherDomains to dns-prefetch
}
```

### Issue 2: Same-Origin Detected as External

**Problem**: `<img src="https://mysite.com/image.jpg">` détecté comme externe

**Solution**: Filtrer le domaine actuel
```javascript
const currentDomain = extractDomainFromURL(window.location.href);
const externalDomains = allDomains.filter(d => d !== currentDomain);
```

### Issue 3: Data URLs

**Problem**: `data:image/...` détecté

**Solution**: Filtrer les data URLs
```javascript
const httpDomains = domains.filter(d => d.startsWith('http'));
```

### Issue 4: Relative URLs

**Problem**: `//cdn.example.com` (protocol-relative)

**Solution**: Convertir en HTTPS
```javascript
const normalizedURL = url.startsWith('//') ? 'https:' + url : url;
```

## Best Practices

1. **Limit preconnect**: Max 4-6 (coût mémoire/réseau)
2. **Prioritize above-the-fold**: Iframes/images visibles en premier
3. **Use dns-prefetch for many domains**: Moins coûteux
4. **Always crossorigin for fonts**: Requis par spec
5. **Place early in `<head>`**: Avant stylesheets
6. **Deduplicate**: Un hint par domaine
7. **HTTPS only for preconnect**: Protocol-relative pour dns-prefetch OK

## Performance Impact

### Metrics

| Resource Type | Before | After | Improvement |
|--------------|--------|-------|-------------|
| Iframe (YouTube) | 300ms | 0ms | -100% |
| External font | 300ms | 0ms | -100% |
| CDN image | 50ms | 0ms | -100% |

### PageSpeed Impact

- **LCP**: -200 to -500ms (si iframes/images above-fold)
- **Performance Score**: +2 to +5 points
- **Lighthouse**: "Preconnect to required origins" ✓ passed

## Integration with DEV Workflow

This module should be invoked as a new step in `optimize-dev.md`:

```markdown
### Step X: Resource Hints (Preconnect/DNS-Prefetch)

Invoke `static-site-optimizer:preconnect-hints` to:
- Scan HTML for external domains (iframes, fonts, images, etc.)
- Classify by resource type and priority
- Generate preconnect hints for critical resources (iframes, fonts)
- Generate dns-prefetch hints for secondary resources (images, analytics)
- Add preload hints for above-the-fold critical resources
- Insert hints in `<head>` with proper crossorigin attributes

Expected result:
  ✓ External domains optimized with resource hints
  ✓ -200 to -500ms latency reduction
  ✓ LCP improved for pages with external iframes/images
  ✓ No duplicate hints
```

---

**Module ready for integration into optimize-dev workflow.**
