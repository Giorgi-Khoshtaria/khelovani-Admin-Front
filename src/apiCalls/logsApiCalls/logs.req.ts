import api from "../api";
import type {
  LogsFilters,
  LogsMeta,
  RequestLog,
} from "@/types/logs.types";

export const getLogsRequest = async (
  params: LogsFilters = {},
): Promise<{ data: RequestLog[]; meta: LogsMeta }> => {
  const {
    status,
    source,
    method,
    search,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20,
  } = params;

  const response = await api.get("/api/admin/logs", {
    params: {
      ...(status && status !== "all" && { status }),
      ...(source && source !== "all" && { source }),
      ...(method && method !== "ALL" && { method }),
      ...(search && { search }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      page,
      limit,
    },
  });

  return { data: response.data.data, meta: response.data.meta };
};

export const getLogByIdRequest = async (id: string): Promise<RequestLog> => {
  const response = await api.get(`/api/admin/logs/${id}`);
  return response.data.data;
};

export const deleteLogRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/logs/${id}`);
};

export const clearAllLogsRequest = async (): Promise<void> => {
  await api.delete("/api/admin/logs");
};
