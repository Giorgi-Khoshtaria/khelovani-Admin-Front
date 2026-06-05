import api from "../api";
import type {
  InformationField,
  InformationFieldFilters,
  InformationFieldMeta,
  InformationFieldPayload,
} from "@/types/informationField.types";

const BASE = "/api/admin/information-fields";

export const getInformationFieldsRequest = async (
  params: InformationFieldFilters = {}
): Promise<{ data: InformationField[]; meta: InformationFieldMeta }> => {
  const { search, type, page = 1, limit = 20 } = params;

  const response = await api.get(BASE, {
    params: {
      ...(search && { search }),
      ...(type && type !== "all" && { type }),
      page,
      limit,
    },
  });

  return { data: response.data.data, meta: response.data.meta };
};

export const getInformationFieldByIdRequest = async (
  id: string
): Promise<InformationField> => {
  const response = await api.get(`${BASE}/${id}`);
  return response.data.data;
};

export const createInformationFieldRequest = async (
  payload: InformationFieldPayload
): Promise<InformationField> => {
  const response = await api.post(BASE, payload);
  return response.data.data;
};

export const updateInformationFieldRequest = async (
  id: string,
  payload: Partial<InformationFieldPayload>
): Promise<InformationField> => {
  const response = await api.put(`${BASE}/${id}`, payload);
  return response.data.data;
};

export const deleteInformationFieldRequest = async (
  id: string
): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
