import type { AppEvents } from "./events";

// A CustomEvent on `window` only reaches listeners in the same tab's JS
// realm — two tabs never share a `window`. BroadcastChannel is the
// standard same-origin mechanism for reaching other tabs, so every emit
// goes out on both: the window event for same-tab listeners (synchronous),
// the channel for every other open tab.
//
// The channel is stored on `window` rather than as a plain module-level
// variable so it survives Hot Module Replacement in dev. A bare module-level
// `new BroadcastChannel(...)` isn't tied to any component lifecycle, so HMR
// would otherwise leave the old channel alive and create a new one alongside
// it, causing duplicate notifications. `window` itself is not reset by HMR,
// so guarding creation through it keeps this to exactly one channel per tab.
declare global {
  interface Window {
    __appEventsChannel?: BroadcastChannel;
  }
}

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") {
    return null;
  }
  if (!window.__appEventsChannel) {
    window.__appEventsChannel = new BroadcastChannel("app-events");
  }
  return window.__appEventsChannel;
}

export function emit<K extends keyof AppEvents>(type: K, detail: AppEvents[K]) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
  getChannel()?.postMessage({ type, detail });
}

export function on<K extends keyof AppEvents>(
  type: K,
  handler: (detail: AppEvents[K]) => void,
): () => void {
  const listener = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener(type, listener);

  // BroadcastChannel never delivers a message back to the tab that sent
  // it, so this can't double-fire the handler in the originating tab.
  const channel = getChannel();
  const channelListener = (e: MessageEvent<{ type: string; detail: AppEvents[K] }>) => {
    if (e.data?.type === type) {
      handler(e.data.detail);
    }
  };
  channel?.addEventListener("message", channelListener);

  return () => {
    window.removeEventListener(type, listener);
    channel?.removeEventListener("message", channelListener);
  };
}
