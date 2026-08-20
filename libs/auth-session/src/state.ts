import { reactive } from "vue";
import type { User } from "@advancedfrontend/contracts";

type Listener = () => void;

// Module-scope reactive state — the actual singleton. Only `internal.ts`
// may mutate it; `index.ts` only reads `user`, and never exposes `token`
// (RFC §7).
const state = reactive<{ user: User | null; token: string | null }>({
  user: null,
  token: null,
});

const listeners = new Set<Listener>();

export function getToken() {
  return state.token;
}

export function getUser() {
  return state.user;
}

export function setSession(nextToken: string | null, nextUser: User | null) {
  state.token = nextToken;
  state.user = nextUser;
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
