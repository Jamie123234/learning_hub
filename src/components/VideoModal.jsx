import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { X, BookOpen, CheckCircle } from 'lucide-react';
import './VideoModal.css';

// ── Load the YouTube IFrame API script once ──
let ytApiReady = false;
let ytApiCallbacks = [];

function ensureYTApi() {
    return new Promise((resolve) => {
        if (ytApiReady && window.YT?.Player) { resolve(); return; }
        ytApiCallbacks.push(resolve);
        if (document.getElementById('yt-iframe-api')) return; // already loading

        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            ytApiReady = true;
            ytApiCallbacks.forEach(cb => cb());
            ytApiCallbacks = [];
        };
    });
}

// ── localStorage helpers ──
const STORAGE_KEY = 'lh_video_progress';

function getSavedTime(videoId) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return data[videoId] || 0;
    } catch { return 0; }
}

function setSavedTime(videoId, time) {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        data[videoId] = Math.floor(time);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
}

export default function VideoModal({ isOpen, videoId, title, onClose, onOpenAuth }) {
    const { currentUser, userProgress, saveProgress } = useApp();
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const intervalRef = useRef(null);
    const [resumeTime, setResumeTime] = useState(0);

    // ── Save position periodically ──
    const startTracking = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            try {
                const player = playerRef.current;
                if (player && typeof player.getCurrentTime === 'function') {
                    const t = player.getCurrentTime();
                    if (t > 0) setSavedTime(videoId, t);
                }
            } catch { /* player may not be ready */ }
        }, 3000);
    }, [videoId]);

    const stopTracking = useCallback(() => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        // Final save
        try {
            const player = playerRef.current;
            if (player && typeof player.getCurrentTime === 'function') {
                const t = player.getCurrentTime();
                if (t > 0) setSavedTime(videoId, t);
            }
        } catch { /* ignore */ }
    }, [videoId]);

    // ── Init / destroy player ──
    useEffect(() => {
        if (!isOpen || !videoId) return;

        let destroyed = false;
        const savedTime = getSavedTime(videoId);
        setResumeTime(savedTime);

        ensureYTApi().then(() => {
            if (destroyed) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                videoId,
                playerVars: {
                    autoplay: 1,
                    start: Math.floor(savedTime),
                    modestbranding: 1,
                    rel: 0,
                },
                events: {
                    onReady: () => {
                        if (!destroyed) startTracking();
                    },
                    onStateChange: (e) => {
                        // 1 = playing, 2 = paused
                        if (e.data === 1) startTracking();
                        else if (e.data === 2) stopTracking();
                    },
                },
            });
        });

        return () => {
            destroyed = true;
            stopTracking();
            try { playerRef.current?.destroy(); } catch { /* ignore */ }
            playerRef.current = null;
        };
    }, [isOpen, videoId, startTracking, stopTracking]);

    // ── Escape key & body scroll ──
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKey);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, [isOpen, onClose]);

    const status = userProgress[videoId];

    const handleProgress = (s) => {
        if (!currentUser) { onClose(); onOpenAuth(); return; }
        saveProgress(videoId, s);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="video-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="video-modal"
                        initial={{ scale: 0.85, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="vm-header">
                            <h3 className="vm-title">{title}</h3>
                            {resumeTime > 5 && (
                                <span className="vm-resume-badge">
                                    Resuming from {formatTime(resumeTime)}
                                </span>
                            )}
                            <button className="vm-close" onClick={onClose}><X size={18} /></button>
                        </div>
                        <div className="vm-player">
                            <div ref={containerRef} />
                        </div>
                        <div className="vm-footer">
                            {currentUser ? (
                                <>
                                    <span className="vm-footer-label">Track your progress:</span>
                                    <div className="vm-prog-btns">
                                        <button
                                            className={`vm-prog-btn ${status === 'in-progress' ? 'active-ip' : ''}`}
                                            onClick={() => handleProgress('in-progress')}
                                        >
                                            <BookOpen size={14} /> In Progress
                                        </button>
                                        <button
                                            className={`vm-prog-btn ${status === 'completed' ? 'active-comp' : ''}`}
                                            onClick={() => handleProgress('completed')}
                                        >
                                            <CheckCircle size={14} /> Completed
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <span className="vm-no-auth">
                                    ✨ <a href="#" onClick={e => { e.preventDefault(); onClose(); onOpenAuth(); }}>Sign in</a> to track your progress
                                </span>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

