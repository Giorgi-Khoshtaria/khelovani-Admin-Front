import axios from "axios";

interface FieldError {
  field?: string;
  message?: string;
}

interface ApiErrorBody {
  message?: string;
  errors?: FieldError[];
}

export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | undefined;

    if (data?.message) return data.message;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors
        .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
        .filter(Boolean)
        .join(" • ");
    }

    return err.message || fallback;
  }

  if (err instanceof Error) return err.message || fallback;
  return fallback;
};
