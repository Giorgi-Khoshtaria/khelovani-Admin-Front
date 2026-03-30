import { useState, useCallback } from "react";
import type { CreateProductInput, AddProductFormData } from "@/types/productTypes";
import { validateAddProductForm } from "@/validations/productValidations";

export const useProductForm = (initialData?: Partial<CreateProductInput>) => {
  const [formData, setFormData] = useState<CreateProductInput>({
    titleGe: "",
    titleEn: "",
    descriptionGe: "",
    descriptionEn: "",
    category: "",
    condition: "handmade",
    price: "",
    stockQuantity: "",
    tagsGe: [],
    materialsGe: [],
    tagsEn: [],
    materialsEn: [],
    images: [],
    currency: "GEL",
    isShown: false,
    isOneOfAKind: false,
    shippingAvailable: false,
    customizable: false,
    owner: "",
    ...initialData,
  });

  const [tagInputs, setTagInputs] = useState({
    tagsGe: initialData?.tagsGe?.join(", ") || "",
    tagsEn: initialData?.tagsEn?.join(", ") || "",
    materialsGe: initialData?.materialsGe?.join(", ") || "",
    materialsEn: initialData?.materialsEn?.join(", ") || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const val = type === "checkbox" ? target.checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: val }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  }, [errors]);

  const handleTagInputChange = useCallback((name: keyof typeof tagInputs, value: string) => {
    setTagInputs((prev) => ({ ...prev, [name]: value }));
    const array = value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [name]: array }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  }, [errors]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (newFiles.length > 5) {
        setErrors((prev) => ({ ...prev, images: "მაქსიმუმ 5 სურათი / Maximum 5 images" }));
        return;
      }
      setFormData((prev) => ({ ...prev, images: newFiles }));
      if (errors.images) {
        setErrors((prev) => {
          const newErrs = { ...prev };
          delete newErrs.images;
          return newErrs;
        });
      }
    }
  }, [errors]);

  const validate = (isEdit: boolean, hasExistingImages: boolean) => {
    const submissionData = {
      ...formData,
      price: Number(formData.price || 0),
      stockQuantity: Number(formData.stockQuantity || 0),
    } as unknown as AddProductFormData;

    const validationErrors = validateAddProductForm(submissionData);
    
    if (isEdit && hasExistingImages && formData.images.length === 0) {
      delete validationErrors.images;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return null;
    }

    return submissionData;
  };

  return {
    formData,
    setFormData,
    tagInputs,
    setTagInputs,
    errors,
    setErrors,
    handleInputChange,
    handleTagInputChange,
    handleFileChange,
    validate
  };
};
