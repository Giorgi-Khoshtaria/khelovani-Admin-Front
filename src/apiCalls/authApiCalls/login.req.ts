import axios from "axios";

export const loginRequest = async (email: string, password: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.post(
    `${BACKEND_URL}/api/admin/auth/login`,
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
