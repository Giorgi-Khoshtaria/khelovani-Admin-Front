import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getProductsRequest,
  deleteProductRequest,
  updateProductRequest,
} from "@/apiCalls/partnerApiCalls/product.req";
import { updateProductPinRequest } from "@/apiCalls/partnerApiCalls/pinProduct.req";
import { getAllPartnerRequest } from "@/apiCalls/partnerApiCalls/getPartner.req";
import { toast } from "react-toastify";
import type { Product, ProductCondition } from "@/types/productTypes";
import { parseJwt } from "@/utils/parseJwt";
import { getErrorMessage } from "@/utils/handleApiError";
import type { Partner, PartnerType } from "@/types/partner.types";
import { useDebounce } from "@/hooks/useDebounce";

interface TokenPayload {
  id: string;
  role: string | { name: string };
  permissions: string[];
}

export const useProductListing = (id?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [category, setCategory] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Admin filter by organization
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [partners, setPartners] = useState<{ _id: string; name: string }[]>([]);
  const [ownerType, setOwnerType] = useState<PartnerType | "">("");
  const [condition, setCondition] = useState<ProductCondition | "">("");

  const userData = useMemo(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return null;
    try {
      const decoded = parseJwt(token);
      return decoded as TokenPayload;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = useMemo(() => {
    if (!userData) return false;
    const role = (
      typeof userData.role === "string"
        ? userData.role
        : userData.role?.name || ""
    ).toLowerCase();
    const permissions = userData.permissions || [];
    return role === "admin" || permissions.includes("products.viewAll");
  }, [userData]);

  const fetchProducts = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const effectiveId = id || (!isAdmin ? userData?.id : undefined);
        const data = await getProductsRequest(
          effectiveId,
          debouncedSearch,
          category,
          selectedPartnerId,
          currentPage,
          limit,
          ownerType || undefined,
          condition || undefined,
        );
        setProducts(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
        setTotalCount(data.meta?.totalCount || 0);
      } catch (err) {
        toast.error(getErrorMessage(err, "შეცდომა პროდუქტების ჩატვირთვისას"));
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [
      id,
      debouncedSearch,
      category,
      selectedPartnerId,
      ownerType,
      condition,
      isAdmin,
      userData?.id,
      currentPage,
    ],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, selectedPartnerId, ownerType, condition]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Fetch partners for the dropdown if admin is in global view
    const loadPartners = async () => {
      if (isAdmin && !id) {
        try {
          const data = await getAllPartnerRequest();
          const partnersList = data.data || [];
          const mapped = partnersList.map((p: Partner) => ({
            _id: p._id,
            name: p.companyNameGe || p.companyNameEn || "Unknown Organization",
          }));
          setPartners(mapped);
        } catch (err) {
          console.error("Failed to fetch partners:", err);
        }
      }
    };
    loadPartners();
  }, [isAdmin, id]);

  const handleDelete = async (productId: string) => {
    if (
      !window.confirm(
        "ნამდვილად გსურთ პროდუქტის წაშლა? / Are you sure you want to delete this product?",
      )
    )
      return;
    try {
      await deleteProductRequest(id, productId);
      toast.success("პროდუქტი წარმატებით წაიშალა");
      fetchProducts(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "შეცდომა პროდუქტის წაშლისას"));
    }
  };

  const handlePin = async (product: Product, pinSection: import("@/types/productTypes").PinSection | null) => {
    const prev_section = product.pinSection;
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, pinSection } : p)),
    );
    try {
      const { data, meta } = await updateProductPinRequest(product._id, pinSection);
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id === product._id) return { ...p, pinSection: data.pinSection, pinnedAt: data.pinnedAt };
          if (meta.evicted.includes(p._id)) return { ...p, pinSection: null, pinnedAt: null };
          return p;
        }),
      );
      if (pinSection && meta.evicted.length > 0) {
        toast.info("სხვა პროდუქტი ავტომატურად მოიხსნა პინიდან");
      } else {
        toast.success(pinSection ? "პროდუქტი დაიპინა" : "პინი მოიხსნა");
      }
      fetchProducts(false);
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, pinSection: prev_section } : p)),
      );
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    const originalStatus = product.isShown;
    const newStatus = !originalStatus;

    setProducts((prev) =>
      prev.map((p) =>
        p._id === product._id ? { ...p, isShown: newStatus } : p,
      ),
    );

    try {
      await updateProductRequest(id, product._id, { isShown: newStatus });
      toast.success(
        originalStatus
          ? "პროდუქტი დაიმალა / Product hidden"
          : "პროდუქტი გამოჩნდა / Product shown",
      );
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isShown: originalStatus } : p,
        ),
      );
      toast.error(getErrorMessage(err, "შეცდომა სტატუსის შეცვლისას"));
    }
  };

  return {
    products,
    loading,
    search,
    setSearch,
    category,
    setCategory,
    condition,
    setCondition,
    selectedPartnerId,
    setSelectedPartnerId,
    ownerType,
    setOwnerType,
    partners,
    isAdmin,
    handleDelete,
    handlePin,
    handleToggleVisibility,
    fetchProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
  };
};
