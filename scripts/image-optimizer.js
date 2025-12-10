#!/usr/bin/env node

/**
 * Image Optimizer Script
 * Converts images to AVIF and WebP, generates responsive sizes
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

// Configuration
const CONFIG = {
  widths: [320, 640, 768, 1024, 1920],
  quality: {
    avif: 80,
    webp: 85,
    jpeg: 85
  },
  formats: ['avif', 'webp', 'jpeg'],
  extensions: ['.jpg', '.jpeg', '.png']
};

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath, outputDir) {
  const ext = path.extname(inputPath).toLowerCase();
  const name = path.basename(inputPath, ext);
  const results = {
    original: inputPath,
    variants: []
  };

  try {
    const metadata = await sharp(inputPath).metadata();
    results.originalSize = metadata.size;
    results.dimensions = { width: metadata.width, height: metadata.height };

    // Generate variants for each width
    for (const width of CONFIG.widths) {
      if (width > metadata.width) continue; // Don't upscale

      const variantName = `${name}-${width}w`;

      // Generate AVIF
      const avifPath = path.join(outputDir, `${variantName}.avif`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .avif({ quality: CONFIG.quality.avif })
        .toFile(avifPath);

      // Generate WebP
      const webpPath = path.join(outputDir, `${variantName}.webp`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: CONFIG.quality.webp })
        .toFile(webpPath);

      // Generate optimized JPEG
      const jpegPath = path.join(outputDir, `${variantName}.jpg`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .jpeg({ quality: CONFIG.quality.jpeg, progressive: true })
        .toFile(jpegPath);

      const avifSize = (await fs.stat(avifPath)).size;
      const webpSize = (await fs.stat(webpPath)).size;
      const jpegSize = (await fs.stat(jpegPath)).size;

      results.variants.push({
        width,
        files: {
          avif: { path: avifPath, size: avifSize },
          webp: { path: webpPath, size: webpSize },
          jpeg: { path: jpegPath, size: jpegSize }
        }
      });
    }

    // Calculate total savings
    const totalNewSize = results.variants.reduce((sum, v) => sum + v.files.jpeg.size, 0);
    results.savings = {
      bytes: results.originalSize - totalNewSize,
      percentage: ((1 - totalNewSize / results.originalSize) * 100).toFixed(2)
    };

    return results;
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Generate picture element HTML
 */
function generatePictureElement(results, relativeDir = '') {
  const { variants, dimensions } = results;
  const name = path.basename(results.original, path.extname(results.original));

  const avifSrcset = variants
    .map(v => `${relativeDir}${path.basename(v.files.avif.path)} ${v.width}w`)
    .join(',\n      ');

  const webpSrcset = variants
    .map(v => `${relativeDir}${path.basename(v.files.webp.path)} ${v.width}w`)
    .join(',\n      ');

  const jpegSrcset = variants
    .map(v => `${relativeDir}${path.basename(v.files.jpeg.path)} ${v.width}w`)
    .join(',\n      ');

  const defaultSrc = variants.find(v => v.width >= 1024) || variants[variants.length - 1];

  return `<picture>
  <source
    type="image/avif"
    srcset="${avifSrcset}"
    sizes="100vw"
  >
  <source
    type="image/webp"
    srcset="${webpSrcset}"
    sizes="100vw"
  >
  <img
    src="${relativeDir}${path.basename(defaultSrc.files.jpeg.path)}"
    srcset="${jpegSrcset}"
    sizes="100vw"
    alt="${name}"
    width="${dimensions.width}"
    height="${dimensions.height}"
    loading="lazy"
    decoding="async"
  >
</picture>`;
}

/**
 * Process directory
 */
async function processDirectory(inputDir, outputDir) {
  console.log(`Processing images in: ${inputDir}`);
  console.log(`Output directory: ${outputDir}`);

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Find all images
  const patterns = CONFIG.extensions.map(ext => `**/*${ext}`);
  const images = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: inputDir, absolute: true });
    images.push(...matches);
  }

  console.log(`Found ${images.length} images to process\n`);

  const report = {
    timestamp: new Date().toISOString(),
    totalImages: images.length,
    results: [],
    totalSavings: { bytes: 0, percentage: 0 }
  };

  // Process each image
  for (let i = 0; i < images.length; i++) {
    const imagePath = images[i];
    console.log(`[${i + 1}/${images.length}] Processing: ${path.basename(imagePath)}`);

    const result = await optimizeImage(imagePath, outputDir);
    if (result) {
      report.results.push(result);
      report.totalSavings.bytes += result.savings.bytes;
      console.log(`  ✓ Saved ${result.savings.percentage}%`);
    }
  }

  // Calculate average savings
  const totalOriginalSize = report.results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalNewSize = totalOriginalSize - report.totalSavings.bytes;
  report.totalSavings.percentage = ((1 - totalNewSize / totalOriginalSize) * 100).toFixed(2);

  // Generate HTML examples
  console.log('\n=== Generated HTML Examples ===\n');
  const examplesPath = path.join(outputDir, 'picture-elements.html');
  let htmlContent = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Optimized Images</title>\n</head>\n<body>\n  <h1>Optimized Images</h1>\n\n';

  report.results.slice(0, 3).forEach(result => {
    htmlContent += '  ' + generatePictureElement(result, './') + '\n\n';
  });

  htmlContent += '</body>\n</html>';
  await fs.writeFile(examplesPath, htmlContent);

  // Save report
  const reportPath = path.join(outputDir, 'optimization-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('\n=== Optimization Summary ===');
  console.log(`Total images processed: ${report.totalImages}`);
  console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total new size: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${(report.totalSavings.bytes / 1024 / 1024).toFixed(2)} MB (${report.totalSavings.percentage}%)`);
  console.log(`\nReport saved to: ${reportPath}`);
  console.log(`HTML examples saved to: ${examplesPath}`);
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node image-optimizer.js <input-dir> <output-dir>');
    console.log('Example: node image-optimizer.js ./src/images ./dist/images');
    process.exit(1);
  }

  const [inputDir, outputDir] = args;

  processDirectory(inputDir, outputDir)
    .then(() => console.log('\n✓ Done!'))
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

module.exports = { optimizeImage, generatePictureElement, processDirectory };
