
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Remove the componentTagger plugin since it's causing compatibility issues
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['framer-motion', 'canvas-confetti']
  },
  server: {
    host: "::",
    port: 8080,
  }
}));
