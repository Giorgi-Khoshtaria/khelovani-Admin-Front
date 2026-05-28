import api from "../api";
import type { ApiResponse } from "@/types/api.types";

interface LoginData {
  token: string;
  id: string;
}

export const loginRequest = async (
  email: string,
  password: string,
): Promise<ApiResponse<LoginData>> => {
  const response = await api.post(`/api/admin/auth/login`, { email, password });
  return response.data;
};
