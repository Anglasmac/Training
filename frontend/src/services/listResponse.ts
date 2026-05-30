export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type PaginatedKeys = 'customers' | 'meals' | 'orders';

export const unwrapPaginatedResponse = <T>(
  payload: unknown,
  key: PaginatedKeys
): PaginatedResponse<T> => {
  if (Array.isArray(payload)) {
    return {
      items: payload as T[],
      total: payload.length,
      page: 1,
      pageSize: payload.length,
      totalPages: 1,
    };
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const items = Array.isArray(record[key]) ? (record[key] as T[]) : [];
    const total =
      typeof record.total === 'number' ? record.total : items.length;
    const page = typeof record.page === 'number' ? record.page : 1;
    const pageSize =
      typeof record.page_size === 'number'
        ? record.page_size
        : items.length || 10;
    const totalPages =
      typeof record.total_pages === 'number'
        ? record.total_pages
        : Math.max(1, Math.ceil(total / pageSize));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  };
};
