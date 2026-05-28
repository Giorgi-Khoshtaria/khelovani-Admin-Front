import { useState, useCallback } from "react";
import type { CreateProductInput, AddProductFormData } from "@/types/productTypes";
import { validateAddProductForm } from "@/validations/productValidations";
import { sanitizeNumericValue } from "@/utils/numericInput";

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
    isOnSale: false,
    discountPercent: "",
    shippingAvailable: false,
    shippingPrice: "",
    dimensions: "",
    weight: "",
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
    // Block negatives across the board for number inputs — UI also
    // intercepts the keys, but this catches paste/autofill/drag.
    const val =
      type === "checkbox"
        ? target.checked
        : type === "number"
          ? sanitizeNumericValue(value)
          : value;

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

  const setArrayField = useCallback(
    (name: "tagsGe" | "tagsEn" | "materialsGe" | "materialsEn", items: string[]) => {
      setFormData((prev) => ({ ...prev, [name]: items }));
      setTagInputs((prev) => ({ ...prev, [name]: items.join(", ") }));
      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [errors],
  );

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

  const appendProcessedImage = useCallback((file: File) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, file].slice(0, 5) }));
    setErrors((prev) => {
      if (!prev.images) return prev;
      const next = { ...prev };
      delete next.images;
      return next;
    });
  }, []);

  const resetImages = useCallback(() => {
    setFormData((prev) => ({ ...prev, images: [] }));
  }, []);

  const validate = (isEdit: boolean, hasExistingImages: boolean) => {
    const isOnSale = formData.isOnSale ?? false;
    const rawDiscount = isOnSale && formData.discountPercent !== "" && formData.discountPercent != null
      ? Number(formData.discountPercent)
      : null;

    // "One of a kind" is driven entirely by the condition field — derive
    // the boolean and pin stock to 1 so the rest of the pipeline sees a
    // consistent payload.
    const isOneOfAKind = formData.condition === "one_of_a_kind";

    const submissionData = {
      ...formData,
      price: Number(formData.price || 0),
      stockQuantity: isOneOfAKind ? 1 : Number(formData.stockQuantity || 0),
      shippingPrice: formData.shippingPrice ? Number(formData.shippingPrice) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      discountPercent: rawDiscount === 0 || rawDiscount == null ? null : rawDiscount,
      isOnSale,
      isOneOfAKind,
    } as unknown as AddProductFormData;

    const validationErrors = validateAddProductForm(submissionData);

    if (isEdit && hasExistingImages && formData.images.length === 0) {
      delete validationErrors.images;
    }

    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      setErrors(validationErrors);
      const firstField = errorKeys[0];
      requestAnimationFrame(() => {
        const el =
          document.querySelector(`[name="${firstField}"]`) ||
          document.querySelector(".pf-input--error, .pf-error");
        if (el) {
          (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
          if (el instanceof HTMLElement && typeof el.focus === "function") {
            el.focus({ preventScroll: true });
          }
        }
      });
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
    setArrayField,
    handleFileChange,
    appendProcessedImage,
    resetImages,
    validate
  };
};
