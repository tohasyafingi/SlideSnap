import { useState } from 'react';
import HomeScreen, { type GridLevel } from '@/components/game/HomeScreen';
import CameraScreen from '@/components/game/CameraScreen';
import PuzzleScreen from '@/components/game/PuzzleScreen';
import LeaderboardScreen from '@/components/game/LeaderboardScreen';

type Screen = 'home' | 'camera' | 'puzzle' | 'leaderboard';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gridLevel, setGridLevel] = useState<GridLevel>({ size: 2, label: '2×2', tag: 'Tutorial' });
  const [playerName, setPlayerName] = useState('');

  const handleStart = (level: GridLevel, name: string) => {
    setGridLevel(level);
    setPlayerName(name);
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

  const handleWin = async (result: { moves: number; timeSeconds: number }) => {
    const payload = {
      name: playerName || 'Player',
      level: gridLevel.size,
      moves: result.moves,
      timeSeconds: result.timeSeconds,
    };

    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to save leaderboard entry', error);
    }
  };

  return (
    <>
      {screen === 'home' && (
        <HomeScreen onStart={handleStart} onOpenLeaderboard={() => setScreen('leaderboard')} />
      )}
      {screen === 'camera' && <CameraScreen onCapture={handleCapture} onBack={handleRestart} />}
      {screen === 'puzzle' && capturedImage && (
        <PuzzleScreen
          imageDataURL={capturedImage}
          gridSize={gridLevel.size}
          onRestart={handleRestart}
          onWin={handleWin}
        />
      )}
      {screen === 'leaderboard' && <LeaderboardScreen onBack={() => setScreen('home')} />}
    </>
  );
};

export default Index;
