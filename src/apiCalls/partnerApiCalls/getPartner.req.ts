import axios from "axios";
import { PartnerStatus } from "@/lib/status/partnerStatus";

export const getPartnerByIdRequest = async (id: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  const response = await axios.get(`${BACKEND_URL}/api/admin/partners/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

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

export const updatePartnerStatus = async (id: string, status: PartnerStatus) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  const response = await axios.patch(
    `${BACKEND_URL}/api/admin/partners/${id}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
