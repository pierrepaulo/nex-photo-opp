import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCameraOptions {
  active: boolean;
}

function cameraErrorMessage(err: unknown): string {
  const name =
    err && typeof err === 'object' && 'name' in err ? String((err as DOMException).name) : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Acesso à câmera negado. Permita o uso da câmera nas configurações do navegador e toque em Tentar novamente.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'Nenhuma câmera foi encontrada neste dispositivo.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'A câmera está em uso por outro aplicativo. Feche-o e tente novamente.';
  }
  if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
    return 'Este dispositivo não atende às configurações da câmera solicitadas. Tente novamente.';
  }
  return 'Não foi possível acessar a câmera. Verifique as permissões e tente de novo.';
}

export function useCamera({ active }: UseCameraOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setRetryToken((n) => n + 1);
  }, []);

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
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(cameraErrorMessage(err));
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
  }, [active, retryToken]);

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

  return { videoRef, isLoading, error, captureFrame, retry };
}
