import React from 'react';
import './MoodSelector.css';

const MOODS = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'sad', label: 'Sad', emoji: '😢' },
    { id: 'chill', label: 'Chill', emoji: '🍃' },
    { id: 'energy', label: 'Energy', emoji: '⚡' },
    { id: 'romantic', label: 'Romantic', emoji: '💖' },
    { id: 'focused', label: 'Focused', emoji: '🧠' },
];

const MoodSelector = ({ onSelect }) => {
    return (
        <div className="grid-container">
            {MOODS.map((mood, index) => (
                <button
                    key={mood.id}
                    onClick={() => onSelect(mood.id)}
                    className="mood-card"
                    style={{
                        animation: `fadeInUp 0.6s ${index * 0.1}s var(--ease-spring) backwards`
                    }}
                >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span className="mood-label">{mood.label}</span>
                </button>
            ))}
        </div>
    );
};

export default MoodSelector;
