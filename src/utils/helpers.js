export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function formatDuration(minutes) {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
    return `${m}m`;
}

export function extractYoutubeId(input) {
    if (!input) return null;
    input = input.trim();
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
        /^([A-Za-z0-9_-]{11})$/,
    ];
    for (const p of patterns) {
        const m = input.match(p);
        if (m) return m[1];
    }
    return null;
}

export function getPasswordStrength(val) {
    let s = 0;
    if (val.length >= 6) s++;
    if (val.length >= 10) s++;
    if (/[A-Z]/.test(val) || /[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    return s; // 0-4
}

export const QUICK_ICONS = [
    '🎓', '🖥️', '📱', '🧠', '⚙️', '🔐', '🗄️', '📊', '🐍', '☁️',
    '🎮', '🧪', '🤖', '🦀', '🐳', '🐹', '📐', '⚡', '💚', '📘',
    '🛠️', '🏗️', '⌨️', '🧩', '👁️', '☕', '🕵️', '▲', '🎯', '📚'
];
