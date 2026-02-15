import { memo } from 'react';

interface TileProps {
  backgroundPosition: string;
  imageUrl: string;
  imageSize: number;
  gridSize: number;
  onClick: () => void;
  isSelected: boolean;
  isSwapping: boolean;
}

/**
 * Satu tile dalam puzzle grid.
 * Menggunakan background-image dan background-position untuk menampilkan potongan gambar.
 */
const Tile = memo(({ backgroundPosition, imageUrl, imageSize, gridSize, onClick, isSelected, isSwapping }: TileProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg overflow-hidden transition-all duration-150 tile-shadow tile-motion
        cursor-pointer hover:scale-[1.03] hover:brightness-110 active:scale-95
        ${isSelected ? 'ring-2 ring-primary/70' : 'ring-2 ring-transparent'}
        ${isSwapping ? 'tile-swap' : ''}
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
