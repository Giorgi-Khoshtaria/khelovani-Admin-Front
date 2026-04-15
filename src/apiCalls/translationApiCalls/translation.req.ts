import api from "../api";
const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getTranslationsRequest = async (params: {
  search?: string;
  page?: number;
  limit?: number;
  namespace?: string;
}) => {
  const response = await api.get(`/api/admin/translations`, {
    params,
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getNamespacesRequest = async () => {
  const response = await api.get(`/api/admin/translations/namespaces`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const addTranslationRequest = async (data: {
  namespace: string;
  key: string;
  translations: { ge: string; en: string };
}) => {
  const response = await api.post(`/api/admin/translations`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateTranslationRequest = async (
  id: string,
  data: { translations: { ge: string; en: string } },
) => {
  const response = await api.put(`/api/admin/translations/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteTranslationRequest = async (id: string) => {
  const response = await api.delete(`/api/admin/translations/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const bulkTranslationRequest = async (data: {
  items: Array<{ namespace: string; key: string; ge: string; en: string }>;
}) => {
  const response = await api.post(`/api/admin/translations/bulk`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const bulkDeleteTranslationRequest = async (ids: string[]) => {
  const response = await api.post(
    `/api/admin/translations/bulk-delete`,
    { ids },
    {
      headers: getAuthHeaders(),
    },
  );
  return response.data;
};
