#!/bin/bash

###############################################################################
# Static Site Optimizer - Tool Installation Script
# Installs all necessary tools for optimizing static websites
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "Static Site Optimizer - Tool Installation"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root for system packages
if [ "$EUID" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

# Function to print warning
print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

###############################################################################
# 1. Check Prerequisites
###############################################################################

echo "Checking prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
  echo -e "${RED}✗${NC} Node.js not found"
  echo "Please install Node.js 18+ from: https://nodejs.org/"
  exit 1
fi

# Check npm
if command_exists npm; then
  NPM_VERSION=$(npm -v)
  echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
  echo -e "${RED}✗${NC} npm not found"
  exit 1
fi

echo ""

###############################################################################
# 2. Install System Packages (Linux/macOS)
###############################################################################

echo "Installing system packages..."
echo ""

# Detect OS
OS=$(uname -s)

if [ "$OS" = "Linux" ]; then
  # Check which package manager is available
  if command_exists apt-get; then
    echo "Detected Debian/Ubuntu system"
    $SUDO apt-get update
    $SUDO apt-get install -y \
      imagemagick \
      jpegoptim \
      optipng \
      pngquant \
      webp \
      gifsicle \
      chromium-browser
    print_status "System packages installed (apt)"

    # Try to install libavif if available
    if apt-cache show libavif-bin >/dev/null 2>&1; then
      $SUDO apt-get install -y libavif-bin
      print_status "AVIF tools installed"
    else
      print_warning "AVIF tools not available in repositories"
    fi

  elif command_exists yum; then
    echo "Detected RedHat/CentOS system"
    $SUDO yum install -y \
      ImageMagick \
      jpegoptim \
      optipng \
      pngquant \
      libwebp-tools \
      gifsicle \
      chromium
    print_status "System packages installed (yum)"

  elif command_exists pacman; then
    echo "Detected Arch Linux system"
    $SUDO pacman -S --noconfirm \
      imagemagick \
      jpegoptim \
      optipng \
      pngquant \
      libwebp \
      gifsicle \
      chromium
    print_status "System packages installed (pacman)"
  fi

elif [ "$OS" = "Darwin" ]; then
  echo "Detected macOS system"
  if command_exists brew; then
    brew install \
      imagemagick \
      jpegoptim \
      optipng \
      pngquant \
      webp \
      gifsicle \
      libavif \
      chromium
    print_status "System packages installed (Homebrew)"
  else
    print_warning "Homebrew not found. Please install from: https://brew.sh/"
  fi
fi

echo ""

###############################################################################
# 3. Install Node.js Global Packages
###############################################################################

echo "Installing Node.js global packages..."
echo ""

# HTML validation and optimization
npm install -g html-minifier html-validator-cli
print_status "HTML tools installed"

# CSS optimization
npm install -g cssnano-cli clean-css-cli stylelint stylelint-config-standard purgecss
print_status "CSS tools installed"

# JavaScript optimization
npm install -g terser uglify-js eslint
print_status "JavaScript tools installed"

# Image optimization
npm install -g sharp-cli svgo
print_status "Image optimization tools installed"

# Performance auditing
npm install -g lighthouse pa11y http-server
print_status "Performance audit tools installed"

# Utility tools
npm install -g cheerio glob
print_status "Utility packages installed"

echo ""

###############################################################################
# 4. Install Local Node.js Packages (for scripts)
###############################################################################

echo "Setting up local Node.js environment..."
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Create package.json if it doesn't exist
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  cd "$PROJECT_DIR"
  npm init -y
  print_status "Created package.json"
fi

# Install local dependencies
cd "$PROJECT_DIR"
npm install --save-dev \
  sharp \
  cheerio \
  glob \
  html-minifier \
  cssnano \
  postcss \
  postcss-cli \
  autoprefixer \
  @fullhuman/postcss-purgecss \
  terser \
  lighthouse \
  axios

print_status "Local packages installed"

echo ""

###############################################################################
# 5. Verify Installations
###############################################################################

echo "Verifying installations..."
echo ""

# Image tools
command_exists convert && echo -e "${GREEN}✓${NC} ImageMagick installed" || print_warning "ImageMagick not found"
command_exists jpegoptim && echo -e "${GREEN}✓${NC} jpegoptim installed" || print_warning "jpegoptim not found"
command_exists optipng && echo -e "${GREEN}✓${NC} optipng installed" || print_warning "optipng not found"
command_exists pngquant && echo -e "${GREEN}✓${NC} pngquant installed" || print_warning "pngquant not found"
command_exists cwebp && echo -e "${GREEN}✓${NC} WebP encoder installed" || print_warning "WebP encoder not found"
command_exists avifenc && echo -e "${GREEN}✓${NC} AVIF encoder installed" || print_warning "AVIF encoder not found (optional)"
command_exists svgo && echo -e "${GREEN}✓${NC} SVGO installed" || print_warning "SVGO not found"

# Minification tools
command_exists html-minifier && echo -e "${GREEN}✓${NC} html-minifier installed" || print_warning "html-minifier not found"
command_exists cssnano && echo -e "${GREEN}✓${NC} cssnano installed" || print_warning "cssnano not found"
command_exists terser && echo -e "${GREEN}✓${NC} terser installed" || print_warning "terser not found"

# Validation tools
command_exists html-validator && echo -e "${GREEN}✓${NC} html-validator installed" || print_warning "html-validator not found"
command_exists stylelint && echo -e "${GREEN}✓${NC} stylelint installed" || print_warning "stylelint not found"
command_exists eslint && echo -e "${GREEN}✓${NC} eslint installed" || print_warning "eslint not found"

# Performance tools
command_exists lighthouse && echo -e "${GREEN}✓${NC} Lighthouse installed" || print_warning "Lighthouse not found"
command_exists pa11y && echo -e "${GREEN}✓${NC} pa11y installed" || print_warning "pa11y not found"

echo ""

###############################################################################
# 6. Create Configuration Files
###############################################################################

echo "Creating configuration files..."
echo ""

# ESLint config
cat > "$PROJECT_DIR/.eslintrc.json" << 'EOF'
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn"
  }
}
EOF
print_status ".eslintrc.json created"

