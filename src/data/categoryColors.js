export const CATEGORY_COLORS = {
    'All': { main: '#6366f1', dark: '#4f46e5', glow: 'rgba(99,102,241,.35)', bg: 'rgba(99,102,241,.18)', text: '#c7d2fe', border: 'rgba(99,102,241,.4)', subtle: 'rgba(99,102,241,.1)' },
    'Web Development': { main: '#06b6d4', dark: '#0891b2', glow: 'rgba(6,182,212,.35)', bg: 'rgba(6,182,212,.18)', text: '#a5f3fc', border: 'rgba(6,182,212,.4)', subtle: 'rgba(6,182,212,.1)' },
    'Programming': { main: '#f59e0b', dark: '#d97706', glow: 'rgba(245,158,11,.35)', bg: 'rgba(245,158,11,.18)', text: '#fde68a', border: 'rgba(245,158,11,.4)', subtle: 'rgba(245,158,11,.1)' },
    'Computer Science': { main: '#8b5cf6', dark: '#7c3aed', glow: 'rgba(139,92,246,.35)', bg: 'rgba(139,92,246,.18)', text: '#ddd6fe', border: 'rgba(139,92,246,.4)', subtle: 'rgba(139,92,246,.1)' },
    'Data Science': { main: '#10b981', dark: '#059669', glow: 'rgba(16,185,129,.35)', bg: 'rgba(16,185,129,.18)', text: '#a7f3d0', border: 'rgba(16,185,129,.4)', subtle: 'rgba(16,185,129,.1)' },
    'DevOps': { main: '#f97316', dark: '#ea580c', glow: 'rgba(249,115,22,.35)', bg: 'rgba(249,115,22,.18)', text: '#fed7aa', border: 'rgba(249,115,22,.4)', subtle: 'rgba(249,115,22,.1)' },
    'Databases': { main: '#3b82f6', dark: '#2563eb', glow: 'rgba(59,130,246,.35)', bg: 'rgba(59,130,246,.18)', text: '#bfdbfe', border: 'rgba(59,130,246,.4)', subtle: 'rgba(59,130,246,.1)' },
    'Mobile Development': { main: '#ec4899', dark: '#db2777', glow: 'rgba(236,72,153,.35)', bg: 'rgba(236,72,153,.18)', text: '#fbcfe8', border: 'rgba(236,72,153,.4)', subtle: 'rgba(236,72,153,.1)' },
    'Software Engineering': { main: '#6366f1', dark: '#4f46e5', glow: 'rgba(99,102,241,.35)', bg: 'rgba(99,102,241,.18)', text: '#c7d2fe', border: 'rgba(99,102,241,.4)', subtle: 'rgba(99,102,241,.1)' },
    'Cybersecurity': { main: '#ef4444', dark: '#dc2626', glow: 'rgba(239,68,68,.35)', bg: 'rgba(239,68,68,.18)', text: '#fecaca', border: 'rgba(239,68,68,.4)', subtle: 'rgba(239,68,68,.1)' },
    'Backend Development': { main: '#14b8a6', dark: '#0d9488', glow: 'rgba(20,184,166,.35)', bg: 'rgba(20,184,166,.18)', text: '#99f6e4', border: 'rgba(20,184,166,.4)', subtle: 'rgba(20,184,166,.1)' },
    'Game Development': { main: '#a855f7', dark: '#9333ea', glow: 'rgba(168,85,247,.35)', bg: 'rgba(168,85,247,.18)', text: '#e9d5ff', border: 'rgba(168,85,247,.4)', subtle: 'rgba(168,85,247,.1)' },
    'Science & Maths': { main: '#22d3ee', dark: '#06b6d4', glow: 'rgba(34,211,238,.35)', bg: 'rgba(34,211,238,.18)', text: '#a5f3fc', border: 'rgba(34,211,238,.4)', subtle: 'rgba(34,211,238,.1)' },
    'Productivity': { main: '#84cc16', dark: '#65a30d', glow: 'rgba(132,204,22,.35)', bg: 'rgba(132,204,22,.18)', text: '#d9f99d', border: 'rgba(132,204,22,.4)', subtle: 'rgba(132,204,22,.1)' },
    'Other': { main: '#94a3b8', dark: '#64748b', glow: 'rgba(148,163,184,.35)', bg: 'rgba(148,163,184,.18)', text: '#e2e8f0', border: 'rgba(148,163,184,.4)', subtle: 'rgba(148,163,184,.1)' },
};

export function getCategoryColor(cat) {
    return CATEGORY_COLORS[cat] || CATEGORY_COLORS['Other'];
}
