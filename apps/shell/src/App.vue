<script setup lang="ts">
import { inject } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useSession } from "@advancedfrontend/auth-session";
import { logout } from "./auth/login";
import LoginForm from "./auth/LoginForm.vue";
import NotificationCenter from "./NotificationCenter.vue";
import type { Manifest } from "./manifest";

const manifest = inject<Manifest>("manifest")!;
const { user, isAuthenticated } = useSession();
</script>

<template>
  <LoginForm v-if="!isAuthenticated" />
  <div v-else class="app">
    <header class="header">
      <span class="logo">Backoffice</span>
      <span class="env-badge">local</span>
      <span class="spacer" />
      <NotificationCenter />
      <span class="profile">{{ user?.name }}</span>
      <button class="logout-link" @click="logout">Log out</button>
    </header>
    <div class="body">
      <aside class="sidebar">
        <RouterLink v-for="mf in manifest.microfrontends" :key="mf.name" :to="mf.route" class="sidebar-link"
          active-class="sidebar-link--active">
          {{ mf.navLabel }}
        </RouterLink>
      </aside>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* Global reset — must NOT be scoped: `body`/`*` live outside this component,
   so a scoped selector would never match. */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;
  background: #f5f6f8;
}

/* Not scoped: the h1s live in remote components. */
.content h1 {
  margin-top: 0;
}
</style>

<style scoped>
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

.spacer {
  flex: 1;
}

.profile {
  font-size: 14px;
  color: #d1d5db;
}

.logout-link {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
  padding: 0;
}

.logout-link:hover {
  color: #fff;
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
  padding: 16px;
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

.sidebar-link--active {
  background: #e5e7eb;
  font-weight: 600;
}

.content {
  flex: 1;
  padding: 32px;
  overflow: auto;
}

.env-badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #374151;
  color: #9ca3af;
}
</style>
