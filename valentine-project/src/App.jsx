// ============================================
// APP.JSX - ROOT COMPONENT
// ============================================
// PURPOSE: Main application controller
// TIES TOGETHER: Models, Views, Controllers
// THIS IS WHERE MVC PATTERN COMES TOGETHER
// ============================================

import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ===== IMPORT MODELS =====
import { createInitialState } from "./models/ValentineModel.js";

// ===== IMPORT CONTROLLER =====
import ValentineController from "./controllers/ValentineController.js";

// ===== IMPORT VIEWS =====
import HomePage from "./views/HomePage.jsx";
import GalleryView from "./views/GalleryView.jsx";
import NaughtyCardView from "./views/NaughtyCardView.jsx";

// ===== IMPORT HOOKS =====
import useLocalStorage from "./hooks/useLocalStorage.js";

/**
 * App Component
 *
 * ARCHITECTURE:
 * 1. STATE (Model): Holds all application data
 * 2. CONTROLLER: Handles business logic
 * 3. VIEWS: Display UI based on state
 *
 * DATA FLOW:
 * User Action → View → Controller → Model (state) → View (re-render)
 */
function App() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  /**
   * Main App State
   * Using custom useLocalStorage hook to persist data
   * Alternative: Use regular useState if you don't want persistence
   */
  const [state, setState] = useLocalStorage(
    "valentine-app-state", // localStorage key
    createInitialState(), // Initial value from model
  );

  /**
   * Controller Instance
   * useRef: Keeps same controller instance across re-renders
   * WHY? Controller needs to maintain reference to state
   */
  const controller = useRef(null);

  // ===== INITIALIZE CONTROLLER =====
  useEffect(() => {
    // Create controller instance on mount
    controller.current = new ValentineController(state, setState);

    // Optional: Load saved state from localStorage
    // controller.current.loadFromStorage();

    console.log("🚀 Valentine App Initialized!");
  }, []); // Empty array = run once on mount

  // ===== UPDATE CONTROLLER STATE ON CHANGES =====
  useEffect(() => {
    if (controller.current) {
      controller.current.state = state;
    }
  }, [state]);

  // ============================================
  // VIEW ROUTING
  // ============================================

  /**
   * Render current view based on state.currentView
   * This is a simple router (no React Router needed for small apps)
   */
  const renderView = () => {
    switch (state.currentView) {
      case "home":
        return (
          <HomePage
            onStart={() => controller.current.navigateTo("gallery")}
            naughtyLevel={state.naughtyLevel}
            heartClicks={state.heartClicks}
          />
        );

      case "gallery":
        return (
          <GalleryView
            photos={state.photos}
            currentIndex={state.currentPhotoIndex}
            onNext={() => controller.current.changePhoto("next")}
            onPrev={() => controller.current.changePhoto("prev")}
            onLike={(photoId) => controller.current.likePhoto(photoId)}
            onToggleFavorite={(photoId) =>
              controller.current.toggleFavorite(photoId)
            }
            onClose={() => controller.current.navigateTo("home")}
            onOpenNaughty={() => controller.current.navigateTo("naughty")}
          />
        );

      case "naughty":
        return (
          <NaughtyCardView
            naughtyLevel={state.naughtyLevel}
            onClose={() => controller.current.navigateTo("gallery")}
            onIncreaseNaughty={(amount) =>
              controller.current.increaseNaughtyLevel(amount)
            }
            onHeartClick={() => controller.current.handleHeartClick()}
          />
        );

      default:
        return (
          <HomePage onStart={() => controller.current.navigateTo("gallery")} />
        );
    }
  };

  // ============================================
  // CONFETTI ANIMATION
  // ============================================

  /**
   * Show confetti when showConfetti state is true
   * Auto-hide after animation completes
   */
  useEffect(() => {
    if (state.showConfetti) {
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        controller.current.hideConfetti();
      }, 3000);

      // Cleanup: clear timeout if component unmounts
      return () => clearTimeout(timer);
    }
  }, [state.showConfetti]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="app">
      {/* MAIN CONTENT */}
      <main className="app-main">{renderView()}</main>

      {/* CONFETTI OVERLAY */}
      {state.showConfetti && (
        <div className="confetti-overlay">
          <div className="confetti">🎉</div>
          <div className="confetti">💕</div>
          <div className="confetti">✨</div>
          <div className="confetti">💖</div>
          <div className="confetti">🎉</div>
        </div>
      )}

      {/* DEBUG INFO (Remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="debug-panel">
          <h4>Debug Info:</h4>
          <p>Current View: {state.currentView}</p>
          <p>Naughty Level: {state.naughtyLevel}%</p>
          <p>Heart Clicks: {state.heartClicks}</p>
          <p>
            Photo Index: {state.currentPhotoIndex + 1}/{state.photos.length}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// EXPORT
// ============================================
export default App;

/**
 * ============================================
 * LEARNING NOTES
 * ============================================
 *
 * 1. COMPONENT LIFECYCLE:
 *    Mount → Render → Update → Unmount
 *
 *    useEffect(() => {
 *      // Mount: runs after first render
 *      return () => {
 *        // Unmount: cleanup function
 *      }
 *    }, []) // Empty deps = run once
 *
 * 2. USEREF vs USESTATE:
 *    useRef:
 *    - Persists between renders
 *    - Changing it doesn't trigger re-render
 *    - Use for: controller instance, DOM refs, timers
 *
 *    useState:
 *    - Triggers re-render on change
 *    - Use for: UI data, anything visual
 *
 * 3. CONTROLLER PATTERN:
 *    const controller = useRef(new Controller())
 *    - Single controller instance
 *    - Encapsulates all business logic
 *    - Views call controller methods
 *    - Controller updates state
 *    - State change triggers re-render
 *
 * 4. PROPS DRILLING:
 *    App → View → SubView → Component
 *    - Passing props down multiple levels
 *    - Can get messy with deep nesting
 *    - Solutions: Context API, State Management (Redux)
 *
 * 5. ROUTING (Simple):
 *    switch (currentView) { case 'home': return <Home /> }
 *    - No library needed for simple apps
 *    - For complex apps: React Router
 *
 * 6. CONDITIONAL RENDERING:
 *    {showConfetti && <Confetti />}
 *    - && operator: renders if true
 *    - Common pattern for optional elements
 *
 * 7. ENVIRONMENT VARIABLES:
 *    process.env.NODE_ENV
 *    - 'development' in dev mode
 *    - 'production' in build
 *    - Use for debug panels, logging
 *
 * 8. CLEANUP FUNCTIONS:
 *    useEffect(() => {
 *      const timer = setTimeout(...)
 *      return () => clearTimeout(timer)
 *    })
 *    - Prevents memory leaks
 *    - Clear timers, listeners, subscriptions
 *
 * 9. ARROW FUNCTIONS IN JSX:
 *    onClick={() => controller.current.method()}
 *    - Creates new function on each render
 *    - OK for small apps
 *    - Use useCallback for optimization
 *
 * 10. STATE UPDATES:
 *     setState(prevState => ({ ...prevState, newValue }))
 *     - Use functional update for derived values
 *     - Ensures you have latest state
 *     - Prevents stale closures
 *
 * ============================================
 *
 * MVC FLOW EXAMPLE:
 *
 * 1. User clicks "Like" button
 *    ↓
 * 2. View calls: onClick={() => onLike(photoId)}
 *    ↓
 * 3. App passes to: controller.likePhoto(photoId)
 *    ↓
 * 4. Controller updates: setState({ ...state, photos: updated })
 *    ↓
 * 5. State change triggers: React re-render
 *    ↓
 * 6. View receives new props and updates UI
 *
 * ============================================
 *
 * CLEAN ARCHITECTURE LAYERS:
 *
 * ┌─────────────────────────────────────┐
 * │   VIEWS (Presentation)              │
 * │   - HomePage.jsx                    │
 * │   - GalleryView.jsx                 │
 * │   - NaughtyCardView.jsx             │
 * └──────────────┬──────────────────────┘
 *                │ User Actions (Props)
 * ┌──────────────▼──────────────────────┐
 * │   CONTROLLERS (Business Logic)      │
 * │   - ValentineController.js          │
 * │   - Handles all state changes       │
 * └──────────────┬──────────────────────┘
 *                │ Updates
 * ┌──────────────▼──────────────────────┐
 * │   MODELS (Data)                     │
 * │   - ValentineModel.js               │
 * │   - NaughtyMessages.js              │
 * └─────────────────────────────────────┘
 *
 * ============================================
 */
