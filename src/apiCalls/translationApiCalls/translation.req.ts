import api from "../api";

export const getTranslationsRequest = async (params: {
  search?: string;
  page?: number;
  limit?: number;
  namespace?: string;
}) => {
  const response = await api.get(`/api/admin/translations`, { params });
  return { data: response.data.data, meta: response.data.meta };
};

export const getNamespacesRequest = async () => {
  const response = await api.get(`/api/admin/translations/namespaces`);
  return response.data.data;
};

export interface UpdateTranslationData {
  namespace?: string;
  key?: string;
  translations?: {
    ge?: string;
    en?: string;
  };
}

export const addTranslationRequest = async (data: {
  namespace: string;
  key: string;
  translations: { ge: string; en: string };
}) => {
  const response = await api.post(`/api/admin/translations`, data);
  return response.data.data;
};

export const updateTranslationRequest = async (
  id: string,
  data: UpdateTranslationData,
) => {
  const response = await api.put(`/api/admin/translations/${id}`, data);
  return response.data.data;
};

export const deleteTranslationRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/translations/${id}`);
  return response.data.data;
};

export const bulkTranslationRequest = async (data: {
  items: Array<{ namespace: string; key: string; ge: string; en: string }>;
}) => {
  const response = await api.post(`/api/admin/translations/bulk`, data);
  return response.data.data;
};

export const bulkDeleteTranslationRequest = async (ids: string[]) => {
  const response = await api.post(`/api/admin/translations/bulk-delete`, {
    ids,
  });
  return response.data.data;
};
