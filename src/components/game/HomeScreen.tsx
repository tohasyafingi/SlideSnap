import { useState } from 'react';
import { Camera, Puzzle, MoveRight, Lock } from 'lucide-react';

export type GridLevel = { size: number; label: string; tag: string };

const LEVELS: GridLevel[] = [
  { size: 3, label: 'Basic', tag: '3x3' },
  { size: 4, label: 'Medium', tag: '4x4' },
  { size: 5, label: 'Hard', tag: '5x5' },
  { size: 6, label: 'WNI', tag: '6x6' },
];

interface HomeScreenProps {
  onStart: (level: GridLevel) => void;
}

/**
 * Layar awal game: judul, rules, pilihan level, dan tombol start.
 */
const HomeScreen = ({ onStart }: HomeScreenProps) => {
  const [selected, setSelected] = useState<GridLevel>(LEVELS[0]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {/* Judul game */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 game-glow">
          <Puzzle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 game-glow-text text-foreground">
          Heedop<span className="text-primary">WNI</span>
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
      <button
        onClick={() => onStart(selected)}
        className="group relative px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg
                   transition-all duration-300 hover:scale-105 active:scale-95 game-glow"
      >
        <span className="flex items-center gap-2">
          Start Game
        </span>
      </button>

      <p className="mt-6 text-xs text-muted-foreground max-w-xs">
        100% private.
      </p>
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
