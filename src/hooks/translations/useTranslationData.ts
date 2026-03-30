import { useState, useCallback } from "react";
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

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(
    async (params: {
      search?: string;
      page?: number;
      limit?: number;
      namespace?: string;
    } = {}) => {
      try {
        setLoading(true);
        setError(null);
        const [transData, nsData] = await Promise.all([
          getTranslationsRequest(params),
          getNamespacesRequest(),
        ]);

        if (transData.success) {
          setTranslations(transData.data.grouped || {});
          setRawTranslations(transData.data.raw || []);
          setTotalCount(transData.data.totalCount || 0);
          setTotalPages(transData.data.totalPages || 1);
        }
        if (nsData.success) {
          setNamespaces(nsData.data || []);
        }
      } catch (err) {
        setError(getErrorMessage(err, "მონაცემების ჩატვირთვა ვერ მოხერხდა"));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    translations,
    rawTranslations,
    namespaces,
    totalCount,
    totalPages,
    loading,
    error,
    fetchData,
  };
}
