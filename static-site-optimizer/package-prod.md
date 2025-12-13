# Production Packaging Workflow

You are packaging a static website for **PRODUCTION DEPLOYMENT**. Apply all aggressive optimizations to maximize performance, minimize bandwidth, and achieve perfect PageSpeed scores.

## Philosophy

**PRODUCTION = MAXIMUM PERFORMANCE + MINIMUM SIZE + PERFECT SCORES**

This workflow focuses on:
- ✅ Aggressive minification (code becomes unreadable)
- ✅ Image format conversion (AVIF + WebP)
- ✅ Pre-compression (Brotli + Gzip)
- ✅ Code optimization (tree-shaking, bundling)
- ✅ Maximum bandwidth savings
- ✅ PageSpeed 95-100 scores
- ❌ Code readability sacrificed for performance
- ❌ Source files are transformed (not for editing)

## Prerequisites

**⚠️ IMPORTANT**: This workflow should ONLY be run on code that has already been:
1. Validated (no errors)
2. GDPR-compliant (Bunny Fonts, no tracking without consent)
3. Accessibility-ready (WCAG AA)
4. SEO-structured

**Recommendation**: Run `static-site-optimizer:optimize-dev` first!

## User Input Required

Ask the user for:
1. **Source directory**: Path to validated, dev-optimized code
2. **Production directory**: Where to save production build (default: {source}_prod or dist/)
3. **Compression level**: Conservative/Balanced/Aggressive (default: Aggressive)
4. **Keep sources**: Whether to keep uncompressed versions (default: yes)

## Production Packaging Workflow - 11 Steps

### Step 1: Pre-Flight Checks

Verify the source code is production-ready:
- ✅ No validation errors
- ✅ GDPR compliant (no Google Fonts)
- ✅ All images have alt text
- ✅ Proper meta tags present
- ⚠️ Warn if tracking scripts without consent

If checks fail, recommend running DEV workflow first.

### Step 2: Setup Production Directory

1. Create production output directory
2. Mirror source structure
3. Initialize build report
4. Copy non-processable files (fonts, PDFs, etc.)

### Step 3: Image Optimization (AGGRESSIVE)

Invoke the `static-site-optimizer:optimize-images` skill with full processing:

**Convert to modern formats:**
- Generate AVIF versions (quality 80)
- Generate WebP versions (quality 85)
- Optimize original formats as fallback (quality 85)

**Generate responsive variants:**
- 320w (mobile small)
- 640w (mobile)
- 768w (tablet)
- 1024w (desktop)
- 1920w (large desktop)

**Update HTML:**
- Replace ALL `<img>` with `<picture>` elements
- Add proper srcsets for each format
- Add lazy loading (except first 2-3 images)
- Add explicit dimensions (width/height)
- Use `loading="lazy"` and `decoding="async"`

**Expected results:**
```
Original:  hero.jpg         450 KB
AVIF:      hero-1024w.avif   45 KB (-90%)
WebP:      hero-1024w.webp   68 KB (-85%)
JPEG:      hero-1024w.jpg   135 KB (-70%)
```

### Step 4: CSS Optimization

