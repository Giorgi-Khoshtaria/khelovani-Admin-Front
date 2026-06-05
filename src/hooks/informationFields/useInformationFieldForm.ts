import { useEffect, useState } from "react";
import {
  InformationFieldType,
  type InformationField,
  type InformationFieldPayload,
} from "@/types/informationField.types";

export interface InformationFieldFormErrors {
  key?: string;
  value?: string;
  description?: string;
}

const KEY_REGEX = /^[a-zA-Z0-9_.-]+$/;

/** HTML input type to use for the value field, based on the selected field type. */
export const valueInputType = (type: InformationFieldType): string => {
  switch (type) {
    case InformationFieldType.Number:
      return "number";
    case InformationFieldType.Date:
      return "date";
    default:
      return "text";
  }
};

/** Validates a value against the selected type. Returns an error message or undefined. */
export const validateValue = (
  type: InformationFieldType,
  value: string
): string | undefined => {
  if (!value.trim()) return "მნიშვნელობა სავალდებულოა";

  if (type === InformationFieldType.Number && Number.isNaN(Number(value))) {
    return "შეიყვანეთ სწორი რიცხვი";
  }

  if (type === InformationFieldType.Date && Number.isNaN(Date.parse(value))) {
    return "შეიყვანეთ სწორი თარიღი";
  }

  return undefined;
};

/**
 * Holds all form state and validation for the information field create/edit form.
 */
export function useInformationFieldForm(field: InformationField | null) {
  const [key, setKey] = useState("");
  const [type, setType] = useState<InformationFieldType>(
    InformationFieldType.Text
  );
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<InformationFieldFormErrors>({});

  useEffect(() => {
    if (field) {
      setKey(field.key);
      setType(field.type);
      setValue(field.value);
      setDescription(field.description ?? "");
    } else {
      setKey("");
      setType(InformationFieldType.Text);
      setValue("");
      setDescription("");
    }
    setErrors({});
  }, [field]);

  const changeType = (next: InformationFieldType) => {
    setType(next);
    setErrors((prev) => ({ ...prev, value: undefined }));
  };

  const validate = (): boolean => {
    const next: InformationFieldFormErrors = {};

    if (!key.trim()) {
      next.key = "გასაღები (key) სავალდებულოა";
    } else if (!KEY_REGEX.test(key.trim())) {
      next.key =
        "გასაღები შეიძლება შეიცავდეს მხოლოდ ლათინურ ასოებს, ციფრებს, . - _";
    }

    const valueError = validateValue(type, value);
    if (valueError) next.value = valueError;

    if (description.length > 1000) {
      next.description = "აღწერა ძალიან გრძელია";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const getPayload = (): InformationFieldPayload => ({
    key: key.trim(),
    type,
    value: value.trim(),
    description: description.trim() || undefined,
  });

  return {
    key,
    setKey,
    type,
    changeType,
    value,
    setValue,
    description,
    setDescription,
    errors,
    validate,
    getPayload,
  };
}
