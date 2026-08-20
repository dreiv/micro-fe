<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import OrdersTable from "./OrdersTable.vue";
import OrderDetail from "./OrderDetail.vue";

// Exposed to the shell via Module Federation (exposes: './Root').
// The shell routes /orders and /orders/:id into this component; we pick the
// right screen from the current route.
const route = useRoute();
// The shell routes `${mf.route}/:pathMatch(.*)*`, so the id arrives as
// `pathMatch` (empty string on the index route, the id on the detail route).
const isDetail = computed(() => route.params.pathMatch !== undefined && route.params.pathMatch !== "");
</script>

<template>
  <div>
    <h1>Orders</h1>
    <OrderDetail v-if="isDetail" />
    <OrdersTable v-else />
  </div>
</template>
