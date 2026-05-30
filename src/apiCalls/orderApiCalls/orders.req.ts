import api from "../api";
import type { Order, OrderCounts } from "@/types/orderTypes";

export interface OrderListParams {
  search?: string;
  status?: string;
  partner?: string;
  page?: number;
  limit?: number;
}

export interface OrderListResult {
  data: Order[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    counts: OrderCounts;
  };
}

const clean = (params: OrderListParams) => {
  const out: Record<string, string | number> = {};
  if (params.search) out.search = params.search;
  if (params.status && params.status !== "all") out.status = params.status;
  if (params.partner) out.partner = params.partner;
  if (params.page) out.page = params.page;
  if (params.limit) out.limit = params.limit;
  return out;
};

/** Admin — all orders across every user/partner. */
export const getAllOrdersRequest = async (
  params: OrderListParams,
): Promise<OrderListResult> => {
  const res = await api.get("/api/admin/orders", { params: clean(params) });
  return { data: res.data.data, meta: res.data.meta };
};

/** Partner — only the authenticated partner's own orders. */
export const getPartnerOrdersRequest = async (
  params: OrderListParams,
): Promise<OrderListResult> => {
  const res = await api.get("/api/partner/orders", { params: clean(params) });
  return { data: res.data.data, meta: res.data.meta };
};

/** Partner — mark one of its orders delivered (paid → delivered). */
export const deliverOrderRequest = async (orderId: string): Promise<Order> => {
  const res = await api.patch(`/api/partner/orders/${orderId}/deliver`);
  return res.data.data;
};
