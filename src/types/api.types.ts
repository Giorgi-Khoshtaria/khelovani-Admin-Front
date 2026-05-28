export interface PaginationMeta {
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface FieldError {
  field: string;
  message: string;
}

export type ApiResponse<T> =
  | { success: true; data: T; meta?: PaginationMeta; message: string }
  | { success: false; message: string; errors?: FieldError[] };
