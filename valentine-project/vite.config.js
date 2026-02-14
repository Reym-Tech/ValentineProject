import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE CONFIG
// Purpose: Configure how Vite bundles and serves your application
// Vite is a modern build tool that's FAST (uses native ES modules)
export default defineConfig({
  plugins: [react()], // Enables React Fast Refresh (hot reload without losing state)

  // Base path for deployment (change if hosting in subfolder)
  base: "./",

  // Server configuration for development
  server: {
    port: 3000, // Dev server runs on localhost:3000
    host: '0.0.0.0',
    open: true, // Auto-opens browser when you run 'npm run dev'
  },

  // Build optimization
  build: {
    outDir: "dist", // Output folder for production build
    sourcemap: true, // Generates source maps for debugging
    minify: "terser", // Minifies JS for smaller file size
  },
});
