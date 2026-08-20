<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { on, getTailParam } from "@advancedfrontend/contracts";
import OrdersTable from "./OrdersTable.vue";
import OrderDetail from "./OrderDetail.vue";

// Exposed to the shell (exposes: './Root'); the shell routes /orders and
// /orders/:id here, so we pick the screen from the current route.
const route = useRoute();
const isDetail = computed(() => getTailParam(route) !== null);

// Cross-microfrontend: on user deactivation (possibly from another tab),
// bump `refreshKey` to force OrdersTable to remount and re-run its load.
const refreshKey = ref(0);
const banner = ref<string | null>(null);

const unsubscribe = on("user:deactivated", ({ userName }) => {
  refreshKey.value += 1;
  banner.value = `Refreshed orders because ${userName} was deactivated`;
});

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
  background: var(--color-banner-bg);
  border: 1px solid var(--color-banner-border);
  color: var(--color-banner-text);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
</style>
