import api from "../api";
import type { PinSection } from "@/types/productTypes";

export const updateProductPinRequest = async (
  productId: string,
  pinSection: PinSection | null,
) => {
  const response = await api.patch(`/api/products/${productId}/pin`, { pinSection });
  return {
    data: response.data.data,
    meta: response.data.meta as { evicted: string[] },
  };
};
