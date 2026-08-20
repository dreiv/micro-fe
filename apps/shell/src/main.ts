import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { registerRemotes } from "@module-federation/runtime";
import App from "./App.vue";
import { fetchManifest } from "./manifest";

async function main() {
  const manifest = await fetchManifest();

  // Register each remote from the manifest at runtime (not build-time).
  // `type: "module"` because the Vite plugin emits remoteEntry.js as an ES module.
  registerRemotes(
    manifest.microfrontends.map((mf) => ({ name: mf.name, entry: mf.entry, type: "module" })),
  );

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
