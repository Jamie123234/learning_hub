import { AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CourseCard from './CourseCard';
import SkeletonCard from './SkeletonCard';
import { Search } from 'lucide-react';
import './CourseGrid.css';

export default function CourseGrid({ onWatch, onOpenAuth }) {
    const { getFiltered, loading, currentUser, userProgress, saveProgress, activeCategory } = useApp();
    const filtered = getFiltered();

    const handleProgress = (videoId, status) => {
        if (!currentUser) { onOpenAuth(); return; }
        saveProgress(videoId, status);
    };

    return (
        <div className="course-grid-wrap">
            <div className="grid-header">
                <h2 className="main-title">{activeCategory === 'All' ? 'All Courses' : activeCategory}</h2>
                <span className="results-count">{loading ? '...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}</span>
            </div>

            {loading ? (
                <div className="video-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><Search size={48} /></div>
                    <h3>No courses found</h3>
                    <p>Try a different search or category.</p>
                </div>
            ) : (
                <div className="video-grid">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((v, i) => (
                            <CourseCard
                                key={v.id}
                                video={v}
                                status={userProgress[v.id]}
                                onWatch={onWatch}
                                onProgress={handleProgress}
                                isLoggedIn={!!currentUser}
                                index={i}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
