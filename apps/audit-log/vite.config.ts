import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "auditLog",
      filename: "remoteEntry.js",
      exposes: {
        "./Root": "./src/Root.vue",
        "./mockHandlers": "./src/mocks/handlers.ts",
      },
      shared: ["vue", "vue-router"],
    }),
  ],
  server: {
    port: 4203,
    cors: true,
  },
});
