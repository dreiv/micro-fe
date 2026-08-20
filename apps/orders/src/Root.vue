<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { on } from "@advancedfrontend/contracts";
import OrdersTable from "./OrdersTable.vue";
import OrderDetail from "./OrderDetail.vue";

// Exposed to the shell (exposes: './Root'); the shell routes /orders and
// /orders/:id here, so we pick the screen from the current route.
const route = useRoute();
// Shell routes `${mf.route}/:pathMatch(.*)*`, so the id arrives as `pathMatch`
// (empty string on the index route).
const isDetail = computed(() => route.params.pathMatch !== undefined && route.params.pathMatch !== "");

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
  background: #ecfdf5;
  border: 1px solid #10b981;
  color: #065f46;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
</style>
