import type { PartnerType } from "@/types/partner.types";

export type ProductCondition =
  | "handmade"
  | "made_to_order"
  | "limited_edition"
  | "one_of_a_kind"
  | "restored"
  | "upcycled";

export const PRODUCT_CONDITIONS: ProductCondition[] = [
  "handmade",
  "made_to_order",
  "limited_edition",
  "one_of_a_kind",
  "restored",
  "upcycled",
];

export const CONDITION_LABELS: Record<ProductCondition, { ge: string; en: string }> = {
  handmade:        { ge: "ხელნაკეთი",            en: "Handmade" },
  made_to_order:   { ge: "შეკვეთით",              en: "Made to Order" },
  limited_edition: { ge: "შეზღუდული გამოშვება",  en: "Limited Edition" },
  one_of_a_kind:   { ge: "ერთ-ერთი ეგზემპლარი", en: "One of a Kind" },
  restored:        { ge: "აღდგენილი",             en: "Restored" },
  upcycled:        { ge: "გადამუშავებული",        en: "Upcycled" },
};

// PinSection mirrors ProductCondition — a product pins into its own condition's section
export type PinSection = ProductCondition;

export interface Product {
  _id: string;
  ownerType?: PartnerType;
  images: string[];
  titleGe: string;
  titleEn?: string;
  descriptionGe: string;
  descriptionEn?: string;
  price: number;
  currency: string;
  category: string;
  stockQuantity: number;
  condition: ProductCondition;
  tagsGe: string[];
  tagsEn?: string[];
  materialsGe: string[];
  materialsEn?: string[];
  locationGe?: string;
  locationEn?: string;
  shippingAvailable?: boolean;
  shippingPrice?: number;
  dimensions?: string;
  weight?: number;
  isShown: boolean;
  isOnSale?: boolean;
  discountPercent?: number | null;
  isOneOfAKind?: boolean;
  pinSection?: PinSection | null;
  pinnedAt?: string | null;
  createdAt: string;
  owner: string;
}

export interface AddProductFormData extends Omit<
  Product,
  "_id" | "createdAt" | "images"
> {
  images: File[];
}

export interface CreateProductInput extends Omit<
  AddProductFormData,
  | "price"
  | "stockQuantity"
  | "shippingPrice"
  | "weight"
  | "category"
  | "discountPercent"
> {
  price: number | string;
  stockQuantity: number | string;
  shippingPrice: number | string;
  weight: number | string;
  discountPercent: number | string | undefined;
  category: string;
}
