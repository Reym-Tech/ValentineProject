// ============================================
// VIEW: GalleryView.jsx
// ============================================
// PURPOSE: Display photo gallery with swipe navigation
// USES: useSwipe hook for mobile gestures
// ============================================

import React from "react";
import useSwipe from "../hooks/useSwipe.js";
import { getRandomEmoji } from "../models/NaughtyMessages.js";

/**
 * GalleryView Component
 *
 * PROPS:
 * @param {Array} photos - Array of photo objects from model
 * @param {number} currentIndex - Which photo is active
 * @param {Function} onNext - Go to next photo
 * @param {Function} onPrev - Go to previous photo
 * @param {Function} onLike - Like current photo
 * @param {Function} onToggleFavorite - Toggle favorite status
 * @param {Function} onClose - Return to home
 * @param {Function} onOpenNaughty - Open naughty card view
 *
 * FEATURES:
 * - Swipe left/right to navigate
 * - Double-tap to like
 * - Click heart to like
 * - Star to favorite
 */
function GalleryView({
  photos,
  currentIndex,
  onNext,
  onPrev,
  onLike,
  onToggleFavorite,
  onClose,
  onOpenNaughty,
}) {
  // ===== VALIDATION =====
  // Prevent crashes if no photos
  if (!photos || photos.length === 0) {
    return (
      <div className="gallery-view empty">
        <h2>No photos yet! 📸</h2>
        <p>Add some photos to /src/assets/photos/</p>
        <button onClick={onClose} className="btn">
          Go Back
        </button>
      </div>
    );
  }

  // ===== CURRENT PHOTO DATA =====
  const currentPhoto = photos[currentIndex];
  const isFirstPhoto = currentIndex === 0;
  const isLastPhoto = currentIndex === photos.length - 1;

  // ===== SWIPE GESTURE HANDLERS =====
  const swipeHandlers = useSwipe(
    {
      onSwipeLeft: onNext, // Swipe left = next photo
      onSwipeRight: onPrev, // Swipe right = previous photo
      onSwipeUp: onOpenNaughty, // Swipe up = open naughty card
    },
    50,
  ); // 50px minimum swipe distance

  // ===== DOUBLE TAP TO LIKE =====
  const handleDoubleTap = () => {
    onLike(currentPhoto.id);
    // Optional: Show animation feedback
  };

  // ===== RENDER =====
  return (
    <div className="gallery-view">
      {/* HEADER */}
      <header className="gallery-header">
        <button
          onClick={onClose}
          className="btn btn-ghost"
          aria-label="Go back">
          ← Back
        </button>

        <div className="photo-counter">
          {currentIndex + 1} / {photos.length}
        </div>

        <button
          onClick={() => onToggleFavorite(currentPhoto.id)}
          className={`btn btn-ghost ${currentPhoto.isFavorite ? "active" : ""}`}
          aria-label="Toggle favorite">
          {currentPhoto.isFavorite ? "⭐" : "☆"}
        </button>
      </header>

      {/* PHOTO CONTAINER (with swipe support) */}
      <div
        className="photo-container"
        {...swipeHandlers}
        onDoubleClick={handleDoubleTap}>
        {/* Main Photo */}
        <img
          src={currentPhoto.url}
          alt={currentPhoto.caption}
          className="gallery-photo"
          loading="lazy" // Lazy load for performance
          draggable={false} // Prevent drag on desktop
        />

        {/* Photo Caption */}
        <div className="photo-caption">
          <p>{currentPhoto.caption}</p>
        </div>

        {/* Like Badge (shows if liked) */}
        {currentPhoto.likes > 0 && (
          <div className="like-badge">❤️ {currentPhoto.likes}</div>
        )}
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="gallery-controls">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={isFirstPhoto}
          className="btn btn-nav"
          aria-label="Previous photo">
          ←
        </button>

        {/* Action Buttons */}
        <div className="action-buttons">
          {/* Like Button */}
          <button
            onClick={() => onLike(currentPhoto.id)}
            className="btn btn-action btn-like"
            aria-label="Like photo">
            ❤️ Like
          </button>

          {/* Naughty Message Button */}
          <button
            onClick={onOpenNaughty}
            className="btn btn-action btn-naughty"
            aria-label="Get naughty message">
            😈 Get Naughty
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={isLastPhoto}
          className="btn btn-nav"
          aria-label="Next photo">
          →
        </button>
      </div>

      {/* HELPER TEXT */}
      <p className="swipe-hint">
        👆 Swipe left/right to navigate • Swipe up for surprise 😏
      </p>
    </div>
  );
}

// ============================================
// EXPORT
// ============================================
export default GalleryView;

/**
 * ============================================
 * LEARNING NOTES
 * ============================================
 *
 * 1. SPREAD OPERATOR FOR PROPS:
 *    <div {...swipeHandlers}>
 *    - Spreads all handler functions onto div
 *    - Equivalent to manually adding each handler
 *    - Clean way to apply multiple event listeners
 *
 * 2. DISABLED BUTTONS:
 *    disabled={isFirstPhoto}
 *    - Boolean attribute
 *    - Prevents click when true
 *    - Should be styled differently in CSS
 *
 * 3. CONDITIONAL CSS CLASSES:
 *    className={`btn ${isFavorite ? 'active' : ''}`}
 *    - Template literal for dynamic classes
 *    - Adds 'active' class when true
 *    - Remove extra spaces: .trim()
 *
 * 4. IMAGE OPTIMIZATION:
 *    loading="lazy"
 *    - Browser delays loading until near viewport
 *    - Saves bandwidth on mobile
 *    - Improves initial page load
 *
 *    draggable={false}
 *    - Prevents default image drag behavior
 *    - Better UX for gallery
 *
 * 5. ARRAY LENGTH CHECKS:
 *    if (!photos || photos.length === 0)
 *    - Always validate arrays before .map or indexing
 *    - Prevents "Cannot read property of undefined"
 *
 * 6. EARLY RETURN PATTERN:
 *    if (error) return <ErrorView />
 *    - Handle edge cases first
 *    - Main logic assumes happy path
 *    - Cleaner than nested conditions
 *
 * 7. INDEX-BASED NAVIGATION:
 *    currentIndex + 1 (for display)
 *    - Arrays are 0-indexed
 *    - Users expect 1-based counting
 *    - Convert for UI display
 *
 * 8. DOUBLE CLICK/TAP:
 *    onDoubleClick={handler}
 *    - Works on desktop & mobile
 *    - For mobile: consider custom implementation
 *    - Track time between taps
 *
 * 9. TOUCH EVENTS VS MOUSE:
 *    Mobile: touchstart, touchmove, touchend
 *    Desktop: mousedown, mousemove, mouseup
 *    Use custom hook to abstract differences
 *
 * 10. PERFORMANCE TIP:
 *     Use React.memo() for photo components
 *     Only re-render when props change
 *     Especially important for large galleries
 *
 * ============================================
 *
 * CSS CLASSES TO STYLE:
 * - .gallery-view: Main container
 * - .gallery-view.empty: Empty state
 * - .gallery-header: Top bar
 * - .photo-counter: Photo number display
 * - .photo-container: Photo wrapper
 * - .gallery-photo: Main image
 * - .photo-caption: Caption overlay
 * - .like-badge: Like counter badge
 * - .gallery-controls: Bottom controls
 * - .btn-nav: Navigation arrows
 * - .action-buttons: Middle button group
 * - .btn-action: Action button base
 * - .btn-like: Like button
 * - .btn-naughty: Naughty button
 * - .swipe-hint: Helper text
 *
 * ============================================
 */
