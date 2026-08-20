<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useSession } from "@advancedfrontend/auth-session";
import { Button } from "@advancedfrontend/ui";
import { useOrdersFilters } from "./store";
import { fetchOrders, refundOrder, cancelOrder } from "./api";
import type { OrderRecord } from "./mocks/handlers";

const PAGE_SIZE = 10;

const { user } = useSession();
const isAdmin = computed(() => user.value?.roles.includes("admin") ?? false);
const { search, status, page, setSearch, setStatus, setPage } = useOrdersFilters();

const items = ref<OrderRecord[]>([]);
const total = ref(0);
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const res = await fetchOrders({
      search: search.value,
      status: status.value,
      page: page.value,
      pageSize: PAGE_SIZE,
    });
    items.value = res.items;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}

watch([search, status, page], load, { immediate: true });

const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)));

function canAct(row: OrderRecord) {
  return row.status === "pending" || row.status === "completed";
}

function formatAmount(amount: number) {
  return `$${amount.toFixed(2)}`;
}

async function onRefund(id: string) {
  await refundOrder(id);
  await load();
}

async function onCancel(id: string) {
  await cancelOrder(id);
  await load();
}
</script>

<template>
  <div>
    <div class="toolbar">
      <input placeholder="Search by customer or order id" :value="search"
        @input="setSearch(($event.target as HTMLInputElement).value)" />
      <select :value="status" @change="setStatus(($event.target as HTMLSelectElement).value)">
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="refunded">Refunded</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
    <p v-if="loading">Loading orders…</p>
    <template v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in items" :key="row.id">
            <td>
              <RouterLink :to="`/orders/${row.id}`">#{{ row.id }}</RouterLink>
            </td>
            <td>{{ row.userName }}</td>
            <td>{{ formatAmount(row.amount) }}</td>
            <td>{{ row.status }}</td>
            <td v-if="isAdmin">
              <template v-if="canAct(row)">
                <Button @click="onRefund(row.id)">Refund</Button>
                <Button @click="onCancel(row.id)">Cancel</Button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button :disabled="page === 0" @click="setPage(page - 1)">Previous</button>
        <span>Page {{ page + 1 }} of {{ pageCount }}</span>
        <button :disabled="page + 1 >= pageCount" @click="setPage(page + 1)">Next</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.toolbar input,
.toolbar select {
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--font-size-base);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-base);
}

.table th,
.table td {
  text-align: left;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.table th {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
}

.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
}
</style>
