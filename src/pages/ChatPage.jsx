import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/gemini';
import AISetup from './AISetup';
import './ChatPage.css';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiConfig, setAiConfig] = useState(null);
    const [showSetup, setShowSetup] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Check if there's existing config
        const saved = localStorage.getItem('ai_personality_config');
        if (saved) {
            const config = JSON.parse(saved);
            if (config.name) {
                setAiConfig(config);
                setShowSetup(false);
            }
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSetupComplete = (config) => {
        setAiConfig(config);
        setShowSetup(false);
        setMessages([]); // Reset chat with new AI
    };

    const handleEditAI = () => {
        setShowSetup(true);
    };

    const handleSend = async (messageText = input) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: messageText.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Build conversation history for context
        const history = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const response = await sendMessage(messageText.trim(), history, aiConfig);

        if (response.success) {
            setMessages(prev => [...prev, {
                role: 'model',
                content: response.message
            }]);
        } else {
            setMessages(prev => [...prev, {
                role: 'model',
                content: `⚠️ Error: ${response.message}`
            }]);
        }

        setIsLoading(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getSuggestions = () => {
        const name = aiConfig?.name || 'AI';
        return [
            `Halo ${name}! 👋`,
            "Ceritakan tentang dirimu",
            "Rekomendasikan lagu untukku",
            "Apa hobimu?"
        ];
    };

    // Show setup form if no config
    if (showSetup) {
        return <AISetup onComplete={handleSetupComplete} existingConfig={aiConfig} />;
    }

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="chat-header-content">
                    <h1 className="title-gradient">{aiConfig?.name || 'AI Chat'}</h1>
                    <p>
                        {aiConfig?.personality?.length > 0
                            ? `${aiConfig.gender !== 'netral' ? (aiConfig.gender === 'pria' ? '♂️' : '♀️') : '🤖'} ${aiConfig.speakingStyle}`
                            : 'Powered by Gemini'
                        }
                    </p>
                </div>
                <button className="edit-ai-btn" onClick={handleEditAI} title="Edit AI">
                    ⚙️
                </button>
            </header>

            {messages.length === 0 ? (
                <div className="chat-welcome">
                    <div className="welcome-icon">{aiConfig?.gender === 'wanita' ? '👩' : aiConfig?.gender === 'pria' ? '👨' : '🤖'}</div>
                    <h2 className="welcome-title title-gradient">Hai! Aku {aiConfig?.name}!</h2>
                    <p className="welcome-subtitle">
                        {aiConfig?.customDescription || `Aku siap membantu dan ngobrol denganmu. Tanya apa saja!`}
                    </p>
                    <div className="suggestion-chips">
                        {getSuggestions().map((suggestion, idx) => (
                            <button
                                key={idx}
                                className="suggestion-chip"
                                onClick={() => handleSend(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                            <div className="message-avatar">
                                {msg.role === 'user' ? '👤' : (aiConfig?.gender === 'wanita' ? '👩' : aiConfig?.gender === 'pria' ? '👨' : '🤖')}
                            </div>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-avatar">{aiConfig?.gender === 'wanita' ? '👩' : aiConfig?.gender === 'pria' ? '👨' : '🤖'}</div>
                            <div className="message-content typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            )}

            <div className="chat-input-container">
                <div className="chat-input-wrapper">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        placeholder={`Ketik pesan untuk ${aiConfig?.name || 'AI'}...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className="send-btn"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                    >
                        <span>Kirim</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
