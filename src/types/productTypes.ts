export interface Product {
  _id: string;
  images: string[];
  titleGe: string;
  titleEn?: string;
  descriptionGe: string;
  descriptionEn?: string;
  price: number;
  currency: string;
  category: ProductCategory;
  stockQuantity: number;
  condition: "new" | "handmade" | "vintage";
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
  createdAt: string;
  isOneOfAKind?: boolean;
  owner: string;
}

export interface AddProductFormData extends Omit<
  Product,
  "_id" | "createdAt" | "images"
> {
  images: File[];
}

/**
 * Interface for the local form state in AddProductPage.
 * Allows numerical fields to be strings during input to prevent leading zeros and allow empty fields.
 */
export interface CreateProductInput extends Omit<
  AddProductFormData,
  "price" | "stockQuantity" | "shippingPrice" | "weight"
> {
  price: number | string;
  stockQuantity: number | string;
  shippingPrice: number | string;
  weight: number | string;
}
export const ProductCategory = {
  JEWELRY: "jewelry",
  CERAMICS: "ceramics",
  TEXTILE: "textile",
  WOODWORK: "woodwork",
  PAINTING: "painting",
  SCULPTURE: "sculpture",
  LEATHERWORK: "leatherwork",
  GLASSWORK: "glasswork",
  EMBROIDERY: "embroidery",
  METALWORK: "metalwork",
  FELTWORK: "feltwork",
  KNITTING: "knitting",
  CANDLES: "candles",
  PHOTOGRAPHY: "photography",
  PRINTMAKING: "printmaking",
  PAPER_ART: "paper_art",
  HOME_DECOR: "home_decor",
  ACCESSORIES: "accessories",
  TOYS: "toys",
  OTHER: "other",
} as const;

export type ProductCategory =
  (typeof ProductCategory)[keyof typeof ProductCategory];

export const PRODUCT_CATEGORY_LABELS: Record<
  ProductCategory,
  { ge: string; en: string }
> = {
  [ProductCategory.JEWELRY]: { ge: "სამკაული", en: "Jewelry" },
  [ProductCategory.CERAMICS]: { ge: "კერამიკა", en: "Ceramics" },
  [ProductCategory.TEXTILE]: { ge: "ტექსტილი", en: "Textile" },
  [ProductCategory.WOODWORK]: { ge: "ხის ნაკეთობები", en: "Woodwork" },
  [ProductCategory.PAINTING]: { ge: "ფერწერა", en: "Painting" },
  [ProductCategory.SCULPTURE]: { ge: "ქანდაკება", en: "Sculpture" },
  [ProductCategory.LEATHERWORK]: { ge: "ტყავის ნაკეთობები", en: "Leatherwork" },
  [ProductCategory.GLASSWORK]: { ge: "მინის ნაკეთობები", en: "Glasswork" },
  [ProductCategory.EMBROIDERY]: { ge: "ნაქარგობა", en: "Embroidery" },
  [ProductCategory.METALWORK]: { ge: "ლითონის ნაკეთობები", en: "Metalwork" },
  [ProductCategory.FELTWORK]: { ge: "თექა", en: "Feltwork" },
  [ProductCategory.KNITTING]: { ge: "ნაქსოვი", en: "Knitting" },
  [ProductCategory.CANDLES]: { ge: "სანთლები", en: "Candles" },
  [ProductCategory.PHOTOGRAPHY]: { ge: "ფოტოგრაფია", en: "Photography" },
  [ProductCategory.PRINTMAKING]: {
    ge: "გრაფიკა / გრავიურა",
    en: "Printmaking",
  },
  [ProductCategory.PAPER_ART]: { ge: "ქაღალდის ხელოვნება", en: "Paper Art" },
  [ProductCategory.HOME_DECOR]: { ge: "სახლის დეკორი", en: "Home Decor" },
  [ProductCategory.ACCESSORIES]: { ge: "აქსესუარები", en: "Accessories" },
  [ProductCategory.TOYS]: { ge: "სათამაშოები", en: "Toys" },
  [ProductCategory.OTHER]: { ge: "სხვა", en: "Other" },
};
