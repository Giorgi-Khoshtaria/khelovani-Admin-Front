export interface Product {
  _id: string;
  images: string[];
  titleGe: string;
  titleEn?: string;
  descriptionGe: string;
  descriptionEn?: string;
  price: number;
  currency: string;
  category: string;
  stockQuantity: number;
  condition: "new" | "handmade" | "vintage";
  tagsGe: string[];
  tagsEn?: string[];
  materialsGe: string[];
  materialsEn?: string[];
  locationGe?: string;
  locationEn?: string;
  isShown: boolean;
  createdAt: string;
  isOneOfAKind?: boolean;
  shippingAvailable?: boolean;
  customizable?: boolean;
  owner: string;
}

export interface AddProductFormData extends Omit<Product, "_id" | "createdAt" | "images"> {
  images: File[];
}

/**
 * Interface for the local form state in AddProductPage.
 * Allows numerical fields to be strings during input to prevent leading zeros and allow empty fields.
 */
export interface CreateProductInput extends Omit<AddProductFormData, "price" | "stockQuantity"> {
  price: number | string;
  stockQuantity: number | string;
}
