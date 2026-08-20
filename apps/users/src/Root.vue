<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getTailParam } from "@advancedfrontend/contracts";
import UsersTable from "./UsersTable.vue";
import UserDetail from "./UserDetail.vue";

// Exposed to the shell (exposes: './Root'); the shell routes /users and
// /users/:id here, so we pick the screen from the current route.
const route = useRoute();
const isDetail = computed(() => getTailParam(route) !== null);
</script>

<template>
  <div>
    <h1>Users</h1>
    <UserDetail v-if="isDetail" />
    <UsersTable v-else />
  </div>
</template>
