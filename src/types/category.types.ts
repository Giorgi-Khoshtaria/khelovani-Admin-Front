export interface Category {
  _id: string;
  slug: string;
  nameGe: string;
  nameEn: string;
  isActive: boolean;
  isPinned: boolean;
  pinnedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormValues {
  slug: string;
  nameGe: string;
  nameEn: string;
}

export interface CategoryFormErrors {
  slug?: string;
  nameGe?: string;
  nameEn?: string;
}
