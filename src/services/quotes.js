// Curated local quotes for reliability and speed
const QUOTES_DB = {
    happy: [
        "Happiness comes in waves. It'll find you again.",
        "The most wasted of days is one without laughter.",
        "Spread love everywhere you go.",
        "Count your age by friends, not years. Count your life by smiles, not tears."
    ],
    sad: [
        "Tears are words that need to be written.",
        "It's okay not to be okay.",
        "Sadness flies away on the wings of time.",
        "Every life has a measure of sorrow, and sometimes this is what awakens us."
    ],
    chill: [
        "Quiet the mind, and the soul will speak.",
        "Relax, recharge, and reflect.",
        "Peace starts with a smile.",
        "Almost everything will work again if you unplug it for a few minutes, including you."
    ],
    energy: [
        "Energy and persistence conquer all things.",
        "Don't stop until you're proud.",
        "The future depends on what you do today.",
        "It always seems impossible until it's done."
    ],
    romantic: [
        "The best thing to hold onto in life is each other.",
        "Love is composed of a single soul inhabiting two bodies.",
        "Where there is love there is life.",
        "You are my sun, my moon, and all my stars."
    ],
    focused: [
        "Starve your distractions, feed your focus.",
        "Focus on the step in front of you, not the whole staircase.",
        "Success is sum of small efforts, repeated day in and day out.",
        "What you stay focused on will grow."
    ]
};

export const getQuote = (mood) => {
    const list = QUOTES_DB[mood] || QUOTES_DB.happy;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
};
