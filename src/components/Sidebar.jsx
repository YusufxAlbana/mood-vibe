import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, theme, onToggleTheme }) => {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <NavLink to="/" className="sidebar-logo title-gradient" onClick={onClose}>
                        Mood Vibe
                    </NavLink>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                        end
                    >
                        <span className="nav-icon">📝</span>
                        <span>Mood Journal</span>
                    </NavLink>

                    <NavLink
                        to="/history"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        <span className="nav-icon">📜</span>
                        <span>History</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="theme-toggle-btn" onClick={onToggleTheme}>
                        <span>{theme === 'light' ? '🌙' : '☀️'}</span>
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
