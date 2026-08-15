import api from "../api";

export interface PageContentText {
  ka: string;
  en: string;
}

export interface Page {
  _id: string;
  path: string;
  title: PageContentText;
  description: PageContentText;
  ogImage: string;
  noindex: boolean;
}

export const getPagesRequest = async (): Promise<Page[]> => {
  const response = await api.get(`/api/admin/pages`);
  return response.data.data;
};

export const createPageRequest = async (
  data: Omit<Page, "_id">,
): Promise<Page> => {
  const response = await api.post(`/api/admin/pages`, data);
  return response.data.data;
};

export const updatePageRequest = async (
  id: string,
  data: Partial<Omit<Page, "_id">>,
): Promise<Page> => {
  const response = await api.put(`/api/admin/pages/${id}`, data);
  return response.data.data;
};

export const deletePageRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/pages/${id}`);
};

export const uploadPageImageRequest = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post(`/api/admin/pages/upload`, formData, {
    params: { folder: "pages" },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data.items[0].url;
};
