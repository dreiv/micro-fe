import { api } from "@advancedfrontend/auth-session";
import type { OrderRecord } from "./mocks/handlers";

export type OrdersPage = { items: OrderRecord[]; total: number };

export function fetchOrders(params: {
  search: string;
  status: string;
  page: number;
  pageSize: number;
}) {
  const qs = new URLSearchParams({
    search: params.search,
    status: params.status,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  return api.get(`/api/orders?${qs.toString()}`) as Promise<OrdersPage>;
}

export function fetchOrder(id: string) {
  return api.get(`/api/orders/${id}`) as Promise<OrderRecord>;
}

export function refundOrder(id: string) {
  return api.post(`/api/orders/${id}/refund`) as Promise<OrderRecord>;
}

export function cancelOrder(id: string) {
  return api.post(`/api/orders/${id}/cancel`) as Promise<OrderRecord>;
}
