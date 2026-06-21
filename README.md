# PropertyTLV

A warm, newspaper-inspired real estate website for Tel Aviv properties.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Adding the Tel Aviv hero video

Place your animation video at:

```
public/videos/tel-aviv.mp4
```

The hero section will automatically play it on loop (muted). Until the file is added, a beautiful Tel Aviv skyline image is shown as a fallback with a gentle shimmer animation.

## Project structure

```
src/
  components/     UI components (Header, HeroVideo, PropertyCard, etc.)
  data/           Property listings data
  types/          TypeScript types
```

## Customizing properties

Edit `src/data/properties.ts` to add, remove, or update listings. Replace the Unsplash image URLs with your own property photos when ready.

## Build for production

```bash
npm run build
npm run preview
```
