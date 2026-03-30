import type { AddProductFormData } from "@/types/productTypes";

const georgianRegex = /^[ა-ჰ0-9\s.,/\\\-()!?:;$%&*#@]+$/;
const englishRegex = /^[a-zA-Z0-9\s.,/\\\-()!?:;$%&*#@]+$/;

export const validateAddProductForm = (data: Partial<AddProductFormData>) => {
  const errors: Record<string, string> = {};

  // Title GE
  if (!data.titleGe || data.titleGe.trim() === "") {
    errors.titleGe = "ქართული სათაური სავალდებულოა";
  } else if (data.titleGe.length < 3) {
    errors.titleGe = "სათაური უნდა იყოს მინიმუმ 3 სიმბოლო";
  } else if (data.titleGe.length > 100) {
    errors.titleGe = "სათაური არ უნდა აღემატებოდეს 100 სიმბოლოს";
  } else if (!georgianRegex.test(data.titleGe)) {
    errors.titleGe = "სათაური უნდა შეიცავდეს მხოლოდ ქართულ ასოებს";
  }

  // Title EN
  if (!data.titleEn || data.titleEn.trim() === "") {
    errors.titleEn =
      "ინგლისური სათაური სავალდებულოა / English title is required";
  } else if (data.titleEn.length < 3) {
    errors.titleEn = "Title must be at least 3 characters";
  } else if (data.titleEn.length > 100) {
    errors.titleEn = "Title must not exceed 100 characters";
  } else if (!englishRegex.test(data.titleEn)) {
    errors.titleEn = "Title must contain only English characters";
  }

  // Description GE
  if (!data.descriptionGe || data.descriptionGe.trim() === "") {
    errors.descriptionGe = "ქართული აღწერა სავალდებულოა";
  } else if (data.descriptionGe.length < 10) {
    errors.descriptionGe = "აღწერა უნდა იყოს მინიმუმ 10 სიმბოლო";
  } else if (data.descriptionGe.length > 2000) {
    errors.descriptionGe = "აღწერა არ უნდა აღემატებოდეს 2000 სიმბოლოს";
  } else if (!georgianRegex.test(data.descriptionGe)) {
    errors.descriptionGe = "აღწერა უნდა შეიცავდეს მხოლოდ ქართულ ასოებს";
  }

  // Description EN
  if (!data.descriptionEn || data.descriptionEn.trim() === "") {
    errors.descriptionEn =
      "ინგლისური აღწერა სავალდებულოა / English description is required";
  } else if (data.descriptionEn.length < 10) {
    errors.descriptionEn = "Description must be at least 10 characters";
  } else if (data.descriptionEn.length > 2000) {
    errors.descriptionEn = "Description must not exceed 2000 characters";
  } else if (!englishRegex.test(data.descriptionEn)) {
    errors.descriptionEn = "Description must contain only English characters";
  }

  if (!data.category) {
    errors.category = "აირჩიეთ კატეგორია";
  }

  if (data.price === undefined || data.price <= 0 || isNaN(data.price)) {
    errors.price = "ფასი უნდა იყოს სწორი ციფრი (0-ზე მეტი)";
  }

  if (
    data.stockQuantity === undefined ||
    data.stockQuantity < 0 ||
    isNaN(data.stockQuantity)
  ) {
    errors.stockQuantity = "მარაგი უნდა იყოს სწორი ციფრი (0 ან მეტი)";
  }

  // Tags GE
  if (!data.tagsGe || data.tagsGe.length === 0) {
    errors.tagsGe = "მინიმუმ 1 ტეგი სავალდებულოა";
  } else if (data.tagsGe.length > 10) {
    errors.tagsGe = "მაქსიმუმ 10 ტეგია ნებადართული";
  } else {
    const invalidTag = data.tagsGe.find(
      (tag: string) =>
        tag.length < 3 || tag.length > 30 || !georgianRegex.test(tag),
    );
    if (invalidTag)
      errors.tagsGe = `არასწორი ტეგი (3-30 სიმბოლო, მხოლოდ ქართული): ${invalidTag}`;
  }

  // Tags EN
  if (!data.tagsEn || data.tagsEn.length === 0) {
    errors.tagsEn = "Minimum 1 English tag is required";
  } else if (data.tagsEn.length > 10) {
    errors.tagsEn = "Maximum 10 tags allowed";
  } else {
    const invalidTag = data.tagsEn.find(
      (tag: string) =>
        tag.length < 3 || tag.length > 30 || !englishRegex.test(tag),
    );
    if (invalidTag)
      errors.tagsEn = `Invalid tag (3-30 chars, only English): ${invalidTag}`;
  }

  // Materials GE
  if (!data.materialsGe || data.materialsGe.length === 0) {
    errors.materialsGe = "მინიმუმ 1 მასალა სავალდებულოა";
  } else if (data.materialsGe.length > 10) {
    errors.materialsGe = "მაქსიმუმ 10 მასალაა ნებადართული";
  } else {
    const invalidMat = data.materialsGe.find(
      (mat: string) =>
        mat.length < 3 || mat.length > 30 || !georgianRegex.test(mat),
    );
    if (invalidMat)
      errors.materialsGe = `არასწორი მასალა (3-30 სიმბოლო, მხოლოდ ქართული): ${invalidMat}`;
  }

  // Materials EN
  if (!data.materialsEn || data.materialsEn.length === 0) {
    errors.materialsEn = "Minimum 1 English material is required";
  } else if (data.materialsEn.length > 10) {
    errors.materialsEn = "Maximum 10 materials allowed";
  } else {
    const invalidMat = data.materialsEn.find(
      (mat: string) =>
        mat.length < 3 || mat.length > 30 || !englishRegex.test(mat),
    );
    if (invalidMat)
      errors.materialsEn = `Invalid material (3-30 chars, only English): ${invalidMat}`;
  }

  if (!data.condition) {
    errors.condition = "მდგომარეობა სავალდებულოა";
  }

  if (!data.images || data.images.length === 0) {
    errors.images = "აუცილებელია მინიმუმ 1 სურათი";
  } else if (data.images.length > 5) {
    errors.images = "მაქსიმუმ 5 სურათი";
  }

  return errors;
};
