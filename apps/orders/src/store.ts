import { ref } from "vue";

export type OrderStatusFilter = "all" | "pending" | "completed" | "refunded" | "cancelled";

// Internal-only UI state (table filters/pagination) — never shared outside
// this microfrontend (RFC §9).
const search = ref("");
const status = ref<OrderStatusFilter>("all");
const page = ref(0);

export function useOrdersFilters() {
  return {
    search,
    status,
    page,
    setSearch: (value: string) => {
      search.value = value;
      page.value = 0;
    },
    setStatus: (value: OrderStatusFilter) => {
      status.value = value;
      page.value = 0;
    },
    setPage: (value: number) => {
      page.value = value;
    },
  };
}
