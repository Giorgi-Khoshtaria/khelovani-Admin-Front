import { 
  validateEmail,
} from "./shared/email.validation";

export const validatePartnerForm = (data: {
  companyNameGe: string;
  companyNameEn?: string;
  phone: string;
  email: string;
  address: string;
  addressEn: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}) => {
  const errors: Record<string, string> = {};

  if (!data.companyNameGe.trim()) errors.companyNameGe = "კომპანიის სახელი სავალდებულოა";
  if (!data.phone.trim()) errors.phone = "ტელეფონი სავალდებულოა";
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (!data.address.trim()) errors.address = "მისამართი სავალდებულოა";
  if (!data.addressEn.trim()) errors.addressEn = "მისამართი (ინგლისურად) სავალდებულოა";

  // Social links are optional, but if provided, we could add regex validation here
  // For now we'll just keep them as optional strings as per user request

  return errors;
};
