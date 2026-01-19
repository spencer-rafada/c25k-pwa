# C25K PWA

A Progressive Web App for the Couch-to-5K interval training program.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## PWA Icons

The app requires PNG icons for PWA installation. To generate icons from the SVG:

You can use an online tool like [Favicon Generator](https://realfavicongenerator.net/) or use ImageMagick:

```bash
# Install ImageMagick if needed
brew install imagemagick

# Convert SVG to PNG icons
convert -background none -resize 192x192 public/icons/icon.svg public/icons/icon-192.png
convert -background none -resize 512x512 public/icons/icon.svg public/icons/icon-512.png
```

Or create your own custom icons and save them as:
- `public/icons/icon-192.png` (192x192px)
- `public/icons/icon-512.png` (512x512px)

## Features

- 9-week C25K program with all workouts
- Interval timer with audio cues
- Progress tracking (localStorage)
- PWA installable on iOS/Android
- Works offline
- Dark theme optimized for outdoor use
- Wake Lock API to keep screen active (where supported)

## Testing on iOS

1. Build and run the app
2. Open in Safari on iOS
3. Tap the Share button
4. Select "Add to Home Screen"
5. Open from home screen to test standalone mode

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- next-pwa
- Web Audio API
- Wake Lock API
