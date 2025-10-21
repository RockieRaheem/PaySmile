#!/bin/bash

# Create icons directory
mkdir -p public/icons

# Create a simple SVG icon as base
cat > public/icons/icon-base.svg << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="#10b981"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="240" fill="white" text-anchor="middle" dominant-baseline="central">😊</text>
</svg>
EOF

echo "✅ Created base icon at public/icons/icon-base.svg"
echo ""
echo "📝 To generate PNG icons, you can:"
echo "1. Use an online SVG to PNG converter (e.g., cloudconvert.com)"
echo "2. Use ImageMagick: convert icon-base.svg -resize 512x512 icon-512x512.png"
echo "3. Or use the SVG directly for now (browsers support it)"
echo ""
echo "Required sizes: 72, 96, 128, 144, 152, 192, 384, 512"
