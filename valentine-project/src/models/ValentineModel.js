// ============================================
// MODEL: ValentineModel.js
// ============================================
// PURPOSE: Defines the data structure (shape) of our application
// This is the "contract" - every component knows what data looks like
// ============================================

/**
 * Photo Model
 * @typedef {Object} Photo
 * @property {string} id - Unique identifier
 * @property {string} url - Image source (local path or URL)
 * @property {string} caption - Naughty/sweet caption
 * @property {number} likes - Number of times you've liked it
 * @property {boolean} isFavorite - Is this a favorite photo?
 */

/**
 * App State Model
 * This defines the ENTIRE state shape of the application
 * Think of it as a blueprint for all data
 */
export const ValentineModel = {
  // ===== NAVIGATION STATE =====
  currentView: "home", // Which page/view is active: 'home' | 'gallery' | 'naughty'

  // ===== PHOTO DATA =====
  photos: [
    // Sample structure - you'll replace with your girlfriend's photos
    {
      id: "1",
      url: "/src/assets/photos/DakogKaon.jpg", // Local path to image
      caption: "😈 That time you made my heart race...",
      likes: 0,
      isFavorite: false,
    },
    {
      id: "2",
      url: "/src/assets/photos/Tabian.jpeg",
      caption: "💕 You look so good, it should be illegal",
      likes: 0,
      isFavorite: false,
    },
    {
      id: "3",
      url: "/src/assets/photos/WowGwapa.jpeg",
      caption: "🔥 My personal snack",
      likes: 0,
      isFavorite: false,
    },
  ],

  // ===== INTERACTION STATE =====
  naughtyLevel: 0, // Tracks playfulness meter (0-100)
  heartClicks: 0, // Total heart button clicks

  // ===== UI STATE =====
  showConfetti: false, // Trigger confetti animation
  currentPhotoIndex: 0, // Active photo in gallery
};

/**
 * Initial State Factory
 * PURPOSE: Creates a fresh copy of initial state
 * WHY: Prevents mutation of the original model
 * USAGE: const initialState = createInitialState();
 */
export const createInitialState = () => ({
  ...ValentineModel,
  photos: ValentineModel.photos.map((photo) => ({ ...photo })), // Deep copy photos array
});

/**
 * Validation Rules
 * PURPOSE: Ensure data integrity
 * These are business rules - what makes data "valid"
 */
export const ValidationRules = {
  /**
   * Validates a photo object
   * @param {Photo} photo - Photo to validate
   * @returns {boolean} - Is valid?
   */
  isValidPhoto: (photo) => {
    return (
      photo &&
      typeof photo.id === "string" &&
      typeof photo.url === "string" &&
      typeof photo.caption === "string" &&
      photo.url.length > 0
    );
  },

  /**
   * Validates naughty level range
   * @param {number} level
   * @returns {boolean}
   */
  isValidNaughtyLevel: (level) => {
    return typeof level === "number" && level >= 0 && level <= 100;
  },
};

/**
 * Data Transformers
 * PURPOSE: Convert data between formats
 * EXAMPLE: API response → App model, or App model → LocalStorage
 */
export const Transformers = {
  /**
   * Converts image file to base64 string (for storage)
   * @param {File} file - Image file from input
   * @returns {Promise<string>} - Base64 string
   */
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Sanitizes caption text (removes bad characters)
   * @param {string} caption
   * @returns {string}
   */
  sanitizeCaption: (caption) => {
    return caption.trim().slice(0, 200); // Max 200 chars
  },
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default ValentineModel;
