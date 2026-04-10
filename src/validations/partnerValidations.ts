import { z } from "zod";
import { validateWithZod } from "./shared/zodUtils";

export const partnerSchema = z.object({
  companyNameGe: z.string().min(1, "კომპანიის სახელი სავალდებულოა / Company name is required"),
  companyNameEn: z.string().min(1, "კომპანიის სახელი (EN) სავალდებულოა / Company name (EN) is required"),
  identificationCode: z
    .string()
    .min(1, "საიდენტიფიკაციო კოდი სავალდებულოა / Identification code is required")
    .length(9, "კოდი უნდა იყოს 9 ნიშნა / Identification code must be 9 digits"),
  contactPerson: z.string().min(1, "საკონტაქტო პირი სავალდებულოა / Contact person is required"),
  city: z.string().min(1, "ქალაქი სავალდებულოა / City is required"),
  phone: z.string().min(1, "ტელეფონი სავალდებულოა / Phone is required"),
  email: z
    .string()
    .min(1, "ელ-ფოსტა აუცილებელია / Email is required")
    .email("არასწორი ელ-ფოსტის ფორმატი / Invalid email format"),
  address: z.string().min(1, "მისამართი სავალდებულოა / Address is required"),
  addressEn: z.string().min(1, "მისამართი (ინგლისურად) სავალდებულოა / Address (EN) is required"),
  website: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;
export type PartnerFormInput = z.input<typeof partnerSchema>;

export const validatePartnerForm = (data: Partial<PartnerFormInput>) => {
  return validateWithZod(partnerSchema, data);
};
