import api from "../api";

export interface MenuItemLabel {
  ka: string;
  en: string;
}

export interface MenuItem {
  _id: string;
  label: MenuItemLabel;
  href: string;
  order: number;
  isActive: boolean;
}

export const getMenuItemsRequest = async (): Promise<MenuItem[]> => {
  const response = await api.get(`/api/admin/menu`);
  return response.data.data;
};

export const createMenuItemRequest = async (
  data: Omit<MenuItem, "_id">,
): Promise<MenuItem> => {
  const response = await api.post(`/api/admin/menu`, data);
  return response.data.data;
};

export const updateMenuItemRequest = async (
  id: string,
  data: Partial<Omit<MenuItem, "_id">>,
): Promise<MenuItem> => {
  const response = await api.put(`/api/admin/menu/${id}`, data);
  return response.data.data;
};

export const deleteMenuItemRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/menu/${id}`);
};
