import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';
import { extractYoutubeId, QUICK_ICONS } from '../utils/helpers';
import { X, Link as LinkIcon, FileText, Tag, Clock, Sparkles } from 'lucide-react';
import './AddCourseModal.css';

const CATEGORIES = [
    'Web Development', 'Programming', 'Computer Science', 'Data Science',
    'DevOps', 'Databases', 'Mobile Development', 'Software Engineering',
    'Cybersecurity', 'Backend Development', 'Game Development',
    'Science & Maths', 'Productivity', 'Other'
];

export default function AddCourseModal({ isOpen, onClose }) {
    const { addCourse, videos } = useApp();
    const toast = useToast();

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [icon, setIcon] = useState('🎓');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [previewId, setPreviewId] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setUrl(''); setTitle(''); setCategory(CATEGORIES[0]);
            setDescription(''); setDuration(''); setIcon('🎓');
            setMsg(null); setPreviewId(null); setLoading(false);
        }
        const handleKey = e => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKey);
        }
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKey); };
    }, [isOpen, onClose]);

    useEffect(() => {
        const id = extractYoutubeId(url);
        setPreviewId(id);
    }, [url]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        const videoId = extractYoutubeId(url);
        if (!videoId) { setMsg({ type: 'error', text: '⚠️ Please enter a valid YouTube URL or video ID.' }); return; }
        if (!title.trim()) { setMsg({ type: 'error', text: '⚠️ Please enter a title.' }); return; }

        if (videos.some(v => v.id === videoId)) { setMsg({ type: 'error', text: '⚠️ This course already exists.' }); return; }

        setLoading(true);
        const courseData = {
            video_id: videoId,
            title: title.trim(),
            category,
            summary: description.trim(),
            description: description.trim(),
            duration_minutes: parseInt(duration, 10) || 0,
            icon,
            created_at: new Date().toISOString(),
        };

        const { error } = await addCourse(courseData);
        setLoading(false);

        if (error && !error.offline) {
            setMsg({ type: 'error', text: '❌ ' + (error.message || 'Failed to save.') });
        } else {
            toast(error?.offline ? '📡 Course added locally (offline)' : '✅ Course added!', error?.offline ? 'info' : 'success');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="addcourse-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="addcourse-modal"
                        initial={{ scale: 0.88, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.88, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 23 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="ac-header">
                            <h3 className="ac-title"><Sparkles size={16} /> Add New Course</h3>
                            <button className="ac-close" onClick={onClose}><X size={16} /></button>
                        </div>

                        {/* Loading bar */}
                        {loading && <div className="ac-loadbar"><div className="ac-loadbar-fill" /></div>}

                        <form className="ac-form" onSubmit={handleSubmit}>
                            {/* YouTube URL */}
                            <div className="ac-field">
                                <label className="ac-label"><LinkIcon size={13} /> YouTube URL or Video ID</label>
                                <input className="ac-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                            </div>

                            {/* Preview */}
                            {previewId && (
                                <div className="ac-preview">
                                    <img src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`} alt="Preview" />
                                </div>
                            )}

                            {/* Title */}
                            <div className="ac-field">
                                <label className="ac-label"><FileText size={13} /> Title</label>
                                <input className="ac-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title" />
                            </div>

                            {/* Category */}
                            <div className="ac-field">
                                <label className="ac-label"><Tag size={13} /> Category</label>
                                <select className="ac-select" value={category} onChange={e => setCategory(e.target.value)}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Description */}
                            <div className="ac-field">
                                <label className="ac-label">Description</label>
                                <textarea className="ac-textarea" value={description} onChange={e => setDescription(e.target.value)}
                                    placeholder="Brief description of the course" rows={3} />
                            </div>

                            {/* Duration + Icon */}
                            <div className="ac-row">
                                <div className="ac-field" style={{ flex: 1 }}>
                                    <label className="ac-label"><Clock size={13} /> Duration (min)</label>
                                    <input className="ac-input" type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="60" min="0" />
                                </div>
                                <div className="ac-field" style={{ flex: 1 }}>
                                    <label className="ac-label">Icon</label>
                                    <div className="icon-grid">
                                        {QUICK_ICONS.map(ic => (
                                            <button key={ic} type="button"
                                                className={`icon-opt ${icon === ic ? 'selected' : ''}`}
                                                onClick={() => setIcon(ic)}>{ic}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {msg && <div className={`ac-msg msg-${msg.type}`}>{msg.text}</div>}

                            <div className="ac-actions">
                                <button type="button" className="ac-cancel" onClick={onClose}>Cancel</button>
                                <button type="submit" className="ac-submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Add Course'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
