interface TableColumn<T extends Record<string, unknown>> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const Table = <T extends Record<string, unknown>,>({
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
          {data.map((row, index) => (
            <tr key={String(row.id ?? row.uuid ?? index)}>
              {columns.map(column => (
                <td key={column.key} className={column.className}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
