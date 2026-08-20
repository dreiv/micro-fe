import type { AppEvents } from "./events";

// A CustomEvent on `window` only reaches same-tab listeners — two tabs never
// share a `window`. BroadcastChannel reaches other tabs, so every emit goes
// out on both: the window event (synchronous, same tab) and the channel
// (every other open tab).
//
// The channel is stored on `window` so it survives HMR in dev: a bare
// module-level `new BroadcastChannel(...)` would leave the old channel alive
// and create a new one alongside it, causing duplicate notifications.
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

  // BroadcastChannel never delivers back to the sending tab, so no
  // double-fire in the originating tab.
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
