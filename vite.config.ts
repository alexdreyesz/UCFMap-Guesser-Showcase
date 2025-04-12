import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  root: "./frontend", // Set the root directory for Vite
  plugins: [react()],
  build: {
    outDir: "../dist/frontend",
  },
  server: {
    allowedHosts: ["ucfmap.evanpartidas.com"],
  },
});
