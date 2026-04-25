import { z } from "zod";
import { validateWithZod } from "./shared/zodUtils";
import { ProductCategory } from "@/types/productTypes";

const georgianRegex = /^[ა-ჰ0-9\s.,/\\\-()!?:;$%&*#@]+$/;
const englishRegex = /^[a-zA-Z0-9\s.,/\\\-()!?:;$%&*#@]+$/;

export const productSchema = z.object({
  titleGe: z
    .string()
    .min(1, "ქართული სათაური სავალდებულოა")
    .min(3, "სათაური უნდა იყოს მინიმუმ 3 სიმბოლო")
    .max(100, "სათაური არ უნდა აღემატებოდეს 100 სიმბოლოს")
    .regex(georgianRegex, "სათაური უნდა შეიცავდეს მხოლოდ ქართულ ასოებს"),
  titleEn: z
    .string()
    .min(1, "ინგლისური სათაური სავალდებულოა / English title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters")
    .regex(englishRegex, "Title must contain only English characters"),
  descriptionGe: z
    .string()
    .min(1, "ქართული აღწერა სავალდებულოა")
    .min(10, "აღწერა უნდა იყოს მინიმუმ 10 სიმბოლო")
    .max(2000, "აღწერა არ უნდა აღემატებოდეს 2000 სიმბოლოს")
    .regex(georgianRegex, "აღწერა უნდა შეიცავდეს მხოლოდ ქართულ ასოებს"),
  descriptionEn: z
    .string()
    .min(1, "ინგლისური აღწერა სავალდებულოა / English description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters")
    .regex(englishRegex, "Description must contain only English characters"),
  category: z.nativeEnum(ProductCategory, {
    error: "აირჩიეთ სწორი კატეგორია / Select a valid category",
  }),
  price: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z
      .number({
        error:
          "ფასი უნდა იყოს სწორი ციფრი (0-ზე მეტი) / Price must be a valid number (greater than 0)",
      })
      .gt(
        0,
        "ფასი უნდა იყოს სწორი ციფრი (0-ზე მეტი) / Price must be a valid number (greater than 0)",
      ),
  ),
  stockQuantity: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z
      .number({
        error:
          "მარაგი უნდა იყოს სწორი ციფრი (0 ან მეტი) / Stock must be a valid number (0 or more)",
      })
      .min(
        0,
        "მარაგი უნდა იყოს სწორი ციფრი (0 ან მეტი) / Stock must be a valid number (0 or more)",
      ),
  ),
  tagsGe: z
    .array(
      z
        .string()
        .min(3, "არასწორი ტეგი (3-30 სიმბოლო, მხოლოდ ქართული)")
        .max(30, "არასწორი ტეგი (3-30 სიმბოლო, მხოლოდ ქართული)")
        .regex(georgianRegex, "არასწორი ტეგი (3-30 სიმბოლო, მხოლოდ ქართული)"),
    )
    .min(1, "მინიმუმ 1 ტეგი სავალდებულოა")
    .max(10, "მაქსიმუმ 10 ტეგია ნებადართული"),
  tagsEn: z
    .array(
      z
        .string()
        .min(3, "Invalid tag (3-30 chars, only English)")
        .max(30, "Invalid tag (3-30 chars, only English)")
        .regex(englishRegex, "Invalid tag (3-30 chars, only English)"),
    )
    .min(1, "Minimum 1 English tag is required")
    .max(10, "Maximum 10 tags allowed"),
  materialsGe: z
    .array(
      z
        .string()
        .min(3, "არასწორი მასალა (3-30 სიმბოლო, მხოლოდ ქართული)")
        .max(30, "არასწორი მასალა (3-30 სიმბოლო, მხოლოდ ქართული)")
        .regex(georgianRegex, "არასწორი მასალა (3-30 სიმბოლო, მხოლოდ ქართული)"),
    )
    .min(1, "მინიმუმ 1 მასალა სავალდებულოა")
    .max(10, "მაქსიმუმ 10 მასალაა ნებადართული"),
  materialsEn: z
    .array(
      z
        .string()
        .min(3, "Invalid material (3-30 chars, only English)")
        .max(30, "Invalid material (3-30 chars, only English)")
        .regex(englishRegex, "Invalid material (3-30 chars, only English)"),
    )
    .min(1, "Minimum 1 English material is required")
    .max(10, "Maximum 10 materials allowed"),
  condition: z.enum(["new", "handmade", "vintage"] as const, {
    error: "მდგომარეობა სავალდებულოა / მდგომარეობა არასწორია",
  }),
  locationGe: z
    .string()
    .regex(georgianRegex, "მდებარეობა უნდა შეიცავდეს მხოლოდ ქართულ ასოებს")
    .optional()
    .or(z.literal("")),
  locationEn: z
    .string()
    .regex(englishRegex, "Location must contain only English characters")
    .optional()
    .or(z.literal("")),
  shippingPrice: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? 0 : Number(val),
    z
      .number({
        error:
          "ტრანსპორტირების ფასი უნდა იყოს 0 ან მეტი / Shipping price must be 0 or more",
      })
      .min(
        0,
        "ტრანსპორტირების ფასი უნდა იყოს 0 ან მეტი / Shipping price must be 0 or more",
      ),
  ),
  weight: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? 0 : Number(val),
    z
      .number({ error: "წონა უნდა იყოს 0 ან მეტი / Weight must be 0 or more" })
      .min(0, "წონა უნდა იყოს 0 ან მეტი / Weight must be 0 or more"),
  ),
  images: z
    .array(z.any())
    .min(1, "აუცილებელია მინიმუმ 1 სურათი")
    .max(5, "მაქსიმუმ 5 სურათი"),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;

export const validateAddProductForm = (data: Partial<ProductFormInput>) => {
  return validateWithZod(productSchema, data);
};
