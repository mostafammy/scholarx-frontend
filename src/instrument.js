/**
 * @fileoverview instrument.js — Sentry initialization sidecar.
 * MUST be imported as the very first import in src/main.jsx.
 * Initializes before any React or app code runs.
 *
 * Features enabled:
 *   ✅ Error Monitoring
 *   ✅ Tracing (page load + React Router v7 navigation)
 *   ✅ Session Replay
 *   ✅ Structured Logging (Sentry.logger.*)
 *   ✅ Redux action breadcrumbs (via store/index.js enhancer)
 */

import * as Sentry from "@sentry/react";
import React from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,

  // Link errors to releases; set VITE_APP_VERSION at build time (e.g. git SHA)
  release: import.meta.env.VITE_APP_VERSION,

  // Include IP addresses and default PII in events
  sendDefaultPii: true,

  integrations: [
    // Tracing: page load spans + React Router v7 navigation spans (BrowserRouter variant)
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),

    // Session Replay: mask all text/media by default for privacy
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Tracing sample rates — lower tracesSampleRate to 0.1–0.2 in production
  tracesSampleRate: import.meta.env.MODE === "production" ? 0.2 : 1.0,

  // Propagate distributed tracing headers to your API
  tracePropagationTargets: [
    "localhost",
    /^https?:\/\/localhost/,
    /^https:\/\/api\.scholarx\.io/,
  ],

  // Session Replay sample rates
  replaysSessionSampleRate: 0.1,   // Record 10% of all sessions
  replaysOnErrorSampleRate: 1.0,   // Always record sessions that include an error

  // Enable Sentry.logger.* structured logging
  enableLogs: true,
});
