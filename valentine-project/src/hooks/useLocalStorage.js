// ============================================
// CUSTOM HOOK: useLocalStorage.js
// ============================================
// PURPOSE: Sync React state with browser localStorage
// WHY: Persist data between page refreshes
// REUSABLE: Can be used in any React project
// ============================================

import { useState, useEffect } from "react";

/**
 * useLocalStorage Hook
 *
 * WHAT IT DOES:
 * 1. Reads initial value from localStorage (if exists)
 * 2. Provides state variable like useState
 * 3. Automatically saves to localStorage on every change
 *
 * BENEFITS:
 * - Data survives page refresh
 * - Automatic sync (no manual save calls)
 * - Works exactly like useState
 *
 * @param {string} key - localStorage key name
 * @param {*} initialValue - Default value if nothing saved
 * @returns {[value, setValue]} - Same API as useState
 *
 * USAGE EXAMPLE:
 * const [name, setName] = useLocalStorage('user-name', 'Anonymous');
 * // Changes to 'name' automatically save to localStorage
 */
function useLocalStorage(key, initialValue) {
  // ===== INITIALIZE STATE WITH SAVED VALUE =====
  const [storedValue, setStoredValue] = useState(() => {
    // WHY A FUNCTION HERE?
    // useState can take a function for lazy initialization
    // This only runs ONCE on component mount (performance optimization)

    try {
      // Try to get saved value from localStorage
      const item = window.localStorage.getItem(key);

      // If found, parse it (localStorage only stores strings)
      // If not found, use initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If JSON.parse fails or localStorage blocked (privacy mode)
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // ===== SAVE TO LOCALSTORAGE ON CHANGE =====
  useEffect(() => {
    // This runs every time storedValue changes

    try {
      // Convert value to JSON string and save
      const valueToStore = JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]); // Dependencies: re-run if key or value changes

  // ===== RETURN STATE & SETTER =====
  // Same API as useState - drop-in replacement!
  return [storedValue, setStoredValue];
}

// ============================================
// ADVANCED VERSION: With Remove Functionality
// ============================================

/**
 * useLocalStorageWithRemove Hook
 * Enhanced version with ability to remove item
 *
 * @returns {[value, setValue, removeValue]}
 */
export function useLocalStorageWithRemove(key, initialValue) {
  const [storedValue, setStoredValue] = useLocalStorage(key, initialValue);

  /**
   * Remove item from localStorage and reset to initial value
   */
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setStoredValue, removeValue];
}

// ============================================
// UTILITY: Sync Between Tabs/Windows
// ============================================

/**
 * useLocalStorageSync Hook
 * Syncs state across browser tabs in real-time
 *
 * HOW IT WORKS:
 * - Listens to 'storage' event (fired when localStorage changes in another tab)
 * - Updates state when other tabs make changes
 * - Great for multi-tab apps
 */
export function useLocalStorageSync(key, initialValue) {
  const [storedValue, setStoredValue] = useLocalStorage(key, initialValue);

  useEffect(() => {
    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Failed to sync storage:", error);
        }
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup: remove listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, setStoredValue]);

  return [storedValue, setStoredValue];
}

// ============================================
// EXPORTS
// ============================================
export default useLocalStorage;

/**
 * ============================================
 * LEARNING NOTES
 * ============================================
 *
 * 1. CUSTOM HOOKS RULES:
 *    - Must start with "use"
 *    - Can use other hooks inside
 *    - Extract reusable logic
 *
 * 2. LAZY INITIALIZATION:
 *    useState(() => expensiveOperation())
 *    - Function only runs ONCE
 *    - Better than: useState(expensiveOperation())
 *
 * 3. USEEFFECT DEPENDENCIES:
 *    useEffect(() => {...}, [dep1, dep2])
 *    - Runs when dependencies change
 *    - Empty array [] = run once on mount
 *    - No array = run after every render
 *
 * 4. CLEANUP FUNCTIONS:
 *    useEffect(() => {
 *      return () => { cleanup here };
 *    })
 *    - Runs when component unmounts
 *    - Or before effect runs again
 *
 * 5. ERROR HANDLING:
 *    Always wrap localStorage in try/catch
 *    - Can be disabled in privacy mode
 *    - Can throw QuotaExceededError
 *
 * 6. JSON SERIALIZATION:
 *    localStorage only stores strings
 *    - JSON.stringify() to save
 *    - JSON.parse() to read
 *    - Can't store functions or circular refs
 *
 * ============================================
 */
