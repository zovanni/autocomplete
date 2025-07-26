import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    proxy: {
      "/api/wikipedia": {
        target: "https://en.wikipedia.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wikipedia/, ""),
        secure: true,
      },
    },
  },
});
