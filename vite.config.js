import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.includes("react-router-dom") || id.includes("react/")) return "react";
          if (id.includes("framer-motion")) return "animation";
          if (id.includes("react-hook-form")) return "forms";
          if (id.includes("axios")) return "http";
          if (id.includes("lucide-react") || id.includes("react-hot-toast") || id.includes("react-helmet-async")) return "ui";
        },
      },
    },
  },
});
