import { useCallback, useEffect, useState } from 'react';
import { exportLogs, getLogs } from '@/features/admin/services/adminService';
import type { Log } from '@/types';

export interface LogsFilterProps {
  startDate: string | null;
  endDate: string | null;
}

export function useLogs(filters: LogsFilterProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getLogs({
        page,
        limit,
        startDate: filters.startDate ?? undefined,
        endDate: filters.endDate ?? undefined,
      });
      setLogs(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Falha ao carregar logs';
      setError(message);
      setLogs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filters.startDate, filters.endDate]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(1);
  }, [filters.startDate, filters.endDate]);

  const setPageSafe = useCallback((p: number) => {
    setPage(p);
  }, []);

  const setLimitAndReset = useCallback((next: number) => {
    setLimit(next);
    setPage(1);
  }, []);

  const exportCsv = useCallback(async () => {
    setIsExporting(true);
    setError(null);
    try {
      await exportLogs({
        startDate: filters.startDate ?? undefined,
        endDate: filters.endDate ?? undefined,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Falha ao exportar CSV';
      setError(message);
    } finally {
      setIsExporting(false);
    }
  }, [filters.startDate, filters.endDate]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isExporting,
    error,
    fetchLogs,
    setPage: setPageSafe,
    setLimit: setLimitAndReset,
    exportCsv,
  };
}
