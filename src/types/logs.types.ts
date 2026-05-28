export type LogSource = "user" | "partner" | "admin" | "public";

export type LogStatusFilter = "all" | "ok" | "error";

export interface RequestLog {
  _id: string;
  method: string;
  url: string;
  statusCode: number;
  responseTimeMs: number;
  source: LogSource;
  ip?: string;
  userAgent?: string;
  userId?: string | null;
  userRole?: string | null;
  errorMessage?: string | null;
  errorStack?: string | null;
  requestBody?: unknown;
  createdAt: string;
}

export interface LogsFilters {
  status?: LogStatusFilter;
  source?: LogSource | "all";
  method?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface LogsMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}
