import { useApp } from '../context/AppContext';
import { Search, Plus, Moon, Sun, User, LogIn } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onOpenAuth, onOpenAccount, onOpenAddCourse }) {
    const { currentUser, theme, toggleTheme, searchQuery, setSearchQuery, metrics } = useApp();

    return (
        <nav className="navbar">
            <div className="nav-inner">
                <div className="logo" onClick={() => { setSearchQuery(''); }}>
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
                </div>
            </div>
        </nav>
    );
}
