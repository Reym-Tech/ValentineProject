// ============================================
// VIEW: HomePage.jsx
// ============================================
// PURPOSE: Landing page - first thing your girlfriend sees
// RESPONSIBILITY: Display ONLY (no business logic)
// ============================================

import React from "react";
import { getRandomMessage } from "../models/NaughtyMessages.js";

/**
 * HomePage Component
 *
 * PROPS:
 * @param {Function} onStart - Callback when "Start" button clicked
 * @param {number} naughtyLevel - Current playfulness level
 * @param {number} heartClicks - Total heart clicks
 *
 * VIEW PRINCIPLES:
 * - Receives data via props (doesn't manage its own state)
 * - Calls callbacks for user actions (doesn't handle logic)
 * - Pure presentation - focuses on WHAT to show, not HOW to update
 */
function HomePage({ onStart, naughtyLevel = 0, heartClicks = 0 }) {
  // ===== DERIVED DATA (LOCAL CALCULATIONS) =====
  // It's OK to compute display values from props
  const message = getRandomMessage([
    "Ready for some naughty fun? 😈",
    "Let's make this Valentine's special 💕",
    "I made something playful for you 😏",
    "Click if you're ready to get spicy 🌶️",
  ]);

  // ===== RENDER =====
  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <div className="hero">
        {/* Animated Heart Icon */}
        <div className="heart-container">
          <span className="heart-icon" role="img" aria-label="heart">
            💕
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="title">
          Happy Valentine's Day,
          <br />
          <span className="highlight">Beautiful</span> 💖
        </h1>

        {/* Playful Message */}
        <p className="subtitle">{message}</p>

        {/* Stats Display (if user has been here before) */}
        {heartClicks > 0 && (
          <div className="stats">
            <span className="stat-item">❤️ {heartClicks} heart clicks</span>
            <span className="stat-item">🔥 {naughtyLevel}% naughty</span>
          </div>
        )}
      </div>

      {/* CALL TO ACTION */}
      <div className="cta-section">
        <button
          className="btn btn-primary pulse"
          onClick={onStart}
          aria-label="Start Valentine experience">
          Let's Get Started 😏
        </button>

        {/* Secondary Message */}
        <p className="hint">Tap to see what I made for you...</p>
      </div>

      {/* DECORATIVE ELEMENTS */}
      <div className="floating-hearts" aria-hidden="true">
        <span className="floating-heart">💕</span>
        <span className="floating-heart">💖</span>
        <span className="floating-heart">💗</span>
      </div>
    </div>
  );
}

// ============================================
// EXPORT
// ============================================
export default HomePage;

/**
 * ============================================
 * COMPONENT DESIGN NOTES
 * ============================================
 *
 * 1. PROPS DESTRUCTURING:
 *    function HomePage({ onStart, naughtyLevel })
 *    - Cleaner than: function HomePage(props)
 *    - Direct access: onStart vs props.onStart
 *
 * 2. DEFAULT PROPS:
 *    { naughtyLevel = 0 }
 *    - Fallback if prop not provided
 *    - Prevents undefined errors
 *
 * 3. CONDITIONAL RENDERING:
 *    {heartClicks > 0 && <div>...</div>}
 *    - && operator: only renders if condition true
 *    - Alternative: heartClicks > 0 ? <div/> : null
 *
 * 4. EVENT HANDLERS:
 *    onClick={onStart}
 *    - Pass function reference (no parentheses!)
 *    - onClick={onStart()} would call immediately
 *    - onClick={() => onStart()} if you need args
 *
 * 5. ACCESSIBILITY:
 *    - role="img": Tells screen readers it's an image
 *    - aria-label: Describes element for screen readers
 *    - aria-hidden="true": Hides decorative elements
 *
 * 6. SEMANTIC HTML:
 *    <button> for actions (not <div onClick>)
 *    <h1> for main heading (one per page)
 *    Proper heading hierarchy (h1 → h2 → h3)
 *
 * 7. CSS CLASSES:
 *    className (not class in React)
 *    Multiple classes: className="btn btn-primary"
 *    Dynamic: className={`btn ${isPrimary ? 'btn-primary' : ''}`}
 *
 * ============================================
 *
 * CSS CLASSES USED (to be styled in App.css):
 * - .home-page: Main container
 * - .hero: Top section wrapper
 * - .heart-container: Animated heart holder
 * - .heart-icon: Heart emoji
 * - .title: Main heading
 * - .highlight: Highlighted text
 * - .subtitle: Secondary text
 * - .stats: Stats display container
 * - .stat-item: Individual stat
 * - .cta-section: Call-to-action area
 * - .btn: Base button style
 * - .btn-primary: Primary button variant
 * - .pulse: Animation class
 * - .hint: Helper text
 * - .floating-hearts: Background decoration
 * - .floating-heart: Individual floating heart
 *
 * ============================================
 */
