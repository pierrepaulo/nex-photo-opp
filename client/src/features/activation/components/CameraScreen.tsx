import type { RefObject } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CameraScreenProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  error: string | null;
  onShutter: () => void;
  shutterDisabled?: boolean;
}

export function CameraScreen({
  videoRef,
  isLoading,
  error,
  onShutter,
  shutterDisabled = false,
}: CameraScreenProps) {
  if (error) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-white px-6">
        <p className="text-center text-text-secondary">{error}</p>
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
          className="h-20 w-20 rounded-full border-4 border-medium bg-surface shadow-md transition-transform hover:scale-105 disabled:opacity-40"
          aria-label="Iniciar contagem para captura"
        />
      </div>
    </div>
  );
}
