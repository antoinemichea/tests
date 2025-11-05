#!/usr/bin/env node

/**
 * HTML Updater Script
 * Replaces <img> tags with optimized <picture> elements
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const cheerio = require('cheerio');

/**
 * Generate picture element from img tag
 */
function generatePictureElement(img, imageDir, imageName, variants) {
  const alt = img.attr('alt') || imageName;
  const className = img.attr('class') || '';
  const id = img.attr('id') || '';
  const loading = img.attr('loading') || 'lazy';

  // Find the variant with dimensions
  const largestVariant = variants.reduce((max, v) =>
    v.width > max.width ? v : max, variants[0]);

  const avifSrcset = variants
    .map(v => `${imageDir}${imageName}-${v.width}w.avif ${v.width}w`)
    .join(', ');

  const webpSrcset = variants
    .map(v => `${imageDir}${imageName}-${v.width}w.webp ${v.width}w`)
    .join(', ');

  const jpegSrcset = variants
    .map(v => `${imageDir}${imageName}-${v.width}w.jpg ${v.width}w`)
    .join(', ');

  const defaultSrc = `${imageDir}${imageName}-1024w.jpg`;

  let pictureHtml = '<picture>\n';
  pictureHtml += `  <source type="image/avif" srcset="${avifSrcset}" sizes="100vw">\n`;
  pictureHtml += `  <source type="image/webp" srcset="${webpSrcset}" sizes="100vw">\n`;
  pictureHtml += `  <img src="${defaultSrc}" srcset="${jpegSrcset}" sizes="100vw" alt="${alt}"`;

  if (className) pictureHtml += ` class="${className}"`;
  if (id) pictureHtml += ` id="${id}"`;
  if (largestVariant.dimensions) {
    pictureHtml += ` width="${largestVariant.dimensions.width}" height="${largestVariant.dimensions.height}"`;
  }
  pictureHtml += ` loading="${loading}" decoding="async">\n`;
  pictureHtml += '</picture>';

  return pictureHtml;
}

/**
 * Update HTML file with picture elements
 */
async function updateHTMLFile(htmlPath, optimizationReport, dryRun = false) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  let replacements = 0;
  const changes = [];

  // Process each img tag
  $('img').each((i, elem) => {
    const img = $(elem);
    const src = img.attr('src');

    if (!src) return;

    // Extract image name and directory
    const imagePath = src.split('/');
    const imageFile = imagePath[imagePath.length - 1];
    const imageName = path.basename(imageFile, path.extname(imageFile));
    const imageDir = imagePath.slice(0, -1).join('/') + (imagePath.length > 1 ? '/' : '');

    // Find corresponding optimization result
    const result = optimizationReport.results.find(r => {
      const resultName = path.basename(r.original, path.extname(r.original));
      return resultName === imageName;
    });

    if (result && result.variants && result.variants.length > 0) {
      // Generate picture element
      const pictureHtml = generatePictureElement(img, imageDir, imageName, result.variants);

      if (!dryRun) {
        // Replace img with picture
        $(elem).replaceWith(pictureHtml);
      }

      replacements++;
      changes.push({
        original: src,
        replacement: 'picture element with AVIF, WebP, and JPEG sources'
      });
    }
  });

  // Update lazy loading for first 2-3 images (above the fold)
  if (!dryRun) {
    $('picture img').each((i, elem) => {
      if (i < 3) {
        $(elem).attr('loading', 'eager');
      }
    });
  }

  const updatedHtml = $.html();

  if (!dryRun && replacements > 0) {
    await fs.writeFile(htmlPath, updatedHtml, 'utf8');
  }

  return {
    file: htmlPath,
    replacements,
    changes
  };
}

/**
 * Process directory of HTML files
 */
async function processDirectory(htmlDir, optimizationReportPath, dryRun = false) {
  console.log(`Processing HTML files in: ${htmlDir}`);
  console.log(`Using optimization report: ${optimizationReportPath}`);

  if (dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No files will be modified\n');
  }

  // Load optimization report
  const reportData = await fs.readFile(optimizationReportPath, 'utf8');
  const optimizationReport = JSON.parse(reportData);

  // Find all HTML files
  const htmlFiles = await glob('**/*.html', { cwd: htmlDir, absolute: true });
  console.log(`Found ${htmlFiles.length} HTML files to process\n`);

  const report = {
    timestamp: new Date().toISOString(),
    dryRun,
    totalFiles: htmlFiles.length,
    filesModified: 0,
    totalReplacements: 0,
    files: []
  };

  // Process each HTML file
  for (let i = 0; i < htmlFiles.length; i++) {
    const htmlPath = htmlFiles[i];
    console.log(`[${i + 1}/${htmlFiles.length}] Processing: ${path.basename(htmlPath)}`);

    try {
      const result = await updateHTMLFile(htmlPath, optimizationReport, dryRun);

      if (result.replacements > 0) {
        report.filesModified++;
        report.totalReplacements += result.replacements;
        console.log(`  ✓ Replaced ${result.replacements} img tags`);

        result.changes.forEach(change => {
          console.log(`    - ${change.original}`);
        });
      } else {
        console.log(`  - No changes needed`);
      }

      report.files.push(result);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      report.files.push({
        file: htmlPath,
        error: error.message
      });
    }
  }

  // Save report
  const reportPath = path.join(htmlDir, 'html-update-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('\n=== HTML Update Summary ===');
  console.log(`Total files processed: ${report.totalFiles}`);
  console.log(`Files modified: ${report.filesModified}`);
  console.log(`Total img tags replaced: ${report.totalReplacements}`);
  console.log(`Report saved to: ${reportPath}`);

  if (dryRun) {
    console.log('\n⚠️  This was a dry run. Re-run without --dry-run to apply changes.');
  }
}

/**
 * Add resource hints to HTML
 */
async function addResourceHints(htmlPath, domains = []) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  // Add DNS prefetch and preconnect
  const head = $('head');

  // Check if hints already exist
  if ($('link[rel="dns-prefetch"]').length === 0) {
    domains.forEach(domain => {
      head.prepend(`<link rel="dns-prefetch" href="//${domain}">\n  `);
      head.prepend(`<link rel="preconnect" href="https://${domain}" crossorigin>\n  `);
    });
  }

  // Preload critical resources
  if ($('link[rel="preload"]').length === 0) {
    // Find first CSS file
    const firstCSS = $('link[rel="stylesheet"]').first();
    if (firstCSS.length) {
      const href = firstCSS.attr('href');
      head.prepend(`<link rel="preload" href="${href}" as="style">\n  `);
    }

    // Find critical fonts
    $('style').each((i, elem) => {
      const content = $(elem).html();
      const fontMatches = content.match(/url\(['"]?([^'"]+\.woff2)['"]?\)/g);
      if (fontMatches) {
        fontMatches.slice(0, 2).forEach(match => {
          const url = match.match(/url\(['"]?([^'"]+)['"]?\)/)[1];
          head.prepend(`<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin>\n  `);
        });
      }
    });
  }

  await fs.writeFile(htmlPath, $.html(), 'utf8');
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node html-updater.js <html-dir> <optimization-report.json> [--dry-run]');
    console.log('Example: node html-updater.js ./dist ./dist/images/optimization-report.json');
    process.exit(1);
  }

  const [htmlDir, reportPath] = args;
  const dryRun = args.includes('--dry-run');

  processDirectory(htmlDir, reportPath, dryRun)
    .then(() => console.log('\n✓ Done!'))
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { updateHTMLFile, processDirectory, addResourceHints };
