import api from "../api";
import type { Product, ProductCondition } from "@/types/productTypes";

export type PinnedProductsGrouped = Record<ProductCondition, Product[]>;

export const getPinnedProductsRequest = async (): Promise<PinnedProductsGrouped> => {
  const response = await api.get("/api/products/pinned");
  return response.data.data;
};
