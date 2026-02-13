import { useState, type FormEvent } from 'react';
import { Camera, Puzzle, MoveRight, Lock, Trophy, X } from 'lucide-react';

export type GridLevel = { size: number; label: string; tag: string };

const LEVELS: GridLevel[] = [
  { size: 2, label: 'Tutorial', tag: '2x2' },
  { size: 3, label: 'Basic', tag: '3x3' },
  { size: 4, label: 'Medium', tag: '4x4' },
  { size: 5, label: 'WNI', tag: '5x5' },
];

interface HomeScreenProps {
  onStart: (level: GridLevel, playerName: string) => void;
  onOpenLeaderboard: () => void;
}

/**
 * Layar awal game: judul, rules, pilihan level, dan tombol start.
 */
const HomeScreen = ({ onStart, onOpenLeaderboard }: HomeScreenProps) => {
  const [selected, setSelected] = useState<GridLevel>(LEVELS[0]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const handleStartClick = () => {
    setShowNameModal(true);
  };

  const handleConfirmName = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed) return;
    onStart(selected, trimmed);
    setShowNameModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {/* Judul game */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 game-glow">
          <Puzzle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 game-glow-text text-foreground">
          Slide<span className="text-primary">Snap</span>
        </h1>
        {/* <p className="text-muted-foreground text-lg">
          Foto → Puzzle → Selesaikan!
        </p> */}
      </div>

      {/* Rules */}
      <div className="w-full max-w-sm space-y-3 mb-8">
        <RuleItem icon={<Lock className="w-5 h-5 text-accent" />} text="Foto kamu tidak akan disimpan di server" />
        <RuleItem icon={<Camera className="w-5 h-5 text-primary" />} text="Ambil foto" />
        <RuleItem icon={<Puzzle className="w-5 h-5 text-game-accent2" />} text="Pecah menjadi kepingan" />
        <RuleItem icon={<MoveRight className="w-5 h-5 text-accent" />} text="Susun kembali fotonya" />
      </div>

      {/* Level selector */}
      <div className="w-full max-w-sm mb-8">
        <p className="text-sm text-muted-foreground mb-3">Pilih Level</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LEVELS.map((level) => (
            <button
              key={level.size}
              onClick={() => setSelected(level)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200
                ${selected.size === level.size
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
            >
              <span className="text-lg font-bold text-foreground">{level.label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                ${selected.size === level.size ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {level.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tombol Start */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleStartClick}
          className="group relative px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg
                     transition-all duration-300 hover:scale-105 active:scale-95 game-glow"
        >
          <span className="flex items-center gap-2">
            Start Game
          </span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="px-6 py-3 rounded-xl border border-border bg-card text-foreground font-medium
                     transition-all duration-200 hover:border-muted-foreground/40"
        >
          <span className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-game-accent2" />
            Leaderboard
          </span>
        </button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground max-w-xs">
        100% private.
      </p>

      {showNameModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm text-left animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Nama Pemain</h2>
              <button
                onClick={() => setShowNameModal(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmName} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Masukkan nama untuk leaderboard</label>
                <input
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  placeholder="Nama kamu"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground
                             focus:outline-none focus:ring-2 focus:ring-primary/40"
                  maxLength={24}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Lanjut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const RuleItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border text-left">
    <div className="shrink-0">{icon}</div>
    <p className="text-sm text-secondary-foreground">{text}</p>
  </div>
);

export default HomeScreen;
