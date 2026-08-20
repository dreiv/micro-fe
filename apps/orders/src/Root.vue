<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { on } from "@advancedfrontend/contracts";
import OrdersTable from "./OrdersTable.vue";
import OrderDetail from "./OrderDetail.vue";

// Exposed to the shell via Module Federation (exposes: './Root').
// The shell routes /orders and /orders/:id into this component; we pick the
// right screen from the current route.
const route = useRoute();
// The shell routes `${mf.route}/:pathMatch(.*)*`, so the id arrives as
// `pathMatch` (empty string on the index route, the id on the detail route).
const isDetail = computed(() => route.params.pathMatch !== undefined && route.params.pathMatch !== "");

// Cross-microfrontend events: when a user is deactivated (from the Users
// screen, possibly in another tab), refresh the orders table and show a
// transient banner. `refreshKey` is bumped to force OrdersTable to remount,
// which re-runs its `watch(..., { immediate: true })` load.
const refreshKey = ref(0);
const banner = ref<string | null>(null);

const unsubscribe = on("user:deactivated", ({ userName }) => {
  refreshKey.value += 1;
  banner.value = `Refreshed orders because ${userName} was deactivated`;
});

// Clean up the listener when this screen is torn down.
onBeforeUnmount(() => unsubscribe());
</script>

<template>
  <div>
    <h1>Orders</h1>
    <p v-if="banner" class="event-banner" @click="banner = null">{{ banner }}</p>
    <OrderDetail v-if="isDetail" />
    <OrdersTable v-else :key="refreshKey" />
  </div>
</template>

<style scoped>
.event-banner {
  background: #ecfdf5;
  border: 1px solid #10b981;
  color: #065f46;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
</style>
