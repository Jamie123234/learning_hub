import './SkeletonCard.css';

export default function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-thumb shimmer" />
            <div className="skeleton-body">
                <div className="skeleton-tag shimmer" />
                <div className="skeleton-title shimmer" />
                <div className="skeleton-desc shimmer" />
                <div className="skeleton-desc short shimmer" />
            </div>
            <div className="skeleton-footer">
                <div className="skeleton-btn shimmer" />
            </div>
        </div>
    );
}
