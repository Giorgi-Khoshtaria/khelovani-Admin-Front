import { useState } from "react";
import { updateTranslationRequest } from "@/apiCalls/translationApiCalls/translation.req";
import { getErrorMessage } from "@/utils/handleApiError";

export default function useEditTranslationForm(
  onSuccess: () => void,
  onError: (msg: string) => void,
) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editGe, setEditGe] = useState("");
  const [editEn, setEditEn] = useState("");

  const start = (item: {
    _id: string;
    translations: { ge: string; en: string };
  }) => {
    setEditingId(item._id);
    setEditGe(item.translations.ge);
    setEditEn(item.translations.en);
  };

  const cancel = () => {
    setEditingId(null);
  };

  const submit = async (id: string) => {
    try {
      await updateTranslationRequest(id, {
        translations: { ge: editGe, en: editEn },
      });
      setEditingId(null);
      onSuccess();
    } catch (err) {
      onError(getErrorMessage(err, "განახლება ვერ მოხერხდა"));
    }
  };

  return {
    editingId,
    editGe,
    editEn,
    setEditGe,
    setEditEn,
    setEditingId,
    start,
    cancel,
    submit,
  };
}
