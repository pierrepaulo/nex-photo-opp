import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import { GradientBackground } from '@/components/layout/GradientBackground';
import { NexLabHeader } from '@/components/layout/NexLabHeader';
import { Button } from '@/components/ui/Button';

const AUTO_FINISH_MS = 15_000;
const QR_SIZE = 280;

interface QRCodeScreenProps {
  downloadUrl: string;
  onFinish: () => void;
}

export function QRCodeScreen({ downloadUrl, onFinish }: QRCodeScreenProps) {
  useEffect(() => {
    const id = window.setTimeout(() => {
      onFinish();
    }, AUTO_FINISH_MS);
    return () => window.clearTimeout(id);
  }, [onFinish]);

  return (
    <GradientBackground>
      <div className="flex min-h-dvh w-full flex-col">
        <NexLabHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-6 text-center">
          <h2 className="max-w-[min(100%,28rem)] text-[clamp(2.5rem,12vw,5.5rem)] font-bold leading-tight text-text-secondary">
            Obrigado!
          </h2>
          <p className="max-w-md text-[clamp(1rem,5vw,2.5rem)] leading-snug text-medium">
            Escaneie o QR Code para baixar sua foto com a moldura.
          </p>
          <div className="rounded-2xl border-2 border-border bg-white p-6 shadow-sm">
            <QRCodeSVG
              value={downloadUrl}
              size={QR_SIZE}
              level="M"
              includeMargin={false}
              className="h-auto w-full max-w-[min(100%,280px)]"
            />
          </div>
        </div>
        <div className="mt-auto w-full pb-10">
          <Button type="button" onClick={onFinish}>
            Finalizar
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}
