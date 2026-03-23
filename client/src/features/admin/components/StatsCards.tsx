import type { PhotoStats } from '@/types';

interface StatsCardsProps {
  stats: PhotoStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-text-secondary">Total de fotos</p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-dark">{stats.totalPhotos}</p>
        <p className="mt-1 text-xs text-text-muted">Todas as fotos no sistema</p>
      </div>
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-text-secondary">Fotos no período</p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-dark">{stats.filteredPhotos}</p>
        <p className="mt-1 text-xs text-text-muted">De acordo com o filtro de data e hora</p>
      </div>
    </div>
  );
}
