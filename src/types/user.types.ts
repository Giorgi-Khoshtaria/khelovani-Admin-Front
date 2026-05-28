import type { UserAddress } from "./address.types";

export interface User {
  _id: string;
  idNumber: string;
  nameGe?: string;
  nameEn: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isActive: boolean;
  addresses?: UserAddress[];
  createdAt: string;
  updatedAt?: string;
}

export interface UserListResponse {
  data: User[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface UserFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  isVerified?: "true" | "false";
  page?: number;
  limit?: number;
}
