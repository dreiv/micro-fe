import { http, HttpResponse } from "msw";

export type OrderStatus = "pending" | "completed" | "refunded" | "cancelled";

export type OrderRecord = {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: OrderStatus;
};

const CUSTOMERS = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Grace Hopper" },
  { id: "3", name: "Alan Turing" },
  { id: "4", name: "Barbara Liskov" },
  { id: "5", name: "Linus Torvalds" },
  { id: "6", name: "Margaret Hamilton" },
];

const STATUSES: OrderStatus[] = ["pending", "completed", "refunded", "cancelled"];

function buildSeedOrders(): OrderRecord[] {
  const orders: OrderRecord[] = [];
  for (let i = 1; i <= 60; i += 1) {
    const customer = CUSTOMERS[i % CUSTOMERS.length];
    orders.push({
      id: String(i),
      userId: customer.id,
      userName: customer.name,
      amount: Math.round((10 + ((i * 37) % 490)) * 100) / 100,
      status: STATUSES[i % STATUSES.length],
    });
  }
  return orders;
}

const orders: OrderRecord[] = buildSeedOrders();

export const handlers = [
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status");
    const page = Number(url.searchParams.get("page") ?? "0");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    const filtered = orders.filter((o) => {
      const matchesSearch =
        !search || o.userName.toLowerCase().includes(search) || o.id.includes(search);
      const matchesStatus = !status || status === "all" || o.status === status;
      return matchesSearch && matchesStatus;
    });

    const start = page * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ items, total: filtered.length });
  }),

  http.get("/api/orders/:id", ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(order);
  }),

  http.post("/api/orders/:id/refund", ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    order.status = "refunded";
    return HttpResponse.json(order);
  }),

  http.post("/api/orders/:id/cancel", ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    order.status = "cancelled";
    return HttpResponse.json(order);
  }),
];
