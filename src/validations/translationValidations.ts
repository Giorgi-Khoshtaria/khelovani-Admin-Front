import { z } from "zod";
import { validateWithZod } from "./shared/zodUtils";

const xssRegex =
  /<\/?(script|iframe|object|embed|base|style|meta|link)\b|on\w+\s*=|javascript:/i;
const georgianRegex = /^[Ⴀ-ჿ\s\d.,!?'"()\-:;%&@#+/\\]+$/;
const englishRegex = /^[a-zA-Z\s\d.,!?'"()\-:;%&@#+/\\]+$/;

export const translationSchema = z.object({
  key: z
    .string()
    .min(1, "გასაღები სავალდებულოა / Key is required")
    .min(
      2,
      "გასაღები უნდა იყოს მინიმუმ 2 სიმბოლო / Key must be at least 2 characters",
    )
    .max(
      100,
      "გასაღები უნდა იყოს მაქსიმუმ 100 სიმბოლო / Key must not exceed 100 characters",
    ),
  ge: z
    .string()
    .min(1, "ქართული თარგმანი სავალდებულოა / Georgian translation is required")
    .max(
      200,
      "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს / Translation must not exceed 200 characters",
    )
    .refine((val) => georgianRegex.test(val), {
      message:
        "მხოლოდ ქართული სიმბოლოები დასაშვებია / Only Georgian characters are allowed",
    })
    .refine((val) => !xssRegex.test(val), {
      message:
        "აღმოჩენილია არასასურველი სიმბოლოები (XSS) / Dangerous characters detected (XSS)",
    }),
  en: z
    .string()
    .min(1, "ინგლისური თარგმანი სავალდებულოა / English translation is required")
    .max(
      200,
      "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს / Translation must not exceed 200 characters",
    )
    .refine((val) => englishRegex.test(val), {
      message:
        "მხოლოდ ლათინური სიმბოლოები დასაშვებია / Only English (Latin) characters are allowed",
    })
    .refine((val) => !xssRegex.test(val), {
      message:
        "აღმოჩენილია არასასურველი სიმბოლოები (XSS) / Dangerous characters detected (XSS)",
    }),
});

export type TranslationFormData = z.infer<typeof translationSchema>;
export type TranslationFormInput = z.input<typeof translationSchema>;

export const validateTranslationForm = (
  data: Partial<TranslationFormInput>,
) => {
  return validateWithZod(translationSchema, data);
};
