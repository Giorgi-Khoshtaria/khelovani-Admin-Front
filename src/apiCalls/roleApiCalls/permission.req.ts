import type { Permission } from "../../types/role.types";
import api from "../api";

export const getPermissionsRequest = async (
  search?: string,
  category?: string,
  sortBy?: string,
  sortOrder?: string,
) => {
  const response = await api.get(`/api/admin/permissions`, {
    params: { search, category, sortBy, sortOrder },
  });
  return { data: response.data.data as Permission[], meta: response.data.meta };
};

export const createPermissionRequest = async (data: Partial<Permission>) => {
  const response = await api.post(`/api/admin/permissions`, data);
  return response.data.data;
};

export const updatePermissionRequest = async (
  id: string,
  data: Partial<Permission>,
) => {
  const response = await api.put(`/api/admin/permissions/${id}`, data);
  return response.data.data;
};

export const deletePermissionRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/permissions/${id}`);
  return response.data.data;
};
