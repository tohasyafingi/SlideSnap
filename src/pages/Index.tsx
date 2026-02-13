import { useState } from 'react';
import HomeScreen, { type GridLevel } from '@/components/game/HomeScreen';
import CameraScreen from '@/components/game/CameraScreen';
import PuzzleScreen from '@/components/game/PuzzleScreen';

type Screen = 'home' | 'camera' | 'puzzle';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gridLevel, setGridLevel] = useState<GridLevel>({ size: 4, label: '4×4', tag: 'Medium' });

  const handleStart = (level: GridLevel) => {
    setGridLevel(level);
    setScreen('camera');
  };

  const handleCapture = (imageDataURL: string) => {
    setCapturedImage(imageDataURL);
    setScreen('puzzle');
  };

  const handleRestart = () => {
    setCapturedImage(null);
    setScreen('home');
  };

  return (
    <>
      {screen === 'home' && <HomeScreen onStart={handleStart} />}
      {screen === 'camera' && <CameraScreen onCapture={handleCapture} onBack={handleRestart} />}
      {screen === 'puzzle' && capturedImage && (
        <PuzzleScreen imageDataURL={capturedImage} gridSize={gridLevel.size} onRestart={handleRestart} />
      )}
    </>
  );
};

export default Index;
