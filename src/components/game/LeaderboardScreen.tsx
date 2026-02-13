import { useEffect, useState } from 'react';
import { Home, Trophy, Clock, Footprints, User, Grid } from 'lucide-react';

export interface LeaderboardEntry {
  name: string;
  level: number;
  moves: number;
  timeSeconds: number;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

const LEVEL_LABELS: Record<number, string> = {
  2: 'Tutorial',
  3: 'Basic',
  4: 'Medium',
  5: 'WNI',
};

const formatLevel = (level: number) => LEVEL_LABELS[level] ?? `${level}x${level}`;

const LeaderboardScreen = ({ onBack }: LeaderboardScreenProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/leaderboard?limit=15');
        if (!response.ok) {
          throw new Error('Gagal memuat leaderboard');
        }
        const data = await response.json();
        if (isMounted) {
          setEntries(Array.isArray(data.entries) ? data.entries : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadLeaderboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          title="Kembali"
        >
          <Home className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-game-accent2" />
          <h2 className="text-lg font-semibold text-foreground">Leaderboard</h2>
        </div>
        <div className="w-9" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4">
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Memuat leaderboard...</div>
        ) : error ? (
          <div className="py-12 text-center text-destructive">{error}</div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Belum ada skor. Main dulu ya.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_90px_70px_70px] gap-3 text-xs text-muted-foreground px-2">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> Nama
              </span>
              <span className="flex items-center gap-1 justify-self-end text-right">
                <Grid className="w-3 h-3" /> Level
              </span>
              <span className="flex items-center gap-1 justify-self-end text-right">
                <Footprints className="w-3 h-3" /> Langkah
              </span>
              <span className="flex items-center gap-1 justify-self-end text-right">
                <Clock className="w-3 h-3" /> Waktu
              </span>
            </div>
            {entries.map((entry, index) => (
              <div
                key={`${entry.name}-${entry.level}-${entry.moves}-${entry.timeSeconds}-${index}`}
                className="grid grid-cols-[minmax(0,1fr)_90px_70px_70px] gap-3 items-center rounded-xl border border-border bg-background/60 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{entry.name}</span>
                </div>
                <span className="text-sm font-mono text-foreground justify-self-end text-right">
                  {formatLevel(entry.level)}
                </span>
                <span className="text-sm font-mono text-foreground justify-self-end text-right">{entry.moves}</span>
                <span className="text-sm font-mono text-foreground justify-self-end text-right">
                  {formatTime(entry.timeSeconds)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
