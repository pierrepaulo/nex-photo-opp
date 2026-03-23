import { api } from '@/services/api';
import type { AdminPhotoRow, PaginatedResponse, PhotoStats } from '@/types';

export interface AdminPhotosQuery {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminStatsQuery {
  startDate?: string;
  endDate?: string;
}

interface AdminPhotosApiResponse {
  photos: AdminPhotoRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }
  const q = search.toString();
  return q ? `?${q}` : '';
}

export async function getPhotos(params: AdminPhotosQuery): Promise<PaginatedResponse<AdminPhotoRow>> {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    startDate: params.startDate,
    endDate: params.endDate,
  });
  const { data } = await api.get<AdminPhotosApiResponse>(`/api/admin/photos${query}`);
  return {
    data: data.photos,
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  };
}

export async function getStats(params: AdminStatsQuery = {}): Promise<PhotoStats> {
  const query = buildQuery({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  const { data } = await api.get<PhotoStats>(`/api/admin/photos/stats${query}`);
  return data;
}
