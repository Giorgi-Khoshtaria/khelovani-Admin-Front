export interface User {
  _id: string;
  idNumber: string;
  nameGe?: string;
  nameEn: string;
  dateOfBirth: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isActive: boolean;
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
  page?: number;
  limit?: number;
}
