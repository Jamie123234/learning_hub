import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { X, BookOpen, CheckCircle } from 'lucide-react';
import './VideoModal.css';

export default function VideoModal({ isOpen, videoId, title, onClose, onOpenAuth }) {
    const { currentUser, userProgress, saveProgress } = useApp();

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
                            <button className="vm-close" onClick={onClose}><X size={18} /></button>
                        </div>
                        <div className="vm-player">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title={title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
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
