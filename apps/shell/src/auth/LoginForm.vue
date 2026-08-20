<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@advancedfrontend/ui';
import { login } from './login';

const email = ref('admin@example.com');
const password = ref('password');
const error = ref<string | null>(null);
const submitting = ref(false);

async function handleSubmit(e: Event) {
  e.preventDefault();
  error.value = null;
  submitting.value = true;
  try {
    // No onSuccess callback needed: App re-renders on its own once
    // useSession() picks up the new session.
    await login(email.value, password.value);
  } catch {
    error.value = 'Invalid email or password';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="login-screen">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h1>Backoffice</h1>
      <label>
        Email
        <input v-model="email" type="email" />
      </label>
      <label>
        Password
        <input v-model="password" type="password" />
      </label>
      <p v-if="error" class="login-error">{{ error }}</p>
      <Button type="submit" :disabled="submitting">
        {{ submitting ? 'Signing in…' : 'Sign in' }}
      </Button>
      <p class="login-hint">
        Try admin@example.com / password (admin) or viewer@example.com / password (viewer).
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--color-bg);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 320px;
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.login-form h1 {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-lg);
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.login-form input {
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: var(--font-size-base);
}

.login-error {
  margin: 0;
  color: #dc2626;
  font-size: var(--font-size-sm);
}

.login-hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
