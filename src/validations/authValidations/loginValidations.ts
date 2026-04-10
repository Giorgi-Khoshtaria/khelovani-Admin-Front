import { z } from "zod";
import { validateWithZod } from "../shared/zodUtils";
import { emailSchema } from "../shared/email.validation";
import { passwordSchema } from "../shared/password.validation";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const validateLoginForm = (
  email?: string,
  password?: string,
): Record<string, string> => {
  return validateWithZod(loginSchema, { email, password });
};
