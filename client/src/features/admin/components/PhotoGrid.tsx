import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import type { AdminPhotoRow } from '@/types';

interface PhotoGridProps {
  photos: AdminPhotoRow[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPhotoClick: (photo: AdminPhotoRow) => void;
}

export function PhotoGrid({
  photos,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onPhotoClick,
}: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-border bg-white/60">
        <LoadingSpinner className="text-medium" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-10 text-center text-text-secondary shadow-sm">
        Nenhuma foto encontrada para os filtros atuais.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => onPhotoClick(photo)}
            className="group overflow-hidden rounded-xl border border-border bg-white text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-medium"
          >
            <div className="aspect-[3/4] w-full overflow-hidden bg-surface">
              <img
                src={photo.framedUrl}
                alt=""
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            </div>
            <p className="truncate px-3 py-2 text-xs text-text-muted">
              {new Date(photo.createdAt).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
      {totalPages > 0 ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}
