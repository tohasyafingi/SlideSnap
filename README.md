# HeedopWNI

A modern photo puzzle game where you capture images and solve puzzles.

**Features:**
- 📸 Capture photos from your camera
- 🧩 4 difficulty levels (2×2 Tutorial to 5×5 Expert)
- ⏱️ Real-time timer and move counter
- 🌙 Dark mode with polished UI
- 📱 Mobile-friendly
- 🚀 100% client-side (no server needed)

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

See [DEPLOY.md](DEPLOY.md) for deployment options (Cloudflare Pages, Vercel, GitHub Pages, etc).

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
│       ├── HomeScreen     # Level selection
│       ├── CameraScreen   # Photo capture
│       ├── PuzzleScreen   # Game board
│       └── Tile           # Puzzle tile component
├── hooks/
│   ├── usePuzzle.ts       # Puzzle game logic
│   ├── useCamera.ts       # Camera access
│   └── use-toast.ts       # Toast notifications
└── pages/
    └── Index.tsx          # Main app router
```

## Game Rules

1. **Select Level:** Choose difficulty (Tutorial 2×2 → Expert 5×5)
2. **Capture Photo:** Use your camera to take a photo
3. **Solve Puzzle:** Drag tiles to reassemble the photo
4. **Win:** Complete the puzzle!

## Deployment

See [DEPLOY.md](DEPLOY.md) for:
- Cloudflare Pages (recommended)
- Vercel
- GitHub Pages
- Other CDNs

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
