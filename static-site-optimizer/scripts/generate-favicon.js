#!/usr/bin/env node

/**
 * Favicon Generator
 * Creates modern SVG favicon with dark mode support and PNG/ICO variants
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const cheerio = require('cheerio');
const { glob } = require('glob');

// Create readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * Generate SVG favicon
 */
function generateSVGFavicon(text, primaryColor, textColor, withDarkMode = true) {
  // Ensure text is 1-2 characters
  const displayText = text.substring(0, 2).toUpperCase();

  if (withDarkMode) {
    // Calculate lighter version for dark mode (increase lightness)
    const darkModeColor = lightenColor(primaryColor, 0.3);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <style>
    rect { fill: ${primaryColor}; }
    text { fill: ${textColor}; }
    @media (prefers-color-scheme: dark) {
      rect { fill: ${darkModeColor}; }
    }
  </style>
  <rect width="100" height="100" rx="20"/>
  <text x="50" y="70" font-size="60" font-weight="bold" text-anchor="middle" font-family="Arial, sans-serif">${displayText}</text>
</svg>`;
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${primaryColor}" rx="20"/>
  <text x="50" y="70" font-size="60" font-weight="bold" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif">${displayText}</text>
</svg>`;
  }
}

/**
 * Lighten a hex color by a factor (0-1)
 */
function lightenColor(hex, factor) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Lighten by moving towards 255
  const newR = Math.round(r + (255 - r) * factor);
  const newG = Math.round(g + (255 - g) * factor);
  const newB = Math.round(b + (255 - b) * factor);

  // Convert back to hex
  return '#' + [newR, newG, newB].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert SVG to PNG at specific size
 */
async function svgToPNG(svgContent, outputPath, size) {
  const svgBuffer = Buffer.from(svgContent);

  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outputPath);

  return outputPath;
}

/**
 * Create multi-size ICO file
 */
async function createICO(svgContent, outputPath) {
  // Create 32x32 PNG as ICO (simplified approach)
  // For true multi-size ICO, would need a specialized library
  const svgBuffer = Buffer.from(svgContent);

  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(outputPath.replace('.ico', '-32x32.png'));

  // Rename to .ico (simple approach - works in most browsers)
  await fs.rename(
    outputPath.replace('.ico', '-32x32.png'),
    outputPath
  );

  return outputPath;
}

/**
 * Update HTML files with favicon links
 */
async function updateHTMLFiles(directory, faviconPath) {
  const htmlFiles = await glob('**/*.html', { cwd: directory, absolute: true });

  let updated = 0;

  for (const htmlPath of htmlFiles) {
    const html = await fs.readFile(htmlPath, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });

    // Remove existing favicon links
    $('link[rel="icon"]').remove();
    $('link[rel="shortcut icon"]').remove();
    $('link[rel="apple-touch-icon"]').remove();

    // Add new favicon links
    const faviconHTML = `
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="shortcut icon" href="/favicon.ico">
`;

    // Insert after charset or viewport, or at beginning of head
    const charset = $('meta[charset]');
    const viewport = $('meta[name="viewport"]');

    if (viewport.length > 0) {
      viewport.after(faviconHTML);
    } else if (charset.length > 0) {
      charset.after(faviconHTML);
    } else {
      $('head').prepend(faviconHTML);
    }

    await fs.writeFile(htmlPath, $.html(), 'utf8');
    updated++;
  }

  return updated;
}

/**
 * Main generation process
 */
