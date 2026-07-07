import { defineConfig } from "vite";

function asyncStylesheetPlugin() {
  return {
    name: "async-stylesheet-delivery",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
        "<link rel=\"preload\" as=\"style\" crossorigin href=\"$1\" onload=\"this.onload=null;this.rel='stylesheet'\"><noscript><link rel=\"stylesheet\" crossorigin href=\"$1\"></noscript>"
      );
    },
  };
}

export default defineConfig({
  plugins: [asyncStylesheetPlugin()],
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
