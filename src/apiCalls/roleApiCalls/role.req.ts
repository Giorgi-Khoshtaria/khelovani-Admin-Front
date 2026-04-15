import type { Role } from "../../types/role.types";
import api from "../api";
const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getRolesRequest = async (): Promise<Role[]> => {
  const response = await api.get(`/api/admin/roles`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getRoleByIdRequest = async (id: string): Promise<Role> => {
  const response = await api.get(`/api/admin/roles/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get Available Permissions is now handled via permission.req.ts

export const createRoleRequest = async (data: Partial<Role>) => {
  const response = await api.post(`/api/admin/roles`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateRoleRequest = async (id: string, data: Partial<Role>) => {
  const response = await api.put(`/api/admin/roles/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteRoleRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/roles/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
