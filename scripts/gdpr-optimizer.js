#!/usr/bin/env node

/**
 * GDPR Compliance & Responsive Design Optimizer
 * Replaces Google Fonts with Bunny Fonts, self-hosts external resources
 */

const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  trackingPatterns: [
    'google-analytics.com',
    'googletagmanager.com',
    'gtag',
    'ga.js',
    'analytics.js',
    'facebook.net',
    'facebook.com/tr',
    'fbevents.js',
    'twitter.com',
    'doubleclick.net',
    'hotjar.com',
    'crazyegg.com',
    'mixpanel.com'
  ],
  responsiveBreakpoints: {
    'mobile-sm': 320,
    'mobile': 576,
    'tablet': 768,
    'desktop': 992,
    'desktop-lg': 1200,
    'desktop-xl': 1400
  }
};

/**
 * Audit external resources in HTML file
 */
async function auditHTMLFile(htmlPath) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const audit = {
    fonts: [],
    scripts: [],
    stylesheets: [],
    images: [],
    tracking: [],
    hasViewport: false
  };

  // Check viewport
  audit.hasViewport = $('meta[name="viewport"]').length > 0;

  // Check for Google Fonts
  $('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').each((i, elem) => {
    audit.fonts.push({
      type: 'google-fonts',
      url: $(elem).attr('href'),
      element: 'link'
    });
  });

  // Check for external scripts
  $('script[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//'))) {
      const isTracking = CONFIG.trackingPatterns.some(pattern => src.includes(pattern));

      if (isTracking) {
        audit.tracking.push({ url: src, element: 'script' });
      } else {
        audit.scripts.push({ url: src, element: 'script' });
      }
    }
  });

  // Check inline scripts for tracking
  $('script:not([src])').each((i, elem) => {
    const content = $(elem).html() || '';
    const isTracking = CONFIG.trackingPatterns.some(pattern => content.includes(pattern));

    if (isTracking) {
      audit.tracking.push({
        url: 'inline',
        element: 'script',
        snippet: content.substring(0, 100)
      });
    }
  });

  // Check for external stylesheets
  $('link[rel="stylesheet"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))) {
      if (!href.includes('fonts.bunny.net')) {
        audit.stylesheets.push({ url: href, element: 'link' });
      }
    }
  });

  // Check for external images
  $('img[src]').each((i, elem) => {
    const src = $(elem).attr('src');
    if (src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//'))) {
      audit.images.push({ url: src, element: 'img' });
    }
  });

  return audit;
}

/**
 * Replace Google Fonts with Bunny Fonts
 */
async function replaceGoogleFonts(htmlPath) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  let replacements = 0;

  // Replace Google Fonts links
  $('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').each((i, elem) => {
    let href = $(elem).attr('href');

    // Replace domains
    href = href.replace('fonts.googleapis.com', 'fonts.bunny.net');
    href = href.replace('fonts.gstatic.com', 'fonts.bunny.net');

    $(elem).attr('href', href);

    // Add comment
    $(elem).before('<!-- GDPR-compliant fonts from Bunny Fonts -->\n  ');

    replacements++;
  });

  // Replace Google Fonts in inline styles
  $('style').each((i, elem) => {
    let content = $(elem).html();
    if (content && (content.includes('fonts.googleapis.com') || content.includes('fonts.gstatic.com'))) {
      content = content.replace(/fonts\.googleapis\.com/g, 'fonts.bunny.net');
      content = content.replace(/fonts\.gstatic\.com/g, 'fonts.bunny.net');
      $(elem).html(content);
      replacements++;
    }
  });

  if (replacements > 0) {
    await fs.writeFile(htmlPath, $.html(), 'utf8');
  }

  return replacements;
}

/**
 * Download external resource
 */
async function downloadResource(url, outputPath) {
  try {
    // Normalize URL
    if (url.startsWith('//')) {
      url = 'https:' + url;
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, response.data);

    return {
      success: true,
      size: response.data.length,
      url: url,
      path: outputPath
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: url
    };
  }
}

/**
 * Self-host external resources
 */
