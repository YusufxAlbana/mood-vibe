const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID_HERE'; // User needs to replace this
const REDIRECT_URI = 'http://localhost:5173/';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state'
];

// Verified Spotify curated playlist IDs (These are official Spotify playlists)
const MOCK_PLAYLISTS = {
    happy: '37i9dQZF1DXdPec7aLTmlC', // Happy Hits!
    sad: '37i9dQZF1DX7qK8ma5wgG1',   // Life Sucks
    chill: '37i9dQZF1DWZqd5JICZI0u', // Lofi Beats
    energy: '37i9dQZF1DX3ZeFHRhhi7Y', // Power Gaming
    romantic: '37i9dQZF1DX50QitC6Oqtn', // Love Pop
    focused: '37i9dQZF1DWZeKCadgRdKQ', // Deep Focus
};

export const getLoginUrl = () => {
    return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join('%20')}`;
};

export const getTokenFromUrl = () => {
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
};

export const searchPlaylists = async (mood, token) => {
    if (!token) {
        console.warn('No token provided, using fallback playlist');
        // Return a constructed object that mimics API response
        return {
            external_urls: { spotify: `https://open.spotify.com/playlist/${MOCK_PLAYLISTS[mood] || MOCK_PLAYLISTS.happy}` },
            id: MOCK_PLAYLISTS[mood] || MOCK_PLAYLISTS.happy,
            name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes (Fallback)`,
            images: [{ url: 'https://placehold.co/300x300?text=Spotify+Mood' }]
        };
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=1`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.playlists.items[0];
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return null;
    }
};
