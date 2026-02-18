import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Moon, Sun, User, LogIn, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onOpenAuth, onOpenAccount, onOpenAddCourse }) {
    const { currentUser, theme, toggleTheme, searchQuery, setSearchQuery, metrics } = useApp();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

    const handleMobileAuth = () => {
        closeMobileNav();
        currentUser ? onOpenAccount() : onOpenAuth();
    };

    const handleMobileAddCourse = () => {
        closeMobileNav();
        onOpenAddCourse();
    };

    return (
        <nav className="navbar">
            <div className="nav-inner">
                <div className="logo" onClick={() => { setSearchQuery(''); closeMobileNav(); }}>
                    <div className="logo-icon">
                        <img src="/favicon.ico" alt="LearnHub" />
                    </div>
                    <span className="logo-text">LearnHub</span>
                </div>

                <div className="search-wrap">
                    <Search size={15} className="search-icon-el" />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search Python, React, Science…"
                        autoComplete="off"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="nav-actions">
                    <span className="count-badge">{metrics.totalCourses} Courses</span>

                    <button className="add-course-nav-btn" title="Add a course" onClick={onOpenAddCourse}>
                        <Plus size={14} />
                        <span>Add Course</span>
                    </button>

                    <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
                        {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
                    </button>

                    <button
                        className={`auth-nav-btn ${currentUser ? 'signed-in' : ''}`}
                        onClick={() => currentUser ? onOpenAccount() : onOpenAuth()}
                    >
                        {currentUser ? (
                            <>
                                <span className="user-avatar">
                                    {(currentUser.email || '?').substring(0, 1).toUpperCase()}
                                </span>
                                My Account
                            </>
                        ) : (
                            <>
                                <LogIn size={14} />
                                Sign In
                            </>
                        )}
                    </button>

                    <button
                        className="hamburger-btn"
                        onClick={() => setMobileNavOpen(v => !v)}
                        title="Menu"
                    >
                        {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile nav drawer */}
            <div className={`mobile-nav-drawer ${mobileNavOpen ? 'open' : ''}`}>
                <div className="mobile-nav-search">
                    <Search size={15} className="search-icon-el" />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search courses…"
                        autoComplete="off"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="mobile-nav-actions">
                    <button className="mobile-nav-btn add" onClick={handleMobileAddCourse}>
                        <Plus size={15} />
                        Add Course
                    </button>

                    <button className="mobile-nav-btn auth" onClick={handleMobileAuth}>
                        {currentUser ? (
                            <>
                                <span className="user-avatar">
                                    {(currentUser.email || '?').substring(0, 1).toUpperCase()}
                                </span>
                                My Account
                            </>
                        ) : (
                            <>
                                <LogIn size={15} />
                                Sign In
                            </>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
