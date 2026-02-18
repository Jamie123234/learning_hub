import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { auth } from '../services/supabase';
import { X, LogOut, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import './AccountPanel.css';

export default function AccountPanel({ isOpen, onClose }) {
    const { currentUser, userProgress, videos } = useApp();

    if (!currentUser) return null;

    const email = currentUser.email || 'User';
    const initial = email.substring(0, 1).toUpperCase();
    const completed = Object.entries(userProgress).filter(([, s]) => s === 'completed');
    const inProgress = Object.entries(userProgress).filter(([, s]) => s === 'in-progress');
    const totalTracked = completed.length + inProgress.length;
    const pct = videos.length > 0 ? Math.round((completed.length / videos.length) * 100) : 0;

    // Category breakdown
    const catBreakdown = {};
    videos.forEach(v => {
        if (!catBreakdown[v.category]) catBreakdown[v.category] = { total: 0, completed: 0 };
        catBreakdown[v.category].total++;
        if (userProgress[v.id] === 'completed') catBreakdown[v.category].completed++;
    });

    const handleSignOut = async () => {
        await auth.signOut();
        onClose();
    };

    // SVG donut chart
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="panel-backdrop"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.aside
                        className="account-panel"
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="ap-header">
                            <div className="ap-user">
                                <div className="ap-avatar">{initial}</div>
                                <div className="ap-user-info">
                                    <h3 className="ap-name">{email}</h3>
                                    <span className="ap-role">Learner</span>
                                </div>
                            </div>
                            <button className="ap-close" onClick={onClose}><X size={16} /></button>
                        </div>

                        <div className="ap-body">
                            {/* Stats */}
                            <div className="ap-stats">
                                <div className="ap-stat">
                                    <CheckCircle size={16} className="stat-icon green" />
                                    <div><span className="stat-val">{completed.length}</span><span className="stat-lbl">Completed</span></div>
                                </div>
                                <div className="ap-stat">
                                    <BookOpen size={16} className="stat-icon amber" />
                                    <div><span className="stat-val">{inProgress.length}</span><span className="stat-lbl">In Progress</span></div>
                                </div>
                                <div className="ap-stat">
                                    <TrendingUp size={16} className="stat-icon indigo" />
                                    <div><span className="stat-val">{totalTracked}</span><span className="stat-lbl">Tracked</span></div>
                                </div>
                            </div>

                            {/* Progress Ring */}
                            <div className="ap-ring-wrap">
                                <svg viewBox="0 0 100 100" className="ap-ring">
                                    <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
                                    <circle cx="50" cy="50" r={radius} fill="none" stroke="url(#ringGrad)"
                                        strokeWidth="6" strokeLinecap="round"
                                        strokeDasharray={circumference} strokeDashoffset={offset}
                                        transform="rotate(-90 50 50)"
                                        style={{ transition: 'stroke-dashoffset .8s ease-out' }}
                                    />
                                    <defs>
                                        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="ap-ring-label">
                                    <span className="ring-pct">{pct}%</span>
                                    <span className="ring-sub">Complete</span>
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            {Object.keys(catBreakdown).length > 0 && (
                                <div className="ap-section">
                                    <h4 className="ap-section-title">By Category</h4>
                                    {Object.entries(catBreakdown).map(([cat, data]) => {
                                        const catPct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                                        return (
                                            <div key={cat} className="cat-progress">
                                                <div className="cat-prog-header">
                                                    <span className="cat-prog-name">{cat}</span>
                                                    <span className="cat-prog-frac">{data.completed}/{data.total}</span>
                                                </div>
                                                <div className="cat-prog-bar">
                                                    <div className="cat-prog-fill" style={{ width: catPct + '%' }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* In Progress */}
                            {inProgress.length > 0 && (
                                <div className="ap-section">
                                    <h4 className="ap-section-title">📖 Currently Watching</h4>
                                    {inProgress.map(([id]) => {
                                        const v = videos.find(x => x.id === id);
                                        if (!v) return null;
                                        return (
                                            <div key={id} className="ap-course-item">
                                                <img src={`https://img.youtube.com/vi/${id}/default.jpg`} alt="" className="ap-thumb" />
                                                <span className="ap-course-title">{v.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Completed */}
                            {completed.length > 0 && (
                                <div className="ap-section">
                                    <h4 className="ap-section-title">✅ Completed</h4>
                                    {completed.map(([id]) => {
                                        const v = videos.find(x => x.id === id);
                                        if (!v) return null;
                                        return (
                                            <div key={id} className="ap-course-item">
                                                <img src={`https://img.youtube.com/vi/${id}/default.jpg`} alt="" className="ap-thumb" />
                                                <span className="ap-course-title">{v.title}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="ap-footer">
                            <button className="ap-signout" onClick={handleSignOut}>
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
