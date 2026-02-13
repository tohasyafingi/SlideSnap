import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'leaderboard.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    moves INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('/api/leaderboard', (req, res) => {
  const limitParam = Number(req.query.limit || 15);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 15;

  const rows = db
    .prepare(
      `
      SELECT name, level, moves, time_seconds AS timeSeconds, created_at AS createdAt
      FROM leaderboard
      ORDER BY moves ASC, time_seconds ASC, created_at ASC
      LIMIT ?
    `
    )
    .all(limit);

  res.json({ entries: rows });
});

app.post('/api/leaderboard', (req, res) => {
  const { name, level, moves, timeSeconds } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Nama wajib diisi.' });
  }
  if (!Number.isInteger(level) || level < 2 || level > 10) {
    return res.status(400).json({ error: 'Level tidak valid.' });
  }
  if (!Number.isInteger(moves) || moves < 0) {
    return res.status(400).json({ error: 'Jumlah langkah tidak valid.' });
  }
  if (!Number.isInteger(timeSeconds) || timeSeconds < 0) {
    return res.status(400).json({ error: 'Waktu tidak valid.' });
  }

  const createdAt = new Date().toISOString();
  const trimmedName = name.trim().slice(0, 24);

  const result = db
    .prepare(
      `
      INSERT INTO leaderboard (name, level, moves, time_seconds, created_at)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .run(trimmedName, level, moves, timeSeconds, createdAt);

  res.status(201).json({
    id: result.lastInsertRowid,
    name: trimmedName,
    level,
    moves,
    timeSeconds,
    createdAt,
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
  console.log(`SlideSnap running on http://localhost:${port}`);
  console.log(`Leaderboard API: http://localhost:${port}/api/leaderboard`);
});
