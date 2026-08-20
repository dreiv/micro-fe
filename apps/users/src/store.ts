import { ref } from "vue";

export type StatusFilter = "all" | "active" | "inactive";

// Internal-only UI state (filters/pagination) — never shared outside this
// microfrontend (RFC §9). Module-scope so table and detail share it.
const search = ref("");
const status = ref<StatusFilter>("all");
const page = ref(0);

export function useUsersFilters() {
  return {
    search,
    status,
    page,
    setSearch: (value: string) => {
      search.value = value;
      page.value = 0;
    },
    setStatus: (value: StatusFilter) => {
      status.value = value;
      page.value = 0;
    },
    setPage: (value: number) => {
      page.value = value;
    },
  };
}
