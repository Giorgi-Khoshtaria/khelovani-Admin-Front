import api from "../api";

export const updatePartnerVisibilityRequest = async (id: string, isShown: boolean) => {
  const response = await api.patch(`/api/admin/partners/${id}/visibility`, { isShown });
  return response.data.data;
};
