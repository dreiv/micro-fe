<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { loadRemote } from "@module-federation/runtime";
import MicrofrontendErrorBoundary from "./MicrofrontendErrorBoundary.vue";

const props = defineProps<{ remoteName: string }>();

// Bumping this forces a full remount of the boundary: fresh error-boundary
// state and fresh async component, so "Retry" actually retries.
const attempt = ref(0);

// One async component per remote, so component identity is stable across
// renders (a new object each render would force a remount every time).
const remoteComponentCache = new Map<string, ReturnType<typeof defineAsyncComponent>>();

function getRemoteComponent(remoteName: string) {
  let Component = remoteComponentCache.get(remoteName);
  if (!Component) {
    Component = defineAsyncComponent(async () => {
      const mod = await loadRemote<{ default: unknown }>(`${remoteName}/Root`);
      if (!mod) {
        throw new Error(`Remote "${remoteName}" did not return a module`);
      }
      return mod.default as any;
    });
    remoteComponentCache.set(remoteName, Component);
  }
  return Component;
}

function retry() {
  remoteComponentCache.delete(props.remoteName);
  // Not enough on its own: the MF runtime keeps its own global record of
  // remote-entry loads on `window.__GLOBAL_LOADING_REMOTE_ENTRY__` (keyed
  // "name:entry"), and a failed load stays cached there — loadRemote() would
  // return the same rejected promise. Internal/undocumented global, so we
  // only touch keys for the remote that's retrying.
  const globalLoading = (window as unknown as Record<string, Record<string, unknown>>)
    .__GLOBAL_LOADING_REMOTE_ENTRY__;
  if (globalLoading) {
    Object.keys(globalLoading)
      .filter((key) => key.startsWith(`${props.remoteName}:`))
      .forEach((key) => delete globalLoading[key]);
  }
  attempt.value += 1;
}
</script>

<template>
  <MicrofrontendErrorBoundary :key="`${remoteName}-${attempt}`" :name="remoteName" @retry="retry">
    <component :is="getRemoteComponent(remoteName)" />
  </MicrofrontendErrorBoundary>
</template>
