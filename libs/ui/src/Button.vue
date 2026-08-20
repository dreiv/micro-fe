<script setup lang="ts">
defineProps<{ className?: string }>();
</script>

<template>
  <button :class="className ? `uikit-button ${className}` : 'uikit-button'" v-on="$attrs">
    <slot />
  </button>
</template>

<style scoped>
.uikit-button {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  border: none;
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-size: var(--font-size-base);
  cursor: pointer;
}

.uikit-button:hover {
  filter: brightness(0.9);
}
</style>
