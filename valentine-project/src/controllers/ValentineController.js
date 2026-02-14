// ============================================
// CONTROLLER: ValentineController.js
// ============================================
// PURPOSE: Handles ALL business logic and state changes
// This is the "brain" - it decides WHAT happens WHEN
// Views call controller methods, controller updates model
// ============================================

import { ValidationRules } from "../models/ValentineModel.js";
import {
  getMessageByLevel,
  getRandomEmoji,
} from "../models/NaughtyMessages.js";

/**
 * ValentineController Class
 *
 * RESPONSIBILITIES:
 * 1. Handle user interactions (button clicks, swipes, etc.)
 * 2. Validate data before updating state
 * 3. Execute business logic (rules like "naughty level can't exceed 100")
 * 4. Trigger view updates via setState callback
 *
 * WHY A CLASS?
 * - Encapsulates related logic together
 * - Maintains reference to state & updater
 * - Easy to test methods independently
 */
class ValentineController {
  /**
   * Constructor
   * @param {Object} initialState - Starting state from model
   * @param {Function} setState - React setState function to trigger re-renders
   *
   * EXPLANATION:
   * - We receive the state & setState from React component
   * - This connects our controller to React's rendering system
   * - When we call this.setState(), React re-renders the view
   */
  constructor(initialState, setState) {
    this.state = initialState; // Current state snapshot
    this.setState = setState; // Function to update React state
  }

  // ============================================
  // NAVIGATION METHODS
  // ============================================

  /**
   * Navigate to a different view
   * @param {string} viewName - 'home' | 'gallery' | 'naughty'
   *
   * PURPOSE: Change which page/component is shown
   * TRIGGERS: Button clicks, back navigation
   */
  navigateTo(viewName) {
    // Validate view name
    const validViews = ["home", "gallery", "naughty"];
    if (!validViews.includes(viewName)) {
      console.error(`Invalid view: ${viewName}`);
      return;
    }

    // Update state
    this.setState((prevState) => ({
      ...prevState, // Keep all other state
      currentView: viewName, // Only update currentView
    }));
  }

  /**
   * Go back to previous view
   * Simple back navigation logic
   */
  goBack() {
    this.setState((prevState) => {
      // Determine previous view based on current
      let previousView = "home";
      if (prevState.currentView === "naughty") {
        previousView = "gallery";
      }

      return { ...prevState, currentView: previousView };
    });
  }

  // ============================================
  // PHOTO INTERACTION METHODS
  // ============================================

  /**
   * Like a photo (increment likes counter)
   * @param {string} photoId - Photo identifier
   *
   * EXPLANATION:
   * - We find the photo by ID
   * - Increment its likes count
   * - Update state with new array
   */
  likePhoto(photoId) {
    this.setState((prevState) => {
      // Map over photos array, update matching photo
      const updatedPhotos = prevState.photos.map(
        (photo) =>
          photo.id === photoId
            ? { ...photo, likes: photo.likes + 1 } // Create new object with updated likes
            : photo, // Keep unchanged
      );

      // Also increase naughty level (more interactions = more playful)
      const newNaughtyLevel = Math.min(prevState.naughtyLevel + 5, 100);

      return {
        ...prevState,
        photos: updatedPhotos,
        naughtyLevel: newNaughtyLevel,
        heartClicks: prevState.heartClicks + 1,
      };
    });
  }

  /**
   * Toggle favorite status
   * @param {string} photoId
   */
  toggleFavorite(photoId) {
    this.setState((prevState) => ({
      ...prevState,
      photos: prevState.photos.map((photo) =>
        photo.id === photoId
          ? { ...photo, isFavorite: !photo.isFavorite }
          : photo,
      ),
    }));
  }

  /**
   * Navigate through gallery photos
   * @param {string} direction - 'next' | 'prev'
   */
  changePhoto(direction) {
    this.setState((prevState) => {
      const totalPhotos = prevState.photos.length;
      let newIndex = prevState.currentPhotoIndex;

      if (direction === "next") {
        newIndex = (newIndex + 1) % totalPhotos; // Loop to start
      } else if (direction === "prev") {
        newIndex = (newIndex - 1 + totalPhotos) % totalPhotos; // Loop to end
      }

      return { ...prevState, currentPhotoIndex: newIndex };
    });
  }

