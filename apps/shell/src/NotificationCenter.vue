<script setup lang="ts">
import { ref } from "vue";
import { on } from "@advancedfrontend/contracts";

type Notification = { id: string; message: string };

const notifications = ref<Notification[]>([]);
const open = ref(false);

on("user:deactivated", ({ userName, by }) => {
  notifications.value = [
    { id: `${Date.now()}`, message: `User ${userName} was deactivated by ${by}` },
    ...notifications.value,
  ];
});
</script>

<template>
  <div class="notification-center">
    <button class="notification-bell" @click="open = !open">
      🔔
      <span v-if="notifications.length > 0" class="notification-badge">
        {{ notifications.length }}
      </span>
    </button>
    <div v-if="open" class="notification-list">
      <p v-if="notifications.length === 0" class="notification-empty">No notifications yet.</p>
      <p v-for="n in notifications" :key="n.id" class="notification-item">
        {{ n.message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.notification-center {
  position: relative;
}

.notification-bell {
  position: relative;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--color-header-text-muted);
  padding: 4px;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--color-danger);
  color: #fff;
  font-size: 10px;
  line-height: 1;
  border-radius: 999px;
  padding: 2px 5px;
}

.notification-list {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 280px;
  max-height: 300px;
  overflow: auto;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.notification-item {
  margin: 0;
  padding: 10px 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--color-border);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-empty {
  margin: 0;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
