import type { Role } from "../../types/role.types";
import api from "../api";

export const getRolesRequest = async (): Promise<Role[]> => {
  const response = await api.get(`/api/admin/roles`);
  return response.data;
};

export const getRoleByIdRequest = async (id: string): Promise<Role> => {
  const response = await api.get(`/api/admin/roles/${id}`);
  return response.data;
};

export const createRoleRequest = async (data: Partial<Role>) => {
  const response = await api.post(`/api/admin/roles`, data);
  return response.data;
};

export const updateRoleRequest = async (id: string, data: Partial<Role>) => {
  const response = await api.put(`/api/admin/roles/${id}`, data);
  return response.data;
};

export const deleteRoleRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/roles/${id}`);
  return response.data;
};
