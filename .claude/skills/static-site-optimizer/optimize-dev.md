# Development Optimization Workflow

You are optimizing a static website for the **development phase**. All optimizations must preserve code readability and maintainability for developers.

## Philosophy

**DEVELOPMENT = CODE QUALITY + COMPLIANCE + ACCESSIBILITY**

This workflow focuses on:
- ✅ Code quality and validation
- ✅ GDPR/RGPD compliance
- ✅ Accessibility improvements
- ✅ SEO structure
- ✅ Responsive design
- ❌ NO minification (code stays readable)
- ❌ NO aggressive compression (only basic optimization)
- ❌ NO source transformation (preserve for debugging)

## User Input Required

Ask the user for:
1. **Source directory**: Full path to the website source code
2. **Output directory**: Where to save optimized files (default: {source}_dev_optimized)
3. **Backup**: Whether to create a backup (default: yes)

## Development Workflow - 9 Steps

### Step 1: Initial Analysis and Backup

1. Verify the source directory exists
2. Create a backup if requested (to {source}_backup_{timestamp})
3. Analyze directory structure:
   - HTML files
   - CSS files
   - JavaScript files
   - Image files
   - Configuration files
4. Create output directory structure

### Step 2: Code Validation

Invoke the `static-site-optimizer:validate` skill to:
- **HTML Validation**:
  - W3C HTML5 standards
  - Semantic structure
  - Proper DOCTYPE
  - Meta tags presence
- **CSS Validation**:
  - Valid CSS syntax
  - No duplicate selectors
  - Proper vendor prefixes
- **JavaScript Validation**:
  - ESLint with standard config
  - No syntax errors
  - Best practices
- **Generate validation report**

### Step 3: Fix Validation Errors

Automatically fix common issues:
- Add missing DOCTYPE
- Add missing meta tags (charset, viewport)
- Fix unclosed HTML tags
- Add missing alt attributes (with placeholder)
- Correct CSS syntax errors
- Fix JavaScript common errors (var → const/let)
- Ensure proper semantic HTML5

**IMPORTANT**: Keep code readable with proper indentation and formatting.

### Step 4: GDPR/RGPD Compliance (CRITICAL)

Invoke the `static-site-optimizer:gdpr-responsive` skill to:
- **Google Fonts → Bunny Fonts replacement**
  - Automatic conversion
  - Privacy-friendly alternative
  - No IP tracking
- **Self-host external resources**
  - Download JavaScript libraries
  - Download CSS libraries
  - Store in local assets directory
- **Audit tracking scripts**
  - Detect Google Analytics, Facebook Pixel, etc.
  - Add warning comments
  - Recommend consent banner implementation
- **Responsive design verification**
  - Add viewport meta tags
  - Verify media queries exist
  - Ensure responsive images

### Step 5: Image Optimization (Basic)

**ONLY basic optimization, NO format conversion:**
- Optimize JPEG files (quality 90, progressive)
- Optimize PNG files (optipng, lossless)
- Optimize SVG files (SVGO)
- Add width/height attributes to images
- Add alt text placeholders if missing
- **DO NOT** convert to AVIF/WebP (keep originals)
- **DO NOT** create responsive variants
- **DO NOT** replace with `<picture>` elements

**Why**: Keep images in their original format for easy editing during development.

```bash
# Basic optimization only
jpegoptim --max=90 --strip-all images/*.jpg
optipng -o5 images/*.png
svgo --multipass images/*.svg
```

### Step 6: Accessibility Improvements

Apply accessibility fixes:
- Add ARIA labels where needed
- Ensure proper color contrast (WCAG AA: 4.5:1 minimum)
- Add skip navigation link
- Ensure logical heading hierarchy (h1 → h2 → h3)
- Add proper form labels
- Add keyboard navigation support
- Add focus indicators

### Step 7: SEO Structure

Ensure proper SEO foundation:
- Add/verify title tags (50-60 chars)
- Add/verify meta descriptions (150-160 chars)
- Add Open Graph tags
- Add Twitter Card tags
- Add canonical URLs
- Create sitemap.xml
- Create robots.txt
- Add structured data (JSON-LD) placeholders
- Verify heading hierarchy

### Step 8: Favicon Verification & Creation

