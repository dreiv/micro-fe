<script setup lang="ts">
// Step 1: static frame only. No routing, no Module Federation yet.
</script>

<template>
  <div class="app">
    <header class="header">
      <span class="logo">Backoffice</span>
    </header>
    <div class="body">
      <aside class="sidebar"></aside>
      <main class="content">
        <p>Backoffice</p>
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
}

.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>
