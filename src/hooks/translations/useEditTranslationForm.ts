import { useState } from "react";
import { updateTranslationRequest } from "@/apiCalls/translationApiCalls/translation.req";
import { getErrorMessage } from "@/utils/handleApiError";
import { validateTranslationForm } from "@/validations/translationValidations";

export default function useEditTranslationForm(
  onSuccess: (msg?: string) => void,
  onError: (msg: string) => void,
) {
  const [editState, setEditState] = useState<{
    id: string | null;
    ge: string;
    en: string;
    key: string;
    namespace: string;
    errors: Record<string, string>;
  }>({
    id: null,
    ge: "",
    en: "",
    key: "",
    namespace: "",
    errors: {},
  });

  const start = (item: {
    _id: string;
    key: string;
    translations: { ge: string; en: string };
    namespace: string;
  }) => {
    setEditState({
      id: item._id,
      ge: item.translations.ge,
      en: item.translations.en,
      key: item.key,
      namespace: item.namespace,
      errors: {},
    });
  };

  const cancel = () => {
    setEditState((prev) => ({ ...prev, id: null, errors: {} }));
  };

  const submit = async (id: string) => {
    try {
      const errors = validateTranslationForm({
        ge: editState.ge,
        en: editState.en,
        key: editState.key,
      });

      if (Object.keys(errors).length > 0) {
        setEditState((prev) => ({ ...prev, errors }));
        return;
      }

      await updateTranslationRequest(id, {
        translations: { ge: editState.ge, en: editState.en },
        namespace: editState.namespace,
        key: editState.key,
      });

      setEditState((prev) => ({ ...prev, id: null, errors: {} }));
      setTimeout(() => {
        onSuccess("თარგმანი წარმატებით განახლდა");
      }, 0);
    } catch (err) {
      onError(getErrorMessage(err, "განახლება ვერ მოხერხდა"));
    }
  };

  return {
    editingId: editState.id,
    editGe: editState.ge,
    editEn: editState.en,
    editKey: editState.key,
    editNamespace: editState.namespace,
    editErrors: editState.errors,
    setEditGe: (ge: string) => setEditState((prev) => ({ ...prev, ge })),
    setEditEn: (en: string) => setEditState((prev) => ({ ...prev, en })),
    setEditKey: (key: string) => setEditState((prev) => ({ ...prev, key })),
    setEditNamespace: (namespace: string) =>
      setEditState((prev) => ({ ...prev, namespace })),
    setEditingId: (id: string | null) =>
      setEditState((prev) => ({ ...prev, id })),
    start,
    cancel,
    submit,
  };
}
