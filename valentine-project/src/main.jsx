// ============================================
// MAIN.JSX - APPLICATION ENTRY POINT
// ============================================
// PURPOSE: Connects React to the DOM
// THIS IS WHERE EVERYTHING STARTS
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/**
 * REACT RENDERING PROCESS:
 *
 * 1. Find the root DOM element (defined in index.html)
 *    - <div id="root"></div>
 *
 * 2. Create a React root
 *    - ReactDOM.createRoot() is React 18's new API
 *    - Enables concurrent features (automatic batching, transitions, etc.)
 *
 * 3. Render the App component into the root
 *    - React takes over this DOM node
 *    - All React components render inside here
 */

// ===== GET ROOT DOM ELEMENT =====
// document.getElementById finds the element with id="root"
const rootElement = document.getElementById("root");

// ===== ERROR HANDLING =====
// Safety check: ensure root element exists
if (!rootElement) {
  throw new Error(
    "Failed to find the root element. " +
      'Make sure index.html has <div id="root"></div>',
  );
}

// ===== CREATE REACT ROOT =====
// createRoot is React 18+ API for concurrent rendering
const root = ReactDOM.createRoot(rootElement);

// ===== RENDER APP =====
root.render(
  // StrictMode: Development helper that catches bugs
  // - Checks for unsafe lifecycles
  // - Warns about legacy APIs
  // - Detects unexpected side effects
  // NOTE: Renders components twice in dev mode (intentional!)
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

/**
 * ============================================
 * LEARNING NOTES
 * ============================================
 *
 * 1. REACT 18 vs REACT 17:
 *    React 17:
 *    ReactDOM.render(<App />, document.getElementById('root'))
 *
 *    React 18:
 *    const root = ReactDOM.createRoot(...)
 *    root.render(<App />)
 *
 *    WHY? Enables concurrent features
 *
 * 2. STRICT MODE:
 *    In DEVELOPMENT:
 *    - Renders components twice (detect side effects)
 *    - Warns about deprecated APIs
 *    - Helps catch bugs early
 *
 *    In PRODUCTION:
 *    - Does nothing (zero overhead)
 *    - Can safely leave it on
 *
 * 3. JSX IN JAVASCRIPT:
 *    <App /> looks like HTML but it's JavaScript
 *    - Babel transpiles JSX to React.createElement() calls
 *    - Browser only sees vanilla JavaScript
 *
 * 4. MOUNTING PROCESS:
 *    1. ReactDOM.createRoot() creates virtual DOM tree
 *    2. root.render() triggers reconciliation
 *    3. React calculates what DOM changes needed
 *    4. React updates actual DOM (efficiently!)
 *
 * 5. SINGLE ROOT CONCEPT:
 *    - One React app = one root element
 *    - Everything rendered inside this root
 *    - Multiple roots possible (micro-frontends)
 *
 * 6. ERROR BOUNDARIES:
 *    If App throws error during render:
 *    - Development: Shows error overlay
 *    - Production: White screen (bad UX)
 *    - Solution: Wrap App in ErrorBoundary component
 *
 * 7. HYDRATION vs RENDER:
 *    render(): Fresh render (what we use)
 *    hydrate(): Attach to server-rendered HTML
 *    Used in Next.js, Gatsby (SSR)
 *
 * ============================================
 *
 * FILE RELATIONSHIP:
 *
 * index.html (HTML file)
 *   ↓ contains
 * <div id="root"></div>
 *   ↓ found by
 * document.getElementById('root')
 *   ↓ used by
 * ReactDOM.createRoot(rootElement)
 *   ↓ renders
 * <App />
 *   ↓ which contains
 * All your components!
 *
 * ============================================
 *
 * VITE HOT MODULE REPLACEMENT (HMR):
 * When you save a file:
 * 1. Vite detects change
 * 2. Sends update to browser via WebSocket
 * 3. React Fast Refresh updates component
 * 4. State preserved (no full page reload!)
 *
 * This is MUCH faster than traditional bundlers
 *
 * ============================================
 */