**Check for existing favicon:**
- Look for `favicon.ico` in root directory
- Look for `favicon.svg` in root directory
- Look for `favicon.png` in root directory
- Check HTML `<link rel="icon">` declarations

**If no favicon exists, create one:**

**Option 1: Generate SVG Favicon (Recommended)**
Create a modern SVG favicon with the site's initials or logo:

```svg
<!-- Example: Simple letter favicon -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#2563eb" rx="20"/>
  <text x="50" y="70" font-size="60" font-weight="bold"
        text-anchor="middle" fill="white" font-family="Arial, sans-serif">
    S
  </text>
</svg>
```

**Option 2: Generate Multiple Sizes (Complete)**
For maximum compatibility, create:
- `favicon.svg` (modern browsers, scalable)
- `favicon.ico` (legacy browsers, 32x32)
- `apple-touch-icon.png` (180x180, iOS)
- `favicon-16x16.png`
- `favicon-32x32.png`

**Update HTML with favicon links:**
```html
<head>
  <!-- Modern browsers (SVG) -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <!-- Fallback for older browsers -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

  <!-- Apple devices -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Legacy (automatic in root) -->
  <link rel="shortcut icon" href="/favicon.ico">
</head>
```

**Automated generation script:**
Use the `generate-favicon.js` script to create a basic SVG favicon:

```javascript
// Prompts for:
// 1. Site name/initials (e.g., "MS" for "My Site")
// 2. Primary color (hex code)
// 3. Text color (default: white)
// Generates:
// - favicon.svg (optimized)
// - PNG variants (using sharp)
// - favicon.ico (multi-size)
// - Updates HTML files
```

**If favicon exists:**
- Verify it's properly linked in HTML
- Add missing favicon declarations
- Ensure proper MIME types
- Test loading in browser

**Benefits of SVG favicon:**
- ✅ Scalable (perfect on any resolution)
- ✅ Small file size (~500 bytes)
- ✅ Easy to edit
- ✅ Supports dark mode (via CSS media queries)
- ✅ Modern and crisp on retina displays

