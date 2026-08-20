<script setup lang="ts">
import { ref, watch } from "vue";
import Button from "./Button.vue";

const props = defineProps<{ page: number; totalPages: number }>();
const emit = defineEmits<{ "update:page": [page: number] }>();

// Draft mirrors the input value so free typing works; it is clamped on
// submit/blur and re-synced whenever the page changes externally.
const draft = ref(String(props.page));

watch(
  () => props.page,
  (value) => {
    draft.value = String(value);
  },
);

function commit() {
  const parsed = Number(draft.value);
  let next = Number.isFinite(parsed) ? Math.trunc(parsed) : props.page;
  next = Math.min(Math.max(next, 1), props.totalPages);
  draft.value = String(next);
  if (next !== props.page) emit("update:page", next);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    commit();
  }
}
</script>

<template>
  <div class="pagination">
    <Button :disabled="page <= 1" @click="emit('update:page', page - 1)"> Previous </Button>
    <span>Page</span>
    <input
      type="number"
      class="pagination-input"
      :min="1"
      :max="totalPages"
      :value="draft"
      @input="draft = ($event.target as HTMLInputElement).value"
      @change="commit"
      @blur="commit"
      @keydown="onKeydown"
    />
    <span>of {{ totalPages }}</span>
    <Button :disabled="page >= totalPages" @click="emit('update:page', page + 1)"> Next </Button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
}

.pagination-input {
  width: 56px;
  padding: var(--space-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-input-bg);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  text-align: center;
}
</style>
