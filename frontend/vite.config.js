import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 개발 시 API 요청을 백엔드로 프록시 (CORS 우회)
      "/api": "http://localhost:4000",
      "/stream": "http://localhost:4000",
      "/qr": "http://localhost:4000",
    },
  },
});
