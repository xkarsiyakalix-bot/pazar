import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import "./index.css";
import App from "./App.js";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';

import ErrorBoundary from './ErrorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <App />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// Unregister service worker to prevent reload loops in development
serviceWorkerRegistration.unregister();
