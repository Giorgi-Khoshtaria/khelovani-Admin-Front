import { useEffect, useState, useCallback } from "react";
import {
  getCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from "@/apiCalls/categoryApiCalls/category.req";
import { updateCategoryPinRequest } from "@/apiCalls/categoryApiCalls/pinCategory.req";
import type {
  Category,
  CategoryFormValues,
  CategoryFormErrors,
} from "@/types/category.types";
import { useFormHandler } from "@/hooks/useFormHandler";
import { getErrorMessage } from "@/utils/handleApiError";
import { toast } from "react-toastify";

const EMPTY_FORM: CategoryFormValues = { slug: "", nameGe: "", nameEn: "" };

const GE_REGEX = /^[ა-ჰ\s''\-]+$/;
const EN_REGEX = /^[A-Za-z\s''\-]+$/;
const SLUG_REGEX = /^[a-z0-9_-]+$/;

function toStringRecord(errors: CategoryFormErrors): Record<string, string> {
  const result: Record<string, string> = {};
  if (errors.slug) result.slug = errors.slug;
  if (errors.nameGe) result.nameGe = errors.nameGe;
  if (errors.nameEn) result.nameEn = errors.nameEn;
  return result;
}

function validateForm(values: CategoryFormValues): CategoryFormErrors {
  const errors: CategoryFormErrors = {};
  if (!values.slug) {
    errors.slug = "სლაგი სავალდებულოა";
  } else if (values.slug.length < 2) {
    errors.slug = "სლაგი მინიმუმ 2 სიმბოლო";
  } else if (values.slug.length > 50) {
    errors.slug = "სლაგი მაქსიმუმ 50 სიმბოლო";
  } else if (!SLUG_REGEX.test(values.slug)) {
    errors.slug = "სლაგი: მხოლოდ a-z, 0-9, _ და -";
  }
  if (!values.nameGe) {
    errors.nameGe = "ქართული სახელი სავალდებულოა";
  } else if (values.nameGe.length < 2) {
    errors.nameGe = "მინიმუმ 2 სიმბოლო";
  } else if (values.nameGe.length > 50) {
    errors.nameGe = "მაქსიმუმ 50 სიმბოლო";
  } else if (!GE_REGEX.test(values.nameGe)) {
    errors.nameGe = "მხოლოდ ქართული ასოები";
  }
  if (!values.nameEn) {
    errors.nameEn = "ინგლისური სახელი სავალდებულოა";
  } else if (values.nameEn.length < 2) {
    errors.nameEn = "მინიმუმ 2 სიმბოლო";
  } else if (values.nameEn.length > 50) {
    errors.nameEn = "მაქსიმუმ 50 სიმბოლო";
  } else if (!EN_REGEX.test(values.nameEn)) {
    errors.nameEn = "მხოლოდ ინგლისური ასოები";
  }
  return errors;
}

export default function useCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<CategoryFormValues>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<CategoryFormErrors>({});

  const addForm = useFormHandler<CategoryFormValues>(EMPTY_FORM);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategoriesRequest();
      setCategories(data);
    } catch {
      toast.error("კატეგორიების ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(addForm.formData);
    if (Object.keys(errors).length > 0) {
      addForm.setErrors(toStringRecord(errors));
      return;
    }
    try {
      await createCategoryRequest(addForm.formData);
      setIsAddModalOpen(false);
      addForm.setFormData(EMPTY_FORM);
      addForm.setErrors({});
      toast.success("კატეგორია წარმატებით შეიქმნა");
      loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err, "კატეგორია ვერ შეიქმნა"));
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditDraft({ slug: cat.slug, nameGe: cat.nameGe, nameEn: cat.nameEn });
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(EMPTY_FORM);
    setEditErrors({});
  };

  const commitEdit = async () => {
    const errors = validateForm(editDraft);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    try {
      await updateCategoryRequest(editingId!, editDraft);
      setEditingId(null);
      toast.success("კატეგორია განახლდა");
      loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err, "განახლება ვერ მოხერხდა"));
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`წაშლა: "${cat.nameGe}"?`)) return;
    try {
      await deleteCategoryRequest(cat._id);
      toast.success("კატეგორია წაიშალა");
      loadCategories();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        toast.error("კატეგორია გამოიყენება — გამორთეთ (isActive=false)");
      } else {
        toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
      }
    }
  };

  const handlePin = async (cat: Category) => {
    const newVal = !cat.isPinned;
    setCategories((prev) =>
      prev.map((c) => (c._id === cat._id ? { ...c, isPinned: newVal } : c)),
    );
    try {
      const { data, meta } = await updateCategoryPinRequest(cat._id, newVal);
      setCategories((prev) =>
        prev.map((c) => {
          if (c._id === cat._id)
            return { ...c, isPinned: data.isPinned, pinnedAt: data.pinnedAt };
          if (meta.evicted.includes(c._id))
            return { ...c, isPinned: false, pinnedAt: null };
          return c;
        }),
      );
      if (newVal && meta.evicted.length > 0) {
        toast.info("სხვა კატეგორია ავტომატურად მოიხსნა პინიდან");
      } else {
        toast.success(newVal ? "კატეგორია დაიპინა" : "პინი მოიხსნა");
      }
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) =>
          c._id === cat._id ? { ...c, isPinned: cat.isPinned } : c,
        ),
      );
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    }
  };

  const handleToggleActive = async (cat: Category) => {
    const newVal = !cat.isActive;
    setCategories((prev) =>
      prev.map((c) => (c._id === cat._id ? { ...c, isActive: newVal } : c)),
    );
    try {
      await updateCategoryRequest(cat._id, { isActive: newVal });
      toast.success(newVal ? "კატეგორია გააქტიურდა" : "კატეგორია გამორთულია");
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) =>
          c._id === cat._id ? { ...c, isActive: cat.isActive } : c,
        ),
      );
      toast.error(getErrorMessage(err, "სტატუსის შეცვლა ვერ მოხერხდა"));
    }
  };

  return {
    categories,
    loading,
    isAddModalOpen,
    setIsAddModalOpen,
    addForm,
    editingId,
    editDraft,
    editErrors,
    setEditDraft,
    startEdit,
    cancelEdit,
    commitEdit,
    handleAddSubmit,
    handleDelete,
    handleToggleActive,
    handlePin,
  };
}
