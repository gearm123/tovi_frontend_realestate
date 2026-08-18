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
public/assets/properhero.mp4
```

The homepage hero plays it on loop (muted). A still image is used as the poster and as a fallback.

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
