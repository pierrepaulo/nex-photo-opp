import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { NexLabHeader } from '@/components/layout/NexLabHeader';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  fetchDownloadByToken,
  openFramedImageInNewTab,
  tryDownloadFramedImage,
} from '@/features/download/services/downloadPhotoService';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; framedUrl: string };

function DownloadUnavailableView({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <NexLabHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-12 text-center">
        <p
          className="select-none text-[clamp(4rem,18vw,7rem)] font-bold leading-none text-border"
          aria-hidden
        >
          404
        </p>
        <div className="max-w-md space-y-3">
          <h1 className="text-2xl font-bold text-dark sm:text-3xl">{title}</h1>
          <p className="text-base text-text-secondary">{description}</p>
        </div>
        <Link
          to="/"
          className="inline-flex min-h-11 min-w-[12rem] items-center justify-center rounded-lg bg-medium px-6 text-lg font-bold text-white transition-colors hover:bg-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-medium/40"
        >
          Ir ao início
        </Link>
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
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <LoadingSpinner size="lg" className="text-medium" />
          <p className="text-center text-lg text-text-secondary">Carregando sua foto…</p>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    const isNotFound = state.message.includes('não foi encontrada') || state.message.includes('expirou');
    return (
      <DownloadUnavailableView
        title={isNotFound ? 'Foto indisponível' : 'Não foi possível baixar'}
        description={state.message}
      />
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
    return (
      <DownloadUnavailableView
        title="Link inválido"
        description="Este endereço não contém um código de download válido. Peça um novo QR Code no estande."
      />
    );
  }

  return <DownloadPageContent key={trimmed} token={trimmed} />;
}
