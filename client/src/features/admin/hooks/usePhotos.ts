import { useCallback, useEffect, useState } from 'react';
import { getPhotos, getStats } from '@/features/admin/services/adminService';
import type { AdminPhotoRow, PhotoStats } from '@/types';

export interface DateTimeFilterValues {
  startDate: string | null;
  endDate: string | null;
}

const defaultStats: PhotoStats = { totalPhotos: 0, filteredPhotos: 0 };

export function usePhotos() {
  const [photos, setPhotos] = useState<AdminPhotoRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<DateTimeFilterValues>({
    startDate: null,
    endDate: null,
  });
  const [stats, setStats] = useState<PhotoStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.all([
        getPhotos({
          page,
          limit,
          startDate: filters.startDate ?? undefined,
          endDate: filters.endDate ?? undefined,
        }),
        getStats({
          startDate: filters.startDate ?? undefined,
          endDate: filters.endDate ?? undefined,
        }),
      ]);
      setPhotos(listRes.data);
      setTotal(listRes.total);
      setTotalPages(listRes.totalPages);
      setStats(statsRes);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Falha ao carregar fotos';
      setError(message);
      setPhotos([]);
      setTotal(0);
      setTotalPages(0);
      setStats(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters.startDate, filters.endDate]);

  useEffect(() => {
    void fetchPhotos();
  }, [fetchPhotos]);

  const applyFilters = useCallback((next: DateTimeFilterValues) => {
    setFilters(next);
    setPage(1);
  }, []);

  const setLimitAndResetPage = useCallback((next: number) => {
    setLimit(next);
    setPage(1);
  }, []);

  return {
    photos,
    total,
    page,
    limit,
    totalPages,
    filters,
    stats,
    isLoading,
    error,
    setPage,
    setLimit: setLimitAndResetPage,
    applyFilters,
    refetch: fetchPhotos,
  };
}
