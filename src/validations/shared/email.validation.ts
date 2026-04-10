import { z } from "zod";
import { validateWithZod } from "./zodUtils";

export const emailSchema = z
  .string()
  .min(1, "ელ-ფოსტა აუცილებელია")
  .max(100, "ელ-ფოსტა არ უნდა აღემატებოდეს 100 სიმბოლოს")
  .email("არასწორი ელ-ფოსტის ფორმატი");

export const validateEmail = (email?: string): string | null => {
  const errors = validateWithZod(emailSchema, email);
  return errors[""] || null;
};
