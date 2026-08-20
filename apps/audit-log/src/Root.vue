<script setup lang="ts">
import { useAuditEntries } from "./store";

// No imports of other microfrontends — we only listen on the shared event bus
// (registered at module scope in ./store).
const entries = useAuditEntries();
</script>

<template>
  <div>
    <h1>Audit Log</h1>
    <p v-if="entries.length === 0" class="empty">
      No events yet. Deactivate a user in Users to see one appear here.
    </p>
    <ul v-else class="list">
      <li v-for="entry in entries" :key="entry.id" class="item">
        <span class="time">{{ entry.at }}</span> {{ entry.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.empty {
  color: #6b7280;
  font-size: 14px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
}

.time {
  color: #6b7280;
  font-size: 12px;
  margin-right: 8px;
}
</style>
