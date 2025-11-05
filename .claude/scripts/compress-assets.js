#!/usr/bin/env node

/**
 * compress-assets.js - Pre-compress static assets with Brotli and Gzip
 * Cross-platform Node.js implementation
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const zlib = require('zlib');
const { promisify } = require('util');

const brotliCompress = promisify(zlib.brotliCompress);
const gzipCompress = promisify(zlib.gzip);

// Configuration
const CONFIG = {
  brotliOptions: {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Maximum quality
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: 0
    }
  },
  gzipOptions: {
    level: 9 // Maximum compression
  },
  minSize: 150, // Minimum file size in bytes
  extensions: [
    '**/*.html', '**/*.htm',
    '**/*.css',
    '**/*.js', '**/*.mjs',
    '**/*.json',
    '**/*.svg',
    '**/*.xml', '**/*.rss', '**/*.atom',
    '**/*.txt', '**/*.md',
    '**/*.map',
    '**/*.webmanifest'
  ],
  exclude: [
    '**/*.br',
    '**/*.gz',
    '**/*.zip',
    '**/*.tar',
    '**/node_modules/**',
    '**/.git/**'
  ]
};

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)}KB`;
  return `${(bytes / 1048576).toFixed(2)}MB`;
}

/**
 * Calculate compression percentage
 */
function calcPercent(original, compressed) {
  if (original === 0) return '0.0';
  return ((1 - compressed / original) * 100).toFixed(1);
}

/**
 * Compress a single file with Brotli and Gzip
 */
async function compressFile(filePath) {
  try {
    const content = await fs.readFile(filePath);
    const originalSize = content.length;

    // Skip files below minimum size
    if (originalSize < CONFIG.minSize) {
      return null;
    }

    const results = {
      path: filePath,
      originalSize,
      brotliSize: 0,
      gzipSize: 0,
      success: true
    };

    // Brotli compression
    try {
      const brotliData = await brotliCompress(content, CONFIG.brotliOptions);
      await fs.writeFile(filePath + '.br', brotliData);
      results.brotliSize = brotliData.length;
    } catch (err) {
      console.error(`  ⚠ Brotli failed: ${err.message}`);
      results.success = false;
    }

    // Gzip compression
    try {
      const gzipData = await gzipCompress(content, CONFIG.gzipOptions);
      await fs.writeFile(filePath + '.gz', gzipData);
      results.gzipSize = gzipData.length;
    } catch (err) {
      console.error(`  ⚠ Gzip failed: ${err.message}`);
      results.success = false;
    }

    return results;
  } catch (err) {
    console.error(`  ✗ Error reading ${filePath}: ${err.message}`);
    return null;
  }
}

/**
 * Get file type category
 */
function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    html: ['.html', '.htm'],
    css: ['.css'],
    js: ['.js', '.mjs'],
    json: ['.json'],
    svg: ['.svg'],
    xml: ['.xml', '.rss', '.atom'],
    other: ['.txt', '.md', '.map', '.webmanifest']
  };

  for (const [type, exts] of Object.entries(types)) {
    if (exts.includes(ext)) return type;
  }
  return 'other';
}

/**
 * Compress all files in a directory
 */
async function compressDirectory(targetDir) {
  console.log('==========================================');
  console.log('Static Assets Compression');
  console.log('==========================================\n');
  console.log(`Target directory: ${targetDir}`);
  console.log(`Brotli quality: 11 (maximum)`);
  console.log(`Gzip quality: 9 (maximum)`);
  console.log(`Minimum file size: ${CONFIG.minSize} bytes\n`);

  const stats = {
    totalFiles: 0,
    totalOriginalSize: 0,
    totalBrotliSize: 0,
    totalGzipSize: 0,
    files: [],
    byType: {}
  };

  // Find all files
  const allFiles = [];
  for (const pattern of CONFIG.extensions) {
    const matches = await glob(pattern, {
      cwd: targetDir,
      absolute: true,
      ignore: CONFIG.exclude,
      nodir: true
    });
    allFiles.push(...matches);
  }

  // Remove duplicates
  const files = [...new Set(allFiles)];

  console.log(`Found ${files.length} files to process\n`);

  // Process each file
  let processedCount = 0;
  for (const file of files) {
    processedCount++;
    const relativePath = path.relative(targetDir, file);

    console.log(`[${processedCount}/${files.length}] ${relativePath}`);

    const result = await compressFile(file);

    if (result) {
      stats.totalFiles++;
      stats.totalOriginalSize += result.originalSize;
      stats.totalBrotliSize += result.brotliSize;
      stats.totalGzipSize += result.gzipSize;
      stats.files.push(result);

      // Track by file type
      const fileType = getFileType(file);
      if (!stats.byType[fileType]) {
        stats.byType[fileType] = {
          count: 0,
          originalSize: 0,
          brotliSize: 0,
          gzipSize: 0
        };
      }
      stats.byType[fileType].count++;
      stats.byType[fileType].originalSize += result.originalSize;
      stats.byType[fileType].brotliSize += result.brotliSize;
      stats.byType[fileType].gzipSize += result.gzipSize;

      console.log(`  Original: ${formatBytes(result.originalSize)}`);
      console.log(`  ✓ Brotli:  ${formatBytes(result.brotliSize)} (${calcPercent(result.originalSize, result.brotliSize)}% smaller)`);
      console.log(`  ✓ Gzip:    ${formatBytes(result.gzipSize)} (${calcPercent(result.originalSize, result.gzipSize)}% smaller)`);
    } else {
      console.log(`  - Skipped (too small)`);
    }

    console.log('');
  }

  // Print summary
  console.log('==========================================');
  console.log('COMPRESSION SUMMARY');
  console.log('==========================================\n');

  if (stats.totalFiles === 0) {
    console.log('⚠ No files met the compression criteria');
    console.log(`  (minimum size: ${CONFIG.minSize} bytes)\n`);
    return stats;
  }

  console.log(`Files compressed: ${stats.totalFiles}\n`);

  console.log('📊 Total Sizes:');
  console.log(`  Original: ${formatBytes(stats.totalOriginalSize)}`);
  console.log(`  Brotli:   ${formatBytes(stats.totalBrotliSize)} (-${calcPercent(stats.totalOriginalSize, stats.totalBrotliSize)}%)`);
  console.log(`  Gzip:     ${formatBytes(stats.totalGzipSize)} (-${calcPercent(stats.totalOriginalSize, stats.totalGzipSize)}%)\n`);

  // Bandwidth savings
  const brotliSavings = stats.totalOriginalSize - stats.totalBrotliSize;
  const gzipSavings = stats.totalOriginalSize - stats.totalGzipSize;

  console.log('💾 Bandwidth Savings:');
  console.log(`  With Brotli: ${formatBytes(brotliSavings)} per page load`);
  console.log(`  With Gzip:   ${formatBytes(gzipSavings)} per page load\n`);

  // Compression ratios
  console.log('📈 Average Compression Ratios:');
  console.log(`  Brotli-11: ${calcPercent(stats.totalOriginalSize, stats.totalBrotliSize)}% size reduction`);
  console.log(`  Gzip-9:    ${calcPercent(stats.totalOriginalSize, stats.totalGzipSize)}% size reduction\n`);

  // By file type
  if (Object.keys(stats.byType).length > 0) {
    console.log('📁 By File Type:');
    for (const [type, data] of Object.entries(stats.byType)) {
      const brotliPercent = calcPercent(data.originalSize, data.brotliSize);
      console.log(`  ${type.toUpperCase()}: ${data.count} files, ${formatBytes(data.originalSize)} → ${formatBytes(data.brotliSize)} (-${brotliPercent}%)`);
    }
    console.log('');
  }

  console.log('🌐 Browser Support:');
  console.log('  Brotli: Chrome 50+, Firefox 44+, Safari 11+, Edge 15+');
  console.log('  Gzip:   All browsers (universal fallback)\n');

  console.log('✓ Compression complete!\n');

  // Save report
  const reportPath = path.join(targetDir, 'compression-report.json');
  await fs.writeFile(reportPath, JSON.stringify(stats, null, 2));
  console.log(`📄 Report saved to: ${reportPath}\n`);

  console.log('Next steps:');
  console.log('  1. Upload compressed files (.br, .gz) alongside originals');
  console.log('  2. Configure web server to serve pre-compressed files');
  console.log('  3. Test with: curl -H "Accept-Encoding: br,gzip" https://your-site.com\n');

  return stats;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node compress-assets.js <directory>');
    console.log('');
    console.log('Example:');
    console.log('  node compress-assets.js ./dist');
    console.log('  node compress-assets.js /var/www/html');
    console.log('');
    console.log('Options:');
    console.log('  --help, -h    Show this help message');
    console.log('');
    process.exit(0);
  }

  const targetDir = path.resolve(args[0]);

  // Check if directory exists
  fs.access(targetDir)
    .then(() => compressDirectory(targetDir))
    .then(() => {
      console.log('✅ All done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}

module.exports = { compressFile, compressDirectory };
