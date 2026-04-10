import { useState } from "react";
import { updateTranslationRequest } from "@/apiCalls/translationApiCalls/translation.req";
import { getErrorMessage } from "@/utils/handleApiError";
import { validateTranslationForm } from "@/validations/translationValidations";

export default function useEditTranslationForm(
  onSuccess: (msg?: string) => void,
  onError: (msg: string) => void,
) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editGe, setEditGe] = useState("");
  const [editEn, setEditEn] = useState("");
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const start = (item: {
    _id: string;
    translations: { ge: string; en: string };
  }) => {
    setEditingId(item._id);
    setEditGe(item.translations.ge);
    setEditEn(item.translations.en);
    setEditErrors({});
  };

  const cancel = () => {
    setEditingId(null);
    setEditErrors({});
  };

  const submit = async (id: string) => {
    try {
      const errors = validateTranslationForm({
        ge: editGe,
        en: editEn,
        key: "",
      });

      if (errors.ge || errors.en) {
        setEditErrors(errors);
        return;
      }

      await updateTranslationRequest(id, {
        translations: { ge: editGe, en: editEn },
      });

      // Clear state and then trigger success callback in next tick
      setEditingId(null);
      setEditErrors({});
      setTimeout(() => {
        onSuccess("თარგმანი წარმატებით განახლდა");
      }, 0);

    } catch (err) {
      onError(getErrorMessage(err, "განახლება ვერ მოხერხდა"));
    }
  };


  return {
    editingId,
    editGe,
    editEn,
    editErrors,
    setEditGe,
    setEditEn,
    setEditingId,
    start,
    cancel,
    submit,
  };
}
