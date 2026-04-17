import api from "../api";
import type { AddProductFormData } from "@/types/productTypes";

const getProductUrl = (partnerId?: string, productId?: string) => {
  if (productId) return `/api/products/${productId}`;
  if (partnerId) return `/api/products/partner/${partnerId}`;
  return `/api/products`;
};

/**
 * Senior Refactor: Declarative FormData creation
 */
const createProductFormData = (data: Partial<AddProductFormData>) => {
  const formData = new FormData();

  // 1. Images
  data.images?.forEach((file) => formData.append("images", file));

  // 2. Configuration for field types
  const BOOLEAN_FIELDS = ["isShown", "isOneOfAKind", "shippingAvailable"];
  const ARRAY_FIELDS = ["tagsGe", "tagsEn", "materialsGe", "materialsEn"];

  // 3. Process all fields
  (Object.keys(data) as Array<keyof AddProductFormData>).forEach((key) => {
    const value = data[key];
    if (value === undefined || value === null || key === "images") return;

    if (BOOLEAN_FIELDS.includes(key)) {
      formData.append(key, value ? "true" : "false");
    } else if (ARRAY_FIELDS.includes(key)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value.toString());
    }
  });

  return formData;
};

export const addProductRequest = async (
  partnerId: string,
  data: AddProductFormData,
  lang: string = "ge",
) => {
  const formData = createProductFormData(data);
  const response = await api.post(
    `${getProductUrl(partnerId)}?lang=${lang}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};

export const getProductsRequest = async (
  partnerId?: string,
  search?: string,
  category?: string,
  filterPartnerId?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await api.get(getProductUrl(partnerId), {
    params: {
      ...(search && { search }),
      ...(category && category !== "all" && { category }),
      ...(filterPartnerId && { partnerId: filterPartnerId }),
      page,
      limit,
    },
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const getProductDetailsRequest = async (
  partnerId?: string,
  productId?: string,
) => {
  const response = await api.get(getProductUrl(partnerId, productId));
  return response.data.data;
};

export const deleteProductRequest = async (
  partnerId: string | undefined,
  productId: string,
) => {
  const response = await api.delete(getProductUrl(partnerId, productId));
  return response.data.data;
};

export const updateProductRequest = async (
  partnerId: string | undefined,
  productId: string,
  data: Partial<AddProductFormData>,
  lang: string = "ge",
) => {
  const formData = createProductFormData(data);
  const response = await api.patch(
    `${getProductUrl(partnerId, productId)}?lang=${lang}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};
