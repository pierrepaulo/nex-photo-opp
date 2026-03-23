import type { DownloadPhotoResponse } from '@/types';
import { api } from '@/services/api';

const DOWNLOAD_FILENAME = 'photo-opp.png';

export async function fetchDownloadByToken(token: string): Promise<DownloadPhotoResponse> {
  const { data } = await api.get<DownloadPhotoResponse>(`/api/download/${encodeURIComponent(token)}`);
  return data;
}

/**
 * Tenta baixar a imagem via fetch + blob (melhor com CORS no storage).
 * Retorna false se falhar (ex.: CORS); o chamador pode usar fallback com URL direta.
 */
export async function tryDownloadFramedImage(framedUrl: string): Promise<boolean> {
  try {
    const res = await fetch(framedUrl);
    if (!res.ok) {
      return false;
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = DOWNLOAD_FILENAME;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    return false;
  }
}

export function openFramedImageInNewTab(framedUrl: string): void {
  window.open(framedUrl, '_blank', 'noopener,noreferrer');
}
