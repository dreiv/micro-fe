import { reactive } from "vue";
import type { User } from "@advancedfrontend/contracts";

type Listener = () => void;

type SessionState = { user: User | null; token: string | null };

// The session must be a true singleton shared across the shell and every
// microfrontend. Each microfrontend bundles its own copy of this lib (Module
// Federation can't share a workspace source package), so we back the state
// and listener set with a window global — the same pattern the event bus
// uses — meaning all copies read/write the same reactive object. `vue` is
// shared, so the reactive proxy is created by one Vue instance and works
// across every copy.
type GlobalSession = { state: SessionState; listeners: Set<Listener> };

function getGlobal(): GlobalSession {
  const w = window as unknown as { __appSession__?: GlobalSession };
  if (!w.__appSession__) {
    w.__appSession__ = {
      state: reactive<SessionState>({ user: null, token: null }),
      listeners: new Set<Listener>(),
    };
  }
  return w.__appSession__;
}

export function getToken() {
  return getGlobal().state.token;
}

export function getUser() {
  return getGlobal().state.user;
}

export function setSession(nextToken: string | null, nextUser: User | null) {
  const g = getGlobal();
  g.state.token = nextToken;
  g.state.user = nextUser;
  g.listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  const g = getGlobal();
  g.listeners.add(listener);
  return () => {
    g.listeners.delete(listener);
  };
}
