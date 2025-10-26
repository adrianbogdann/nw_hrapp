import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001,
    proxy: {
      '/api': {
        target: 'http://backend:3000', // backend service name in docker-compose
        changeOrigin: true,
        secure: false,
      },
    },
  },
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
