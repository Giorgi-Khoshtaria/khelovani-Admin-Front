import api from "../api";
import type { Category, CategoryFormValues } from "@/types/category.types";

export const getCategoriesRequest = async (active?: boolean): Promise<Category[]> => {
  const params: Record<string, string> = {};
  if (active !== undefined) params.active = String(active);
  const response = await api.get("/api/admin/categories", { params });
  return response.data.data as Category[];
};

export const getPublicCategoriesRequest = async (): Promise<Category[]> => {
  const response = await api.get("/api/categories");
  return response.data.data as Category[];
};

export const getCategoryByIdRequest = async (id: string): Promise<Category> => {
  const response = await api.get(`/api/admin/categories/${id}`);
  return response.data.data;
};

export const createCategoryRequest = async (data: CategoryFormValues): Promise<Category> => {
  const response = await api.post("/api/admin/categories", data);
  return response.data.data;
};

export const updateCategoryRequest = async (
  id: string,
  data: Partial<CategoryFormValues> & { isActive?: boolean },
): Promise<Category> => {
  const response = await api.put(`/api/admin/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategoryRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/categories/${id}`);
};
