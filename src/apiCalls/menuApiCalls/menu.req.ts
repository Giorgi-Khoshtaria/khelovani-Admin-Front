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

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getMenuItemsRequest = async (): Promise<MenuItem[]> => {
  const response = await api.get(`/api/admin/menu`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createMenuItemRequest = async (
  data: Omit<MenuItem, "_id">,
): Promise<MenuItem> => {
  const response = await api.post(`/api/admin/menu`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateMenuItemRequest = async (
  id: string,
  data: Partial<Omit<MenuItem, "_id">>,
): Promise<MenuItem> => {
  const response = await api.put(`/api/admin/menu/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteMenuItemRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/menu/${id}`, {
    headers: getAuthHeaders(),
  });
};
