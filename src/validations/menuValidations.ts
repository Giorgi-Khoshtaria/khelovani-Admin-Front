export const validateMenuItemForm = (data: {
  labelKa?: string;
  labelEn?: string;
  href?: string;
  order?: number | string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.labelKa || data.labelKa.trim() === "") {
    errors.labelKa = "ქართული სახელი სავალდებულოა";
  } else if (data.labelKa.trim().length < 2) {
    errors.labelKa = "ქართული სახელი მინიმუმ 2 სიმბოლო უნდა იყოს";
  }

  if (!data.labelEn || data.labelEn.trim() === "") {
    errors.labelEn = "ინგლისური სახელი სავალდებულოა";
  } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(data.labelEn.trim())) {
    errors.labelEn = "ინგლისური სახელი მხოლოდ ლათინური ასოებით უნდა იყოს";
  }

  if (!data.href || data.href.trim() === "") {
    errors.href = "ლინკი სავალდებულოა";
  } else if (!data.href.trim().startsWith("/")) {
    errors.href = "ლინკი უნდა იწყებოდეს '/' სიმბოლოთი (მაგ. /about)";
  }

  if (data.order === undefined || data.order === "") {
    errors.order = "რიგითობა სავალდებულოა";
  } else {
    const orderNum = Number(data.order);
    if (isNaN(orderNum) || orderNum < 0) {
      errors.order = "რიგითობა უნდა იყოს 0 ან მეტი";
    }
  }

  return errors;
};
