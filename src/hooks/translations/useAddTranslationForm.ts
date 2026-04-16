import { useState } from "react";
import { validateTranslationForm } from "@/validations/translationValidations";
import { addTranslationRequest } from "@/apiCalls/translationApiCalls/translation.req";
import { getErrorMessage } from "@/utils/handleApiError";

export default function useAddTranslationForm(
  defaultNamespace: string,
  onSuccess: (msg?: string) => void,
  onError: (msg: string) => void,
) {
  const [formState, setFormState] = useState({
    isAddMode: false,
    key: "",
    ge: "",
    en: "",
    selectedNamespace: "",
    errors: {} as Record<string, string>,
  });

  const resetForm = () => {
    setFormState((prev) => ({
      ...prev,
      key: "",
      ge: "",
      en: "",
      errors: {},
    }));
  };

  const toggleAddMode = () => {
    if (formState.isAddMode) {
      resetForm();
    }
    setFormState((prev) => ({ ...prev, isAddMode: !prev.isAddMode }));
  };

  const handleAddTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const namespace = formState.selectedNamespace || defaultNamespace;
      const errors = validateTranslationForm({
        key: formState.key,
        ge: formState.ge,
        en: formState.en,
      });

      if (Object.keys(errors).length > 0) {
        setFormState((prev) => ({ ...prev, errors }));
        return;
      }
      setFormState((prev) => ({ ...prev, errors: {} }));

      await addTranslationRequest({
        namespace,
        key: formState.key,
        translations: { ge: formState.ge, en: formState.en },
      });

      setFormState((prev) => ({
        ...prev,
        isAddMode: false,
        key: "",
        ge: "",
        en: "",
      }));
      onSuccess("თარგმანი წარმატებით დაემატა");
    } catch (err) {
      onError(getErrorMessage(err, "დამატება ვერ მოხერხდა"));
    }
  };

  return {
    isAddMode: formState.isAddMode,
    newKey: formState.key,
    newGe: formState.ge,
    newEn: formState.en,
    selectedNamespaceForAdd: formState.selectedNamespace,
    formErrors: formState.errors,
    setNewKey: (key: string) => setFormState((prev) => ({ ...prev, key })),
    setNewGe: (ge: string) => setFormState((prev) => ({ ...prev, ge })),
    setNewEn: (en: string) => setFormState((prev) => ({ ...prev, en })),
    setSelectedNamespaceForAdd: (selectedNamespace: string) =>
      setFormState((prev) => ({ ...prev, selectedNamespace })),
    setIsAddMode: (isAddMode: boolean) =>
      setFormState((prev) => ({ ...prev, isAddMode })),
    toggleAddMode,
    onSubmit: handleAddTranslation,
  };
}
