# Favicon Configuration

Favicon files for HamarTech are located in this directory and configured through Next.js metadata API.

## Files Structure

- `favicon.ico` - Main favicon file
- `icon0.svg` - SVG icon (modern browsers)
- `icon1.png` - PNG icon (32x32)
- `apple-icon.png` - Apple touch icon (180x180)
- `web-app-manifest-192x192.png` - PWA icon 192x192
- `web-app-manifest-512x512.png` - PWA icon 512x512
- `manifest.json` - Web app manifest

## Configuration

Favicon is configured in:

- `src/lib/seo/metadata.ts` - Icons and manifest configuration
- `src/app/layout.tsx` - Root layout with AppleMetaTag component
- `src/components/seo/apple-meta.tsx` - Component for apple-mobile-web-app-title meta tag

## Verification

To verify favicon setup, run:

```bash
npx realfavicon check 3000
```

Or visit: https://realfavicongenerator.net/favicon_checker

## Next.js App Router

Next.js 16 App Router automatically detects and uses:

- Icons configured in metadata API
- Manifest file referenced in metadata
- Apple touch icons for iOS devices

All favicon files are served from `/favicon/` path.
