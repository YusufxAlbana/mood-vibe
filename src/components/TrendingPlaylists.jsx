import React, { useState, useEffect } from 'react';
import { getTrendingPlaylists } from '../services/gemini';
import './TrendingPlaylists.css';

const TrendingPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrendingPlaylists();
    }, []);

    const loadTrendingPlaylists = async () => {
        try {
            const response = await getTrendingPlaylists();
            if (response.success) {
                setPlaylists(response.data);
            }
        } catch (error) {
            console.error('Failed to load playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaylistClick = (name) => {
        window.open(`https://open.spotify.com/search/${encodeURIComponent(name)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="trending-section">
                <h3 className="trending-title">
                    <span>🔥</span> Trending Playlists Hari Ini
                </h3>
                <div className="playlist-loading">
                    <div className="playlist-skeleton"></div>
                    <div className="playlist-skeleton"></div>
                    <div className="playlist-skeleton"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="trending-section">
            <h3 className="trending-title">
                <span>🔥</span> Trending Playlists Hari Ini
            </h3>
            <p className="trending-subtitle">Klik untuk cari di Spotify</p>

            <div className="playlist-grid">
                {playlists.map((playlist, index) => (
                    <div
                        key={index}
                        className="playlist-card"
                        onClick={() => handlePlaylistClick(playlist.name)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="playlist-emoji">{playlist.emoji}</div>
                        <div className="playlist-info">
                            <h4 className="playlist-name">{playlist.name}</h4>
                            <p className="playlist-mood">{playlist.mood}</p>
                        </div>
                        <span className="playlist-arrow">→</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingPlaylists;