async function selfHostResources(htmlPath, assetsDir) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const downloads = [];

  // Download and replace external scripts
  const scripts = $('script[src]').toArray();
  for (const elem of scripts) {
    const src = $(elem).attr('src');

    if (src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//'))) {
      // Skip tracking scripts and Bunny Fonts
      const isTracking = CONFIG.trackingPatterns.some(p => src.includes(p));
      if (isTracking || src.includes('fonts.bunny.net')) continue;

      try {
        const url = new URL(src.startsWith('//') ? 'https:' + src : src);
        const filename = path.basename(url.pathname) || 'script.js';
        const localPath = path.join(assetsDir, 'js', filename);
        const relativePath = path.relative(path.dirname(htmlPath), localPath);

        console.log(`  Downloading: ${src}`);
        const result = await downloadResource(src, localPath);

        if (result.success) {
          $(elem).attr('src', relativePath.replace(/\\/g, '/'));
          downloads.push(result);
          console.log(`    ✓ Saved to ${relativePath} (${(result.size / 1024).toFixed(2)} KB)`);
        } else {
          console.log(`    ✗ Failed: ${result.error}`);
        }
      } catch (error) {
        console.log(`    ✗ Invalid URL: ${src}`);
      }
    }
  }

  // Download and replace external stylesheets
  const stylesheets = $('link[rel="stylesheet"]').toArray();
  for (const elem of stylesheets) {
    const href = $(elem).attr('href');

    if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))) {
      // Skip Bunny Fonts
      if (href.includes('fonts.bunny.net')) continue;

      try {
        const url = new URL(href.startsWith('//') ? 'https:' + href : href);
        const filename = path.basename(url.pathname) || 'style.css';
        const localPath = path.join(assetsDir, 'css', filename);
        const relativePath = path.relative(path.dirname(htmlPath), localPath);

        console.log(`  Downloading: ${href}`);
        const result = await downloadResource(href, localPath);

        if (result.success) {
          $(elem).attr('href', relativePath.replace(/\\/g, '/'));
          downloads.push(result);
          console.log(`    ✓ Saved to ${relativePath} (${(result.size / 1024).toFixed(2)} KB)`);
        } else {
          console.log(`    ✗ Failed: ${result.error}`);
        }
      } catch (error) {
        console.log(`    ✗ Invalid URL: ${href}`);
      }
    }
  }

  if (downloads.length > 0) {
    await fs.writeFile(htmlPath, $.html(), 'utf8');
  }

  return downloads;
}

/**
 * Flag tracking scripts
 */
async function flagTrackingScripts(htmlPath) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const flagged = [];

  // Flag external tracking scripts
  $('script[src]').each((i, elem) => {
    const src = $(elem).attr('src') || '';
    const isTracking = CONFIG.trackingPatterns.some(pattern => src.includes(pattern));

    if (isTracking) {
      $(elem).before(`<!-- ⚠️ WARNING: Tracking script requires GDPR consent -->\n  `);
      $(elem).after('\n  <!-- End tracking script -->');
      flagged.push({ type: 'external', url: src });
    }
  });

  // Flag inline tracking scripts
  $('script:not([src])').each((i, elem) => {
    const content = $(elem).html() || '';
    const isTracking = CONFIG.trackingPatterns.some(pattern => content.includes(pattern));

    if (isTracking) {
      $(elem).before(`<!-- ⚠️ WARNING: Inline tracking code requires GDPR consent -->\n  `);
      $(elem).after('\n  <!-- End tracking code -->');
      flagged.push({ type: 'inline', snippet: content.substring(0, 100) });
    }
  });

  if (flagged.length > 0) {
    await fs.writeFile(htmlPath, $.html(), 'utf8');
  }

  return flagged;
}

/**
 * Ensure viewport meta tag
 */
async function ensureViewport(htmlPath) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  if ($('meta[name="viewport"]').length === 0) {
    $('head').prepend('  <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">\n');
    await fs.writeFile(htmlPath, $.html(), 'utf8');
    return { added: true };
  }

  return { added: false, exists: true };
}

/**
 * Process directory
 */
