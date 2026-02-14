// ============================================
// CUSTOM HOOK: useSwipe.js
// ============================================
// PURPOSE: Detect swipe gestures on mobile/touch devices
// USE CASE: Photo gallery navigation, card swiping
// ============================================

import { useState, useEffect, useRef } from "react";

/**
 * useSwipe Hook
 * Detects left/right/up/down swipe gestures
 *
 * HOW IT WORKS:
 * 1. Track touchStart position
 * 2. Calculate distance on touchEnd
 * 3. Determine swipe direction if distance > threshold
 *
 * @param {Object} callbacks - {onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown}
 * @param {number} minSwipeDistance - Minimum pixels to register swipe (default: 50)
 * @returns {Object} - Touch event handlers to attach to element
 *
 * USAGE:
 * const swipeHandlers = useSwipe({
 *   onSwipeLeft: () => console.log('Swiped left!'),
 *   onSwipeRight: () => console.log('Swiped right!')
 * });
 *
 * return <div {...swipeHandlers}>Swipe me!</div>
 */
function useSwipe(callbacks = {}, minSwipeDistance = 50) {
  // ===== REFS TO TRACK TOUCH POSITIONS =====
  // useRef: Persists value between renders WITHOUT causing re-render
  // Perfect for storing mutable values that don't affect UI
  const touchStartX = useRef(0); // X coordinate where touch started
  const touchStartY = useRef(0); // Y coordinate where touch started
  const touchEndX = useRef(0); // X coordinate where touch ended
  const touchEndY = useRef(0); // Y coordinate where touch ended

  /**
   * Handle Touch Start
   * Records initial touch position
   */
  const handleTouchStart = (e) => {
    // e.touches[0] = first finger touching screen
    // changedTouches for touchend (touches array is empty there)
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  /**
   * Handle Touch Move (optional tracking)
   * You can use this to show visual feedback during swipe
   */
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    // Optional: Prevent default scrolling during swipe
    // e.preventDefault(); // Uncomment if needed
  };

  /**
   * Handle Touch End
   * Calculate swipe distance and direction
   */
  const handleTouchEnd = (e) => {
    // Get final position from last changed touch
    touchEndX.current = e.changedTouches[0].clientX;
    touchEndY.current = e.changedTouches[0].clientY;

    // Calculate distances
    const deltaX = touchEndX.current - touchStartX.current; // Negative = left, Positive = right
    const deltaY = touchEndY.current - touchStartY.current; // Negative = up, Positive = down

    // Absolute values for comparison
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // ===== DETERMINE SWIPE DIRECTION =====
    // Check if swipe is primarily horizontal or vertical
    if (absDeltaX > absDeltaY) {
      // HORIZONTAL SWIPE
      if (absDeltaX > minSwipeDistance) {
        if (deltaX > 0) {
          // Swiped RIGHT
          callbacks.onSwipeRight?.();
        } else {
          // Swiped LEFT
          callbacks.onSwipeLeft?.();
        }
      }
    } else {
      // VERTICAL SWIPE
      if (absDeltaY > minSwipeDistance) {
        if (deltaY > 0) {
          // Swiped DOWN
          callbacks.onSwipeDown?.();
        } else {
          // Swiped UP
          callbacks.onSwipeUp?.();
        }
      }
    }
  };

  // ===== RETURN EVENT HANDLERS =====
  // Spread these onto your element: <div {...swipeHandlers}>
  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// ============================================
// ADVANCED: Mouse Swipe Support (Desktop)
// ============================================

/**
 * useSwipeWithMouse Hook
 * Supports both touch AND mouse drag
 * Great for desktop testing
 */
export function useSwipeWithMouse(callbacks = {}, minSwipeDistance = 50) {
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);

  // ===== MOUSE HANDLERS =====
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    // Optional: Show drag feedback here
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const deltaX = e.clientX - startX.current;
    const deltaY = e.clientY - startY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      deltaX > 0 ? callbacks.onSwipeRight?.() : callbacks.onSwipeLeft?.();
    } else if (absDeltaY > minSwipeDistance) {
      deltaY > 0 ? callbacks.onSwipeDown?.() : callbacks.onSwipeUp?.();
    }
  };

  // ===== TOUCH HANDLERS =====
  const touchHandlers = useSwipe(callbacks, minSwipeDistance);

  // ===== RETURN COMBINED HANDLERS =====
  return {
    ...touchHandlers,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  };
}

// ============================================
// UTILITY: Swipe with Velocity Detection
// ============================================

/**
 * useSwipeVelocity Hook
 * Detects fast vs slow swipes
 * Useful for different actions based on swipe speed
 */
export function useSwipeVelocity(callbacks = {}, minSwipeDistance = 50) {
  const startTime = useRef(0);
  const touchHandlers = useSwipe(callbacks, minSwipeDistance);

  const handleTouchStartWithTime = (e) => {
    startTime.current = Date.now();
    touchHandlers.onTouchStart(e);
  };

  const handleTouchEndWithVelocity = (e) => {
    const endTime = Date.now();
    const duration = endTime - startTime.current;
    const velocity = minSwipeDistance / duration; // pixels per millisecond

    // Pass velocity to callbacks if they support it
    if (callbacks.onSwipe) {
      callbacks.onSwipe({ velocity, duration });
    }

    touchHandlers.onTouchEnd(e);
  };

  return {
    ...touchHandlers,
    onTouchStart: handleTouchStartWithTime,
    onTouchEnd: handleTouchEndWithVelocity,
  };
}

// ============================================
// EXPORT
// ============================================
export default useSwipe;

/**
 * ============================================
 * LEARNING NOTES
 * ============================================
 *
 * 1. TOUCH EVENTS:
 *    - touchstart: Finger touches screen
 *    - touchmove: Finger moves while touching
 *    - touchend: Finger lifts off
 *    - touches: Array of all current touches
 *    - changedTouches: Array of touches that changed
 *
 * 2. TOUCH EVENT PROPERTIES:
 *    e.touches[0].clientX: X position in viewport
 *    e.touches[0].clientY: Y position in viewport
 *    e.touches[0].pageX: X position in document
 *    e.touches[0].screenX: X position on screen
 *
 * 3. USEREF VS USESTATE:
 *    useRef:
 *    - Mutable value that persists
 *    - Changing it doesn't cause re-render
 *    - Access via .current property
 *    - Perfect for: DOM refs, timers, tracking values
 *
 *    useState:
 *    - Immutable state
 *    - Changing it triggers re-render
 *    - Use for: UI data, anything that affects display
 *
 * 4. OPTIONAL CHAINING (?.):
 *    callbacks.onSwipeLeft?.()
 *    - Only calls function if it exists
 *    - Prevents "undefined is not a function" errors
 *    - Same as: callbacks.onSwipeLeft && callbacks.onSwipeLeft()
 *
 * 5. SPREAD OPERATOR (...):
 *    <div {...swipeHandlers}>
 *    - Spreads all properties onto element
 *    - Same as: onTouchStart={} onTouchEnd={} etc.
 *
 * 6. PREVENTING DEFAULT:
 *    e.preventDefault()
 *    - Stops browser default behavior
 *    - For swipes: prevents scrolling
 *    - Use carefully: can break accessibility
 *
 * 7. CALCULATING SWIPE DIRECTION:
 *    - Compare absolute deltaX vs deltaY
 *    - Larger value determines axis
 *    - Sign (+ or -) determines direction
 *
 * 8. THRESHOLD PATTERN:
 *    if (distance > minSwipeDistance)
 *    - Prevents accidental triggers
 *    - Makes gestures feel intentional
 *    - Adjust based on use case
 *
 * ============================================
 */
