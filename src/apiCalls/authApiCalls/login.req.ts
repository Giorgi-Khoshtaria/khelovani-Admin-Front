import api from "../api";
export const loginRequest = async (email: string, password: string) => {
  const response = await api.post(
    `/api/admin/auth/login`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};
