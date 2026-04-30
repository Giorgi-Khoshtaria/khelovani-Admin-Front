import api from "../api";
import type { Product } from "@/types/productTypes";

export const getPinnedProductsRequest = async (): Promise<Product[]> => {
  const response = await api.get("/api/products/pinned");
  return response.data.data;
};
