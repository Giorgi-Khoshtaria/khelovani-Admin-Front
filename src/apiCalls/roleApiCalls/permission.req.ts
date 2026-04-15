import type { Permission } from "../../types/role.types";
import api from "../api";
const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getPermissionsRequest = async (
  search?: string,
  category?: string,
  sortBy?: string,
  sortOrder?: string,
): Promise<Permission[]> => {
  const response = await api.get(`/api/admin/permissions`, {
    headers: getAuthHeaders(),
    params: { search, category, sortBy, sortOrder },
  });
  return response.data;
};

export const createPermissionRequest = async (data: Partial<Permission>) => {
  const response = await api.post(`/api/admin/permissions`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updatePermissionRequest = async (
  id: string,
  data: Partial<Permission>,
) => {
  const response = await api.put(`/api/admin/permissions/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deletePermissionRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/permissions/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
