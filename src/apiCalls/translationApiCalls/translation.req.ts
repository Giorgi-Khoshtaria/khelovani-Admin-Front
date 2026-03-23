import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getTranslationsRequest = async (search?: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.get(`${BACKEND_URL}/api/admin/translations`, {
    params: { search },
  });
  return response.data;
};

export const getNamespacesRequest = async () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.get(`${BACKEND_URL}/api/admin/translations/namespaces`);
  return response.data;
};

export const addTranslationRequest = async (data: {
  namespace: string;
  key: string;
  translations: { ge: string; en: string };
}) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.post(`${BACKEND_URL}/api/admin/translations`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateTranslationRequest = async (
  id: string,
  data: { translations: { ge: string; en: string } }
) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.put(`${BACKEND_URL}/api/admin/translations/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteTranslationRequest = async (id: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.delete(`${BACKEND_URL}/api/admin/translations/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const bulkTranslationRequest = async (data: {
  items: Array<{ namespace: string; key: string; ge: string; en: string }>;
}) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.post(`${BACKEND_URL}/api/admin/translations/bulk`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const bulkDeleteTranslationRequest = async (ids: string[]) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const response = await axios.post(`${BACKEND_URL}/api/admin/translations/bulk-delete`, { ids }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
