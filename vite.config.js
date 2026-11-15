import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": { target: "https://auth-backend-lb6o.onrender.com", changeOrigin: true },
      "/api":  { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});
