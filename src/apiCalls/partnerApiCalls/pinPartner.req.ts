import api from "../api";

export const updatePartnerPinRequest = async (id: string, isPinned: boolean) => {
  const response = await api.patch(`/api/admin/partners/${id}/pin`, { isPinned });
  return {
    data: response.data.data,
    meta: response.data.meta as { evicted: string[] },
  };
};
