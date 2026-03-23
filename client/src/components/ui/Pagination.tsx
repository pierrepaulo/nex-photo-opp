interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg bg-medium px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm text-text-secondary">
        Pagina {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-lg bg-medium px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proximo
      </button>
    </div>
  );
}
