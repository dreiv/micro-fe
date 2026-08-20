import { reactive } from "vue";
import type { User } from "@advancedfrontend/contracts";

type Listener = () => void;

type SessionState = { user: User | null; token: string | null };

// Must be a true singleton across shell and every microfrontend. Each
// microfrontend bundles its own copy of this lib (MF can't share a workspace
// source package), so state and listeners are backed by a window global —
// same pattern as the event bus — so all copies read/write the same reactive
// object. `vue` is shared, so one reactive proxy works across every copy.
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
