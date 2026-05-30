import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  loading = false,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className='pagination-bar'>
      <span className='pagination-summary'>
        Mostrando {startItem}-{endItem} de {totalItems}
      </span>

      <div className='pagination-actions'>
        <Button
          variant='secondary'
          size='sm'
          disabled={loading || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </Button>

        <span className='pagination-page'>
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant='secondary'
          size='sm'
          disabled={loading || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
