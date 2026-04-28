import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

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
    // Upload source maps to Sentry on production builds (requires SENTRY_AUTH_TOKEN)
    process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        // Automatically inject release version into the bundle
        release: {
          inject: true,
        },
      }),
  ].filter(Boolean),

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
    // "hidden" generates source maps but doesn't expose them publicly —
    // Sentry uploads them; browsers never load them
    sourcemap: "hidden",
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
