import api from "../api";
import type { AddProductFormData } from "@/types/productTypes";

const getProductUrl = (partnerId?: string, productId?: string) => {
  if (productId) {
    return `/api/products/${productId}`;
  }
  if (partnerId) {
    return `/api/products/partner/${partnerId}`;
  }
  return `/api/products`;
};

const createProductFormData = (data: Partial<AddProductFormData>) => {
  const formData = new FormData();

  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => formData.append("images", file));
  }

  const fields: (keyof AddProductFormData)[] = [
    "titleGe",
    "titleEn",
    "descriptionGe",
    "descriptionEn",
    "category",
    "price",
    "currency",
    "stockQuantity",
    "condition",
    "shippingPrice",
    "weight",
    "locationGe",
    "locationEn",
    "dimensions",
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null) {
      formData.append(field, data[field]!.toString());
    }
  });

  const booleanFields: (keyof AddProductFormData)[] = [
    "isShown",
    "isOneOfAKind",
    "shippingAvailable",
  ];
  booleanFields.forEach((field) => {
    if (data[field] !== undefined)
      formData.append(field, data[field] ? "true" : "false");
  });

  const arrayFields: (keyof AddProductFormData)[] = [
    "tagsGe",
    "tagsEn",
    "materialsGe",
    "materialsEn",
  ];
  arrayFields.forEach((field) => {
    if (data[field] !== undefined)
      formData.append(field, JSON.stringify(data[field]));
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
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
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
      ...(search ? { search } : {}),
      ...(category && category !== "all" ? { category } : {}),
      ...(filterPartnerId ? { partnerId: filterPartnerId } : {}),
      page,
      limit,
    },
  });
  return response.data;
};

export const getProductDetailsRequest = async (
  partnerId?: string,
  productId?: string,
) => {
  const response = await api.get(getProductUrl(partnerId, productId));
  return response.data;
};

export const deleteProductRequest = async (
  partnerId: string | undefined,
  productId: string,
) => {
  const response = await api.delete(getProductUrl(partnerId, productId));
  return response.data;
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
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
