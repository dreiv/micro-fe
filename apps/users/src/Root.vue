<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import UsersTable from "./UsersTable.vue";
import UserDetail from "./UserDetail.vue";

// Exposed to the shell (exposes: './Root'); the shell routes /users and
// /users/:id here, so we pick the screen from the current route.
const route = useRoute();
// Shell routes `${mf.route}/:pathMatch(.*)*`, so the id arrives as `pathMatch`
// (empty string on the index route).
const isDetail = computed(() => route.params.pathMatch !== undefined && route.params.pathMatch !== "");
</script>

<template>
  <div>
    <h1>Users</h1>
    <UserDetail v-if="isDetail" />
    <UsersTable v-else />
  </div>
</template>
