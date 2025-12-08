import React, { useState, useEffect } from 'react';
import './AISetup.css';

const PERSONALITY_TRAITS = [
    { id: 'friendly', label: '😊 Ramah', value: 'ramah dan bersahabat' },
    { id: 'funny', label: '😂 Lucu', value: 'humoris dan suka bercanda' },
    { id: 'serious', label: '🧐 Serius', value: 'serius dan profesional' },
    { id: 'romantic', label: '💕 Romantis', value: 'romantis dan penuh perhatian' },
    { id: 'wise', label: '🦉 Bijak', value: 'bijaksana dan penuh nasihat' },
    { id: 'energetic', label: '⚡ Energik', value: 'penuh semangat dan energik' },
    { id: 'calm', label: '🧘 Kalem', value: 'tenang dan santai' },
    { id: 'sarcastic', label: '😏 Sarkastik', value: 'sarkastik tapi tetap sopan' },
];

const AISetup = ({ onComplete, existingConfig }) => {
    const [config, setConfig] = useState({
        name: '',
        age: '',
        gender: 'netral',
        personality: [],
        customDescription: '',
        speakingStyle: 'santai',
        creator: 'King Yusuf Dari Aceh'
    });

    useEffect(() => {
        // Load existing config if available
        if (existingConfig) {
            setConfig(existingConfig);
        } else {
            const saved = localStorage.getItem('ai_personality_config');
            if (saved) {
                setConfig(JSON.parse(saved));
            }
        }
    }, [existingConfig]);

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const togglePersonality = (traitId) => {
        setConfig(prev => ({
            ...prev,
            personality: prev.personality.includes(traitId)
                ? prev.personality.filter(id => id !== traitId)
                : [...prev.personality, traitId]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save to localStorage
        localStorage.setItem('ai_personality_config', JSON.stringify(config));

        // Call completion handler
        onComplete(config);
    };

    const handleReset = () => {
        const defaultConfig = {
            name: '',
            age: '',
            gender: 'netral',
            personality: [],
            customDescription: '',
            speakingStyle: 'santai',
            creator: 'King Yusuf Dari Aceh'
        };
        setConfig(defaultConfig);
        localStorage.removeItem('ai_personality_config');
    };

    const isValid = config.name.trim().length > 0;

    return (
        <div className="setup-container">
            <header className="setup-header">
                <span className="setup-icon">🤖</span>
                <h1 className="title-gradient">Buat AI Kamu Sendiri</h1>
                <p>Kustomisasi kepribadian AI sesuai keinginanmu!</p>
            </header>

            <form className="setup-form" onSubmit={handleSubmit}>
                {/* AI Name */}
                <div className="form-group">
                    <label>🏷️ Nama AI</label>
                    <input
                        type="text"
                        placeholder="Contoh: Luna, Max, Aria..."
                        value={config.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                    />
                </div>

                {/* Age & Gender */}
                <div className="form-row">
                    <div className="form-group">
                        <label>🎂 Umur (opsional)</label>
                        <input
                            type="text"
                            placeholder="Contoh: 25 tahun"
                            value={config.age}
                            onChange={(e) => handleChange('age', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>👤 Gender</label>
                        <select
                            value={config.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                        >
                            <option value="netral">Netral</option>
                            <option value="pria">Pria</option>
                            <option value="wanita">Wanita</option>
                        </select>
                    </div>
                </div>

                {/* Speaking Style */}
                <div className="form-group">
                    <label>🗣️ Gaya Bicara</label>
                    <select
                        value={config.speakingStyle}
                        onChange={(e) => handleChange('speakingStyle', e.target.value)}
                    >
                        <option value="santai">Santai & Casual</option>
                        <option value="formal">Formal & Profesional</option>
                        <option value="gaul">Gaul & Slang</option>
                        <option value="puitis">Puitis & Artistic</option>
                        <option value="pendek">Singkat & To the Point</option>
                    </select>
                </div>

                {/* Personality Traits */}
                <div className="form-group">
                    <label>✨ Sifat AI (pilih beberapa)</label>
                    <div className="personality-chips">
                        {PERSONALITY_TRAITS.map(trait => (
                            <button
                                key={trait.id}
                                type="button"
                                className={`personality-chip ${config.personality.includes(trait.id) ? 'selected' : ''}`}
                                onClick={() => togglePersonality(trait.id)}
                            >
                                {trait.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Description */}
                <div className="form-group">
                    <label>📝 Deskripsi Tambahan (opsional)</label>
                    <textarea
                        placeholder="Tambahkan detail khusus tentang AI kamu, misalnya: 'Suka membahas anime' atau 'Ahli dalam programming'..."
                        value={config.customDescription}
                        onChange={(e) => handleChange('customDescription', e.target.value)}
                    />
                    <span className="form-hint">Tulis apapun yang ingin kamu tambahkan ke kepribadian AI</span>
                </div>

                {/* Actions */}
                <div className="setup-actions">
                    <button type="button" className="reset-btn" onClick={handleReset}>
                        Reset
                    </button>
                    <button type="submit" className="start-btn" disabled={!isValid}>
                        🚀 Mulai Chat
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AISetup;
