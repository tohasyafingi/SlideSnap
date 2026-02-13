# SlideSnap Deployment Guide

SlideSnap is a full-stack photo puzzle game with a React frontend and Node.js backend using SQLite for the leaderboard.

## Prerequisites

- Node.js >= 18.18 && < 23
- npm >= 8.0

## Local Development

```bash
# Install dependencies
npm install

# Terminal 1: Start the backend API (dev mode)
npm run dev:server

# Terminal 2: Start frontend dev server with HMR
npm run dev
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:8787
- Vite proxies /api requests to the backend

## Production Build & Deployment

### Build

```bash
npm run build
```

This compiles the React app to `dist/` folder using Vite.

### Run Production

```bash
npm start
```

The server will:
- Serve the built frontend from `dist/`
- Run the leaderboard API on `http://localhost:3000` (or `PORT` env var)
- Store leaderboard data in `server/data/leaderboard.db`
- Fallback all non-API routes to `index.html` (for client-side routing)

## Environment Variables

```bash
PORT=3000          # Server port (default: 3000)
NODE_ENV=production
```

## Hosting Options

### Option 1: Vercel + SQLite (Not recommended — SQLite needs filesystem persistence)
Use a managed database (PostgreSQL/MongoDB) instead and update the server code.

### Option 2: Railway / Render / Fly.io
- Deploy from git
- Set `NODE_ENV=production`
- Ensure `PORT` env var is configured
- SQLite data persists on the same instance

### Option 3: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm run build

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t slidesnap .
docker run -p 3000:3000 slidesnap
```

### Option 4: Self-hosted (VPS)
Use systemd/PM2 to manage the Node process:

```bash
npm install -g pm2
pm2 start server/index.js --name slidesnap
pm2 save
pm2 startup
```

## Project Structure

```
capture-solve/
├── src/                 # React frontend
├── server/
│   └── index.js        # Express API server
│   └── data/           # SQLite database (created on first run)
├── dist/               # Built frontend (created by npm run build)
└── package.json
```

## API Endpoints

### GET /api/leaderboard
Returns top 15 high scores.

**Query Params:**
- `limit` (optional, default: 15, max: 50)

**Response:**
```json
{
  "entries": [
    {
      "name": "Player Name",
      "level": 2,
      "moves": 4,
      "timeSeconds": 45,
      "createdAt": "2026-02-14T10:30:00.000Z"
    }
  ]
}
```

### POST /api/leaderboard
Submit a new score.

**Request Body:**
```json
{
  "name": "Player Name",
  "level": 2,
  "moves": 4,
  "timeSeconds": 45
}
```

**Response:** `201 Created` with the created entry.

## Performance Tips

- Frontend is static and CDN-friendly
- SQLite is sufficient for 10k+ records
- For high-traffic production, consider:
  - Adding caching headers to static assets
  - Using a reverse proxy (nginx)
  - Migrating to PostgreSQL for horizontal scaling

## Troubleshooting

### "Cannot find module 'better-sqlite3'"
```bash
npm install
npm rebuild better-sqlite3
```

### Port already in use
```bash
# Kill the process using the port
lsof -ti:3000 | xargs kill -9
```

### Database locked errors
- Only one writer at a time (SQLite limitation)
- Consider PostgreSQL for concurrent writes at scale

## License

SlideSnap Game © 2026
