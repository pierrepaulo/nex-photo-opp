import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { DateTimeFilters } from '@/features/admin/components/DateTimeFilters';
import { PageSizeSelector } from '@/features/admin/components/PageSizeSelector';
import { LogsTable } from '@/features/admin/components/LogsTable';
import { PhotoGrid } from '@/features/admin/components/PhotoGrid';
import { PhotoModal } from '@/features/admin/components/PhotoModal';
import { StatsCards } from '@/features/admin/components/StatsCards';
import { useLogs } from '@/features/admin/hooks/useLogs';
import { usePhotos } from '@/features/admin/hooks/usePhotos';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { AdminPhotoRow } from '@/types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const {
    photos,
    page,
    limit,
    totalPages,
    filters,
    stats,
    isLoading,
    error,
    setPage,
    setLimit,
    applyFilters,
  } = usePhotos();

  const {
    logs,
    page: logsPage,
    limit: logsLimit,
    totalPages: logsTotalPages,
    isLoading: logsLoading,
    isExporting: logsExporting,
    error: logsError,
    setPage: setLogsPage,
    setLimit: setLogsLimit,
    exportCsv,
  } = useLogs(filters);

  const [selected, setSelected] = useState<AdminPhotoRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function handlePhotoClick(photo: AdminPhotoRow) {
    setSelected(photo);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelected(null);
  }

  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-border bg-white px-4 py-4 shadow-sm sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark sm:text-3xl">Painel administrativo</h1>
            <p className="mt-1 text-sm text-text-secondary">Fotos capturadas na ativação</p>
          </div>
          <Button type="button" variant="outline" onClick={handleLogout} fullWidth={false} className="shrink-0 py-3 text-base">
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8">
        <StatsCards stats={stats} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <DateTimeFilters
              key={`${filters.startDate ?? ''}|${filters.endDate ?? ''}`}
              applied={filters}
              onApply={applyFilters}
              onClear={() => applyFilters({ startDate: null, endDate: null })}
            />
          </div>
          <div className="shrink-0 rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
            <PageSizeSelector value={limit} onChange={setLimit} />
          </div>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        <PhotoGrid
          photos={photos}
          isLoading={isLoading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onPhotoClick={handlePhotoClick}
        />

        {logsError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{logsError}</p>
        ) : null}

        <LogsTable
          logs={logs}
          isLoading={logsLoading}
          isExporting={logsExporting}
          currentPage={logsPage}
          totalPages={logsTotalPages}
          pageSize={logsLimit}
          onPageChange={setLogsPage}
          onPageSizeChange={setLogsLimit}
          onExportCsv={exportCsv}
        />
      </main>

      <PhotoModal photo={selected} isOpen={modalOpen} onClose={handleCloseModal} />
    </div>
  );
}
