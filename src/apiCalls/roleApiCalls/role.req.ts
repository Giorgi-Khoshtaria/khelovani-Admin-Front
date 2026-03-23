import axios from "axios";
import type { Role } from "../../types/role.types";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export const getRolesRequest = async (): Promise<Role[]> => {
  const response = await axios.get(`${BACKEND_URL}/api/admin/roles`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getRoleByIdRequest = async (id: string): Promise<Role> => {
  const response = await axios.get(`${BACKEND_URL}/api/admin/roles/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Get Available Permissions is now handled via permission.req.ts

export const createRoleRequest = async (data: Partial<Role>) => {
  const response = await axios.post(`${BACKEND_URL}/api/admin/roles`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateRoleRequest = async (id: string, data: Partial<Role>) => {
  const response = await axios.put(`${BACKEND_URL}/api/admin/roles/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteRoleRequest = async (id: string) => {
  const response = await axios.delete(`${BACKEND_URL}/api/admin/roles/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
