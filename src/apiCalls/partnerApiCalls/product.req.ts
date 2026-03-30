import axios from "axios";
import type { AddProductFormData } from "@/types/productTypes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
const getToken = () => localStorage.getItem("adminToken");

const getProductUrl = (partnerId?: string, productId?: string) => {
  if (partnerId) {
    return productId 
      ? `${BACKEND_URL}/api/admin/partners/${partnerId}/products/${productId}`
      : `${BACKEND_URL}/api/admin/partners/${partnerId}/products`;
  }
  return productId
    ? `${BACKEND_URL}/api/admin/partners/products/${productId}`
    : `${BACKEND_URL}/api/admin/partners/products/all`;
};

const createProductFormData = (data: Partial<AddProductFormData>) => {
  const formData = new FormData();

  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => formData.append("images", file));
  }

  const fields: (keyof AddProductFormData)[] = [
    "titleGe", "titleEn", "descriptionGe", "descriptionEn", 
    "category", "price", "currency", "stockQuantity", "condition"
  ];

  fields.forEach(field => {
    if (data[field] !== undefined) formData.append(field, data[field]!.toString());
  });

  const booleanFields: (keyof AddProductFormData)[] = ["isShown", "isOneOfAKind", "shippingAvailable", "customizable"];
  booleanFields.forEach(field => {
    if (data[field] !== undefined) formData.append(field, data[field] ? "true" : "false");
  });

  const arrayFields: (keyof AddProductFormData)[] = ["tagsGe", "tagsEn", "materialsGe", "materialsEn"];
  arrayFields.forEach(field => {
    if (data[field] !== undefined) formData.append(field, JSON.stringify(data[field]));
  });

  return formData;
};

export const addProductRequest = async (partnerId: string, data: AddProductFormData, lang: string = "ge") => {
  const formData = createProductFormData(data);
  const response = await axios.post(`${getProductUrl(partnerId)}?lang=${lang}`, formData, {
    headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProductsRequest = async (partnerId?: string, search?: string, category?: string, filterPartnerId?: string) => {
  const response = await axios.get(getProductUrl(partnerId), {
    params: { 
      ...(search ? { search } : {}), 
      ...(category && category !== "all" ? { category } : {}),
      ...(filterPartnerId ? { partnerId: filterPartnerId } : {})
    },
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const getProductDetailsRequest = async (partnerId?: string, productId?: string) => {
  const response = await axios.get(getProductUrl(partnerId, productId), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const deleteProductRequest = async (partnerId: string | undefined, productId: string) => {
  const response = await axios.delete(getProductUrl(partnerId, productId), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const updateProductRequest = async (partnerId: string | undefined, productId: string, data: Partial<AddProductFormData>, lang: string = "ge") => {
  const formData = createProductFormData(data);
  const response = await axios.put(`${getProductUrl(partnerId, productId)}?lang=${lang}`, formData, {
    headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
