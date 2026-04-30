import api from "../api";

export const updateProductPinRequest = async (productId: string, isPinned: boolean) => {
  const response = await api.patch(`/api/products/${productId}/pin`, { isPinned });
  return {
    data: response.data.data,
    meta: response.data.meta as { evicted: string[] },
  };
};
