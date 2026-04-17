import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getProductsRequest,
  deleteProductRequest,
  updateProductRequest,
} from "@/apiCalls/partnerApiCalls/product.req";
import { getAllPartnerRequest } from "@/apiCalls/partnerApiCalls/getPartner.req";
import { toast } from "react-toastify";
import type { Product } from "@/types/productTypes";
import { parseJwt } from "@/utils/parseJwt";
import type { Partner } from "@/types/partner.types";
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
        );
        setProducts(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
        setTotalCount(data.meta?.totalCount || 0);
      } catch {
        toast.error("შეცდომა პროდუქტების ჩატვირთვისას");
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [id, debouncedSearch, category, selectedPartnerId, isAdmin, userData?.id, currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, selectedPartnerId]);

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
    } catch {
      toast.error("შეცდომა პროდუქტის წაშლისას");
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
    } catch {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isShown: originalStatus } : p,
        ),
      );
      toast.error("შეცდომა სტატუსის შეცვლისას");
    }
  };

  return {
    products,
    loading,
    search,
    setSearch,
    category,
    setCategory,
    selectedPartnerId,
    setSelectedPartnerId,
    partners,
    isAdmin,
    handleDelete,
    handleToggleVisibility,
    fetchProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
  };
};
