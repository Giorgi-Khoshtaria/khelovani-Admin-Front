import api from "../api";
import type { UserFilters } from "@/types/user.types";

export const getUsersRequest = async (params: UserFilters = {}) => {
  const { search, dateFrom, dateTo, page = 1, limit = 10 } = params;
  const response = await api.get("/api/admin/users", {
    params: {
      ...(search && { search }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      page,
      limit,
    },
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const getUserByIdRequest = async (id: string) => {
  const response = await api.get(`/api/admin/users/${id}`);
  return response.data.data;
};

export const deleteUserRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/users/${id}`);
  return response.data.data;
};

export const bulkDeleteUsersRequest = async (ids: string[]) => {
  const response = await api.post("/api/admin/users/bulk-delete", { ids });
  return response.data.data;
};
