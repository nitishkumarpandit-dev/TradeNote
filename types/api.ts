export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
}

export interface PaginatedApiResponse<T> {
  data: T;
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
}