**Dark mode support (optional):**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <style>
    rect { fill: #2563eb; }
    text { fill: white; }
    @media (prefers-color-scheme: dark) {
      rect { fill: #60a5fa; }
    }
  </style>
  <rect width="100" height="100" rx="20"/>
  <text x="50" y="70" font-size="60" font-weight="bold"
        text-anchor="middle" font-family="Arial, sans-serif">S</text>
</svg>
```

### Step 9: Performance Audit (Baseline)

Invoke the `static-site-optimizer:pagespeed` skill to establish baseline metrics:

**Why in DEV workflow:**
- Identify performance issues early
- Establish baseline scores before production
- Guide optimization priorities
- Detect problems before they reach production

**Audit process:**
- Run Lighthouse on local server
- Analyze both mobile and desktop
- Generate performance report
- Identify low-hanging fruit improvements

**Expected DEV scores (without minification/compression):**
- Performance: 70-85 (baseline, will improve in PROD)
- Accessibility: 90-100 (should be high)
- Best Practices: 85-95
- SEO: 95-100 (should be excellent)

**Report includes:**
- Core Web Vitals baseline
- Recommendations for improvement
- Issues to address before PROD
- Validation that code structure is sound

**Important notes:**
- These are BASELINE scores
- Lower performance is expected (no minification yet)
- Focus on accessibility and SEO scores
- Performance will jump to 95-100 in PROD workflow

### Step 9: Development Report

Generate a comprehensive report:

```
===========================================
DEVELOPMENT OPTIMIZATION REPORT
===========================================

✅ CODE VALIDATION:
  HTML: 12 files validated, 5 errors fixed
  CSS:  8 files validated, 3 errors fixed
  JS:   6 files validated, 2 errors fixed

✅ GDPR COMPLIANCE:
  ⚠ Google Fonts → Bunny Fonts: 3 replacements
  ✓ External resources self-hosted: 5 libraries
  ⚠ Tracking scripts flagged: 2 (need consent)

✅ ACCESSIBILITY:
  ✓ ARIA labels added: 15
  ✓ Color contrast fixed: 3 issues
  ✓ Alt texts added: 8 images
  Score: 95/100

✅ SEO STRUCTURE:
  ✓ Meta tags added: 12 pages
  ✓ Sitemap generated
  ✓ Robots.txt created
  ✓ Structured data added

✅ IMAGES:
  Optimized: 45 images
  Savings: 15% (lossless optimization only)

⚠ RESPONSIVE DESIGN:
  ✓ Viewport tags: 12 pages
  ✓ Media queries: Present

📊 PERFORMANCE AUDIT (Baseline):
  Mobile:
    Performance:     78/100  (baseline)
    Accessibility:   95/100  ✓
    Best Practices:  90/100  ✓
    SEO:            100/100  ✓

  Desktop:
    Performance:     85/100  (baseline)
    Accessibility:   95/100  ✓
    Best Practices:  90/100  ✓
    SEO:            100/100  ✓

  Core Web Vitals (baseline):
    LCP: 2.8s (will improve in PROD)
    FID: 35ms ✓
    CLS: 0.05 ✓

  ⚠ Performance Notes:
    - Lower performance score expected (no minification)
    - Will improve to 95-100 in PRODUCTION workflow
    - Code structure is sound

===========================================
CODE QUALITY: Excellent ✓
GDPR COMPLIANCE: 95% ⚠ (manual review needed)
ACCESSIBILITY: 95/100 ✓
SEO: 100/100 ✓
PERFORMANCE BASELINE: 78/100 (expected, will improve in PROD)
===========================================

📁 Output: /path/to/output_dev_optimized
📄 Validation report: validation-report.json
📄 GDPR report: gdpr-report.json
📄 PageSpeed baseline report: pagespeed-baseline.json

NEXT STEPS FOR DEVELOPMENT:
1. Review and test the optimized code
2. Implement cookie consent banner for tracking scripts
3. Update privacy policy to mention Bunny Fonts usage
4. Address any PageSpeed recommendations if needed
5. Continue development with clean, validated code
6. Monitor baseline performance during development
7. When ready for production, run the PRODUCTION workflow
   → Performance will improve from ~78 to 95-100
   → File sizes will reduce by 70-90%

⚠ IMPORTANT: This is the DEV version
   - Code is readable and maintainable
   - Images are in original formats
   - No minification applied
   - Ready for continued development

   For PRODUCTION deployment, run:
   static-site-optimizer:package-prod
===========================================
```

## What is NOT Done in DEV Workflow

❌ **Minification**: Code stays readable
- HTML comments preserved
- CSS formatting preserved
- JavaScript readable with proper indentation
- Console.log statements preserved

❌ **Image Format Conversion**: Keep originals
- No AVIF/WebP conversion
- No responsive variants
- No `<picture>` element replacement
- Easy to edit source images

❌ **Pre-Compression**: No .br/.gz files
- Original files only
- No bandwidth optimization
- Faster build times

❌ **Aggressive Optimization**: Preserve clarity
- No CSS/JS bundling
- No tree-shaking
- No code splitting
- Easy debugging

## Success Criteria

Development optimization is complete when:
- ✅ All code validates without errors
- ✅ GDPR compliance achieved (Google Fonts → Bunny Fonts)
- ✅ Accessibility score 90+
- ✅ SEO structure in place
- ✅ Code remains readable and maintainable
- ✅ Images are basically optimized (but still editable)
- ✅ Ready for continued development

## Output Structure

```
output_dev_optimized/
├── index.html           (validated, readable)
├── css/
│   └── styles.css      (validated, readable, NOT minified)
├── js/
│   └── app.js          (validated, readable, NOT minified)
├── images/
│   └── *.jpg           (lossless optimized, original format)
├── assets/
│   ├── js/             (self-hosted libraries)
│   └── css/            (self-hosted libraries)
├── reports/
│   ├── validation-report.json
│   ├── gdpr-report.json
│   └── dev-report.txt
├── sitemap.xml
└── robots.txt
```

## Important Notes

- **Code stays readable**: No minification, proper formatting
- **Easy debugging**: Source maps not needed (code is clear)
- **Quick iterations**: Fast build, no heavy processing
- **Git-friendly**: Clean diffs, easy to review changes
- **Team-friendly**: Other developers can read the code
- **Production-ready preparation**: Clean base for PROD workflow

---

**Begin development optimization process now.**
