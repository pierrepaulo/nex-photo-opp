import { useCallback, useEffect, useRef, useState } from 'react';
import type { UploadPhotoResponse } from '@/types';
import { CameraScreen } from '@/features/activation/components/CameraScreen';
import { CountdownOverlay } from '@/features/activation/components/CountdownOverlay';
import { HomeScreen } from '@/features/activation/components/HomeScreen';
import { QRCodeScreen } from '@/features/activation/components/QRCodeScreen';
import { ReviewScreen } from '@/features/activation/components/ReviewScreen';
import { useCamera } from '@/features/activation/hooks/useCamera';
import { useCountdown } from '@/features/activation/hooks/useCountdown';
import { composeFramePreview } from '@/features/activation/hooks/useFrameOverlay';
import { uploadPhoto } from '@/features/activation/services/photoService';

type Step = 'home' | 'camera' | 'countdown' | 'review' | 'qrcode';

export function ActivationPage() {
  const [step, setStep] = useState<Step>('home');
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadPhotoResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const cameraActive = step === 'camera' || step === 'countdown';
  const { videoRef, isLoading, error, captureFrame } = useCamera({ active: cameraActive });

  const captureFrameRef = useRef(captureFrame);
  const resetCountdownRef = useRef<() => void>(() => {});

  useEffect(() => {
    captureFrameRef.current = captureFrame;
  }, [captureFrame]);

  const { currentValue, start, reset } = useCountdown({
    startValue: 3,
    onComplete: () => {
      void (async () => {
        const blob = await captureFrameRef.current();
        if (!blob) {
          resetCountdownRef.current();
          setStep('camera');
          return;
        }
        try {
          const preview = await composeFramePreview(blob);
          setCapturedBlob(blob);
          setPreviewDataUrl(preview);
          setStep('review');
        } catch {
          resetCountdownRef.current();
          setStep('camera');
        }
      })();
    },
  });

  useEffect(() => {
    resetCountdownRef.current = reset;
  }, [reset]);

  const goToCamera = useCallback(() => {
    setStep('camera');
  }, []);

  const startCountdown = useCallback(() => {
    setStep('countdown');
    start();
  }, [start]);

  const retakePhoto = useCallback(() => {
    reset();
    setCapturedBlob(null);
    setPreviewDataUrl(null);
    setUploadError(null);
    setUploadResult(null);
    setStep('camera');
  }, [reset]);

  const approvePhoto = useCallback(() => {
    if (!capturedBlob) {
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    void uploadPhoto(capturedBlob)
      .then((data) => {
        setUploadResult(data);
        setStep('qrcode');
      })
      .catch((err: unknown) => {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? String((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? '')
            : '';
        setUploadError(
          message || 'Não foi possível enviar a foto. Tente novamente ou verifique se o servidor está disponível.',
        );
      })
      .finally(() => {
        setIsUploading(false);
      });
  }, [capturedBlob]);

  const finish = useCallback(() => {
    reset();
    setCapturedBlob(null);
    setPreviewDataUrl(null);
    setUploadResult(null);
    setUploadError(null);
    setStep('home');
  }, [reset]);

  return (
    <>
      {step === 'home' ? <HomeScreen onStart={goToCamera} /> : null}

      {step === 'camera' || step === 'countdown' ? (
        <div className="relative mx-auto min-h-dvh w-full max-w-[480px]">
          <CameraScreen
            videoRef={videoRef}
            isLoading={isLoading}
            error={error}
            onShutter={startCountdown}
            shutterDisabled={step === 'countdown'}
          />
          {step === 'countdown' && currentValue !== null && currentValue > 0 ? (
            <CountdownOverlay value={currentValue} />
          ) : null}
        </div>
      ) : null}

      {step === 'review' && previewDataUrl ? (
        <div className="mx-auto w-full max-w-[480px]">
          <ReviewScreen
            previewDataUrl={previewDataUrl}
            isUploading={isUploading}
            errorMessage={uploadError}
            onRetake={retakePhoto}
            onContinue={approvePhoto}
          />
        </div>
      ) : null}

      {step === 'qrcode' && uploadResult ? (
        <QRCodeScreen downloadUrl={uploadResult.downloadUrl} onFinish={finish} />
      ) : null}
    </>
  );
}
