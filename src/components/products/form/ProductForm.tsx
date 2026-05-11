import React from "react";
import "./ProductForm.scss";
import type { CreateProductInput } from "@/types/productTypes";
import MediaSection from "./sections/MediaSection";
import BasicInfoSection from "./sections/BasicInfoSection";
import PricingSection from "./sections/PricingSection";
import ShippingSection from "./sections/ShippingSection";
import TagsSection from "./sections/TagsSection";
import FormActions from "./sections/FormActions";

interface ProductFormProps {
  formData: CreateProductInput;
  errors: Record<string, string>;
  loading: boolean;
  isEdit?: boolean;
  existingImages?: string[];
  onSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  setArrayField: (
    name: "tagsGe" | "tagsEn" | "materialsGe" | "materialsEn",
    items: string[],
  ) => void;
  appendProcessedImage: (file: File) => void;
  resetImages: () => void;
  removeExistingImage?: (url: string) => void;
  onCancel?: () => void;
  isAdmin?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  errors,
  loading,
  isEdit,
  existingImages,
  onSubmit,
  handleInputChange,
  setArrayField,
  appendProcessedImage,
  resetImages,
  removeExistingImage,
  onCancel,
  isAdmin,
}) => (
  <form className="product-form" onSubmit={onSubmit} noValidate>
    <MediaSection
      images={formData.images}
      errors={errors}
      isEdit={isEdit}
      existingImages={existingImages}
      appendProcessedImage={appendProcessedImage}
      resetImages={resetImages}
      removeExistingImage={removeExistingImage}
    />

    <BasicInfoSection
      formData={formData}
      errors={errors}
      handleInputChange={handleInputChange}
    />

    <PricingSection
      formData={formData}
      errors={errors}
      isAdmin={isAdmin}
      handleInputChange={handleInputChange}
    />

    <ShippingSection
      formData={formData}
      errors={errors}
      handleInputChange={handleInputChange}
    />

    <TagsSection
      formData={formData}
      errors={errors}
      setArrayField={setArrayField}
    />

    <FormActions loading={loading} isEdit={isEdit} onCancel={onCancel} />
  </form>
);

export default ProductForm;
