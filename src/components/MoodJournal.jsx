import React, { useState, useEffect } from 'react';
import { analyzeMood } from '../services/gemini';
import { getSongsForMood } from '../services/songDatabase';
import Logo from '../assets/logo.svg';
import './MoodJournal.css';

// Landscape background images (high quality, free to use)
const LANDSCAPE_BACKGROUNDS = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountains
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', // Foggy forest
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', // Forest sunlight
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', // Mountain lake
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80', // Valley
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80', // Green hills
    'https://images.unsplash.com/photo-1552083375-1447ce886485?w=1920&q=80', // Aurora
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80', // Sunset
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80', // Lake reflection
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80', // Waterfall
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80', // Mountains sunset
    'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1920&q=80', // Beach sunset
    'https://images.unsplash.com/photo-1518173946687-a4c036bc1c9a?w=1920&q=80', // Night sky
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', // Mountain peak
    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80', // Desert
];

const MoodJournal = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [error, setError] = useState('');
    const [bgIndex, setBgIndex] = useState(0);
    const [bgFade, setBgFade] = useState(true);

    // Rotate background every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBgFade(false);
            setTimeout(() => {
                setBgIndex((prev) => (prev + 1) % LANDSCAPE_BACKGROUNDS.length);
                setBgFade(true);
            }, 500);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Update document title when playing music
    useEffect(() => {
        if (currentSong) {
            document.title = `🎵 ${currentSong.title} - ${currentSong.artist} | Mood Vibe`;
        } else if (result) {
            document.title = `${result.emoji} ${result.mood} | Mood Vibe`;
        } else {
            document.title = 'Mood Vibe';
        }

        // Cleanup: reset title when component unmounts
        return () => {
            document.title = 'Mood Vibe';
        };
    }, [currentSong, result]);

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError('Tulis dulu cerita hari ini kamu! 😊');
            return;
        }

        setError('');
        setLoading(true);
        setResult(null);
        setSongs([]);
        setCurrentSong(null);

        try {
            const response = await analyzeMood(text);
            if (response.success) {
                setResult(response.data);

                // Get songs from database based on mood
                const moodSongs = getSongsForMood(response.data.mood);
                setSongs(moodSongs);

                // Auto-select first song
                if (moodSongs.length > 0) {
                    setCurrentSong(moodSongs[0]);
                }
            } else {
                setError(response.message || 'Gagal menganalisis mood');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setText('');
        setResult(null);
        setSongs([]);
        setCurrentSong(null);
        setError('');
    };

    const handleSongSelect = (song) => {
        setCurrentSong(song);
    };

    return (
        <div className="mood-container">
            {/* Rotating Background */}
            <div
                className={`mood-background ${bgFade ? 'visible' : ''}`}
                style={{ backgroundImage: `url(${LANDSCAPE_BACKGROUNDS[bgIndex]})` }}
            />

            <div className="mood-overlay" />

            {/* Content */}
            <div className="mood-content">
                {!result ? (
                    /* Input View */
                    <div className="input-view">
                        <div className="input-card">
                            <div className="width-full flex-col-center mb-6">
                                <img src={Logo} className="app-logo mb-2" alt="Mood Vibe Logo" />
                                <h1 className="app-title">
                                    Mood Vibe
                                </h1>
                            </div>
                            <p className="app-desc">Ceritakan harimu, temukan lagu yang cocok!</p>

                            <textarea
                                className="mood-input"
                                placeholder="Bagaimana perasaanmu hari ini?"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={loading}
                            />

                            {error && <p className="error-text">{error}</p>}

                            <button
                                className="submit-btn"
                                onClick={handleAnalyze}
                                disabled={loading}
                            >
                                {loading ? (
                                    <><span className="spinner"></span> Menganalisis...</>
                                ) : (
                                    <><span>🎵</span> Analisis Mood</>
                                )}
                            </button>

                            <div className="quick-moods">
                                <span
                                    className="quick-btn"
                                    onClick={() => setText('Hari ini aku senang banget!')}
                                >😊</span>
                                <span
                                    className="quick-btn"
                                    onClick={() => setText('Aku merasa sedih dan galau...')}
                                >😢</span>
                                <span
                                    className="quick-btn"
                                    onClick={() => setText('Lagi santai dan chill aja')}
                                >🍃</span>
                                <span
                                    className="quick-btn"
                                    onClick={() => setText('Semangat banget hari ini!')}
                                >⚡</span>
                                <span
                                    className="quick-btn"
                                    onClick={() => setText('Lagi jatuh cinta nih...')}
                                >💖</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Result View */
                    <div className="result-view">
                        {/* Left - Mood Info */}
                        <div className="mood-info-panel">
                            <div className="mood-header">
                                <span className="mood-emoji">{result.emoji}</span>
                                <div>
                                    <h2 className="mood-title">{result.mood}</h2>
                                    <p className="mood-insight">{result.insight}</p>
                                </div>
                            </div>

                            {/* Spotify Player */}
                            {currentSong && (
                                <div className="player-section">
                                    <h3>🎧 Now Playing</h3>
                                    <div className="spotify-embed">
                                        <iframe
                                            src={`https://open.spotify.com/embed/track/${currentSong.spotifyId}?utm_source=generator&theme=0`}
                                            width="100%"
                                            height="152"
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                            title="Spotify Player"
                                        />
                                    </div>
                                </div>
                            )}

                            <button className="reset-btn" onClick={handleReset}>
                                🔄 Analisis Lagi
                            </button>
                        </div>

                        {/* Right - Song List */}
                        <div className="songs-panel">
                            <h3>🎵 Rekomendasi untuk "{result.mood}"</h3>
                            <div className="songs-grid">
                                {songs.map((song, index) => (
                                    <button
                                        key={index}
                                        className={`song-btn ${currentSong?.spotifyId === song.spotifyId ? 'active' : ''}`}
                                        onClick={() => handleSongSelect(song)}
                                    >
                                        <span className="song-number">{index + 1}</span>
                                        <div className="song-info">
                                            <span className="song-title">{song.title}</span>
                                            <span className="song-artist">{song.artist}</span>
                                        </div>
                                        <span className="play-icon">▶</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodJournal;
