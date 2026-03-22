export const validateEmail = (email?: string): string | null => {
  if (!email || email.trim() === "") return "ელ-ფოსტა აუცილებელია";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "არასწორი ელ-ფოსტის ფორმატი";
  return null;
};
