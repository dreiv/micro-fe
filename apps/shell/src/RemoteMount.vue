<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { loadRemote } from '@module-federation/runtime'

const props = defineProps<{ remoteName: string }>()

// Loads the remote's exposed './Root' component at runtime.
const RemoteRoot = defineAsyncComponent(async () => {
  const mod = await loadRemote<{ default: unknown }>(`${props.remoteName}/Root`)
  if (!mod) {
    throw new Error(`Remote "${props.remoteName}" did not return a module`)
  }
  // The exposed './Root' module's default export is the Vue component itself.
  return mod.default as any
})
</script>

<template>
  <component :is="RemoteRoot" v-if="RemoteRoot" />
</template>
