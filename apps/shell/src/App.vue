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
      <span class="spacer" />
      <div class="header-right">
        <NotificationCenter />
        <span class="profile">{{ user?.name }}</span>
        <button class="logout-link" @click="logout">Log out</button>
      </div>
    </header>
    <div class="body">
      <aside class="sidebar">
        <RouterLink
          v-for="mf in manifest.microfrontends"
          :key="mf.name"
          :to="mf.route"
          class="sidebar-link"
          active-class="sidebar-link--active"
        >
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
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
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
  background: var(--color-header-bg);
  color: var(--color-header-text);
}

.logo {
  font-weight: 700;
  font-size: 18px;
}

.spacer {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile {
  font-size: 14px;
  color: var(--color-header-text-muted);
}

.logout-link {
  background: none;
  border: none;
  color: var(--color-header-text-muted);
  cursor: pointer;
  font-size: 13px;
  text-decoration: underline;
  padding: 0;
}

.logout-link:hover {
  color: var(--color-header-text);
}

.body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  width: 200px;
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-sidebar-border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--color-sidebar-link);
  text-decoration: none;
  font-size: 14px;
}

.sidebar-link:hover {
  background: var(--color-sidebar-link-hover-bg);
}

.sidebar-link--active {
  background: var(--color-sidebar-link-active-bg);
  font-weight: 600;
}

.content {
  flex: 1;
  padding: 32px;
  overflow: auto;
}
</style>
