import axios from "axios";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import type { Partner } from "@/types/partner.types";

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

export const getAllPartnerRequest = async (
  search?: string,
  status?: string,
) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  const response = await axios.get(`${BACKEND_URL}/api/admin/partners`, {
    params: {
      ...(search ? { search } : {}),
      ...(status && status !== "all" ? { status } : {}),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updatePartnerStatus = async (
  id: string,
  status: PartnerStatus,
) => {
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

export const updatePartnerRequest = async (
  id: string,
  updateData: Partial<Partner>,
) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  const response = await axios.patch(
    `${BACKEND_URL}/api/admin/partners/${id}`,
    updateData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deletePartnerRequest = async (id: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  const response = await axios.delete(
    `${BACKEND_URL}/api/admin/partners/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
export const uploadPartnerPhotoRequest = async (id: string, file: File) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("adminToken");

  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.patch(
    `${BACKEND_URL}/api/admin/partners/${id}/photo`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
