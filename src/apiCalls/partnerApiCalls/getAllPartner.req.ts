import axios from "axios";

export const getAllPartnerRequest = async () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  const response = await axios.get(`${BACKEND_URL}/api/admin/partners`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
