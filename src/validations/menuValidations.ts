import { z } from "zod";
import { validateWithZod } from "./shared/zodUtils";

export const menuSchema = z.object({
  labelEn: z
    .string()
    .trim()
    .min(1, "ინგლისური სახელი სავალდებულოა / English label is required")
    .max(
      100,
      "ინგლისური სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს / English label must not exceed 100 characters",
    )
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "ინგლისური სახელი მხოლოდ ლათინური ასოებით უნდა იყოს / English label must contain only Latin characters",
    ),
  labelKa: z
    .string()
    .trim()
    .min(1, "ქართული სახელი სავალდებულოა / Georgian label is required")
    .max(
      100,
      "ქართული სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს / Georgian label must not exceed 100 characters",
    )
    .regex(
      /^[ა-ჰ0-9\s\-_]+$/,
      "ქართული სახელი მხოლოდ ქართული ასოებით უნდა იყოს / Georgian label must contain only Georgian characters",
    ),
  href: z
    .string()
    .trim()
    .min(1, "ლინკი სავალდებულოა / Link is required")
    .max(
      100,
      "ლინკი არ უნდა აღემატებოდეს 100 სიმბოლოს / Link must not exceed 100 characters",
    )
    .startsWith(
      "/",
      "ლინკი უნდა იწყებოდეს '/' სიმბოლოთი (მაგ. /about) / Link must start with '/' (e.g. /about)",
    )
    .regex(
      /^\/[a-zA-Z0-9/\-._]*$/,
      "არასწორი ლინკის ფორმატი / Invalid link format",
    ),
  order: z.preprocess(
    (a) => (a === "" ? undefined : Number(a)),
    z
      .number({
        error: "რიგითობა უნდა იყოს 0 ან მეტი / Order must be 0 or more",
      })
      .min(0, "რიგითობა უნდა იყოს 0 ან მეტი / Order must be 0 or more"),
  ),
});

export type MenuFormData = z.infer<typeof menuSchema>;
export type MenuFormInput = z.input<typeof menuSchema>;

export const validateMenuItemForm = (data: Partial<MenuFormInput>) => {
  return validateWithZod(menuSchema, data);
};
