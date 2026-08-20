<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { loadRemote } from "@module-federation/runtime";
import MicrofrontendErrorBoundary from "./MicrofrontendErrorBoundary.vue";

const props = defineProps<{ remoteName: string }>();

// Bumping this forces a full remount of the boundary below: a fresh
// error-boundary state and a fresh async component, so "Retry" actually
// retries instead of replaying the same failed promise.
const attempt = ref(0);

// Cache one async component per remote so the component identity is stable
// across renders (a new object each render would force a remount every time).
const remoteComponentCache = new Map<string, ReturnType<typeof defineAsyncComponent>>();

function getRemoteComponent(remoteName: string) {
  let Component = remoteComponentCache.get(remoteName);
  if (!Component) {
    Component = defineAsyncComponent(async () => {
      const mod = await loadRemote<{ default: unknown }>(`${remoteName}/Root`);
      if (!mod) {
        throw new Error(`Remote "${remoteName}" did not return a module`);
      }
      // The exposed './Root' module's default export is the Vue component itself.
      return mod.default as any;
    });
    remoteComponentCache.set(remoteName, Component);
  }
  return Component;
}

function retry() {
  // Drop our own cached async component so a fresh one (and a fresh load
  // promise) is created on remount.
  remoteComponentCache.delete(props.remoteName);
  // Clearing our own cache and remounting isn't enough on its own: Module
  // Federation's runtime keeps its own separate, global record of remote-entry
  // loads on `window.__GLOBAL_LOADING_REMOTE_ENTRY__` (keyed "name:entry"),
  // and a failed load stays cached there — loadRemote() would just return the
  // same rejected promise again without this. It's an internal/undocumented
  // global, not part of the public API, so we only touch keys for the one
  // remote that's retrying.
  const globalLoading = (window as unknown as Record<string, Record<string, unknown>>).__GLOBAL_LOADING_REMOTE_ENTRY__;
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
