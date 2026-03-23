import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ReviewScreenProps {
  previewDataUrl: string;
  isUploading: boolean;
  errorMessage: string | null;
  onRetake: () => void;
  onContinue: () => void;
}

export function ReviewScreen({
  previewDataUrl,
  isUploading,
  errorMessage,
  onRetake,
  onContinue,
}: ReviewScreenProps) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white px-4 pb-10 pt-6">
      {isUploading ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/90 px-6"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <LoadingSpinner size="lg" />
          <p className="text-center text-lg font-semibold text-text-secondary">Enviando foto…</p>
          <p className="max-w-xs text-center text-sm text-text-muted">Aguarde enquanto processamos sua imagem.</p>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <img
          src={previewDataUrl}
          alt="Pré-visualização da foto com moldura"
          className="max-h-[min(65dvh,640px)] w-full object-contain"
        />
        {errorMessage ? (
          <div className="mt-4 flex w-full max-w-md flex-col items-center gap-3" role="alert">
            <p className="text-center text-sm text-red-600">{errorMessage}</p>
            <Button
              type="button"
              variant="outline"
              onClick={onContinue}
              disabled={isUploading}
              fullWidth={false}
              className="min-w-48"
            >
              Tentar novamente
            </Button>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex w-full flex-col gap-3">
        <Button type="button" variant="outline" onClick={onRetake} disabled={isUploading}>
          Refazer
        </Button>
        <Button type="button" variant="primary" onClick={onContinue} disabled={isUploading} isLoading={isUploading}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
