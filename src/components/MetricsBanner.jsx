import { useApp } from '../context/AppContext';
import { useEffect, useState, useRef } from 'react';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import './MetricsBanner.css';

function AnimatedNumber({ value, duration = 1200 }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const num = parseInt(value, 10);
        if (isNaN(num)) { setDisplay(value); return; }
        let start = 0;
        const step = (ts) => {
            if (!ref.current) ref.current = ts;
            const prog = Math.min((ts - ref.current) / duration, 1);
            const eased = 1 - Math.pow(1 - prog, 3);
            setDisplay(Math.round(eased * num));
            if (prog < 1) requestAnimationFrame(step);
        };
        ref.current = null;
        requestAnimationFrame(step);
    }, [value, duration]);

    return <>{display}</>;
}

export default function MetricsBanner() {
    const { metrics, currentUser } = useApp();

    return (
        <div className="metrics-banner">
            <div className="metric-card m-indigo">
                <div className="metric-icon"><BookOpen size={18} /></div>
                <div className="metric-info">
                    <span className="metric-val"><AnimatedNumber value={metrics.totalCourses} /></span>
                    <span className="metric-label">Total Courses</span>
                </div>
            </div>
            <div className="metric-card m-amber">
                <div className="metric-icon"><Clock size={18} /></div>
                <div className="metric-info">
                    <span className="metric-val">{metrics.totalContent}</span>
                    <span className="metric-label">Content</span>
                </div>
            </div>
            {currentUser && (
                <div className="metric-card m-emerald">
                    <div className="metric-icon"><TrendingUp size={18} /></div>
                    <div className="metric-info">
                        <span className="metric-val"><AnimatedNumber value={metrics.pct} />%</span>
                        <span className="metric-label">Progress</span>
                    </div>
                </div>
            )}
        </div>
    );
}
