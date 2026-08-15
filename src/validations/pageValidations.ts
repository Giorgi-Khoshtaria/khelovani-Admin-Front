import { z } from "zod";
import { validateWithZod } from "./shared/zodUtils";

const baseSchema = z.object({
  path: z
    .string()
    .trim()
    .min(1, "გვერდის მისამართი სავალდებულოა")
    .max(100, "მისამართი არ უნდა აღემატებოდეს 100 სიმბოლოს")
    .startsWith("/", "მისამართი უნდა იწყებოდეს '/' სიმბოლოთი (მაგ. /about)")
    .regex(/^\/[a-zA-Z0-9/\-._]*$/, "არასწორი მისამართის ფორმატი"),
  titleKa: z
    .string()
    .trim()
    .min(2, "სათაური (ქართული) სავალდებულოა")
    .max(60, "სათაური არ უნდა აღემატებოდეს 60 სიმბოლოს"),
  titleEn: z
    .string()
    .trim()
    .min(2, "სათაური (ინგლისური) სავალდებულოა")
    .max(60, "სათაური არ უნდა აღემატებოდეს 60 სიმბოლოს"),
  descriptionKa: z
    .string()
    .trim()
    .min(10, "აღწერა (ქართული) სავალდებულოა")
    .max(160, "აღწერა არ უნდა აღემატებოდეს 160 სიმბოლოს"),
  descriptionEn: z
    .string()
    .trim()
    .min(10, "აღწერა (ინგლისური) სავალდებულოა")
    .max(160, "აღწერა არ უნდა აღემატებოდეს 160 სიმბოლოს"),
  ogImage: z.string().trim().optional(),
  noindex: z.boolean().optional(),
  showInNav: z.boolean().optional(),
  navLabelKa: z.string().trim().optional(),
  navLabelEn: z.string().trim().optional(),
  navOrder: z.preprocess(
    (v) => (v === "" || v === undefined ? 0 : Number(v)),
    z.number().min(0, "რიგითობა უნდა იყოს 0 ან მეტი").optional(),
  ),
});

// Nav label rules mirror the Menu form's own constraints (Georgian-only /
// Latin-only, 20 chars max) — only enforced when "show in navigation" is on.
export const pageSchema = baseSchema.superRefine((data, ctx) => {
  if (!data.showInNav) return;

  const navLabelKa = data.navLabelKa?.trim() ?? "";
  if (!navLabelKa) {
    ctx.addIssue({
      code: "custom",
      path: ["navLabelKa"],
      message: "ბმულის ტექსტი (ქართული) სავალდებულოა",
    });
  } else if (navLabelKa.length > 20) {
    ctx.addIssue({
      code: "custom",
      path: ["navLabelKa"],
      message: "ბმულის ტექსტი არ უნდა აღემატებოდეს 20 სიმბოლოს",
    });
  } else if (!/^[ა-ჰ0-9\s\-_]+$/.test(navLabelKa)) {
    ctx.addIssue({
      code: "custom",
      path: ["navLabelKa"],
      message: "ბმულის ტექსტი მხოლოდ ქართული ასოებით უნდა იყოს",
    });
  }

  const navLabelEn = data.navLabelEn?.trim() ?? "";
  if (!navLabelEn) {
    ctx.addIssue({
      code: "custom",
      path: ["navLabelEn"],
      message: "ბმულის ტექსტი (ინგლისური) სავალდებულოა",
    });
  } else if (navLabelEn.length > 20) {
    ctx.addIssue({
      code: "custom",
      path: ["navLabelEn"],
      message: "ბმულის ტექსტი არ უნდა აღემატებოდეს 20 სიმბოლოს",
    });
  } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(navLabelEn)) {
    ctx.addIssue({
      code: "custom",
      path: ["navLabelEn"],
      message: "ბმულის ტექსტი მხოლოდ ლათინური ასოებით უნდა იყოს",
    });
  }
});

export type PageFormData = z.infer<typeof pageSchema>;
export type PageFormInput = z.input<typeof pageSchema>;

export const validatePageForm = (data: Partial<PageFormInput>) => {
  return validateWithZod(pageSchema, data);
};
