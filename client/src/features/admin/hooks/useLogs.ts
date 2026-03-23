import { useCallback, useState } from 'react';
import type { Log } from '@/types';

/**
 * Placeholder para a Fase 7 (listagem e exportação de logs).
 */
export function useLogs() {
  const [logs] = useState<Log[]>([]);
  const [total] = useState(0);
  const [page] = useState(1);
  const [limit] = useState(20);
  const [isLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    // Fase 7
  }, []);

  const setPage = useCallback((_p: number) => {
    // Fase 7
  }, []);

  const exportCsv = useCallback(async () => {
    // Fase 7
  }, []);

  return {
    logs,
    total,
    page,
    limit,
    isLoading,
    fetchLogs,
    setPage,
    exportCsv,
  };
}
