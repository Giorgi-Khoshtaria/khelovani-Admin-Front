import { useEffect, useState, useCallback } from "react";
import {
  getTranslationsRequest,
  getNamespacesRequest,
} from "@/apiCalls/translationApiCalls/translation.req";
import { getErrorMessage } from "@/utils/handleApiError";
import type { RawTranslation, NamespaceItem } from "@/types/translation.types";

export default function useTranslationData() {
  const [translations, setTranslations] = useState<
    Record<string, Record<string, { ge: string; en: string }>>
  >({});
  const [rawTranslations, setRawTranslations] = useState<RawTranslation[]>([]);
  const [namespaces, setNamespaces] = useState<NamespaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const [transData, nsData] = await Promise.all([
        getTranslationsRequest(search),
        getNamespacesRequest(),
      ]);

      if (transData.success) {
        setTranslations(transData.data.grouped || {});
        setRawTranslations(transData.data.raw || []);
      }
      if (nsData.success) {
        setNamespaces(nsData.data || []);
      }
    } catch (err) {
      setError(getErrorMessage(err, "მონაცემების ჩატვირთვა ვერ მოხერხდა"));
    } finally {
      setLoading(false);
    }
  }, []); // no external state dependencies used inside

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  return {
    translations,
    rawTranslations,
    namespaces,
    loading,
    error,
    fetchData,
  };
}
