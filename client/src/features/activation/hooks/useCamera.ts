import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCameraOptions {
  active: boolean;
}

export function useCamera({ active }: UseCameraOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const el = videoRef.current;
      if (el) {
        el.srcObject = null;
      }
      /* eslint-disable react-hooks/set-state-in-effect -- reset de UI ao sair do modo câmera */
      setIsLoading(false);
      setError(null);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let cancelled = false;
    let videoEl: HTMLVideoElement | null = null;
    setIsLoading(true);
    setError(null);

    void navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          aspectRatio: { ideal: 9 / 16 },
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
        audio: false,
      })
      .then((media) => {
        if (cancelled) {
          media.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = media;
        const el = videoRef.current;
        if (el) {
          el.srcObject = media;
          videoEl = el;
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Não foi possível acessar a câmera. Verifique as permissões.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoEl) {
        videoEl.srcObject = null;
      }
    };
  }, [active]);

  const captureFrame = useCallback((): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return Promise.resolve(null);
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return Promise.resolve(null);
    }
    ctx.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  }, []);

  return { videoRef, isLoading, error, captureFrame };
}
