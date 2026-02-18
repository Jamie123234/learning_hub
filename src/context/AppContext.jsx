import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { auth, from, checkSupabase } from '../services/supabase';
import { STATIC_COURSES } from '../data/staticCourses';

const AppContext = createContext(null);

export function useApp() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProgress, setUserProgress] = useState({});
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('lh_theme') || 'dark';
    });
    const [sbOnline, setSbOnline] = useState(null);
    const nullTimerRef = useRef(null);

    // ── Theme ──
    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('lh_theme', next);
            return next;
        });
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // ── Load courses ──
    const loadCourses = useCallback(async () => {
        setLoading(true);
        const online = await checkSupabase();
        setSbOnline(online);

        if (online) {
            try {
                const { data, error } = await from('courses').select('*').order('created_at', { ascending: false });
                if (!error && data && data.length > 0) {
                    const dbIds = new Set(data.map(r => r.video_id));
                    const dbCourses = data.map(r => ({
                        id: r.video_id, title: r.title, category: r.category,
                        summary: r.summary || r.description || '', dur: r.duration_minutes || 0, icon: r.icon || '🎓',
                    }));
                    setVideos([...dbCourses, ...STATIC_COURSES.filter(v => !dbIds.has(v.id))]);
                } else {
                    setVideos([...STATIC_COURSES]);
                }
            } catch (_) {
                setVideos([...STATIC_COURSES]);
            }
        } else {
            setVideos([...STATIC_COURSES]);
        }
        setLoading(false);
    }, []);

    // ── Load progress ──
    const loadProgress = useCallback(async (user) => {
        if (!user) { setUserProgress({}); return; }
        const online = await checkSupabase();
        if (!online) { setUserProgress({}); return; }
        const { data, error } = await from('course_progress').select('video_id,status').eq('user_id', user.id);
        if (!error && data) {
            const prog = {};
            data.forEach(r => { prog[r.video_id] = r.status; });
            setUserProgress(prog);
        }
    }, []);

    // ── Save progress ──
    const saveProgress = useCallback(async (videoId, status) => {
        if (!currentUser) return false;

        setUserProgress(prev => {
            const next = { ...prev };
            if (next[videoId] === status) {
                delete next[videoId];
                // Remove from DB
                checkSupabase().then(online => {
                    if (online) from('course_progress').delete().eq('user_id', currentUser.id).eq('video_id', videoId);
                });
                return next;
            }
            next[videoId] = status;
            // Upsert to DB
            checkSupabase().then(online => {
                if (online) {
                    from('course_progress').upsert(
                        { user_id: currentUser.id, video_id: videoId, status, updated_at: new Date().toISOString() },
                        { onConflict: 'user_id,video_id' }
                    );
                }
            });
            return next;
        });
        return true;
    }, [currentUser]);

    // ── Add course ──
    const addCourse = useCallback(async (courseData) => {
        const online = await checkSupabase();
        let error = null;
        if (online) {
            const result = await from('courses').insert([courseData]);
            error = result.error;
        } else {
            error = { message: 'OFFLINE', offline: true };
        }

        const newCourse = {
            id: courseData.video_id, title: courseData.title, category: courseData.category,
            summary: courseData.summary, dur: courseData.duration_minutes || 0, icon: courseData.icon || '🎓',
        };
        setVideos(prev => [newCourse, ...prev]);
        return { error };
    }, []);

    // ── Auth state listener ──
    useEffect(() => {
        const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                if (nullTimerRef.current) { clearTimeout(nullTimerRef.current); nullTimerRef.current = null; }
                setCurrentUser(session.user);
                await loadProgress(session.user);
            } else if (event === 'SIGNED_OUT') {
                if (nullTimerRef.current) { clearTimeout(nullTimerRef.current); nullTimerRef.current = null; }
                setCurrentUser(null);
                setUserProgress({});
            } else if (!session) {
                if (nullTimerRef.current) clearTimeout(nullTimerRef.current);
                nullTimerRef.current = setTimeout(() => {
                    nullTimerRef.current = null;
                    setCurrentUser(prev => {
                        if (!prev) setUserProgress({});
                        return prev;
                    });
                }, 500);
            }
        });

        return () => subscription.unsubscribe();
    }, [loadProgress]);

    // ── Init ──
    useEffect(() => { loadCourses(); }, [loadCourses]);

    // ── Computed: filtered videos ──
    const getFiltered = useCallback(() => {
        const q = searchQuery.toLowerCase();
        return videos.filter(v => {
            const mc = activeCategory === 'All' || v.category === activeCategory;
            const mq = !q || v.title.toLowerCase().includes(q) || v.summary.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
            return mc && mq;
        });
    }, [videos, activeCategory, searchQuery]);

    // ── Computed: categories with counts ──
    const categories = (() => {
        const catCount = {};
        videos.forEach(v => { catCount[v.category] = (catCount[v.category] || 0) + 1; });
        const allCats = ['All', ...new Set(videos.map(v => v.category))];
        return allCats.map(cat => ({
            name: cat,
            count: cat === 'All' ? videos.length : catCount[cat] || 0,
        }));
    })();

    // ── Computed: metrics ──
    const metrics = (() => {
        const totalMins = videos.reduce((s, v) => s + (v.dur || 0), 0);
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        const completed = Object.values(userProgress).filter(s => s === 'completed').length;
        const inProgress = Object.values(userProgress).filter(s => s === 'in-progress').length;
        const pct = videos.length > 0 ? Math.round((completed / videos.length) * 100) : 0;
        return {
            totalCourses: videos.length,
            totalContent: h + 'h' + (m > 0 ? ' ' + m + 'm' : ''),
            categoryCount: new Set(videos.map(v => v.category)).size,
            completed,
            inProgress,
            pct,
        };
    })();

    const value = {
        currentUser, userProgress, videos, loading,
        activeCategory, setActiveCategory,
        searchQuery, setSearchQuery,
        theme, toggleTheme,
        sbOnline,
        getFiltered, categories, metrics,
        saveProgress, addCourse, loadCourses,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
