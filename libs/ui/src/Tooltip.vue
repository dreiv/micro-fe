<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <span class="uikit-tooltip-wrap">
    <slot />
    <span class="uikit-tooltip" role="tooltip" aria-hidden="true">{{ label }}</span>
  </span>
</template>

<style scoped>
.uikit-tooltip-wrap {
  position: relative;
  display: inline-flex;
}

.uikit-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-header-bg);
  color: #fff;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.uikit-tooltip-wrap:hover .uikit-tooltip,
.uikit-tooltip-wrap:focus-within .uikit-tooltip {
  opacity: 1;
}
</style>
