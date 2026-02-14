// ============================================
// MODEL: NaughtyMessages.js
// ============================================
// PURPOSE: Data source for naughty/playful messages
// This is static data (doesn't change during runtime)
// ============================================

/**
 * Naughty Message Categories
 * Each category has different levels of spiciness 🌶️
 */

// ===== SWEET & PLAYFUL (Safe for work-ish) =====
export const sweetMessages = [
  "You're my favorite notification 💕",
  "Netflix & chill? But mostly chill with you 😏",
  "I'd swipe right on you every time 💖",
  "You're like Wi-Fi - I'm always looking for you 📶",
  "Let's make tonight... legendary 😈",
  "Is it hot in here, or is it just you? 🔥",
  "You're the only one who gets my dark humor... and my dark side 🖤",
  "Want to be my forever Valentine? (and my forever snack) 🍰",
];

// ===== SPICY (Medium heat 🌶️🌶️) =====
export const spicyMessages = [
  "I like you more than pizza... and that's saying something 🍕😍",
  "Come over, I need help with... research 📚😏",
  "You + Me = Trouble (the best kind) 😈💕",
  "I'm not saying you're hot, but... 🔥 okay I'm totally saying that",
  "My bed is cold... and I think you're the solution 🛏️💭",
  "Let's skip dinner and go straight to dessert 🍰😘",
  "I've been naughty, might need you to punish me 😇",
  "Your clothes would look better on my floor 👀",
];

// ===== EXTRA SPICY (Turn up the heat 🌶️🌶️🌶️) =====
export const extraSpicyMessages = [
  "I can't focus when you look like THAT 😍🔥",
  "Forget butterflies, I feel the whole zoo when I see you 🦋🦁🐯",
  "You're 99% angel, but that 1%... 😈👼",
  "I'd cross the ocean for you... or just my bedroom 😏",
  "You're the reason I have trust issues with my imagination 💭😳",
  "Let's do something we'll both regret tomorrow 😈💕",
  "You're my favorite distraction... and I'm easily distracted 👀",
  "I'm writing this with one hand... the other is thinking about you 🤚💭",
];

// ===== RANDOM FUN FACTS (Lighthearted) =====
export const funFacts = [
  "🎯 Fun Fact: You make my dopamine levels higher than any meme ever could",
  "🧠 Science says thinking about you burns 1.5 calories per minute. I'm losing weight over here!",
  "📊 Statistics: 99% of my good moods are caused by you. The other 1%? Food.",
  "🔬 Research shows: You're 100% my type (I did the research myself)",
  "⚡ Breaking: Local person becomes 10x hotter when smiling. More at 11.",
  "🎮 Achievement Unlocked: Made my heart skip a beat (Again)",
  "🌡️ Warning: Hotness levels exceeding safe limits. Proceed with caution.",
  "💡 Did you know? You're scientifically proven to be my favorite person",
];

// ===== MEME-STYLE QUESTIONS (Interactive) =====
export const naughtyQuestions = [
  {
    question: "Rate your naughtiness level today:",
    options: [
      "😇 Angel (lying)",
      "😏 Trouble",
      "😈 Chaos Mode",
      "🔥 FBI Watchlist",
    ],
  },
  {
    question: "What's tonight's vibe?",
    options: [
      "🍕 Chill",
      "🎮 Game Night",
      "🌶️ Spicy Time",
      "🛏️ Early Bedtime 😏",
    ],
  },
  {
    question: "How much do you love me?",
    options: [
      "🌮 Like tacos",
      "☕ Like coffee",
      "📱 Like my phone",
      "♾️ More than memes",
    ],
  },
  {
    question: "Be honest: Am I your type?",
    options: ["❌ No", "🤔 Maybe", "✅ Yes", "💯 You're literally it"],
  },
];

// ===== EMOJI REACTIONS =====
export const emojiReactions = {
  love: ["❤️", "💕", "💖", "💗", "💓", "💞", "💝"],
  naughty: ["😏", "😈", "😍", "🥵", "🔥", "💋", "👀"],
  sweet: ["🥰", "😘", "😊", "☺️", "💐", "🌹", "✨"],
  funny: ["😂", "🤣", "😆", "😜", "🤪", "😋", "🎉"],
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get random message from category
 * @param {Array} category - Message array
 * @returns {string} - Random message
 */
export const getRandomMessage = (category) => {
  const randomIndex = Math.floor(Math.random() * category.length);
  return category[randomIndex];
};

/**
 * Get message based on naughty level
 * @param {number} naughtyLevel - Current naughtiness (0-100)
 * @returns {string} - Appropriate message
 */
export const getMessageByLevel = (naughtyLevel) => {
  if (naughtyLevel < 33) {
    return getRandomMessage(sweetMessages);
  } else if (naughtyLevel < 66) {
    return getRandomMessage(spicyMessages);
  } else {
    return getRandomMessage(extraSpicyMessages);
  }
};

/**
 * Get random emoji from category
 * @param {string} type - Emoji category key
 * @returns {string} - Random emoji
 */
export const getRandomEmoji = (type = "love") => {
  const emojis = emojiReactions[type] || emojiReactions.love;
  return emojis[Math.floor(Math.random() * emojis.length)];
};

/**
 * Create a custom naughty message
 * @param {string} name - Your girlfriend's name
 * @param {string} template - Message template with {name} placeholder
 * @returns {string}
 */
export const createCustomMessage = (name, template) => {
  return template.replace(/{name}/g, name);
};

// ===== EXPORT ALL =====
export default {
  sweetMessages,
  spicyMessages,
  extraSpicyMessages,
  funFacts,
  naughtyQuestions,
  emojiReactions,
  getRandomMessage,
  getMessageByLevel,
  getRandomEmoji,
  createCustomMessage,
};
