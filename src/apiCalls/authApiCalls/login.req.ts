import api from "../api";

// Note: No auth header needed - login is a public endpoint
export const loginRequest = async (email: string, password: string) => {
  const response = await api.post(`/api/admin/auth/login`, { email, password });
  return response.data.data;
};
