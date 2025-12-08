const KEYS = {
    HISTORY: 'mood_vibe_history',
    THEME: 'mood_vibe_theme'
};

export const getHistory = () => {
    try {
        const item = localStorage.getItem(KEYS.HISTORY);
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

export const saveHistoryItem = (item) => {
    try {
        const history = getHistory();
        // Add new item to Start, limit to 10
        const newHistory = [{ timestamp: Date.now(), ...item }, ...history].slice(0, 10);
        localStorage.setItem(KEYS.HISTORY, JSON.stringify(newHistory));
    } catch (e) {
        console.error("Failed to save history", e);
    }
};

export const getTheme = () => {
    return 'light'; // Prevent dark mode from ever loading
    // return localStorage.getItem(KEYS.THEME) || 'light';
};

export const saveTheme = (theme) => {
    // Force light theme always
    const safeTheme = 'light'; 
    localStorage.setItem(KEYS.THEME, safeTheme);
    document.documentElement.setAttribute('data-theme', safeTheme);
};

// Initialize theme
export const initTheme = () => {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    return theme;
};
