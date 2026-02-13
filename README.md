# SlideSnap

A modern photo puzzle game where you capture images, solve puzzles, and compete on a leaderboard.

**Features:**
- 📸 Capture photos from your camera
- 🧩 4 difficulty levels (2×2 Tutorial to 5×5 Expert)
- ⏱️ Real-time timer and move counter
- 🏆 Global leaderboard with persistent scores
- 🌙 Dark mode with polished UI
- 📱 Mobile-friendly

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Terminal 1: Start backend (port 8787)
npm run dev:server

# Terminal 2: Start frontend dev server (port 8080)
npm run dev
```

Open http://localhost:8080 in your browser.

### Production

```bash
# Build frontend
npm run build

# Start server (port 3000 by default)
npm start
```

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn-ui
- React Router
- Lucide React icons

**Backend:**
- Node.js + Express
- better-sqlite3 (leaderboard storage)
- CORS enabled

## Project Structure

```
src/
├── components/
│   └── game/              # Game screens
│       ├── HomeScreen     # Level selection
│       ├── CameraScreen   # Photo capture
│       ├── PuzzleScreen   # Game board
│       ├── LeaderboardScreen
│       └── Tile           # Puzzle tile component
├── hooks/
│   ├── usePuzzle.ts       # Puzzle game logic
│   ├── useCamera.ts       # Camera access
│   └── use-toast.ts       # Toast notifications
└── pages/
    └── Index.tsx          # Main app router

server/
└── index.js               # Express API server
```

## API Endpoints

### GET /api/leaderboard
Get top 15 scores (or custom limit).

```bash
curl http://localhost:3000/api/leaderboard?limit=10
```

### POST /api/leaderboard
Submit a new score.

```bash
curl -X POST http://localhost:3000/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"name":"Player","level":2,"moves":4,"timeSeconds":45}'
```

## Game Rules

1. **Select Level:** Choose difficulty (Tutorial 2×2 → Expert 5×5)
2. **Enter Name:** Your name will appear on the leaderboard
3. **Capture Photo:** Use your camera to take a photo
4. **Solve Puzzle:** Drag tiles to reassemble the photo
5. **Compete:** Submit your score to the leaderboard

## Deployment

See [DEPLOY.md](DEPLOY.md) for:
- Docker setup
- Hosting on Railway/Render/Fly.io
- VPS deployment with PM2
- Environment variables

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

- Static frontend (~3.5 MB gzipped)
- SQLite leaderboard (handles 10k+ records)
- API latency: <50ms (local)

## License

SlideSnap © 2026 — Open Source
