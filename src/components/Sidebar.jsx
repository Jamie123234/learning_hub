import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCategoryColor } from '../data/categoryColors';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
    const { categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useApp();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className="sidebar">
            <div className="sidebar-sticky">
                {/* Mobile search */}
                <div className="mobile-search">
                    <input
                        className="search-input mobile-search-input"
                        type="text"
                        placeholder="Search courses…"
                        autoComplete="off"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-header">
                        <span className="sidebar-label">Categories</span>
                        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                            {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                            Filter
                        </button>
                    </div>
                    <div className={`category-list ${collapsed ? 'collapsed' : ''}`}>
                        {categories.map(cat => {
                            const colors = getCategoryColor(cat.name);
                            const isActive = cat.name === activeCategory;
                            return (
                                <button
                                    key={cat.name}
                                    className={`cat-btn ${isActive ? 'active' : ''}`}
                                    style={{
                                        '--cat-color': colors.main,
                                        '--cat-color-dark': colors.dark,
                                        '--cat-color-glow': colors.glow,
                                        '--cat-color-subtle': colors.subtle,
                                    }}
                                    onClick={() => setActiveCategory(cat.name)}
                                >
                                    <span className="cat-dot" style={{ background: isActive ? '#fff' : colors.main }} />
                                    {cat.name}
                                    <span className="cat-count" style={{
                                        background: isActive ? 'rgba(255,255,255,.2)' : colors.subtle,
                                        color: isActive ? '#fff' : colors.main,
                                    }}>
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
}
