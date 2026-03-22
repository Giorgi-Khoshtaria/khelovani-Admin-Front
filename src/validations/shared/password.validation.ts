export const validatePassword = (password?: string): string | null => {
  if (!password || password.trim() === "") return "პაროლი აუცილებელია";
  return null;
};
