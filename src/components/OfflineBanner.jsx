import { useApp } from '../context/AppContext';
import { WifiOff } from 'lucide-react';
import './OfflineBanner.css';

export default function OfflineBanner() {
    const { sbOnline } = useApp();

    if (sbOnline !== false) return null;

    return (
        <div className="offline-banner">
            <WifiOff size={14} />
            <span>You're offline — showing cached courses</span>
        </div>
    );
}
