#!/bin/bash

###############################################################################
# compress-assets.sh - Pre-compress static assets for production
# Generates .br (Brotli) and .gz (Gzip) versions of text files
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
BROTLI_QUALITY=11
GZIP_QUALITY=9
MIN_SIZE=150  # bytes

# Statistics
TOTAL_FILES=0
TOTAL_ORIGINAL_SIZE=0
TOTAL_BROTLI_SIZE=0
TOTAL_GZIP_SIZE=0

# Function to format bytes
format_bytes() {
  local bytes=$1
  if [ $bytes -lt 1024 ]; then
    echo "${bytes}B"
  elif [ $bytes -lt 1048576 ]; then
    echo "$(awk "BEGIN {printf \"%.2f\", $bytes/1024}")KB"
  else
    echo "$(awk "BEGIN {printf \"%.2f\", $bytes/1048576}")MB"
  fi
}

# Function to calculate percentage
calc_percent() {
  local orig=$1
  local comp=$2
  if [ $orig -eq 0 ]; then
    echo "0.0"
  else
    awk "BEGIN {printf \"%.1f\", 100*(1-$comp/$orig)}"
  fi
}

# Function to get file size (cross-platform)
get_file_size() {
  local file=$1
  if stat -f%z "$file" >/dev/null 2>&1; then
    # macOS
    stat -f%z "$file"
  else
    # Linux
    stat -c%s "$file"
  fi
}

# Check dependencies
check_dependency() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ $1 not found.${NC}"
    return 1
  fi
  return 0
}

# Install brotli if missing
if ! check_dependency brotli; then
  echo -e "${CYAN}Installing brotli...${NC}"
  if command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update && sudo apt-get install -y brotli
  elif command -v brew >/dev/null 2>&1; then
    brew install brotli
  elif command -v yum >/dev/null 2>&1; then
    sudo yum install -y brotli
  else
    echo -e "${YELLOW}⚠ Please install brotli manually:${NC}"
    echo "  Ubuntu/Debian: sudo apt-get install brotli"
    echo "  macOS: brew install brotli"
    echo "  RedHat/CentOS: sudo yum install brotli"
    exit 1
  fi
fi

if ! check_dependency gzip; then
  echo -e "${YELLOW}⚠ gzip not found (should be preinstalled)${NC}"
  exit 1
fi

# Get target directory
TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
  echo -e "${YELLOW}Error: Directory $TARGET_DIR does not exist${NC}"
  exit 1
fi

echo "=========================================="
echo "Static Assets Compression"
echo "=========================================="
echo ""
echo "Target directory: $TARGET_DIR"
echo "Brotli quality: $BROTLI_QUALITY (maximum)"
echo "Gzip quality: $GZIP_QUALITY (maximum)"
echo "Minimum file size: $MIN_SIZE bytes"
echo ""

# Create temporary file list
TEMP_FILE=$(mktemp)

# Find all compressible files
find "$TARGET_DIR" -type f \( \
  -name "*.html" -o \
  -name "*.htm" -o \
  -name "*.css" -o \
  -name "*.js" -o \
  -name "*.mjs" -o \
  -name "*.json" -o \
  -name "*.svg" -o \
  -name "*.xml" -o \
  -name "*.txt" -o \
  -name "*.md" -o \
  -name "*.map" -o \
  -name "*.webmanifest" -o \
  -name "*.rss" -o \
  -name "*.atom" \
\) > "$TEMP_FILE"

# Count files
FOUND_FILES=$(wc -l < "$TEMP_FILE")
echo -e "${CYAN}Found $FOUND_FILES files to process${NC}"
echo ""

