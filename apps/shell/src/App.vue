<script setup lang="ts">
import { inject } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useSession } from "@advancedfrontend/auth-session";
import { logout } from "./auth/login";
import LoginForm from "./auth/LoginForm.vue";
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
      <span class="profile">{{ user?.name }}</span>
      <button class="logout-link" @click="logout">Log out</button>
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

.spacer {
  flex: 1;
}

.profile {
  font-size: 14px;
}

.logout-link {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
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
