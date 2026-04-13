import "./instrument"; // Sentry — MUST be first import
import React from 'react';
import ReactDOM from 'react-dom/client';
import { reactErrorHandler } from '@sentry/react';
import { Provider } from 'react-redux';
import store from './store/index.js';
import App from './App';
import './index.css';
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById('root'), {
  // React 19 — forward all error categories to Sentry
  onUncaughtError: reactErrorHandler(),
  onCaughtError: reactErrorHandler(),
  onRecoverableError: reactErrorHandler(),
}).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
