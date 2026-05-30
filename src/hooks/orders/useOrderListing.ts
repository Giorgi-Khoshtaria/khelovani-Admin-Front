import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import {
  getAllOrdersRequest,
  getPartnerOrdersRequest,
  deliverOrderRequest,
} from "@/apiCalls/orderApiCalls/orders.req";
import { parseJwt } from "@/utils/parseJwt";
import { getErrorMessage } from "@/utils/handleApiError";
import { useDebounce } from "@/hooks/useDebounce";
import type { Order, OrderCounts, OrderStatusFilter } from "@/types/orderTypes";

interface TokenPayload {
  id: string;
  role: string | { name: string };
  permissions: string[];
}

const EMPTY_COUNTS: OrderCounts = {
  all: 0,
  paid: 0,
  delivered: 0,
  cancelled: 0,
};

/**
 * Drives the order listing for both admin (all orders) and partner (own
 * orders). `profileMode` = the partner self-view (`/profile/orders`).
 */
export const useOrderListing = (profileMode: boolean) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<OrderCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<OrderStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 15;

  const userData = useMemo(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return null;
    try {
      return parseJwt(token) as TokenPayload;
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
    return role === "admin" || (userData.permissions || []).includes("orders.viewAll");
  }, [userData]);

  // Partner endpoint when in the profile view or when not an admin.
  const partnerView = profileMode || !isAdmin;

  const fetchOrders = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const params = {
          search: debouncedSearch,
          status,
          page: currentPage,
          limit,
        };
        const res = partnerView
          ? await getPartnerOrdersRequest(params)
          : await getAllOrdersRequest(params);
        setOrders(res.data || []);
        setCounts(res.meta?.counts || EMPTY_COUNTS);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.totalCount || 0);
      } catch (err) {
        toast.error(getErrorMessage(err, "შეცდომა შეკვეთების ჩატვირთვისას"));
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [partnerView, debouncedSearch, status, currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const markDelivered = async (orderId: string) => {
    if (
      !window.confirm(
        "მონიშნოთ შეკვეთა მიწოდებულად? / Mark this order as delivered?",
      )
    )
      return;
    try {
      await deliverOrderRequest(orderId);
      toast.success("შეკვეთა მონიშნულია მიწოდებულად");
      fetchOrders(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    }
  };

  return {
    orders,
    counts,
    loading,
    search,
    setSearch,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    isAdmin,
    partnerView,
    markDelivered,
  };
};
