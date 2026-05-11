import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProductDetailsRequest, deleteProductRequest, updateProductRequest } from "@/apiCalls/partnerApiCalls/product.req";
import { updateProductPinRequest } from "@/apiCalls/partnerApiCalls/pinProduct.req";
import { toast } from "react-toastify";
import type { Product } from "@/types/productTypes";
import { parseJwt } from "@/utils/parseJwt";
import { getErrorMessage } from "@/utils/handleApiError";

export const useProductDetails = (partnerId?: string, productId?: string) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinning, setPinning] = useState(false);

  const userRole = useMemo(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return null;
    try {
      return parseJwt(token)?.role || null;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = userRole === "admin";

  const fetchProductDetails = useCallback(async (showLoading = true) => {
    if (!productId) return;
    try {
      if (showLoading) setLoading(true);
      const data = await getProductDetailsRequest(partnerId, productId);
      setProduct(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "პროდუქტის მონაცემების ჩატვირთვა ვერ მოხერხდა"));
      navigate(partnerId ? `/partners/${partnerId}/products` : "/products");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [partnerId, productId, navigate]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleDelete = async () => {
    if (!productId) return;
    if (!window.confirm("ნამდვილად გსურთ პროდუქტის წაშლა? / Are you sure you want to delete this product?")) return;

    try {
      await deleteProductRequest(partnerId, productId);
      toast.success("პროდუქტი წარმატებით წაიშალა");
      navigate(partnerId ? `/partners/${partnerId}/products` : "/products");
    } catch (err) {
      toast.error(getErrorMessage(err, "შეცდომა პროდუქტის წაშლისას"));
    }
  };

  const handlePin = async (pinSection: import("@/types/productTypes").PinSection | null) => {
    if (!productId || !product) return;
    if (pinning) return;
    try {
      setPinning(true);
      const { data, meta } = await updateProductPinRequest(productId, pinSection);
      setProduct((prev) => prev ? { ...prev, pinSection: data.pinSection, pinnedAt: data.pinnedAt } : null);
      if (pinSection && meta.evicted.length > 0) {
        toast.info("სხვა პროდუქტი ავტომატურად მოიხსნა პინიდან");
      } else {
        toast.success(pinSection ? "პროდუქტი დაიპინა" : "პინი მოიხსნა");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    } finally {
      setPinning(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!productId || !product) return;
    const originalStatus = product.isShown;
    const newStatus = !originalStatus;

    setProduct(prev => prev ? { ...prev, isShown: newStatus } : null);

    try {
      await updateProductRequest(partnerId, productId, { isShown: newStatus });
      toast.success(originalStatus ? "პროდუქტი დაიმალა / Product hidden" : "პროდუქტი გამოჩნდა / Product shown");
    } catch (err) {
      setProduct(prev => prev ? { ...prev, isShown: originalStatus } : null);
      toast.error(getErrorMessage(err, "შეცდომა სტატუსის შეცვლისას"));
    }
  };

  return {
    product,
    loading,
    isAdmin,
    pinning,
    handlePin,
    handleDelete,
    handleToggleVisibility,
    fetchProductDetails
  };
};
