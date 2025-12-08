import React from 'react';
import './ResultView.css';

const ResultView = ({ data, onReset }) => {
    const { playlist, image, quote } = data;

    // Use high-res image for background
    // We can set it on the body or here. Setting on a fixed background div is cleaner.

    return (
        <div className="result-container" style={{ backgroundImage: `url(${image.urls.regular})` }}>
            <div className="overlay"></div>

            <div className="content-wrapper">
                <blockquote className="quote-card glass-panel">
                    <p>"{quote}"</p>
                </blockquote>

                <div className="player-card glass-panel">
                    {playlist ? (
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <p>Playlist not found.</p>
                        </div>
                    )}
                </div>

                <div className="actions">
                    <button onClick={onReset} className="btn-primary glass-panel" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
                        Different Mood?
                    </button>
                    <a
                        href={image.links.html}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="credit-link"
                    >
                        Photo by {image.user.name} on Unsplash
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResultView;
