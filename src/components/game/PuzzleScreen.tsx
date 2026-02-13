import { useEffect, useState, useMemo } from 'react';
import { Home, RotateCcw, Clock, Footprints, Trophy, Eye, EyeOff } from 'lucide-react';
import { usePuzzle } from '@/hooks/usePuzzle';
import Tile from './Tile';

interface PuzzleScreenProps {
  imageDataURL: string;
  gridSize: number;
  onRestart: () => void;
}

/**
 * Layar puzzle utama.
 * Menampilkan grid tiles, preview gambar asli, timer, move counter, dan modal win.
 */
const PuzzleScreen = ({ imageDataURL, gridSize: initialGridSize, onRestart }: PuzzleScreenProps) => {
  const { tiles, moveCount, isWon, formattedTime, gridSize, initPuzzle, moveTile, canMove } =
    usePuzzle(initialGridSize);

  const [puzzleSize, setPuzzleSize] = useState(300);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxSize = Math.min(vw - 32, vh - 260, 600);
      setPuzzleSize(Math.max(280, maxSize));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    initPuzzle(puzzleSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleSize]);

  const gap = 3;

  const tilesByPosition = useMemo(() => {
    const map = new Map<number, (typeof tiles)[0]>();
    tiles.forEach((t) => map.set(t.currentIndex, t));
    return map;
  }, [tiles]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Stats bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <button
          onClick={onRestart}
          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          title="Kembali ke Home"
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-mono">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-foreground">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-mono">
            <Footprints className="w-4 h-4 text-game-accent2" />
            <span className="text-foreground">{moveCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Toggle preview gambar asli */}
          <button
            onClick={() => setShowPreview((p) => !p)}
            className={`p-2 rounded-lg border transition-colors ${
              showPreview
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
            title="Preview gambar asli"
          >
            {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <button
            onClick={() => initPuzzle(puzzleSize)}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
            title="Shuffle ulang"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview gambar asli (collapsible) */}
      {showPreview && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className="rounded-xl overflow-hidden border border-primary/30"
            style={{ width: Math.min(puzzleSize * 0.4, 140), height: Math.min(puzzleSize * 0.4, 140) }}
          >
            <img src={imageDataURL} alt="Gambar asli" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Puzzle grid */}
      <div
        className="rounded-2xl bg-card border border-border p-1 game-glow"
        style={{
          width: puzzleSize + gap * 2 + 8,
          height: puzzleSize + gap * 2 + 8,
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gap: `${gap}px`,
            width: puzzleSize,
            height: puzzleSize,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, posIndex) => {
            const tile = tilesByPosition.get(posIndex);
            if (!tile) return <div key={posIndex} />;

            const isEmpty = tile.correctIndex === gridSize * gridSize - 1;
            return (
              <Tile
                key={tile.id}
                isEmpty={isEmpty}
                backgroundPosition={tile.backgroundPosition}
                imageUrl={imageDataURL}
                imageSize={puzzleSize}
                gridSize={gridSize}
                onClick={() => moveTile(posIndex)}
                canMove={canMove(posIndex)}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Ketuk tile yang bersebelahan dengan kotak kosong untuk menggesernya
      </p>

      {/* Modal Win */}
      {isWon && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">You Win! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              Selesai dalam <span className="text-primary font-mono font-semibold">{formattedTime}</span> dengan{' '}
              <span className="text-game-accent2 font-mono font-semibold">{moveCount}</span> langkah
            </p>
            <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden mb-6 border border-border">
              <img src={imageDataURL} alt="Completed puzzle" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={onRestart}
              className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold
                         transition-all hover:scale-105 active:scale-95"
            >
              Main Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleScreen;
