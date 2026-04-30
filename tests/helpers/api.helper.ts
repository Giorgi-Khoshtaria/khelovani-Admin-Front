import axios from "axios";
import * as dotenv from "dotenv";
import * as path from "path";

import type { MenuItem } from "../../src/apiCalls/menuApiCalls/menu.req";
import type { Partner } from "../../src/types/partner.types";
import type { CreateProductInput } from "../../src/types/productTypes";
import type { RawTranslation } from "../../src/types/translation.types";

import type { Role, Permission } from "../../src/types/role.types";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const backendUrl = process.env.VITE_BACKEND_API_URL;

export class ApiHelper {
  private token: string | null = null;

  constructor(token?: string) {
    this.token = token || null;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  async login(
    email = process.env.ADMIN_EMAIL,
    password = process.env.ADMIN_PASSWORD,
  ) {
    const response = await axios.post(`${backendUrl}/api/admin/auth/login`, {
      email,
      password,
    });
    this.token =
      response.data.token ||
      response.data.accessToken ||
      response.data.data?.token;
    return this.token;
  }

  // Menu API
  async getMenuItems() {
    const response = await axios.get(`${backendUrl}/api/admin/menu`, {
      headers: this.getHeaders(),
    });
    return response.data.data;
  }
  async createMenuItem(data: Omit<MenuItem, "_id">) {
    const response = await axios.post(`${backendUrl}/api/admin/menu`, data, {
      headers: this.getHeaders(),
    });
    return response.data.data;
  }
  async updateMenuItem(id: string, data: Omit<MenuItem, "_id">) {
    const response = await axios.put(
      `${backendUrl}/api/admin/menu/${id}`,
      data,
      { headers: this.getHeaders() },
    );
    return response.data;
  }
  async deleteMenuItem(id: string) {
    await axios.delete(`${backendUrl}/api/admin/menu/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Partners API
  async createPartner(data: Partial<Partner>) {
    // Note: Admin cannot directly POST a partner, we use the public registration endpoint for seeding
    const registrationData = {
      categories: ["other"],
      terms: true,
      ...data,
    };
    const response = await axios.post(
      `${backendUrl}/api/partner/register`,
      registrationData,
      { headers: this.getHeaders() },
    );
    return response.data.partner ?? response.data.data ?? response.data;
  }
  async deletePartner(id: string) {
    await axios.delete(`${backendUrl}/api/admin/partners/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async approvePartner(id: string) {
    await axios.patch(
      `${backendUrl}/api/admin/partners/${id}/status`,
      { status: "APPROVED" },
      { headers: this.getHeaders() },
    );
  }

  async pinPartner(id: string, isPinned: boolean) {
    const response = await axios.patch(
      `${backendUrl}/api/admin/partners/${id}/pin`,
      { isPinned },
      { headers: this.getHeaders() },
    );
    return response.data;
  }

  async setPartnerVisibility(id: string, isShown: boolean) {
    const response = await axios.patch(
      `${backendUrl}/api/admin/partners/${id}/visibility`,
      { isShown },
      { headers: this.getHeaders() },
    );
    return response.data;
  }

  // Products API
  async createProduct(partnerId: string, data: Partial<CreateProductInput>) {
    const formData = new FormData();

    // Add dummy image if not provided (backend requires at least one image)
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "tests/assets/demo-product.jpg");

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: "image/jpeg" });
      formData.append("images", blob, "sample-product.jpg");
    }

    // Append other fields
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Ensure mandatory fields if not provided
    if (!data.tagsGe) formData.append("tagsGe", JSON.stringify(["ტეგი"]));
    if (!data.tagsEn) formData.append("tagsEn", JSON.stringify(["tag"]));
    if (!data.materialsGe)
      formData.append("materialsGe", JSON.stringify(["მასალა"]));
    if (!data.materialsEn)
      formData.append("materialsEn", JSON.stringify(["material"]));
    if (!data.currency) formData.append("currency", "GEL");

    const response = await axios.post(
      `${backendUrl}/api/products/partner/${partnerId}`,
      formData,
      {
        headers: {
          ...this.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }
  async deleteProduct(productId: string) {
    await axios.delete(`${backendUrl}/api/products/${productId}`, {
      headers: this.getHeaders(),
    });
  }

  async pinProduct(productId: string, isPinned: boolean) {
    const response = await axios.patch(
      `${backendUrl}/api/products/${productId}/pin`,
      { isPinned },
      { headers: this.getHeaders() },
    );
    return response.data;
  }

  // Translations API
  async createTranslation(data: Omit<RawTranslation, "_id">) {
    const response = await axios.post(
      `${backendUrl}/api/admin/translations`,
      data,
      { headers: this.getHeaders() },
    );
    return response.data;
  }
  async bulkDeleteTranslations(ids: string[]) {
    await axios.post(
      `${backendUrl}/api/admin/translations/bulk-delete`,
      { ids },
      { headers: this.getHeaders() },
    );
  }

  // Roles API
  async getRoles() {
    const response = await axios.get(`${backendUrl}/api/admin/roles`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
  async createRole(data: Partial<Role>) {
    const response = await axios.post(`${backendUrl}/api/admin/roles`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
  async deleteRole(id: string) {
    await axios.delete(`${backendUrl}/api/admin/roles/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Users API
  async getUsers(params: Record<string, string | number> = {}) {
    const response = await axios.get(`${backendUrl}/api/admin/users`, {
      headers: this.getHeaders(),
      params,
    });
    return response.data;
  }
  async getUserById(id: string) {
    const response = await axios.get(`${backendUrl}/api/admin/users/${id}`, {
      headers: this.getHeaders(),
    });
    return response.data.data ?? response.data;
  }
  async deleteUser(id: string) {
    await axios.delete(`${backendUrl}/api/admin/users/${id}`, {
      headers: this.getHeaders(),
    });
  }
  async bulkDeleteUsers(ids: string[]) {
    await axios.post(
      `${backendUrl}/api/admin/users/bulk-delete`,
      { ids },
      { headers: this.getHeaders() },
    );
  }

  // Permissions API
  async getPermissions() {
    const response = await axios.get(`${backendUrl}/api/admin/permissions`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
  async createPermission(data: Partial<Permission>) {
    const response = await axios.post(
      `${backendUrl}/api/admin/permissions`,
      data,
      { headers: this.getHeaders() },
    );
    return response.data;
  }
  async deletePermission(id: string) {
    await axios.delete(`${backendUrl}/api/admin/permissions/${id}`, {
      headers: this.getHeaders(),
    });
  }
  async getPermissionCategories(): Promise<string[]> {
    const response = await axios.get(
      `${backendUrl}/api/admin/permissions/categories`,
      { headers: this.getHeaders() },
    );
    return response.data.data as string[];
  }

  // Categories API
  async getCategories() {
    const response = await axios.get(`${backendUrl}/api/admin/categories`, {
      headers: this.getHeaders(),
    });
    return response.data.data;
  }
  async createCategory(data: { slug: string; nameGe: string; nameEn: string; isActive?: boolean }) {
    const response = await axios.post(`${backendUrl}/api/admin/categories`, data, {
      headers: this.getHeaders(),
    });
    return response.data.data;
  }
  async deleteCategory(id: string) {
    await axios.delete(`${backendUrl}/api/admin/categories/${id}`, {
      headers: this.getHeaders(),
    }).catch(() => {});
  }
}
