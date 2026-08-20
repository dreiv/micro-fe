import { computed, onScopeDispose, ref } from "vue";
import { getUser, getToken, subscribe } from "./state";

// Read-only API. This entry is what gets shared with microfrontends —
// there is no export here that can reach the token (RFC §7).
export function useSession() {
  const user = ref(getUser());
  const unsubscribe = subscribe(() => {
    user.value = getUser();
  });
  onScopeDispose(unsubscribe);
  return { user, isAuthenticated: computed(() => user.value !== null) };
}

export const session = {
  getUser,
  subscribe,
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request(path: string, options: RequestOptions = {}) {
  const token = getToken();
  const res = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }
  return res.json();
}

// Defined here (not in the shell or a microfrontend) so it can read the
// private `token` variable directly, per RFC §7. Team code calls these
// without ever seeing the token itself — the client attaches it.
export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) => request(path, { method: "POST", body }),
};
