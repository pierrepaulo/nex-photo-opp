import { useParams } from 'react-router-dom';

export function DownloadPage() {
  const { token } = useParams<{ token: string }>();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface p-8">
      <h1 className="text-3xl font-bold text-dark">Download</h1>
      <p className="mt-4 text-text-secondary">Token: {token}</p>
      <p className="mt-2 text-text-muted">Pagina de download — em breve</p>
    </div>
  );
}
