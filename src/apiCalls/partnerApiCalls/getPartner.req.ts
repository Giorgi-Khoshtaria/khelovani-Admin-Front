import { PartnerStatus } from "@/lib/status/partnerStatus";
import type { Partner } from "@/types/partner.types";
import api from "../api";

export const getPartnerByIdRequest = async (id: string) => {
  const response = await api.get(`/api/admin/partners/${id}`);
  return response.data;
};

export const getAllPartnerRequest = async (
  search?: string,
  status?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await api.get(`/api/admin/partners`, {
    params: {
      ...(search ? { search } : {}),
      ...(status && status !== "all" ? { status } : {}),
      page,
      limit,
    },
  });
  return response.data;
};

export const updatePartnerStatus = async (
  id: string,
  status: PartnerStatus,
) => {
  const response = await api.patch(`/api/admin/partners/${id}/status`, {
    status,
  });
  return response.data;
};

export const updatePartnerRequest = async (
  id: string,
  updateData: Partial<Partner>,
) => {
  const response = await api.patch(`/api/admin/partners/${id}`, updateData);
  return response.data;
};

export const deletePartnerRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/partners/${id}`);
  return response.data;
};

export const uploadPartnerPhotoRequest = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.patch(
    `/api/admin/partners/${id}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const bulkDeletePartnersRequest = async (ids: string[]) => {
  const response = await api.post(`/api/admin/partners/bulk-delete`, { ids });
  return response.data;
};