# Stylelint config
cat > "$PROJECT_DIR/.stylelintrc.json" << 'EOF'
{
  "extends": "stylelint-config-standard",
  "rules": {
    "indentation": 2,
    "string-quotes": "double"
  }
}
EOF
print_status ".stylelintrc.json created"

# PostCSS config
cat > "$PROJECT_DIR/postcss.config.js" << 'EOF'
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: ['advanced', {
        discardComments: { removeAll: true }
      }]
    })
  ]
};
EOF
print_status "postcss.config.js created"

# PurgeCSS config
cat > "$PROJECT_DIR/purgecss.config.js" << 'EOF'
module.exports = {
  content: ['**/*.html', '**/*.js'],
  css: ['**/*.css'],
  safelist: ['active', 'show', 'open', 'visible']
};
EOF
print_status "purgecss.config.js created"

# Make scripts executable
chmod +x "$SCRIPT_DIR"/*.js 2>/dev/null || true
chmod +x "$SCRIPT_DIR"/*.sh 2>/dev/null || true

echo ""

###############################################################################
# 7. Summary
###############################################################################

echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Installed tools:"
echo "  • Image optimization: ImageMagick, jpegoptim, optipng, pngquant, WebP, AVIF"
echo "  • Minification: html-minifier, cssnano, terser"
echo "  • Validation: html-validator, stylelint, eslint"
echo "  • Performance: Lighthouse, pa11y"
echo "  • Utilities: sharp, cheerio, glob"
echo ""
echo "Configuration files created:"
echo "  • .eslintrc.json"
echo "  • .stylelintrc.json"
echo "  • postcss.config.js"
echo "  • purgecss.config.js"
echo ""
echo "Next steps:"
echo "  1. Run 'static-site-optimizer:optimize' skill in Claude Code"
echo "  2. Or use the scripts directly:"
echo "     node .claude/scripts/image-optimizer.js <input-dir> <output-dir>"
echo "     node .claude/scripts/html-updater.js <html-dir> <report.json>"
echo ""
echo -e "${GREEN}Ready to optimize your static site!${NC}"
echo ""
