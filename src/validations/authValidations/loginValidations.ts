import { validateEmail } from "../shared/email.validation";
import { validatePassword } from "../shared/password.validation";

export const validateLoginForm = (
  email?: string,
  password?: string,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
