import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "users",
      filename: "remoteEntry.js",
      exposes: {
        "./Root": "./src/Root.vue",
      },
      shared: ["vue", "vue-router"],
    }),
  ],
  server: {
    port: 4201,
    cors: true,
  },
});
