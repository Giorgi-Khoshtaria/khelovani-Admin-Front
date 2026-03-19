import axios from "axios";

export const loginRequest = async (email: string, password: string) => {
  const response = await axios.post("/api/admin/login", {
    email,
    password,
  });
  return response.data;
};
