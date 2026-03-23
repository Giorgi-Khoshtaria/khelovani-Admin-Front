export const validateTranslationForm = (data: {
  namespace?: string;
  key?: string;
  ge?: string;
  en?: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.namespace || data.namespace.trim() === "") {
    errors.namespace = "ნეიმსპეისი სავალდებულოა";
  }

  if (!data.key || data.key.trim() === "") {
    errors.key = "გასაღები სავალდებულოა";
  }

  if (!data.ge || data.ge.trim() === "") {
    errors.ge = "ქართული თარგმანი სავალდებულოა";
  }

  if (!data.en || data.en.trim() === "") {
    errors.en = "ინგლისური თარგმანი სავალდებულოა";
  }

  return errors;
};