async function generateFavicons(outputDir, options) {
  console.log('\n🎨 Generating favicons...\n');

  const { text, primaryColor, textColor, darkMode } = options;

  // Generate SVG
  console.log('✓ Generating SVG favicon...');
  const svgContent = generateSVGFavicon(text, primaryColor, textColor, darkMode);
  const svgPath = path.join(outputDir, 'favicon.svg');
  await fs.writeFile(svgPath, svgContent);
  console.log(`  Saved: ${svgPath} (~${svgContent.length} bytes)`);

  // Generate PNG variants
  console.log('✓ Generating PNG variants...');

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 }
  ];

  for (const { name, size } of sizes) {
    const pngPath = path.join(outputDir, name);
    await svgToPNG(svgContent, pngPath, size);
    const stats = await fs.stat(pngPath);
    console.log(`  Saved: ${pngPath} (${size}x${size}, ${(stats.size / 1024).toFixed(2)} KB)`);
  }

  // Generate ICO
  console.log('✓ Generating ICO file...');
  const icoPath = path.join(outputDir, 'favicon.ico');
  await createICO(svgContent, icoPath);
  const icoStats = await fs.stat(icoPath);
  console.log(`  Saved: ${icoPath} (${(icoStats.size / 1024).toFixed(2)} KB)`);

  // Update HTML files
  console.log('✓ Updating HTML files...');
  const updated = await updateHTMLFiles(outputDir, svgPath);
  console.log(`  Updated ${updated} HTML file(s)`);

  console.log('\n✅ Favicon generation complete!\n');

  return {
    svg: svgPath,
    png: sizes.map(s => path.join(outputDir, s.name)),
    ico: icoPath,
    htmlFilesUpdated: updated
  };
}

/**
 * Interactive CLI
 */
async function interactiveCLI() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   Favicon Generator (SVG + variants)  ║');
  console.log('╚═══════════════════════════════════════╝\n');

  // Get site name/initials
  const text = await question('Site initials/text (1-2 characters): ');
  if (!text || text.length === 0) {
    console.error('❌ Error: Text is required');
    process.exit(1);
  }

  // Get primary color
  const primaryColor = await question('Primary color (hex, e.g., #2563eb): ');
  if (!primaryColor || !primaryColor.match(/^#[0-9A-Fa-f]{6}$/)) {
    console.error('❌ Error: Invalid hex color (use format #RRGGBB)');
    process.exit(1);
  }

  // Get text color (with default)
  let textColor = await question('Text color (default: #ffffff): ');
  if (!textColor) textColor = '#ffffff';

  // Dark mode support
  const darkModeInput = await question('Enable dark mode support? (y/n, default: y): ');
  const darkMode = !darkModeInput || darkModeInput.toLowerCase() === 'y';

  // Output directory
  let outputDir = await question('Output directory (default: current directory): ');
  if (!outputDir) outputDir = process.cwd();

  rl.close();

  // Generate favicons
  const result = await generateFavicons(outputDir, {
    text,
    primaryColor,
    textColor,
    darkMode
  });

  // Print summary
  console.log('═══════════════════════════════════════');
  console.log('FAVICON GENERATION SUMMARY');
  console.log('═══════════════════════════════════════\n');
  console.log(`Text: ${text.substring(0, 2).toUpperCase()}`);
  console.log(`Primary color: ${primaryColor}`);
  console.log(`Text color: ${textColor}`);
  console.log(`Dark mode: ${darkMode ? 'Yes' : 'No'}`);
  console.log(`\nFiles generated:`);
  console.log(`  - favicon.svg (modern browsers)`);
  console.log(`  - favicon-16x16.png`);
  console.log(`  - favicon-32x32.png`);
  console.log(`  - apple-touch-icon.png (iOS)`);
  console.log(`  - favicon.ico (legacy browsers)`);
  console.log(`\nHTML files updated: ${result.htmlFilesUpdated}`);
  console.log('\n✅ Done!\n');
}

/**
 * Non-interactive CLI
 */
async function nonInteractiveCLI(args) {
  const options = {
    text: args.text,
    primaryColor: args.color || '#2563eb',
    textColor: args.textColor || '#ffffff',
    darkMode: args.darkMode !== false
  };

  const outputDir = args.output || process.cwd();

  await generateFavicons(outputDir, options);
}

// Main CLI handler
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive mode
    interactiveCLI()
      .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
      });
  } else {
    // Non-interactive mode
    console.log('Usage: node generate-favicon.js');
    console.log('       (interactive mode - recommended)');
    console.log('\nOr use programmatically:');
    console.log('  const { generateFavicons } = require("./generate-favicon.js");');
    process.exit(0);
  }
}

module.exports = { generateFavicons, generateSVGFavicon };