**Aggressive CSS processing:**
- Remove unused CSS (PurgeCSS)
- Minify with cssnano (advanced preset)
- Merge duplicate selectors
- Optimize values (0px → 0, #ffffff → #fff)
- Remove comments
- Merge media queries

⚠️ **ATTENTION - Options CSSO:**
Si CSSO est utilisé, **TOUJOURS utiliser `--no-restructure`** pour éviter que les propriétés CSS ne soient séparées, ce qui casse les animations et gradients:
```bash
csso --no-restructure input.css --output output.min.css
```

**Critical CSS:**
- Extract above-the-fold CSS
- Inline critical CSS in `<head>`
- Load remaining CSS asynchronously
- Add `<noscript>` fallback

**Output:**
```css
/* Before: styles.css - 180 KB */
/* After:  styles.min.css - 25 KB (-86%) */
```

### Step 5: JavaScript Optimization

**Aggressive JS processing:**
- Minify with Terser (mangle + compress)
- Remove console.log statements
- Remove debugger statements
- Remove dead code (tree-shaking)
- Optimize expressions
- Shorten variable names

**Modern JavaScript:**
- Bundle modules if needed
- Code splitting for large apps
- Dynamic imports for lazy loading

**Output:**
```javascript
/* Before: app.js - 250 KB */
/* After:  app.min.js - 68 KB (-73%) */
```

### Step 6: HTML Minification

**Aggressive HTML processing:**
- Remove all comments (except IE conditionals)
- Collapse whitespace
- Remove optional closing tags
- Remove redundant attributes
- Remove quotes where safe
- Minify inline CSS and JS
- Remove empty attributes

⚠️ **ATTENTION - Options html-minifier-terser:**
**NE JAMAIS utiliser `--remove-tag-whitespace`** car cette option supprime les espaces entre les attributs HTML et génère du HTML invalide:
```html
<!-- Résultat cassé avec --remove-tag-whitespace -->
<span class="title"data-i18n="key">  <!-- Espace manquant ! -->
```

**Commande sécurisée:**
```bash
html-minifier-terser \
  --collapse-whitespace \
  --remove-comments \
  --remove-redundant-attributes \
  --remove-script-type-attributes \
  --minify-css true \
  --minify-js true \
  input.html -o output.html
```

**Inline optimizations:**
- Inline critical CSS
- Inline small SVGs
- Inline data URIs for tiny images (<2KB)

**Output:**
```html
<!-- Before: index.html - 85 KB -->
<!-- After:  index.html - 32 KB (-62%) -->
```

### Step 7: Cache-Busting for CSS and JS

**Add version timestamps to prevent browser caching issues:**

Generate timestamp-based cache busting for all CSS and JavaScript files:
- Use current date/time as version parameter
- Format: `YYYYMMDDHHMMSS` (e.g., 20231121154530)
- Update all HTML references automatically

**Processing:**
- Rename files to include timestamp:
  - `styles.min.css` → `styles.min.css?v=20231121154530`
  - Or: `styles.min.css` → `styles.min.20231121154530.css`
- Update all `<link>` tags for CSS
- Update all `<script>` tags for JavaScript
- Update any CSS `@import` statements
- Update any inline references

**Example transformation:**
```html
<!-- Before -->
<link rel="stylesheet" href="css/styles.min.css">
<script src="js/app.min.js"></script>

<!-- After (query string method) -->
<link rel="stylesheet" href="css/styles.min.css?v=20231121154530">
<script src="js/app.min.js?v=20231121154530"></script>

<!-- Or (filename method - recommended) -->
<link rel="stylesheet" href="css/styles.min.20231121154530.css">
<script src="js/app.min.20231121154530.js"></script>
```

**Benefits:**
- Forces browser to reload updated assets
- Prevents stale cache issues
- Version tracking for debugging
- No server configuration needed

**Output:**
```
Cache-busting applied:
  CSS files: 8 files versioned (v=20231121154530)
  JS files: 6 files versioned (v=20231121154530)
  HTML updates: 12 files updated with new URLs
```

### Step 8: Pre-Compression (Brotli + Gzip)

Invoke the `static-site-optimizer:compress` skill with maximum quality:

**Generate compressed versions:**
- Brotli level 11 (maximum quality)
  - ~80% compression ratio
  - Modern browsers
- Gzip level 9 (maximum compression)
  - ~70% compression ratio
  - Universal fallback

**Process all text files:**
- HTML, CSS, JavaScript
- JSON, XML, SVG
- Source maps (if generated)
- Manifest files

**Result structure:**
```
dist/
├── index.html
├── index.html.br      (-80%)
├── index.html.gz      (-70%)
├── styles.min.css
├── styles.min.css.br  (-82%)
├── styles.min.css.gz  (-73%)
└── ...
```

### Step 9: Performance Optimizations

**Add resource hints:**
```html
<link rel="dns-prefetch" href="//fonts.bunny.net">
<link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-1024w.avif" as="image">
```

**Optimize loading:**
- Add `async` to non-critical scripts
- Add `defer` to DOM-dependent scripts
- Add `font-display: swap` to fonts
- Implement service worker (optional)


### Step 10: PageSpeed Audit

Invoke the `static-site-optimizer:pagespeed` skill to:
- Run Lighthouse audit (mobile + desktop)
- Verify Core Web Vitals
- Check all PageSpeed categories:
  - Performance: Target 95-100
  - Accessibility: Target 100
  - Best Practices: Target 95-100
  - SEO: Target 100

If scores are below target, identify and fix remaining issues.

### Step 11: Production Build Report

Generate comprehensive production report:

```
===========================================
PRODUCTION BUILD REPORT
===========================================

🎯 TARGET: Maximum Performance Production Build

📦 MINIFICATION:
  HTML: 12 files
    Original:  450 KB
    Minified:  145 KB  (-68%)

  CSS: 8 files
    Original:  180 KB
    Minified:   28 KB  (-84%)
    Unused removed: 95 KB

  JavaScript: 6 files
    Original:  320 KB
    Minified:   82 KB  (-74%)

🖼️ IMAGE OPTIMIZATION:
  Images processed: 45
  Formats generated:
    - AVIF: 225 files (90% smaller)
    - WebP: 225 files (85% smaller)
    - JPEG optimized: 45 files (70% smaller)

  Original total:  4.5 MB
  AVIF total:      450 KB  (-90%)
  WebP total:      675 KB  (-85%)
  JPEG total:      1.35 MB (-70%)

📦 PRE-COMPRESSION:
  Files compressed: 26

  Brotli (.br):
    Original:  850 KB
    Compressed: 170 KB  (-80%)

  Gzip (.gz):
    Original:  850 KB
    Compressed: 255 KB  (-70%)

💾 TOTAL SIZE COMPARISON:
  Source (dev):        5.45 MB
  Production (JPEG):   1.60 MB  (-71%)
  Production (WebP):   0.98 MB  (-82%)
  Production (AVIF):   0.73 MB  (-87%)
  With Brotli (AVIF):  0.62 MB  (-89%)

🚀 PAGESPEED SCORES:
  Mobile:
    Performance:     98/100  ✓
    Accessibility:  100/100  ✓
    Best Practices:  95/100  ✓
    SEO:            100/100  ✓

  Desktop:
    Performance:    100/100  ✓
    Accessibility:  100/100  ✓
    Best Practices:  95/100  ✓
    SEO:            100/100  ✓

⚡ CORE WEB VITALS (Mobile):
  LCP: 1.2s  ✓ (< 2.5s)
  FID:  45ms ✓ (< 100ms)
  CLS: 0.02  ✓ (< 0.1)
  FCP: 0.9s  ✓ (< 1.8s)
  SI:  1.8s  ✓ (< 3.4s)
  TBT:  55ms ✓ (< 200ms)

===========================================
✅ PRODUCTION BUILD SUCCESSFUL
===========================================

📁 Output directory: /path/to/dist
📄 Build report: dist/build-report.json
📄 PageSpeed report: dist/pagespeed-report.json

📊 BANDWIDTH SAVINGS PER PAGE LOAD:
  With AVIF + Brotli: ~89% bandwidth saved
  Estimated cost savings: $XX/month at 10K visitors

🚀 DEPLOYMENT CHECKLIST:
  ✓ All files minified
  ✓ Images in modern formats
  ✓ Pre-compressed versions ready
  ✓ PageSpeed scores excellent
  ✓ Core Web Vitals passed

⚠️ IMPORTANT NOTES:
  - This build is NOT editable (minified)
  - Keep your DEV source code separate
  - Use CDN for best global performance
  - Enable HTTP/2 or HTTP/3 on server
  - Configure proper cache headers

NEXT STEPS:
  1. Test the production build locally
  2. Upload to production server
  3. Verify compression is working:
     curl -H "Accept-Encoding: br,gzip" https://your-site.com
  4. Monitor PageSpeed scores in production
  5. Set up performance monitoring

===========================================
```

## Compression Level Options

### Conservative (Safe)
- Image quality: 90 (JPEG), 85 (WebP), 85 (AVIF)
- Minification: Basic
- Pre-compression: Gzip only
- Use case: High-quality portfolio sites

### Balanced (Recommended)
- Image quality: 85 (JPEG), 85 (WebP), 80 (AVIF)
- Minification: Standard
- Pre-compression: Brotli + Gzip
- Use case: Most production sites

### Aggressive (Maximum Performance)
- Image quality: 80 (JPEG), 80 (WebP), 75 (AVIF)
- Minification: Maximum
- Pre-compression: Brotli 11 + Gzip 9
- Use case: High-traffic sites, bandwidth-critical

## Output Structure

```
dist/  (production build)
├── index.html                      (minified)
├── index.html.br                   (brotli compressed)
├── index.html.gz                   (gzip compressed)
├── css/
│   ├── styles.min.css             (minified, purged)
│   ├── styles.min.css.br
│   └── styles.min.css.gz
├── js/
│   ├── app.min.js                 (minified, tree-shaken)
│   ├── app.min.js.br
│   ├── app.min.js.gz
│   └── app.min.js.map             (source map, optional)
├── images/
│   ├── hero-320w.avif
│   ├── hero-320w.webp
│   ├── hero-320w.jpg
│   ├── hero-640w.avif
│   └── ...                         (all responsive variants)
├── assets/
│   ├── fonts/                      (web fonts)
│   └── ...
├── reports/
│   ├── build-report.json
│   ├── pagespeed-report.json
│   └── compression-report.json
├── sitemap.xml
├── sitemap.xml.gz
├── robots.txt
└── manifest.webmanifest
```

## Important Warnings

⚠️ **NOT for Development**:
- Code is minified (unreadable)
- Images are converted (not original)
- Cannot be edited directly
- Debugging is difficult

⚠️ **Source Control**:
- Do NOT commit production build to git
- Keep only DEV source in version control
- Build production on CI/CD or before deploy

⚠️ **Testing Required**:
- Test thoroughly before deploying
- Verify all images load correctly
- Check all functionality works
- Test on multiple browsers
- Verify compression headers

## Success Criteria

Production build is ready when:
- ✅ PageSpeed scores 95-100 on all metrics
- ✅ Core Web Vitals all green
- ✅ File sizes reduced by 70-90%
- ✅ All images in modern formats with fallbacks
- ✅ All text files pre-compressed
- ✅ Build report shows excellent results
- ✅ No broken functionality

---

**Begin production packaging process now.**
