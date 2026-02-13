import { useEffect, useState, useMemo } from 'react';
import { Home, RotateCcw, Clock, Footprints, Trophy } from 'lucide-react';
import { usePuzzle } from '@/hooks/usePuzzle';
import Tile from './Tile';

interface PuzzleScreenProps {
  imageDataURL: string;
  onRestart: () => void;
}

/**
 * Layar puzzle utama.
 * Menampilkan grid tiles, timer, move counter, dan modal win.
 */
const PuzzleScreen = ({ imageDataURL, onRestart }: PuzzleScreenProps) => {
  const { tiles, emptyIndex, moveCount, isWon, formattedTime, gridSize, initPuzzle, moveTile, canMove } =
    usePuzzle(4);

  // Hitung ukuran puzzle berdasarkan viewport
  const [puzzleSize, setPuzzleSize] = useState(300);

  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Max 600px, min 280px, sisakan ruang untuk UI
      const maxSize = Math.min(vw - 32, vh - 220, 600);
      setPuzzleSize(Math.max(280, maxSize));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Inisialisasi puzzle saat mount
  useEffect(() => {
    initPuzzle(puzzleSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzleSize]);

  const tileSize = puzzleSize / gridSize;
  const gap = 3;

  // Buat lookup posisi berdasarkan currentIndex
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

        <button
          onClick={() => initPuzzle(puzzleSize)}
          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          title="Shuffle ulang"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

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

            {/* Preview gambar utuh */}
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
