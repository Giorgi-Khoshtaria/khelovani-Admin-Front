import axios from "axios";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import type { Partner } from "@/types/partner.types";
import api from "../api";
export const getPartnerByIdRequest = async (id: string) => {
  const token = localStorage.getItem("adminToken");

  const response = await api.get(`/api/admin/partners/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllPartnerRequest = async (
  search?: string,
  status?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const token = localStorage.getItem("adminToken");

  const response = await api.get(`/api/admin/partners`, {
    params: {
      ...(search ? { search } : {}),
      ...(status && status !== "all" ? { status } : {}),
      page,
      limit,
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
  const token = localStorage.getItem("adminToken");

  const response = await api.patch(
    `/api/admin/partners/${id}/status`,
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
  const token = localStorage.getItem("adminToken");

  const response = await axios.patch(`/api/admin/partners/${id}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deletePartnerRequest = async (id: string) => {
  const token = localStorage.getItem("adminToken");

  const response = await api.delete(`/api/admin/partners/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const uploadPartnerPhotoRequest = async (id: string, file: File) => {
  const token = localStorage.getItem("adminToken");

  const formData = new FormData();
  formData.append("image", file);

  const response = await api.patch(
    `/api/admin/partners/${id}/photo`,
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

export const bulkDeletePartnersRequest = async (ids: string[]) => {
  const token = localStorage.getItem("adminToken");

  const response = await api.post(
    `/api/admin/partners/bulk-delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
