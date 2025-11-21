#!/usr/bin/env node

/**
 * Cache Buster for CSS and JavaScript files
 *
 * Adds version timestamps to CSS and JS references in HTML files
 * to prevent browser caching issues in production builds.
 *
 * Usage:
 *   node cache-buster.js <directory> [options]
 *
 * Options:
 *   --method=query       Use query string (default): styles.css?v=20231121154530
 *   --method=filename    Rename files: styles.20231121154530.css
 *   --timestamp=CUSTOM   Use custom timestamp instead of current date/time
 *   --dry-run           Show what would be changed without modifying files
 *
 * Example:
 *   node cache-buster.js ./dist
 *   node cache-buster.js ./dist --method=filename
 *   node cache-buster.js ./dist --timestamp=20231121000000
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const distDir = args[0] || './dist';
const options = {
  method: 'query', // 'query' or 'filename'
  timestamp: null,
  dryRun: false
};

// Parse options
args.slice(1).forEach(arg => {
  if (arg.startsWith('--method=')) {
    options.method = arg.split('=')[1];
  } else if (arg.startsWith('--timestamp=')) {
    options.timestamp = arg.split('=')[1];
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  }
});

// Generate timestamp in format YYYYMMDDHHMMSS
function generateTimestamp() {
  if (options.timestamp) {
    return options.timestamp;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Find all HTML files recursively
function findHtmlFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });

  return results;
}

// Find all CSS and JS files for filename method
function findAssetFiles(dir) {
  const results = {
    css: [],
    js: []
  };

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subResults = findAssetFiles(fullPath);
      results.css.push(...subResults.css);
      results.js.push(...subResults.js);
    } else if (file.endsWith('.css') && !file.endsWith('.br') && !file.endsWith('.gz')) {
      results.css.push(fullPath);
    } else if (file.endsWith('.js') && !file.endsWith('.br') && !file.endsWith('.gz') && !file.endsWith('.map')) {
      results.js.push(fullPath);
    }
  });

  return results;
}

// Apply cache busting using query string method
function applyQueryStringMethod(htmlContent, timestamp) {
  let modified = htmlContent;
  let cssCount = 0;
  let jsCount = 0;

  // Match CSS links: <link ... href="path/to/file.css" ...>
  modified = modified.replace(
    /(<link[^>]+href=["'])([^"'?]+\.css)(\?v=[^"']*)?(?=["'])/gi,
    (match, prefix, url, existingQuery) => {
      cssCount++;
      return `${prefix}${url}?v=${timestamp}`;
    }
  );

  // Match JS scripts: <script ... src="path/to/file.js" ...>
  modified = modified.replace(
    /(<script[^>]+src=["'])([^"'?]+\.js)(\?v=[^"']*)?(?=["'])/gi,
    (match, prefix, url, existingQuery) => {
      jsCount++;
      return `${prefix}${url}?v=${timestamp}`;
    }
  );

  // Match CSS @import in inline styles
  modified = modified.replace(
    /(@import\s+["'])([^"'?]+\.css)(\?v=[^"']*)?(?=["'])/gi,
    (match, prefix, url, existingQuery) => {
      return `${prefix}${url}?v=${timestamp}`;
    }
  );

  return {
    content: modified,
    cssCount,
    jsCount
  };
}

// Apply cache busting using filename method
function applyFilenameMethod(htmlContent, timestamp, distDir) {
  let modified = htmlContent;
  const renames = [];
  let cssCount = 0;
  let jsCount = 0;

  // Match CSS links
  modified = modified.replace(
    /(<link[^>]+href=["'])([^"']+\.css)(?=["'])/gi,
    (match, prefix, url) => {
      // Skip if already has timestamp
      if (url.match(/\.\d{14}\.css$/)) {
        return match;
      }

      cssCount++;
      const newUrl = url.replace(/\.css$/, `.${timestamp}.css`);

      // Store rename operation
      const oldPath = path.join(distDir, url);
      const newPath = path.join(distDir, newUrl);
      renames.push({ old: oldPath, new: newPath });

      return `${prefix}${newUrl}`;
    }
  );

  // Match JS scripts
  modified = modified.replace(
    /(<script[^>]+src=["'])([^"']+\.js)(?=["'])/gi,
    (match, prefix, url) => {
      // Skip if already has timestamp
      if (url.match(/\.\d{14}\.js$/)) {
        return match;
      }

      jsCount++;
      const newUrl = url.replace(/\.js$/, `.${timestamp}.js`);

      // Store rename operation
      const oldPath = path.join(distDir, url);
      const newPath = path.join(distDir, newUrl);
      renames.push({ old: oldPath, new: newPath });

      return `${prefix}${newUrl}`;
    }
  );

  return {
    content: modified,
    renames,
    cssCount,
    jsCount
  };
}

// Main execution
async function main() {
  console.log('🚀 Cache Buster - Production Asset Versioning\n');
  console.log(`📁 Directory: ${distDir}`);
  console.log(`🔧 Method: ${options.method}`);
  console.log(`⏰ Timestamp: generating...`);

  if (options.dryRun) {
    console.log('⚠️  DRY RUN MODE - No files will be modified\n');
  }

  // Verify directory exists
  if (!fs.existsSync(distDir)) {
    console.error(`❌ Error: Directory "${distDir}" does not exist`);
    process.exit(1);
  }

  // Generate timestamp
  const timestamp = generateTimestamp();
  console.log(`⏰ Timestamp: ${timestamp}\n`);

  // Find all HTML files
  console.log('🔍 Finding HTML files...');
  const htmlFiles = findHtmlFiles(distDir);
  console.log(`   Found ${htmlFiles.length} HTML files\n`);

  if (htmlFiles.length === 0) {
    console.log('⚠️  No HTML files found. Nothing to do.');
    return;
  }

  // Statistics
  const stats = {
    htmlFiles: 0,
    cssReferences: 0,
    jsReferences: 0,
    filesRenamed: 0
  };

  const allRenames = [];

  // Process each HTML file
  console.log('📝 Processing HTML files...\n');

  for (const htmlFile of htmlFiles) {
    const relativePath = path.relative(distDir, htmlFile);
    console.log(`   Processing: ${relativePath}`);

    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    let result;

    if (options.method === 'filename') {
      result = applyFilenameMethod(htmlContent, timestamp, distDir);
      allRenames.push(...result.renames);
    } else {
      result = applyQueryStringMethod(htmlContent, timestamp);
    }

    stats.htmlFiles++;
    stats.cssReferences += result.cssCount;
    stats.jsReferences += result.jsCount;

    console.log(`      CSS: ${result.cssCount} references updated`);
    console.log(`      JS:  ${result.jsCount} references updated`);

    // Write modified HTML
    if (!options.dryRun) {
      fs.writeFileSync(htmlFile, result.content, 'utf8');
    }
  }

  // Rename files if using filename method
  if (options.method === 'filename' && allRenames.length > 0) {
    console.log('\n📦 Renaming asset files...\n');

    // Remove duplicates
    const uniqueRenames = Array.from(
      new Map(allRenames.map(r => [r.old, r])).values()
    );

    for (const rename of uniqueRenames) {
      const relativeOld = path.relative(distDir, rename.old);
      const relativeNew = path.relative(distDir, rename.new);

      if (fs.existsSync(rename.old)) {
        console.log(`   ${relativeOld} → ${relativeNew}`);

        if (!options.dryRun) {
          fs.renameSync(rename.old, rename.new);
          stats.filesRenamed++;

          // Also rename compressed versions if they exist
          if (fs.existsSync(rename.old + '.br')) {
            fs.renameSync(rename.old + '.br', rename.new + '.br');
          }
          if (fs.existsSync(rename.old + '.gz')) {
            fs.renameSync(rename.old + '.gz', rename.new + '.gz');
          }
        }
      }
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ CACHE BUSTING COMPLETE');
  console.log('='.repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`   HTML files processed: ${stats.htmlFiles}`);
  console.log(`   CSS references updated: ${stats.cssReferences}`);
  console.log(`   JS references updated: ${stats.jsReferences}`);

  if (options.method === 'filename') {
    console.log(`   Files renamed: ${stats.filesRenamed}`);
  }

  console.log(`\n🏷️  Version: v=${timestamp}`);
  console.log(`🔧 Method: ${options.method}`);

  if (options.dryRun) {
    console.log('\n⚠️  DRY RUN - No files were actually modified');
  } else {
    console.log('\n✅ All files updated successfully!');
  }

  console.log('\n💡 Benefits:');
  console.log('   ✓ Browser cache invalidated for all CSS/JS');
  console.log('   ✓ Users will receive latest versions');
  console.log('   ✓ Version tracking enabled');
  console.log('   ✓ No server configuration needed\n');

  // Write report
  const report = {
    timestamp: timestamp,
    method: options.method,
    directory: distDir,
    stats: stats,
    htmlFiles: htmlFiles.map(f => path.relative(distDir, f))
  };

  const reportPath = path.join(distDir, 'cache-busting-report.json');

  if (!options.dryRun) {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`📄 Report saved: ${path.relative(process.cwd(), reportPath)}\n`);
  }
}

// Run
main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
