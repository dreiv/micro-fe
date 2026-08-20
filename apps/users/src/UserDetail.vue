<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useSession } from "@advancedfrontend/auth-session";
import { Button } from "@advancedfrontend/ui";
import { fetchUser, activateUser, deactivateUser, setUserRole } from "./api";
import { emitUserDeactivated } from "./events";
import type { UserRecord } from "./mocks/handlers";
import type { Role } from "@advancedfrontend/contracts";

const route = useRoute();
// Shell routes `${mf.route}/:pathMatch(.*)*`, so the id arrives as `pathMatch`.
const id = computed(() => String(route.params.pathMatch ?? ""));

const { user: sessionUser } = useSession();
const isAdmin = computed(() => sessionUser.value?.roles.includes("admin") ?? false);

const record = ref<UserRecord | null>(null);
const loading = ref(true);

async function load() {
  if (!id.value) return;
  loading.value = true;
  try {
    record.value = await fetchUser(id.value);
  } catch {
    record.value = null;
  } finally {
    loading.value = false;
  }
}

watch(id, load, { immediate: true });

async function onActivate() {
  if (!record.value) return;
  record.value = await activateUser(record.value.id);
}

async function onDeactivate() {
  if (!record.value) return;
  const updated = await deactivateUser(record.value.id);
  emitUserDeactivated(updated, sessionUser.value);
  record.value = updated;
}

async function onRoleChange(e: Event) {
  if (!record.value) return;
  const role = (e.target as HTMLSelectElement).value as Role;
  record.value = await setUserRole(record.value.id, role);
}
</script>

<template>
  <div>
    <p>
      <RouterLink to="/users">← Back to users</RouterLink>
    </p>
    <p v-if="loading">Loading…</p>
    <template v-else-if="record">
      <h2>{{ record.name }}</h2>
      <p>{{ record.email }}</p>
      <p>Role: {{ record.role }}</p>
      <p>Status: {{ record.status }}</p>
      <div v-if="isAdmin" class="detail-actions">
        <Button v-if="record.status === 'active'" @click="onDeactivate">Deactivate</Button>
        <Button v-else @click="onActivate">Activate</Button>
        <select :value="record.role" @change="onRoleChange">
          <option value="admin">admin</option>
          <option value="viewer">viewer</option>
        </select>
      </div>
    </template>
    <p v-else>User not found.</p>
  </div>
</template>

<style scoped>
.detail-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.detail-actions select {
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
</style>
