import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import "./index.css";
import App from "./App.js";
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

import ErrorBoundary from './ErrorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Force clear any existing service workers and caches (Aggressive cleanup)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

if ('caches' in window) {
  caches.keys().then((names) => {
    for (let name of names) caches.delete(name);
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// Unregister service worker to prevent reload loops in development
serviceWorkerRegistration.unregister();
