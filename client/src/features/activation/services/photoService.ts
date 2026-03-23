import type { UploadPhotoResponse } from '@/types';
import { api } from '@/services/api';

/** Nome do ficheiro no multipart (apenas metadado; o buffer vem do Blob). */
const PHOTO_PART_FILENAME = 'capture.png';

/**
 * Envia a foto original (PNG) para POST /api/photos (campo `photo`, multipart).
 * Resposta alinhada ao PhotoResponseDTO (Fase 4.10): o campo `id` é o identificador da foto no backend
 * (equivalente ao “photoId” mencionado no plano 4.11).
 */
export async function uploadPhoto(photoBlob: Blob): Promise<UploadPhotoResponse> {
  const formData = new FormData();
  formData.append('photo', photoBlob, PHOTO_PART_FILENAME);
  const { data } = await api.post<UploadPhotoResponse>('/api/photos', formData);
  return data;
}
