import { z } from "zod";
import { validateWithZod } from "./zodUtils";

export const passwordSchema = z
  .string()
  .trim()
  .min(1, "პაროლი აუცილებელია")
  .max(128, "პაროლი არ უნდა აღემატებოდეს 128 სიმბოლოს");

export const validatePassword = (password?: string): string | null => {
  const errors = validateWithZod(passwordSchema, password);
  return errors[""] || null;
};
