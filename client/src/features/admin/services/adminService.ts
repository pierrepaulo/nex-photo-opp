import { api } from '@/services/api';
import type { AdminPhotoRow, Log, PaginatedResponse, PhotoStats } from '@/types';

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

export interface AdminLogsQuery {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminLogsExportQuery {
  startDate?: string;
  endDate?: string;
}

interface AdminLogsApiResponse {
  logs: Log[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export async function getLogs(params: AdminLogsQuery): Promise<PaginatedResponse<Log>> {
  const query = buildQuery({
    page: params.page,
    limit: params.limit,
    startDate: params.startDate,
    endDate: params.endDate,
  });
  const { data } = await api.get<AdminLogsApiResponse>(`/api/admin/logs${query}`);
  return {
    data: data.logs,
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  };
}

export async function exportLogs(params: AdminLogsExportQuery = {}): Promise<void> {
  const query = buildQuery({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  const response = await api.get<Blob>(`/api/admin/logs/export${query}`, {
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'];
  let filename = `logs-${new Date().toISOString().slice(0, 10)}.csv`;
  if (disposition) {
    const match = /filename="([^"]+)"/.exec(disposition);
    if (match?.[1]) {
      filename = match[1];
    }
  }

  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
