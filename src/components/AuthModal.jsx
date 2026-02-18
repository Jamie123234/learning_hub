import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, checkSupabase } from '../services/supabase';
import { getPasswordStrength } from '../utils/helpers';
import { X, Eye, EyeOff, Mail, Lock, Sparkles, BookOpen, BarChart3, Zap, ArrowRight } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (!isOpen) { setEmail(''); setPassword(''); setConfirm(''); setMsg(null); setShowPw(false); setShowConfirm(false); setMode('signin'); }
        const handleKey = e => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKey);
        }
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
    }, [isOpen, onClose]);

    const pwStrength = getPasswordStrength(password);
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['', '#ef4444', '#f59e0b', '#6366f1', '#10b981'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        if (!email || !password) { setMsg({ type: 'error', text: '⚠️ Please fill in all fields.' }); return; }

        if (mode === 'signup') {
            if (password.length < 6) { setMsg({ type: 'error', text: '⚠️ Password must be at least 6 characters.' }); return; }
            if (password !== confirm) { setMsg({ type: 'error', text: '❌ Passwords do not match.' }); return; }
        }

        const online = await checkSupabase();
        if (!online) { setMsg({ type: 'error', text: '⚠️ Cannot reach server. Try again later.' }); return; }

        setLoading(true);

        if (mode === 'signin') {
            const { error } = await auth.signInWithPassword({ email, password });
            setLoading(false);
            if (error) {
                const m = error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials')
                    ? '❌ Incorrect email or password.'
                    : '❌ ' + error.message;
                setMsg({ type: 'error', text: m });
            } else {
                onClose();
            }
        } else {
            const { data, error } = await auth.signUp({ email, password });
            setLoading(false);
            if (error) {
                const m = error.message.toLowerCase().includes('already')
                    ? '❌ An account with this email already exists. Try signing in.'
                    : '❌ ' + error.message;
                setMsg({ type: 'error', text: m });
            } else if (!data.session) {
                setMsg({ type: 'success', text: '✅ Account created! Check your email to confirm, then sign in.' });
            } else {
                onClose();
            }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
        exit: { opacity: 0, x: -20 },
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="auth-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="auth-modal"
                        initial={{ scale: 0.9, opacity: 0, y: 30, filter: 'blur(6px)' }}
                        animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ scale: 0.9, opacity: 0, y: 30, filter: 'blur(6px)' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Left Panel — Brand Showcase */}
                        <div className="auth-left">
                            {/* Animated background elements */}
                            <div className="auth-bg-decor">
                                <div className="auth-gradient-orb orb-a" />
                                <div className="auth-gradient-orb orb-b" />
                                <div className="auth-grid-lines" />
                                <div className="auth-orb-rings">
                                    <div className="ring ring-1" />
                                    <div className="ring ring-2" />
                                    <div className="ring ring-3" />
                                </div>
                                <div className="floating-dots">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className={`fdot fdot-${i + 1}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="auth-left-content">
                                <div className="auth-logo-mark">
                                    <div className="auth-logo-inner">
                                        <Zap size={22} />
                                    </div>
                                </div>

                                <motion.h2
                                    className="auth-welcome"
                                    key={mode}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {mode === 'signin' ? 'Welcome back' : 'Start your journey'}
                                </motion.h2>
                                <motion.p
                                    className="auth-sub"
                                    key={mode + '-sub'}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.18 }}
                                >
                                    {mode === 'signin'
                                        ? 'Continue your learning where you left off'
                                        : 'Join thousands of learners on LearnHub'}
                                </motion.p>

                                <div className="auth-features">
                                    <div className="af-item">
                                        <div className="af-icon"><BookOpen size={15} /></div>
                                        <div className="af-text">
                                            <span className="af-title">Track Progress</span>
                                            <span className="af-desc">Resume courses right where you left off</span>
                                        </div>
                                    </div>
                                    <div className="af-item">
                                        <div className="af-icon"><BarChart3 size={15} /></div>
                                        <div className="af-text">
                                            <span className="af-title">Personal Dashboard</span>
                                            <span className="af-desc">Stats, streaks, and category insights</span>
                                        </div>
                                    </div>
                                    <div className="af-item">
                                        <div className="af-icon"><Sparkles size={15} /></div>
                                        <div className="af-text">
                                            <span className="af-title">Cloud Sync</span>
                                            <span className="af-desc">Access your data from any device</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="auth-social-proof">
                                    <div className="avatar-stack">
                                        {['🧑‍💻', '👩‍🎓', '👨‍🔬', '👩‍💼'].map((e, i) => (
                                            <div key={i} className="stack-avatar" style={{ zIndex: 4 - i }}>{e}</div>
                                        ))}
                                    </div>
                                    <span className="proof-text">Trusted by <strong>2,000+</strong> learners</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel — Form */}
                        <div className="auth-right">
                            <button className="auth-close" onClick={onClose}><X size={16} /></button>

                            <div className="auth-right-inner">
                                <div className="auth-right-header">
                                    <h3 className="auth-form-title">
                                        {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
                                    </h3>
                                    <p className="auth-form-sub">
                                        {mode === 'signin' ? 'Enter your credentials below' : 'Fill in the details to get started'}
                                    </p>
                                </div>

                                {/* Tab switcher */}
                                <div className="auth-tabs">
                                    <button
                                        className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
                                        onClick={() => { setMode('signin'); setMsg(null); }}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                                        onClick={() => { setMode('signup'); setMsg(null); }}
                                    >
                                        Sign Up
                                    </button>
                                    <div className="tab-indicator" style={{ transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0)' }} />
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.form
                                        className="auth-form"
                                        key={mode}
                                        variants={formVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        onSubmit={handleSubmit}
                                    >
                                        {/* Email */}
                                        <motion.div className="field" variants={fieldVariants}>
                                            <div className="field-label-row">
                                                <Mail size={13} className="field-label-icon" />
                                                <label className="field-label">Email</label>
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="field-input"
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                            />
                                        </motion.div>

                                        {/* Password */}
                                        <motion.div className="field" variants={fieldVariants}>
                                            <div className="field-label-row">
                                                <Lock size={13} className="field-label-icon" />
                                                <label className="field-label">Password</label>
                                            </div>
                                            <div className="field-input-wrap">
                                                <input
                                                    type={showPw ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    className="field-input"
                                                    placeholder="••••••••"
                                                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                                                />
                                                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </motion.div>

                                        {/* Password strength */}
                                        {mode === 'signup' && password && (
                                            <motion.div className="strength-row" variants={fieldVariants}>
                                                <div className="strength-bar">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className={`strength-seg ${i <= pwStrength ? 'filled' : ''}`}
                                                            style={{ background: i <= pwStrength ? strengthColors[pwStrength] : undefined }} />
                                                    ))}
                                                </div>
                                                <span className="strength-label" style={{ color: strengthColors[pwStrength] }}>
                                                    {strengthLabels[pwStrength]}
                                                </span>
                                            </motion.div>
                                        )}

                                        {/* Confirm password */}
                                        {mode === 'signup' && (
                                            <motion.div className="field" variants={fieldVariants}>
                                                <div className="field-label-row">
                                                    <Lock size={13} className="field-label-icon" />
                                                    <label className="field-label">Confirm Password</label>
                                                </div>
                                                <div className="field-input-wrap">
                                                    <input
                                                        type={showConfirm ? 'text' : 'password'}
                                                        value={confirm}
                                                        onChange={e => setConfirm(e.target.value)}
                                                        className="field-input"
                                                        placeholder="••••••••"
                                                        autoComplete="new-password"
                                                    />
                                                    <button type="button" className="pw-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                                                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Messages */}
                                        {msg && (
                                            <motion.div
                                                className={`auth-msg msg-${msg.type}`}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                            >
                                                {msg.text}
                                            </motion.div>
                                        )}

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            className="auth-submit"
                                            disabled={loading}
                                            variants={fieldVariants}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {loading ? (
                                                <span className="auth-loading"><span className="dot-spinner" /> Processing…</span>
                                            ) : (
                                                <>
                                                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                                    <ArrowRight size={16} className="submit-arrow" />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                </AnimatePresence>

                                <div className="auth-divider">
                                    <span>or</span>
                                </div>

                                <div className="auth-switch">
                                    {mode === 'signin' ? (
                                        <>New to LearnHub? <button onClick={() => { setMode('signup'); setMsg(null); }}>Create a free account</button></>
                                    ) : (
                                        <>Already have an account? <button onClick={() => { setMode('signin'); setMsg(null); }}>Sign in instead</button></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
