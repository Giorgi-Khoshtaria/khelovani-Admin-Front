import { z } from "zod";
import { validateWithZod } from "./zodUtils";

export const passwordSchema = z.string().min(1, "პაროლი აუცილებელია");

export const validatePassword = (password?: string): string | null => {
  const errors = validateWithZod(passwordSchema, password);
  return errors[""] || null;
};
