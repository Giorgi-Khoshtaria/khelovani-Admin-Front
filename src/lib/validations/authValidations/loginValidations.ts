export const validateLoginForm = (
  email?: string,
  password?: string
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "ელ-ფოსტა აუცილებელია";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.email = "არასწორი ელ-ფოსტის ფორმატი";
  }

  if (!password) {
    errors.password = "პაროლი აუცილებელია";
  }

  return errors;
};