<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import UsersTable from "./UsersTable.vue";
import UserDetail from "./UserDetail.vue";

// Exposed to the shell via Module Federation (exposes: './Root').
// The shell routes /users and /users/:id into this component; we pick the
// right screen from the current route.
const route = useRoute();
// The shell routes `${mf.route}/:pathMatch(.*)*`, so the id arrives as
// `pathMatch` (empty string on the index route, the id on the detail route).
const isDetail = computed(() => route.params.pathMatch !== undefined && route.params.pathMatch !== "");
</script>

<template>
  <div>
    <h1>Users</h1>
    <UserDetail v-if="isDetail" />
    <UsersTable v-else />
  </div>
</template>
