import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4200,
    cors: true,
  },
});