async function processDirectory(inputDir, assetsDir = null) {
  console.log(`Processing directory: ${inputDir}`);

  if (!assetsDir) {
    assetsDir = path.join(inputDir, 'assets');
  }

  // Create assets directories
  await fs.mkdir(path.join(assetsDir, 'js'), { recursive: true });
  await fs.mkdir(path.join(assetsDir, 'css'), { recursive: true });

  // Find all HTML files
  const htmlFiles = await glob('**/*.html', { cwd: inputDir, absolute: true });
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: htmlFiles.length,
    googleFontsReplaced: 0,
    externalResourcesSelfHosted: 0,
    trackingScriptsFlagged: 0,
    viewportsAdded: 0,
    files: []
  };

  // Process each HTML file
  for (let i = 0; i < htmlFiles.length; i++) {
    const htmlPath = htmlFiles[i];
    console.log(`[${i + 1}/${htmlFiles.length}] Processing: ${path.basename(htmlPath)}`);

    // Audit
    const audit = await auditHTMLFile(htmlPath);

    // Replace Google Fonts with Bunny Fonts
    const fontsReplaced = await replaceGoogleFonts(htmlPath);
    if (fontsReplaced > 0) {
      console.log(`  ✓ Replaced ${fontsReplaced} Google Fonts with Bunny Fonts`);
      report.googleFontsReplaced += fontsReplaced;
    }

    // Self-host external resources
    const downloads = await selfHostResources(htmlPath, assetsDir);
    if (downloads.length > 0) {
      report.externalResourcesSelfHosted += downloads.length;
    }

    // Flag tracking scripts
    const flagged = await flagTrackingScripts(htmlPath);
    if (flagged.length > 0) {
      console.log(`  ⚠ Flagged ${flagged.length} tracking scripts`);
      report.trackingScriptsFlagged += flagged.length;
    }

    // Ensure viewport
    const viewport = await ensureViewport(htmlPath);
    if (viewport.added) {
      console.log(`  ✓ Added viewport meta tag`);
      report.viewportsAdded++;
    }

    report.files.push({
      path: htmlPath,
      audit,
      fontsReplaced,
      downloads: downloads.length,
      trackingFlagged: flagged.length,
      viewportAdded: viewport.added
    });

    console.log('');
  }

  // Save report
  const reportPath = path.join(inputDir, 'gdpr-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('===========================================');
  console.log('GDPR COMPLIANCE & RESPONSIVE DESIGN REPORT');
  console.log('===========================================\n');

  console.log('GDPR/RGPD COMPLIANCE:');
  console.log(`  ✓ Google Fonts replaced with Bunny Fonts: ${report.googleFontsReplaced}`);
  console.log(`  ✓ External resources self-hosted: ${report.externalResourcesSelfHosted}`);
  console.log(`  ${report.trackingScriptsFlagged > 0 ? '⚠' : '✓'} Tracking scripts flagged: ${report.trackingScriptsFlagged}`);

  if (report.trackingScriptsFlagged > 0) {
    console.log('\n  ⚠️  Action required: Add cookie consent banner for tracking scripts');
  }

  console.log('\nRESPONSIVE DESIGN:');
  console.log(`  ✓ Viewport meta tags added: ${report.viewportsAdded}`);
  console.log(`  ✓ All files now have proper viewport configuration`);

  console.log('\nRECOMMENDATIONS:');
  if (report.trackingScriptsFlagged > 0) {
    console.log('  • Implement cookie consent banner (e.g., using Tarteaucitron.js)');
    console.log('  • Update privacy policy to mention data collection');
  }
  console.log('  • Test responsive design on actual devices');
  console.log('  • Consider removing non-essential tracking scripts');

  console.log(`\n✓ Report saved to: ${reportPath}\n`);
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: node gdpr-optimizer.js <directory> [assets-dir]');
    console.log('Example: node gdpr-optimizer.js ./dist ./dist/assets');
    process.exit(1);
  }

  const [inputDir, assetsDir] = args;

  processDirectory(inputDir, assetsDir)
    .then(() => console.log('✓ Done!'))
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = {
  auditHTMLFile,
  replaceGoogleFonts,
  selfHostResources,
  flagTrackingScripts,
  ensureViewport,
  processDirectory
};
