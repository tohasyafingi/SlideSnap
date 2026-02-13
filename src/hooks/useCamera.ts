import { useState, useRef, useCallback } from 'react';

/**
 * Hook untuk mengakses kamera dan capture foto.
 * Semua proses hanya di memory — tidak ada penyimpanan ke storage.
 */
export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // Default: kamera depan
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Minta izin kamera dan mulai streaming
  const startCamera = useCallback(async (facing: 'user' | 'environment' = facingMode) => {
    setIsLoading(true);
    setError(null);
    try {
      // Stop track lama jika ada
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setFacingMode(facing);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Tidak bisa mengakses kamera. Pastikan izin sudah diberikan.');
      console.error('Camera error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [stream, facingMode]);

  // Stop semua track kamera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Toggle antara kamera depan dan belakang
  const toggleCamera = useCallback(async () => {
    const newFacing = facingMode === 'user' ? 'environment' : 'user';
    await startCamera(newFacing);
  }, [facingMode, startCamera]);

  /**
   * Capture frame dari video, crop center menjadi square,
   * resize ke max 600x600, return sebagai dataURL.
   */
  const capture = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video) return null;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const size = Math.min(vw, vh);
    const sx = (vw - size) / 2;
    const sy = (vh - size) / 2;

    const maxSize = 600;
    const outSize = Math.min(size, maxSize);

    const canvas = document.createElement('canvas');
    canvas.width = outSize;
    canvas.height = outSize;
    const ctx = canvas.getContext('2d')!;

    // Crop center dan resize
    ctx.drawImage(video, sx, sy, size, size, 0, 0, outSize, outSize);

    const dataURL = canvas.toDataURL('image/jpeg', 0.9);

    // Stop kamera setelah capture
    stopCamera();

    return dataURL;
  }, [stopCamera]);

  return { videoRef, stream, error, isLoading, facingMode, startCamera, stopCamera, toggleCamera, capture };
}
