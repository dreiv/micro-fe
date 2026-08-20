<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

// A microfrontend failing to load or throwing must never take down the shell,
// sidebar, or other microfrontends (RFC §12). Vue has no built-in error
// boundary; `onErrorCaptured` is the equivalent.
const props = defineProps<{ name: string }>();
const emit = defineEmits<{ (e: "retry"): void }>();

const hasError = ref(false);

onErrorCaptured((error) => {
  console.error(`Microfrontend "${props.name}" failed to load or crashed:`, error);
  hasError.value = true;
  // false stops the error propagating up to the shell.
  return false;
});
</script>

<template>
  <div v-if="hasError" class="mf-fallback">
    <p>This section is temporarily unavailable.</p>
    <button @click="emit('retry')">Retry</button>
  </div>
  <slot v-else />
</template>

<style scoped>
.mf-fallback {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
  max-width: 420px;
}

.mf-fallback p {
  margin: 0;
}

.mf-fallback button {
  padding: 6px 14px;
  border: 1px solid #991b1b;
  border-radius: 6px;
  background: #fff;
  color: #991b1b;
  cursor: pointer;
  font-size: 13px;
}

.mf-fallback button:hover {
  background: #991b1b;
  color: #fff;
}
</style>
