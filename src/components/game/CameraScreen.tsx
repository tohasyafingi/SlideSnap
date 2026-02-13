import { useEffect } from 'react';
import { Camera, RotateCcw, X } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';

interface CameraScreenProps {
  onCapture: (imageDataURL: string) => void;
  onBack: () => void;
}

/**
 * Layar kamera: live preview dan tombol capture.
 * Kamera otomatis start saat mount dan stop saat unmount.
 */
const CameraScreen = ({ onCapture, onBack }: CameraScreenProps) => {
  const { videoRef, stream, error, isLoading, startCamera, stopCamera, capture } = useCamera();

  // Start kamera saat komponen mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const dataURL = capture();
    if (dataURL) {
      onCapture(dataURL);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <button
          onClick={() => { stopCamera(); onBack(); }}
          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Ambil Foto</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Video preview */}
      <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-card border-2 border-border relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Camera className="w-12 h-12 text-destructive mb-3" />
            <p className="text-destructive text-sm">{error}</p>
            <button
              onClick={startCamera}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          onLoadedMetadata={(e) => (e.currentTarget as HTMLVideoElement).play()}
        />

        {/* Grid overlay untuk panduan framing */}
        {stream && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-foreground/10" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tombol Capture */}
      <div className="mt-8">
        <button
          onClick={handleCapture}
          disabled={!stream}
          className="w-20 h-20 rounded-full border-4 border-primary bg-primary/20 
                     flex items-center justify-center transition-all duration-200
                     hover:bg-primary/30 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed
                     game-glow"
        >
          <div className="w-14 h-14 rounded-full bg-primary" />
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Posisikan objek di tengah frame
      </p>
    </div>
  );
};

export default CameraScreen;