  /**
   * Add new photo to gallery
   * @param {Object} photoData - {url, caption}
   *
   * USE CASE: If you want to add photos dynamically
   */
  addPhoto(photoData) {
    // Validate photo data
    const newPhoto = {
      id: Date.now().toString(), // Simple unique ID
      url: photoData.url,
      caption: photoData.caption || "💕",
      likes: 0,
      isFavorite: false,
    };

    if (!ValidationRules.isValidPhoto(newPhoto)) {
      console.error("Invalid photo data");
      return;
    }

    this.setState((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, newPhoto], // Append to array
    }));
  }

  // ============================================
  // NAUGHTY LEVEL METHODS
  // ============================================

  /**
   * Increase naughtiness level
   * @param {number} amount - How much to increase
   *
   * TRIGGERED BY: Button clicks, interactions
   */
  increaseNaughtyLevel(amount = 10) {
    this.setState((prevState) => {
      const newLevel = Math.min(prevState.naughtyLevel + amount, 100);

      // Trigger confetti at certain milestones
      const showConfetti = newLevel >= 50 && prevState.naughtyLevel < 50;

      return {
        ...prevState,
        naughtyLevel: newLevel,
        showConfetti,
      };
    });
  }

  /**
   * Reset naughty level (cooldown)
   */
  resetNaughtyLevel() {
    this.setState((prevState) => ({
      ...prevState,
      naughtyLevel: 0,
      showConfetti: false,
    }));
  }

  // ============================================
  // UI INTERACTION METHODS
  // ============================================

  /**
   * Handle heart button click
   * Central handler for the main interaction
   *
   * BUSINESS LOGIC:
   * - Increment heart clicks
   * - Increase naughty level
   * - Trigger animations based on thresholds
   */
  handleHeartClick() {
    this.setState((prevState) => {
      const newClicks = prevState.heartClicks + 1;
      const newNaughtyLevel = Math.min(prevState.naughtyLevel + 3, 100);

      // Every 10 clicks = confetti celebration
      const showConfetti = newClicks % 10 === 0;

      return {
        ...prevState,
        heartClicks: newClicks,
        naughtyLevel: newNaughtyLevel,
        showConfetti,
      };
    });
  }

  /**
   * Dismiss confetti animation
   */
  hideConfetti() {
    this.setState((prevState) => ({
      ...prevState,
      showConfetti: false,
    }));
  }

  // ============================================
  // DATA PERSISTENCE METHODS
  // ============================================

  /**
   * Save current state to localStorage
   * PURPOSE: Persist data between sessions
   */
  saveToStorage() {
    try {
      const stateToSave = {
        photos: this.state.photos,
        naughtyLevel: this.state.naughtyLevel,
        heartClicks: this.state.heartClicks,
      };
      localStorage.setItem("valentine-state", JSON.stringify(stateToSave));
      console.log("State saved successfully!");
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }

  /**
   * Load state from localStorage
   * @returns {Object|null} Saved state or null
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem("valentine-state");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.setState((prevState) => ({
          ...prevState,
          ...parsed,
        }));
        console.log("State loaded successfully!");
        return parsed;
      }
    } catch (error) {
      console.error("Failed to load state:", error);
    }
    return null;
  }

  /**
   * Clear saved data
   */
  clearStorage() {
    localStorage.removeItem("valentine-state");
    console.log("Storage cleared!");
  }

  // ============================================
  // COMPUTED/DERIVED VALUES
  // ============================================

  /**
   * Get current message based on naughty level
   * @returns {string} Contextual message
   *
   * PURPOSE: Dynamic content based on state
   */
  getCurrentMessage() {
    return getMessageByLevel(this.state.naughtyLevel);
  }

  /**
   * Get naughty level category
   * @returns {string} 'sweet' | 'spicy' | 'extra-spicy'
   */
  getNaughtyCategory() {
    const level = this.state.naughtyLevel;
    if (level < 33) return "sweet";
    if (level < 66) return "spicy";
    return "extra-spicy";
  }

  /**
   * Get favorite photos only
   * @returns {Array} Filtered photo array
   */
  getFavoritePhotos() {
    return this.state.photos.filter((photo) => photo.isFavorite);
  }

  /**
   * Get most liked photo
   * @returns {Object|null} Photo with highest likes
   */
  getMostLikedPhoto() {
    if (this.state.photos.length === 0) return null;
    return this.state.photos.reduce((max, photo) =>
      photo.likes > max.likes ? photo : max,
    );
  }
}

// ============================================
// EXPORT
// ============================================
export default ValentineController;
