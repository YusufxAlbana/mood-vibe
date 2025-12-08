import React, { useState, useEffect } from 'react';
import { getHistory } from '../utils/storage';
import './HistoryPage.css';

const MOOD_EMOJIS = {
    happy: '😊',
    sad: '😢',
    chill: '🍃',
    energy: '⚡',
    romantic: '💖',
    focused: '🧠'
};

const HistoryPage = () => {
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        setHistoryList(getHistory());
    }, []);

    return (
        <div className="history-container">
            <header className="history-header">
                <h1 className="title-gradient">Mood History</h1>
                <p>Your recent mood vibes</p>
            </header>

            {historyList.length === 0 ? (
                <div className="empty-history">
                    <div className="empty-history-icon">📜</div>
                    <h3>No history yet</h3>
                    <p>Generate some moods to see your history here!</p>
                </div>
            ) : (
                <div className="history-list-page">
                    {historyList.map((item, idx) => (
                        <div key={idx} className="history-card">
                            <div className="history-emoji">
                                {MOOD_EMOJIS[item.mood] || '🎵'}
                            </div>
                            <div className="history-info">
                                <div className="history-info-mood">{item.mood}</div>
                                <div className="history-info-quote">"{item.quote}"</div>
                                <div className="history-info-date">
                                    {new Date(item.date).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
