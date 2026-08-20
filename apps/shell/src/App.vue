<script setup lang="ts">
import { inject } from "vue";
import { RouterLink, RouterView } from "vue-router";
import type { Manifest } from "./manifest";

const manifest = inject<Manifest>("manifest")!;
</script>

<template>
  <div class="app">
    <header class="header">
      <span class="logo">Backoffice</span>
    </header>
    <div class="body">
      <aside class="sidebar">
        <RouterLink v-for="mf in manifest.microfrontends" :key="mf.name" :to="mf.route" class="sidebar-link">
          {{ mf.navLabel }}
        </RouterLink>
      </aside>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;
  background: #f5f6f8;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  height: 56px;
  background: #1f2937;
  color: #fff;
}

.logo {
  font-weight: 700;
  font-size: 18px;
}

.body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
}

.sidebar-link:hover {
  background: #f3f4f6;
}

.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>
