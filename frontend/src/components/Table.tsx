export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const Table = <T,>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = '',
}: TableProps<T>) => {
  if (loading) {
    return (
      <div className={`table-container ${className}`}>
        <div className='table-loading'>
          <div className='loading-spinner'></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`table-container ${className}`}>
        <div className='table-empty'>
          <span>{emptyMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className='data-table'>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const r = row as Record<string, unknown>;
            return (
              <tr key={String(r.id ?? r.uuid ?? index)}>
                {columns.map(column => {
                  const value = r[column.key];
                  return (
                    <td key={column.key} className={column.className}>
                      {column.render
                        ? column.render(value, row)
                        : (value as React.ReactNode)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
