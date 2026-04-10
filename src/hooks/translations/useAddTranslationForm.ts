import { useState } from "react";
import { validateTranslationForm } from "@/validations/translationValidations";
import { addTranslationRequest } from "@/apiCalls/translationApiCalls/translation.req";
import { getErrorMessage } from "@/utils/handleApiError";

export default function useAddTranslationForm(
  defaultNamespace: string,
  onSuccess: (msg?: string) => void,
  onError: (msg: string) => void,
) {
  const [isAddMode, setIsAddMode] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newGe, setNewGe] = useState("");
  const [newEn, setNewEn] = useState("");
  const [selectedNamespaceForAdd, setSelectedNamespaceForAdd] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setNewKey("");
    setNewGe("");
    setNewEn("");
    setFormErrors({});
  };

  const toggleAddMode = () => {
    if (isAddMode) {
      resetForm();
    }
    setIsAddMode(!isAddMode);
  };

  const handleAddTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const namespace = selectedNamespaceForAdd || defaultNamespace;
      const errors = validateTranslationForm({
        key: newKey,
        ge: newGe,
        en: newEn,
      });

      if (Object.keys(errors).length > 0) {
        console.log("Validation Errors:", errors);
        setFormErrors(errors);
        return;
      }
      setFormErrors({});

      await addTranslationRequest({
        namespace,
        key: newKey,
        translations: { ge: newGe, en: newEn },
      });

      setIsAddMode(false);
      setNewKey("");
      setNewGe("");
      setNewEn("");
      onSuccess("თარგმანი წარმატებით დაემატა");
    } catch (err) {
      onError(getErrorMessage(err, "დამატება ვერ მოხერხდა"));
    }
  };

  return {
    isAddMode,
    newKey,
    newGe,
    newEn,
    selectedNamespaceForAdd,
    formErrors,
    setNewKey,
    setNewGe,
    setNewEn,
    setSelectedNamespaceForAdd,
    setIsAddMode,
    toggleAddMode,
    onSubmit: handleAddTranslation,
  };
}
