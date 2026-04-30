import api from "../api";

export const updateCategoryPinRequest = async (categoryId: string, isPinned: boolean) => {
  const response = await api.patch(`/api/admin/categories/${categoryId}/pin`, { isPinned });
  return {
    data: response.data.data,
    meta: response.data.meta as { evicted: string[] },
  };
};
