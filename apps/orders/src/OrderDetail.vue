<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useSession } from "@advancedfrontend/auth-session";
import { Button } from "@advancedfrontend/ui";
import { fetchOrder, refundOrder, cancelOrder } from "./api";
import type { OrderRecord } from "./mocks/handlers";

const route = useRoute();
// The shell routes `${mf.route}/:pathMatch(.*)*`, so the id arrives as
// `pathMatch`.
const id = computed(() => String(route.params.pathMatch ?? ""));

const { user } = useSession();
const isAdmin = computed(() => user.value?.roles.includes("admin") ?? false);

const record = ref<OrderRecord | null>(null);
const loading = ref(true);

async function load() {
  if (!id.value) return;
  loading.value = true;
  try {
    record.value = await fetchOrder(id.value);
  } catch {
    record.value = null;
  } finally {
    loading.value = false;
  }
}

watch(id, load, { immediate: true });

const canAct = computed(
  () => record.value?.status === "pending" || record.value?.status === "completed",
);

async function onRefund() {
  if (!record.value) return;
  record.value = await refundOrder(record.value.id);
}

async function onCancel() {
  if (!record.value) return;
  record.value = await cancelOrder(record.value.id);
}

function formatAmount(amount: number) {
  return `$${amount.toFixed(2)}`;
}
</script>

<template>
  <div>
    <p>
      <RouterLink to="/orders">← Back to orders</RouterLink>
    </p>
    <p v-if="loading">Loading…</p>
    <template v-else-if="record">
      <h2>Order #{{ record.id }}</h2>
      <p>Customer: {{ record.userName }}</p>
      <p>Amount: {{ formatAmount(record.amount) }}</p>
      <p>Status: {{ record.status }}</p>
      <div v-if="isAdmin && canAct" class="detail-actions">
        <Button @click="onRefund">Refund</Button>
        <Button @click="onCancel">Cancel</Button>
      </div>
    </template>
    <p v-else>Order not found.</p>
  </div>
</template>

<style scoped>
.detail-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
</style>
