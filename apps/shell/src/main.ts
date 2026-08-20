import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { registerRemotes, loadRemote } from "@module-federation/runtime";
import type { RequestHandler } from "msw";
import App from "./App.vue";
import { fetchManifest } from "./manifest";
import { restoreSession } from "./auth/login";
import { createWorker } from "./mocks/browser";
import "@advancedfrontend/ui/tokens.css";

async function main() {
  const manifest = await fetchManifest();

  // `type: "module"` — the Vite plugin emits remoteEntry.js as an ES module.
  registerRemotes(
    manifest.microfrontends.map((mf) => ({ name: mf.name, entry: mf.entry, type: "module" })),
  );

  // Each microfrontend exposes its mock handlers like its screen, so the
  // shell combines them into one backend. allSettled: one broken entry only
  // loses that microfrontend's handlers, not the shell's boot.
  const remoteHandlerResults = await Promise.allSettled(
    manifest.microfrontends.map(async (mf) => {
      const mod = await loadRemote<{ handlers: RequestHandler[] }>(`${mf.name}/mockHandlers`);
      return mod?.handlers ?? [];
    }),
  );
  const remoteHandlerLists = remoteHandlerResults.map((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `Failed to load mock handlers for "${manifest.microfrontends[i].name}":`,
        result.reason,
      );
      return [];
    }
    return result.value;
  });

  const worker = createWorker(remoteHandlerLists.flat());
  await worker.start({ onUnhandledRequest: "bypass" });

  // Re-issue a token so the session survives a real page reload (the token
  // itself never touches storage).
  await restoreSession();

  const routes = [
    { path: "/", component: () => import("./Home.vue") },
    ...manifest.microfrontends.map((mf) => ({
      path: `${mf.route}/:pathMatch(.*)*`,
      component: () => import("./RemoteMount.vue"),
      props: { remoteName: mf.name },
    })),
  ];

  const router = createRouter({ history: createWebHistory(), routes });
  const app = createApp(App);
  app.provide("manifest", manifest);
  app.use(router);
  app.mount("#app");
}

main();
