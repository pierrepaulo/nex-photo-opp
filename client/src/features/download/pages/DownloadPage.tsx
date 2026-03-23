import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NexLabHeader } from '@/components/layout/NexLabHeader';
import { Button } from '@/components/ui/Button';
import {
  fetchDownloadByToken,
  openFramedImageInNewTab,
  tryDownloadFramedImage,
} from '@/features/download/services/downloadPhotoService';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; framedUrl: string };

function InvalidTokenView() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <NexLabHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-dark">Download</h1>
        <p className="max-w-md text-text-secondary">Link inválido.</p>
      </div>
    </div>
  );
}

function DownloadPageContent({ token }: { token: string }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const autoDownloadStartedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const data = await fetchDownloadByToken(token);
        if (cancelled) {
          return;
        }
        setState({ status: 'ready', framedUrl: data.framedUrl });
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setState({
            status: 'error',
            message: 'Esta foto não foi encontrada ou o link expirou.',
          });
        } else {
          setState({
            status: 'error',
            message: 'Não foi possível carregar a foto. Tente de novo mais tarde.',
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (state.status !== 'ready' || autoDownloadStartedRef.current) {
      return;
    }
    autoDownloadStartedRef.current = true;
    void tryDownloadFramedImage(state.framedUrl);
  }, [state]);

  const handleManualDownload = useCallback(async () => {
    if (state.status !== 'ready') {
      return;
    }
    const ok = await tryDownloadFramedImage(state.framedUrl);
    if (!ok) {
      openFramedImageInNewTab(state.framedUrl);
    }
  }, [state]);

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-dvh flex-col bg-surface">
        <NexLabHeader />
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <p className="text-center text-lg text-text-secondary">Carregando sua foto…</p>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex min-h-dvh flex-col bg-surface">
        <NexLabHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-dark">Download</h1>
          <p className="max-w-md text-text-secondary">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <NexLabHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-6 px-4 py-8">
        <h1 className="text-center text-2xl font-bold text-dark">Sua foto</h1>
        <p className="text-center text-sm text-text-muted">
          Se o download não iniciou automaticamente, clique no botão abaixo.
        </p>
        <div className="w-full overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm">
          <img
            src={state.framedUrl}
            alt="Foto com moldura"
            className="mx-auto max-h-[min(60dvh,480px)] w-full object-contain"
          />
        </div>
        <div className="w-full max-w-sm">
          <Button type="button" onClick={() => void handleManualDownload()}>
            Baixar imagem
          </Button>
        </div>
      </main>
    </div>
  );
}

export function DownloadPage() {
  const { token } = useParams<{ token: string }>();
  const trimmed = token?.trim() ?? '';

  if (!trimmed) {
    return <InvalidTokenView />;
  }

  return <DownloadPageContent key={trimmed} token={trimmed} />;
}
