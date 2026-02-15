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
  const [moveCount, setMoveCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lastSwap, setLastSwap] = useState<[number, number] | null>(null);
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

  useEffect(() => {
    if (!lastSwap) return;
    const timeout = window.setTimeout(() => setLastSwap(null), 220);
    return () => window.clearTimeout(timeout);
  }, [lastSwap]);

  /** Fisher-Yates shuffle untuk mode tukar tile (tanpa tile kosong) */
  const shuffleArray = useCallback((arr: number[]): number[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  /** Inisialisasi puzzle dari image */
  const initPuzzle = useCallback(
    (imageSize: number) => {
      const total = gridSize * gridSize;
      const tileSize = imageSize / gridSize;
      const indices = Array.from({ length: total }, (_, i) => i);

      const shuffled = shuffleArray(indices);

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
      setMoveCount(0);
      setTimer(0);
      setIsWon(false);
      setIsRunning(true);
      setSelectedIndex(null);
      setLastSwap(null);
    },
    [gridSize, shuffleArray]
  );

  /** Pilih dua tile untuk ditukar posisinya */
  const selectTile = useCallback(
    (clickedIndex: number) => {
      if (isWon) return;

      if (selectedIndex === null) {
        setSelectedIndex(clickedIndex);
        return;
      }

      if (selectedIndex === clickedIndex) {
        setSelectedIndex(null);
        return;
      }

      setTiles((prev) => {
        const updated = [...prev];
        const firstTileIdx = updated.findIndex((t) => t.currentIndex === selectedIndex);
        const secondTileIdx = updated.findIndex((t) => t.currentIndex === clickedIndex);

        if (firstTileIdx === -1 || secondTileIdx === -1) return prev;

        const temp = updated[firstTileIdx].currentIndex;
        updated[firstTileIdx] = {
          ...updated[firstTileIdx],
          currentIndex: updated[secondTileIdx].currentIndex,
        };
        updated[secondTileIdx] = {
          ...updated[secondTileIdx],
          currentIndex: temp,
        };

        const won = updated.every((t) => t.currentIndex === t.correctIndex);
        if (won) {
          setIsWon(true);
          setIsRunning(false);
        }

        return updated;
      });

      setMoveCount((m) => m + 1);
      setLastSwap([selectedIndex, clickedIndex]);
      setSelectedIndex(null);
    },
    [isWon, selectedIndex]
  );

  /** Format timer menjadi mm:ss */
  const formattedTime = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;

  return {
    tiles,
    moveCount,
    isWon,
    timer,
    formattedTime,
    gridSize,
    initPuzzle,
    selectTile,
    selectedIndex,
    lastSwap,
  };
}
