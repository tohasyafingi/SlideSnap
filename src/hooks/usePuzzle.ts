import { useState, useCallback, useEffect, useRef } from 'react';

/** Representasi satu tile puzzle */
export interface PuzzleTile {
  id: number;
  correctIndex: number;
  currentIndex: number;
  backgroundPosition: string;
}

/**
 * Hook utama untuk logic sliding puzzle.
 * Menangani pembuatan tiles, shuffle, pergerakan, dan win detection.
 */
export function usePuzzle(gridSize: number = 4) {
  const [tiles, setTiles] = useState<PuzzleTile[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(gridSize * gridSize - 1);
  const [moveCount, setMoveCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isWon) {
      intervalRef.current = window.setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isWon]);

  /**
   * Hitung jumlah inversion untuk cek solvability.
   * Untuk grid genap (4x4), puzzle solvable jika:
   * - blank di baris ganjil dari bawah + inversion genap, ATAU
   * - blank di baris genap dari bawah + inversion ganjil
   */
  const isSolvable = useCallback(
    (arr: number[], emptyPos: number): boolean => {
      let inversions = 0;
      const filtered = arr.filter((v) => v !== gridSize * gridSize - 1);
      for (let i = 0; i < filtered.length; i++) {
        for (let j = i + 1; j < filtered.length; j++) {
          if (filtered[i] > filtered[j]) inversions++;
        }
      }

      if (gridSize % 2 !== 0) {
        // Grid ganjil: solvable jika inversion genap
        return inversions % 2 === 0;
      } else {
        // Grid genap: pertimbangkan posisi baris blank dari bawah
        const blankRowFromBottom = gridSize - Math.floor(emptyPos / gridSize);
        if (blankRowFromBottom % 2 === 0) {
          return inversions % 2 !== 0;
        } else {
          return inversions % 2 === 0;
        }
      }
    },
    [gridSize]
  );

  /** Fisher-Yates shuffle dengan jaminan solvable */
  const shuffleArray = useCallback(
    (arr: number[]): { shuffled: number[]; emptyPos: number } => {
      const shuffled = [...arr];
      let emptyPos: number;
      do {
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        emptyPos = shuffled.indexOf(gridSize * gridSize - 1);
      } while (!isSolvable(shuffled, emptyPos));

      return { shuffled, emptyPos };
    },
    [gridSize, isSolvable]
  );

  /** Inisialisasi puzzle dari image */
  const initPuzzle = useCallback(
    (imageSize: number) => {
      const total = gridSize * gridSize;
      const tileSize = imageSize / gridSize;
      const indices = Array.from({ length: total }, (_, i) => i);

      const { shuffled, emptyPos } = shuffleArray(indices);

      const newTiles: PuzzleTile[] = shuffled.map((correctIdx, currentIdx) => {
        const col = correctIdx % gridSize;
        const row = Math.floor(correctIdx / gridSize);
        return {
          id: correctIdx,
          correctIndex: correctIdx,
          currentIndex: currentIdx,
          backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
        };
      });

      setTiles(newTiles);
      setEmptyIndex(emptyPos);
      setMoveCount(0);
      setTimer(0);
      setIsWon(false);
      setIsRunning(true);
    },
    [gridSize, shuffleArray]
  );

  /** Cek apakah tile bisa digeser (bersebelahan dengan empty) */
  const canMove = useCallback(
    (tileIndex: number): boolean => {
      const tileRow = Math.floor(tileIndex / gridSize);
      const tileCol = tileIndex % gridSize;
      const emptyRow = Math.floor(emptyIndex / gridSize);
      const emptyCol = emptyIndex % gridSize;

      const rowDiff = Math.abs(tileRow - emptyRow);
      const colDiff = Math.abs(tileCol - emptyCol);

      // Hanya boleh geser jika adjacent (horizontal atau vertical)
      return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    },
    [gridSize, emptyIndex]
  );

  /** Geser tile ke posisi kosong */
  const moveTile = useCallback(
    (clickedIndex: number) => {
      if (isWon || !canMove(clickedIndex)) return;

      setTiles((prev) => {
        const updated = [...prev];
        // Cari tile di posisi yang diklik dan di posisi empty
        const clickedTileIdx = updated.findIndex((t) => t.currentIndex === clickedIndex);
        const emptyTileIdx = updated.findIndex((t) => t.currentIndex === emptyIndex);

        if (clickedTileIdx === -1 || emptyTileIdx === -1) return prev;

        // Swap currentIndex
        const temp = updated[clickedTileIdx].currentIndex;
        updated[clickedTileIdx] = {
          ...updated[clickedTileIdx],
          currentIndex: updated[emptyTileIdx].currentIndex,
        };
        updated[emptyTileIdx] = {
          ...updated[emptyTileIdx],
          currentIndex: temp,
        };

        // Cek menang: semua tile di posisi benar
        const won = updated.every((t) => t.currentIndex === t.correctIndex);
        if (won) {
          setIsWon(true);
          setIsRunning(false);
        }

        return updated;
      });

      setEmptyIndex(clickedIndex);
      setMoveCount((m) => m + 1);
    },
    [emptyIndex, canMove, isWon]
  );

  /** Format timer menjadi mm:ss */
  const formattedTime = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;

  return {
    tiles,
    emptyIndex,
    moveCount,
    isWon,
    timer,
    formattedTime,
    gridSize,
    initPuzzle,
    moveTile,
    canMove,
  };
}
