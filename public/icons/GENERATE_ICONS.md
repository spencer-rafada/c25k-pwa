# Generate PWA Icons

This directory needs two PNG icon files for the PWA to work properly:

- `icon-192.png` - 192x192 pixels
- `icon-512.png` - 512x512 pixels

## Option 1: Use ImageMagick (if installed)

```bash
brew install imagemagick
convert -background none -resize 192x192 icon.svg icon-192.png
convert -background none -resize 512x512 icon.svg icon-512.png
```

## Option 2: Use an online tool

1. Go to [Favicon Generator](https://realfavicongenerator.net/)
2. Upload the `icon.svg` file
3. Generate and download icons
4. Place the 192x192 and 512x512 PNG files in this directory

## Option 3: Create manually

Create two PNG images with a simple green background and white "C25K" text:
- Save as `icon-192.png` (192x192px)
- Save as `icon-512.png` (512x512px)

## Quick Test (creates placeholder icons)

For testing purposes, you can create simple solid color placeholders:

```bash
# macOS with sips
sips -s format png -z 192 192 -c 192 192 -b 10b981 --out icon-192.png /System/Library/CoreServices/DefaultDesktop.jpg
sips -s format png -z 512 512 -c 512 512 -b 10b981 --out icon-512.png /System/Library/CoreServices/DefaultDesktop.jpg
```

Or use any image editor to create 192x192 and 512x512 PNG files with a green (#10b981) background.
