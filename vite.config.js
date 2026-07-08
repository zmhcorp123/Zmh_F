import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  esbuild: {
    jsx: "automatic",
    legalComments: "none",
  },
  build: {
    cssCodeSplit: true,
    minify: "esbuild",
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 2048,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      treeshake: true,
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || /node_modules[/\\]react[/\\]/.test(id)) return "react";
          if (id.includes("react-router-dom") || id.includes("@remix-run") || id.includes("node_modules/react-router/")) return "router";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("react-helmet-async")) return "seo";
          return "vendor";
        },
      },
    },
  },
});
