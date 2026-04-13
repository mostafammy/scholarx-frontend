import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use automatic JSX runtime (React 17+)
      jsxRuntime: "automatic",
      // Add babel configuration for better React 19 support
      babel: {
        plugins: [],
      },
    }),
  ],

  define: {
    "process.env": {},
  },

  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },

  // Build configuration
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },

  // Preview server configuration
  preview: {
    port: 5173,
    strictPort: false,
    host: true,
  },
});
