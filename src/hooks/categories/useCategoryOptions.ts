import { useEffect, useState } from "react";
import { getPublicCategoriesRequest } from "@/apiCalls/categoryApiCalls/category.req";
import type { Category } from "@/types/category.types";

let _cache: Category[] | null = null;

export default function useCategoryOptions() {
  const [options, setOptions] = useState<Category[]>(_cache ?? []);
  const [loading, setLoading] = useState(_cache === null);

  useEffect(() => {
    if (_cache !== null) return;
    getPublicCategoriesRequest()
      .then((data) => {
        _cache = data;
        setOptions(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getLabel = (slug: string): string => {
    const found = (_cache ?? options).find((c) => c.slug === slug);
    return found ? found.nameGe : slug;
  };

  return { options, loading, getLabel };
}
