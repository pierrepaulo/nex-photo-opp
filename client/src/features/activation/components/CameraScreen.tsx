import type { RefObject } from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CameraScreenProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  error: string | null;
  onShutter: () => void;
  onRetryCamera?: () => void;
  shutterDisabled?: boolean;
}

export function CameraScreen({
  videoRef,
  isLoading,
  error,
  onShutter,
  onRetryCamera,
  shutterDisabled = false,
}: CameraScreenProps) {
  if (error) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 bg-white px-6 pb-10">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold text-dark">Não foi possível usar a câmera</p>
          <p className="mt-3 text-text-secondary">{error}</p>
        </div>
        {onRetryCamera ? (
          <Button type="button" onClick={onRetryCamera} fullWidth={false} className="min-h-11 min-w-[12rem]">
            Tentar novamente
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <LoadingSpinner size="lg" />
          </div>
        )}
        <video
          ref={videoRef}
          className="aspect-[9/16] h-full max-h-[min(80dvh,720px)] w-full object-cover"
          autoPlay
          playsInline
          muted
        />
      </div>
      <div className="flex justify-center pb-10 pt-6">
        <button
          type="button"
          onClick={onShutter}
          disabled={isLoading || shutterDisabled}
          className="h-20 w-20 rounded-full border-4 border-medium bg-surface shadow-md transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-medium/40 disabled:opacity-40"
          aria-label="Iniciar contagem para captura"
        />
      </div>
    </div>
  );
}
