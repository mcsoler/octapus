import { cn } from '../../lib/utils';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCount,
  className
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCount: number;
  className?: string;
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      <div className="text-sm text-gray-500">
        {totalCount > 0 && (
          <span>
            Mostrando <span className="font-semibold text-gray-700">{startItem}</span> a{' '}
            <span className="font-semibold text-gray-700">{endItem}</span> de{' '}
            <span className="font-semibold text-gray-700">{totalCount}</span> resultados
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium',
            'border-2 border-gray-100 bg-white',
            'transition-all duration-200 ease-out',
            'hover:bg-gray-50 hover:border-gray-200',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-100',
            'flex items-center gap-1'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, i) =>
            page === -1 ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'min-w-[40px] h-10 rounded-xl text-sm font-medium',
                  'transition-all duration-200 ease-out',
                  currentPage === page
                    ? 'bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'border-2 border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200'
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium',
            'border-2 border-gray-100 bg-white',
            'transition-all duration-200 ease-out',
            'hover:bg-gray-50 hover:border-gray-200',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-100',
            'flex items-center gap-1'
          )}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
