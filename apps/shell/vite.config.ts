import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "shell",
      shared: ["vue", "vue-router"],
    }),
  ],
  server: {
    port: 4200,
    cors: true,
  },
});
