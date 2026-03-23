import { GradientBackground } from '@/components/layout/GradientBackground';
import { NexLabHeader } from '@/components/layout/NexLabHeader';
import { Button } from '@/components/ui/Button';

interface QRCodeScreenProps {
  downloadUrl: string;
  onFinish: () => void;
}

export function QRCodeScreen({ downloadUrl, onFinish }: QRCodeScreenProps) {
  return (
    <GradientBackground>
      <div className="flex min-h-dvh w-full flex-col">
        <NexLabHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-2 text-center">
          <h2 className="text-2xl font-bold text-text-secondary">Foto enviada</h2>
          <p className="text-sm text-text-muted">
            Na próxima etapa, um QR Code será exibido aqui. Link de download (teste):
          </p>
          <p className="max-w-full break-all rounded-lg bg-surface px-3 py-2 text-xs text-dark">{downloadUrl}</p>
        </div>
        <div className="mt-auto pb-10">
          <Button type="button" onClick={onFinish}>
            Finalizar
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}
