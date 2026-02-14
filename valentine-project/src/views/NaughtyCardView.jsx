// ============================================
// VIEW: NaughtyCardView.jsx
// ============================================
// PURPOSE: Interactive "naughty" card with random messages
// FEATURES: Scratch-off effect, random messages, animations
// ============================================

import React, { useState, useEffect } from "react";
import {
  getMessageByLevel,
  getRandomEmoji,
  naughtyQuestions,
} from "../models/NaughtyMessages.js";

/**
 * NaughtyCardView Component
 *
 * PROPS:
 * @param {number} naughtyLevel - Current playfulness level (0-100)
 * @param {Function} onClose - Go back to gallery
 * @param {Function} onIncreaseNaughty - Increase naughtiness
 * @param {Function} onHeartClick - Handle heart button clicks
 *
 * FEATURES:
 * - Random naughty messages based on level
 * - Interactive questions with answers
 * - Heart click counter
 * - Scratch-to-reveal effect
 */
function NaughtyCardView({
  naughtyLevel,
  onClose,
  onIncreaseNaughty,
  onHeartClick,
}) {
  // ===== LOCAL STATE =====
  // This component has its own UI state (not global app state)
  const [currentMessage, setCurrentMessage] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [emoji, setEmoji] = useState("💕");

  // ===== EFFECTS =====

  /**
   * Load random message on mount and level change
   * useEffect dependencies: [naughtyLevel]
   * Runs when naughtyLevel changes
   */
  useEffect(() => {
    const message = getMessageByLevel(naughtyLevel);
    setCurrentMessage(message);
    setEmoji(getRandomEmoji("naughty"));
  }, [naughtyLevel]);

  /**
   * Load random question on mount
   */
  useEffect(() => {
    const randomQuestion =
      naughtyQuestions[Math.floor(Math.random() * naughtyQuestions.length)];
    setCurrentQuestion(randomQuestion);
  }, []);

  // ===== EVENT HANDLERS =====

  /**
   * Handle "Reveal" button click
   * Shows hidden message with animation
   */
  const handleReveal = () => {
    setIsRevealed(true);
    onIncreaseNaughty(10); // Reward for revealing
  };

  /**
   * Get new random message
   */
  const handleNewMessage = () => {
    const message = getMessageByLevel(naughtyLevel);
    setCurrentMessage(message);
    setEmoji(getRandomEmoji("naughty"));
    setIsRevealed(false);
    setSelectedAnswer(null);
    onIncreaseNaughty(5);
  };

  /**
   * Handle question answer selection
   */
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    onIncreaseNaughty(3);
  };

  /**
   * Handle heart spam clicking
   */
  const handleHeartSpam = () => {
    onHeartClick();
    // Optional: Add visual feedback animation
  };

  // ===== RENDER =====
  return (
    <div className="naughty-card-view">
      {/* HEADER */}
      <header className="card-header">
        <button
          onClick={onClose}
          className="btn btn-ghost"
          aria-label="Go back">
          ← Back
        </button>

        {/* Naughty Meter */}
        <div className="naughty-meter">
          <span className="meter-label">Naughty Level:</span>
          <div className="meter-bar">
            <div className="meter-fill" style={{ width: `${naughtyLevel}%` }} />
          </div>
          <span className="meter-value">{naughtyLevel}% 🔥</span>
        </div>
      </header>

      {/* MAIN CARD */}
      <div className="card-container">
        {/* Emoji Icon */}
        <div className="card-emoji">
          <span className="big-emoji">{emoji}</span>
        </div>

        {/* Message Card (Scratch-off style) */}
        <div className={`message-card ${isRevealed ? "revealed" : "hidden"}`}>
          {!isRevealed ? (
            // BEFORE REVEAL
            <div className="scratch-overlay">
              <p className="scratch-text">Tap to reveal 👇</p>
              <button onClick={handleReveal} className="btn btn-reveal">
                😈 Reveal Message
              </button>
            </div>
          ) : (
            // AFTER REVEAL
            <div className="message-content fade-in">
              <p className="naughty-message">{currentMessage}</p>

              {/* Get New Message */}
              <button onClick={handleNewMessage} className="btn btn-secondary">
                🎲 Another One
              </button>
            </div>
          )}
        </div>

        {/* INTERACTIVE QUESTION */}
        {currentQuestion && isRevealed && (
          <div className="question-card fade-in">
            <h3 className="question-text">{currentQuestion.question}</h3>

            <div className="answer-options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`btn btn-option ${
                    selectedAnswer === option ? "selected" : ""
                  }`}>
                  {option}
                </button>
              ))}
            </div>

            {/* Response to selected answer */}
            {selectedAnswer && (
              <p className="answer-response fade-in">
                {getAnswerResponse(selectedAnswer)}
              </p>
            )}
          </div>
        )}

        {/* HEART SPAM BUTTON */}
        <div className="heart-spam-section">
          <p className="spam-hint">
            Click the heart as many times as you want 😏
          </p>
          <button onClick={handleHeartSpam} className="btn btn-heart pulse">
            ❤️
          </button>
        </div>
      </div>

      {/* CATEGORY INDICATOR */}
      <div className="category-badge">{getCategoryLabel(naughtyLevel)}</div>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get category label based on naughty level
 * @param {number} level
 * @returns {string}
 */
function getCategoryLabel(level) {
  if (level < 33) return "😇 Sweet & Innocent";
  if (level < 66) return "😏 Getting Spicy";
  return "🔥 EXTRA Naughty";
}

/**
 * Get response based on selected answer
 * @param {string} answer
 * @returns {string}
 */
function getAnswerResponse(answer) {
  const responses = {
    // Common answers
    "💯 You're literally it": "🥰 Aww, you're the sweetest!",
    "♾️ More than memes": "😂 That's A LOT of love!",
    "✅ Yes": "😘 I knew it!",
    "🔥 FBI Watchlist": "😈 That's what I like to hear!",
    "🌶️ Spicy Time": "🔥 Now we're talking!",

    // Default
    default: "💕 Love your answer!",
  };

  return responses[answer] || responses.default;
}

// ============================================
// EXPORT
// ============================================
export default NaughtyCardView;

/**
 * ============================================
 * LEARNING NOTES
 * ============================================
 *
 * 1. LOCAL vs GLOBAL STATE:
 *    LOCAL (useState in component):
 *    - isRevealed, selectedAnswer
 *    - Only this component cares about these
 *    - Doesn't affect other components
 *
 *    GLOBAL (passed via props from App):
 *    - naughtyLevel, photos
 *    - Multiple components need this data
 *    - Managed at top level
 *
 * 2. MULTIPLE USEEFFECTS:
 *    useEffect(() => {}, [dep1])
 *    useEffect(() => {}, [dep2])
 *    - Each effect can have different dependencies
 *    - Run independently
 *    - Separate concerns (message vs question)
 *
 * 3. INLINE STYLES:
 *    style={{ width: `${naughtyLevel}%` }}
 *    - Use for dynamic values
 *    - Double curly braces: outer = JSX, inner = object
 *    - Template literal for dynamic strings
 *
 * 4. CONDITIONAL CLASSES:
 *    className={`card ${isRevealed ? 'revealed' : 'hidden'}`}
 *    - Ternary operator for either/or
 *    - Template literal to combine strings
 *
 * 5. ARRAY.MAP() FOR LISTS:
 *    {options.map((option, index) => <button key={index}>)}
 *    - Transforms array into JSX elements
 *    - key prop required (React optimization)
 *    - index is OK here (order doesn't change)
 *
 * 6. CONDITIONAL RENDERING (&&):
 *    {currentQuestion && <div>...</div>}
 *    - Only renders if truthy
 *    - Short-circuit evaluation
 *    - Alternative to ternary when no "else" needed
 *
 * 7. EVENT HANDLER PATTERNS:
 *    onClick={handleReveal}       // No args
 *    onClick={() => handleAnswer(option)}  // With args
 *
 *    WHY ARROW FUNCTION?
 *    onClick={handleAnswer(option)}  // WRONG! Calls immediately
 *    onClick={() => handleAnswer(option)}  // RIGHT! Calls on click
 *
 * 8. CSS ANIMATIONS:
 *    className="fade-in"
 *    - Add class when element appears
 *    - CSS handles animation
 *    - JavaScript just toggles class
 *
 * 9. HELPER FUNCTIONS:
 *    function getCategoryLabel(level) {}
 *    - Pure functions outside component
 *    - Don't recreate on every render
 *    - Easier to test
 *
 * 10. VISUAL FEEDBACK:
 *     - Always provide feedback for interactions
 *     - Button clicks → animations/state change
 *     - Disabled states → visual difference
 *     - Loading states → spinners/skeletons
 *
 * ============================================
 *
 * CSS CLASSES TO STYLE:
 * - .naughty-card-view: Main container
 * - .card-header: Top section
 * - .naughty-meter: Progress bar container
 * - .meter-bar: Progress bar background
 * - .meter-fill: Progress bar fill (dynamic width)
 * - .card-container: Main content area
 * - .card-emoji: Emoji display
 * - .message-card: Message container
 * - .message-card.revealed: Revealed state
 * - .message-card.hidden: Hidden state
 * - .scratch-overlay: Cover before reveal
 * - .scratch-text: "Tap to reveal" text
 * - .btn-reveal: Reveal button
 * - .message-content: Revealed message
 * - .naughty-message: Message text
 * - .question-card: Question section
 * - .question-text: Question heading
 * - .answer-options: Answer buttons container
 * - .btn-option: Answer button
 * - .btn-option.selected: Selected answer
 * - .answer-response: Response text
 * - .heart-spam-section: Heart button area
 * - .btn-heart: Heart button
 * - .category-badge: Category label
 * - .fade-in: Fade-in animation
 * - .pulse: Pulse animation
 *
 * ============================================
 */
