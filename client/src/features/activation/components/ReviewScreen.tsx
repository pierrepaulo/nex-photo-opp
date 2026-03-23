import { Button } from '@/components/ui/Button';

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
    <div className="flex min-h-dvh w-full flex-col bg-white px-4 pb-10 pt-6">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <img
          src={previewDataUrl}
          alt="Pré-visualização da foto com moldura"
          className="max-h-[min(65dvh,640px)] w-full object-contain"
        />
        {errorMessage ? (
          <p className="mt-4 text-center text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <div className="mt-6 flex w-full flex-col gap-3">
        <Button type="button" variant="outline" onClick={onRetake} disabled={isUploading}>
          Refazer
        </Button>
        <Button type="button" variant="primary" onClick={onContinue} isLoading={isUploading}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