# Process each file
while IFS= read -r file; do
  # Skip if file doesn't exist (edge case)
  [ -f "$file" ] || continue

  # Get file size
  SIZE=$(get_file_size "$file")

  # Skip small files
  if [ "$SIZE" -lt "$MIN_SIZE" ]; then
    continue
  fi

  # Skip already compressed files
  if [[ "$file" =~ \.(br|gz)$ ]]; then
    continue
  fi

  TOTAL_FILES=$((TOTAL_FILES + 1))
  TOTAL_ORIGINAL_SIZE=$((TOTAL_ORIGINAL_SIZE + SIZE))

  # Get relative path for display
  REL_PATH=$(realpath --relative-to="$TARGET_DIR" "$file" 2>/dev/null || basename "$file")

  echo -e "${BLUE}[$TOTAL_FILES/$FOUND_FILES]${NC} $REL_PATH"
  echo -e "  Original: $(format_bytes $SIZE)"

  # Brotli compression (level 11 = maximum quality)
  if brotli -q $BROTLI_QUALITY -f -k "$file" 2>/dev/null; then
    if [ -f "$file.br" ]; then
      BR_SIZE=$(get_file_size "$file.br")
      TOTAL_BROTLI_SIZE=$((TOTAL_BROTLI_SIZE + BR_SIZE))
      BR_PERCENT=$(calc_percent $SIZE $BR_SIZE)
      echo -e "  ${GREEN}✓ Brotli${NC}:  $(format_bytes $BR_SIZE) (${BR_PERCENT}% smaller)"
    fi
  else
    echo -e "  ${YELLOW}⚠ Brotli failed${NC}"
  fi

  # Gzip compression (level 9 = maximum compression)
  if gzip -$GZIP_QUALITY -f -k "$file" 2>/dev/null; then
    if [ -f "$file.gz" ]; then
      GZ_SIZE=$(get_file_size "$file.gz")
      TOTAL_GZIP_SIZE=$((TOTAL_GZIP_SIZE + GZ_SIZE))
      GZ_PERCENT=$(calc_percent $SIZE $GZ_SIZE)
      echo -e "  ${GREEN}✓ Gzip${NC}:    $(format_bytes $GZ_SIZE) (${GZ_PERCENT}% smaller)"
    fi
  else
    echo -e "  ${YELLOW}⚠ Gzip failed${NC}"
  fi

  echo ""

done < "$TEMP_FILE"

# Cleanup
rm -f "$TEMP_FILE"

# Print summary
echo "=========================================="
echo "COMPRESSION SUMMARY"
echo "=========================================="
echo ""

if [ $TOTAL_FILES -eq 0 ]; then
  echo -e "${YELLOW}⚠ No files met the compression criteria${NC}"
  echo "  (minimum size: $MIN_SIZE bytes)"
  echo ""
  exit 0
fi

echo "Files compressed: $TOTAL_FILES"
echo ""
echo "📊 Total Sizes:"
echo "  Original: $(format_bytes $TOTAL_ORIGINAL_SIZE)"
echo "  Brotli:   $(format_bytes $TOTAL_BROTLI_SIZE) (${GREEN}-$(calc_percent $TOTAL_ORIGINAL_SIZE $TOTAL_BROTLI_SIZE)%${NC})"
echo "  Gzip:     $(format_bytes $TOTAL_GZIP_SIZE) (${GREEN}-$(calc_percent $TOTAL_ORIGINAL_SIZE $TOTAL_GZIP_SIZE)%${NC})"
echo ""

# Calculate bandwidth savings
BROTLI_SAVINGS=$((TOTAL_ORIGINAL_SIZE - TOTAL_BROTLI_SIZE))
GZIP_SAVINGS=$((TOTAL_ORIGINAL_SIZE - TOTAL_GZIP_SIZE))

echo "💾 Bandwidth Savings:"
echo "  With Brotli: $(format_bytes $BROTLI_SAVINGS) per page load"
echo "  With Gzip:   $(format_bytes $GZIP_SAVINGS) per page load"
echo ""

# Calculate average ratios
BROTLI_RATIO=$(calc_percent $TOTAL_ORIGINAL_SIZE $TOTAL_BROTLI_SIZE)
GZIP_RATIO=$(calc_percent $TOTAL_ORIGINAL_SIZE $TOTAL_GZIP_SIZE)

echo "📈 Average Compression Ratios:"
echo "  Brotli-11: ${BROTLI_RATIO}% size reduction"
echo "  Gzip-9:    ${GZIP_RATIO}% size reduction"
echo ""

echo "🌐 Browser Support:"
echo "  Brotli: Chrome 50+, Firefox 44+, Safari 11+, Edge 15+"
echo "  Gzip:   All browsers (universal fallback)"
echo ""

echo -e "${GREEN}✓ Compression complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Upload compressed files (.br, .gz) alongside originals"
echo "  2. Configure web server to serve pre-compressed files"
echo "  3. Test with: curl -H 'Accept-Encoding: br,gzip' https://your-site.com"
echo ""
