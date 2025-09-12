import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Performance monitoring
if (import.meta.env.DEV) {
  // Add performance monitoring in development
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "measure") {
        console.log(`${entry.name}: ${entry.duration}ms`);
      }
    }
  });
  observer.observe({ entryTypes: ["measure"] });
}

// Register service worker for caching
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Use requestIdleCallback for better performance
const root = createRoot(document.getElementById("root")!);

// Render with priority
if ("requestIdleCallback" in window) {
  requestIdleCallback(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }, 0);
}
