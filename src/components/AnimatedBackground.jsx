import './AnimatedBackground.css';

export default function AnimatedBackground() {
    return (
        <div className="animated-bg" aria-hidden="true">
            <div className="bg-orb orb-a" />
            <div className="bg-orb orb-b" />
            <div className="bg-orb orb-c" />
            <div className="bg-particles">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`bg-particle p-${i + 1}`} />
                ))}
            </div>
        </div>
    );
}
