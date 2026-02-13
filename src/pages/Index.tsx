import { useState } from 'react';
import HomeScreen from '@/components/game/HomeScreen';
import CameraScreen from '@/components/game/CameraScreen';
import PuzzleScreen from '@/components/game/PuzzleScreen';

/** State layar aplikasi */
type Screen = 'home' | 'camera' | 'puzzle';

/**
 * Halaman utama: mengatur flow antar screen.
 * Home → Camera → Puzzle → Home (restart)
 */
const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleStart = () => setScreen('camera');

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
        <PuzzleScreen imageDataURL={capturedImage} onRestart={handleRestart} />
      )}
    </>
  );
};

export default Index;
