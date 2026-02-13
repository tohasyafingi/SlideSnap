import { memo } from 'react';

interface TileProps {
  isEmpty: boolean;
  backgroundPosition: string;
  imageUrl: string;
  imageSize: number;
  gridSize: number;
  onClick: () => void;
  canMove: boolean;
}

/**
 * Satu tile dalam puzzle grid.
 * Menggunakan background-image dan background-position untuk menampilkan potongan gambar.
 */
const Tile = memo(({ isEmpty, backgroundPosition, imageUrl, imageSize, gridSize, onClick, canMove }: TileProps) => {
  if (isEmpty) {
    return <div className="rounded-lg bg-background/50" />;
  }

  return (
    <button
      onClick={onClick}
      disabled={!canMove}
      className={`
        rounded-lg overflow-hidden transition-all duration-150 tile-shadow
        ${canMove
          ? 'cursor-pointer hover:scale-[1.03] hover:brightness-110 active:scale-95 ring-2 ring-primary/30'
          : 'cursor-default'
        }
      `}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${imageSize}px ${imageSize}px`,
        backgroundPosition,
      }}
      aria-label={`Tile`}
    />
  );
});

Tile.displayName = 'Tile';

export default Tile;
