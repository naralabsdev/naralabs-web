type PaginatedPayload<T> = {
  items: T[];
  total?: number;
  page?: number;
  page_size?: number;
};

export function normalizePaginatedPayload<T>(
  payload: PaginatedPayload<T>,
  options: { page: number; pageSize: number },
) {
  const items = payload.items ?? [];
  const page = payload.page ?? options.page;
  const pageSize = payload.page_size ?? options.pageSize;
  const total = payload.total ?? items.length;

  return { items, total, page, pageSize };
}
