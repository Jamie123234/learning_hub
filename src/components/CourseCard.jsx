import { motion } from 'framer-motion';
import { getCategoryColor } from '../data/categoryColors';
import { formatDuration } from '../utils/helpers';
import { Play, ExternalLink, BookOpen, CheckCircle } from 'lucide-react';
import './CourseCard.css';

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.88,
        rotateX: 8,
        filter: 'blur(8px)',
    },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
            mass: 0.8,
            delay: Math.min(i * 0.06, 0.6),
        },
    }),
};

export default function CourseCard({ video, status, onWatch, onProgress, isLoggedIn, index = 0 }) {
    const colors = getCategoryColor(video.category);
    const thumbUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;

    const handleProgress = (e, s) => {
        e.stopPropagation();
        if (onProgress) onProgress(video.id, s);
    };

    return (
        <motion.div
            className={`card ${status ? 'has-progress' : ''}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            layout
            style={{ perspective: 800 }}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
        >
            {/* Thumbnail */}
            <div className="card-thumb" onClick={() => onWatch(video.id, video.title)}>
                <img src={thumbUrl} alt={video.title} loading="lazy" className="thumb-img" />
                <div className="thumb-overlay">
                    <div className="play-circle"><Play size={20} fill="white" /></div>
                </div>
                {status === 'completed' && (
                    <div className="completed-badge"><CheckCircle size={12} /> Completed</div>
                )}
                {video.dur > 0 && (
                    <span className="dur-badge">{formatDuration(video.dur)}</span>
                )}
            </div>

            {/* Body */}
            <div className="card-body">
                <span className="cat-tag" style={{ background: colors.bg, color: colors.main, borderColor: colors.border }}>
                    {video.category}
                </span>
                <h3 className="card-title">{video.icon} {video.title}</h3>
                <p className="card-desc">{video.summary}</p>
            </div>

            {/* Actions */}
            <div className="card-footer">
                <button className="cta-btn" onClick={() => onWatch(video.id, video.title)}>
                    <Play size={13} /> Watch Now
                </button>
                <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ext-link"
                    title="Open on YouTube"
                    onClick={e => e.stopPropagation()}
                >
                    <ExternalLink size={13} />
                </a>
            </div>

            {/* Progress Actions */}
            {isLoggedIn && (
                <div className="card-progress-actions">
                    <button
                        className={`prog-btn ${status === 'in-progress' ? 'active-ip' : ''}`}
                        onClick={e => handleProgress(e, 'in-progress')}
                    >
                        <BookOpen size={12} /> {status === 'in-progress' ? 'Watching' : 'Start'}
                    </button>
                    <button
                        className={`prog-btn ${status === 'completed' ? 'active-comp' : ''}`}
                        onClick={e => handleProgress(e, 'completed')}
                    >
                        <CheckCircle size={12} /> {status === 'completed' ? 'Done' : 'Complete'}
                    </button>
                </div>
            )}

            {/* Progress bar */}
            {status && (
                <div className="card-progress-bar">
                    <div
                        className={`progress-fill ${status}`}
                        style={{ width: status === 'completed' ? '100%' : '35%' }}
                    />
                </div>
            )}
        </motion.div>
    );
}
