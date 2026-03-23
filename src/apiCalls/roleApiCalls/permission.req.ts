import axios from "axios";
import type { Permission } from "../../types/role.types";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const getPermissionsRequest = async (
  search?: string,
  category?: string,
  sortBy?: string,
  sortOrder?: string
): Promise<Permission[]> => {
  const response = await axios.get(`${BACKEND_URL}/api/admin/permissions`, {
    headers: getAuthHeaders(),
    params: { search, category, sortBy, sortOrder },
  });
  return response.data;
};

export const createPermissionRequest = async (data: Partial<Permission>) => {
  const response = await axios.post(`${BACKEND_URL}/api/admin/permissions`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updatePermissionRequest = async (id: string, data: Partial<Permission>) => {
  const response = await axios.put(`${BACKEND_URL}/api/admin/permissions/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deletePermissionRequest = async (id: string) => {
  const response = await axios.delete(`${BACKEND_URL}/api/admin/permissions/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
