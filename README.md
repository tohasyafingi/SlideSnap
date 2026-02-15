# HeedopWNI

![HeedopWNI Logo](public/favicon.png)

A modern photo puzzle game: take a photo, slice it into tiles, then swap tiles to rebuild it.

**Features:**
- 📸 Capture photos from your camera (front/back toggle)
- 🧩 4 difficulty levels (3×3 Basic to 6×6 WNI)
- 🧠 Tap two tiles to swap (no empty tile)
- ⏱️ Real-time timer and move counter
- 👀 Toggle original image preview + reshuffle
- 🔊 Click SFX + level-based background music + win sound
- 📱 Mobile-friendly
- 🚀 100% client-side (no server needed, photo stays in memory)

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start frontend dev server (port 8080)
npm run dev
```

Open http://localhost:8080 in your browser.

### Production

```bash
# Build static files
npm run build

# Output in dist/ folder (ready for CDN)
```



## Tech Stack

**Frontend Only:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn-ui
- React Router
- Lucide React icons

## Project Structure

```
src/
├── components/
│   └── game/              # Game screens
│       ├── HomeScreen.tsx   # Level selection
│       ├── CameraScreen.tsx # Photo capture
│       ├── PuzzleScreen.tsx # Game board
│       └── Tile.tsx         # Puzzle tile component
├── hooks/
│   ├── usePuzzle.ts         # Puzzle game logic
│   ├── useCamera.ts         # Camera access
│   └── use-toast.ts         # Toast notifications
└── pages/
    └── Index.tsx            # Main app router
```

## Game Rules

1. **Select Level:** Choose difficulty (Basic 3×3 → WNI 6×6)
2. **Capture Photo:** Use your camera to take a photo
3. **Solve Puzzle:** Tap two tiles to swap their positions
4. **Optional Help:** Toggle preview or reshuffle
5. **Win:** Complete the puzzle!

## Development

```bash
# Run tests
npm run test

# Watch tests
npm run test:watch

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Bundle size: ~200KB gzipped
- 100% client-side (no server)
- Works offline
- CDN-friendly static assets

## License

HeedopWNI © 2026 — Open Source
