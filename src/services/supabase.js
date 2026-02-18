// ══════════════════════════════════════════════════════════════
// Inline Supabase Client — zero CDN, immune to tracking prev.
// Uses Supabase REST + Auth API directly via fetch().
// ══════════════════════════════════════════════════════════════
import { sessionStore } from './sessionStore';

const BASE = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON;
const SESSION_KEY = 'session';

let _session = null;
let _authListeners = [];
let _refreshTimer = null;

function headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', apikey: KEY, ...extra };
    if (_session?.access_token) h['Authorization'] = 'Bearer ' + _session.access_token;
    return h;
}

async function apiFetch(path, opts = {}) {
    const r = await fetch(BASE + path, { ...opts, headers: headers(opts.headers || {}) });
    let body = {};
    try { body = await r.json(); } catch (_) { }
    return { ok: r.ok, status: r.status, data: body };
}

function saveSession(s) {
    _session = s;
    if (s) sessionStore.set(SESSION_KEY, JSON.stringify(s));
    else sessionStore.del(SESSION_KEY);
}

function loadSession() {
    const raw = sessionStore.get(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (_) { return null; }
}

function scheduleRefresh(expiresAt) {
    if (_refreshTimer) clearTimeout(_refreshTimer);
    const msLeft = (expiresAt * 1000) - Date.now() - 60000;
    if (msLeft <= 0) { refreshSession(); return; }
    _refreshTimer = setTimeout(refreshSession, Math.min(msLeft, 2147483647));
}

async function refreshSession() {
    if (!_session?.refresh_token) { signOut(); return; }
    const r = await apiFetch('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: _session.refresh_token })
    });
    if (r.ok && r.data.access_token) {
        const s = { ...r.data, user: r.data.user || _session.user };
        saveSession(s);
        scheduleRefresh(s.expires_at);
        emit('TOKEN_REFRESHED', s);
    } else {
        saveSession(null);
        emit('SIGNED_OUT', null);
    }
}

function emit(event, session) {
    _authListeners.forEach(fn => fn(event, session));
}

async function signOut() {
    if (_session?.access_token) {
        await apiFetch('/auth/v1/logout', { method: 'POST' }).catch(() => { });
    }
    if (_refreshTimer) clearTimeout(_refreshTimer);
    saveSession(null);
    emit('SIGNED_OUT', null);
    return { error: null };
}

// ── Auth API ──
export const auth = {
    onAuthStateChange(cb) {
        _authListeners.push(cb);
        setTimeout(() => cb(_session ? 'INITIAL_SESSION' : 'SIGNED_OUT', _session), 0);
        return {
            data: {
                subscription: {
                    unsubscribe: () => { _authListeners = _authListeners.filter(f => f !== cb); }
                }
            }
        };
    },

    async getSession() {
        if (_session) return { data: { session: _session }, error: null };
        const s = loadSession();
        if (s) {
            if (s.expires_at && Date.now() / 1000 > s.expires_at - 60) {
                const r = await apiFetch('/auth/v1/token?grant_type=refresh_token', {
                    method: 'POST',
                    body: JSON.stringify({ refresh_token: s.refresh_token })
                });
                if (r.ok && r.data.access_token) {
                    const ns = { ...r.data, user: r.data.user || s.user };
                    saveSession(ns);
                    scheduleRefresh(ns.expires_at);
                    _session = ns;
                    return { data: { session: ns }, error: null };
                } else {
                    saveSession(null);
                    return { data: { session: null }, error: null };
                }
            }
            _session = s;
            scheduleRefresh(s.expires_at);
            return { data: { session: s }, error: null };
        }
        return { data: { session: null }, error: null };
    },

    async signInWithPassword({ email, password }) {
        const r = await apiFetch('/auth/v1/token?grant_type=password', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (r.ok && r.data.access_token) {
            const s = { ...r.data };
            saveSession(s);
            scheduleRefresh(s.expires_at);
            emit('SIGNED_IN', s);
            return { data: { session: s, user: s.user }, error: null };
        }
        const msg = r.data?.error_description || r.data?.msg || r.data?.message || 'Invalid login credentials';
        return { data: null, error: { message: msg } };
    },

    async signUp({ email, password }) {
        const r = await apiFetch('/auth/v1/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (r.status === 400) {
            const msg = r.data?.msg || r.data?.message || 'Sign up failed';
            return { data: null, error: { message: msg.includes('already') ? 'User already registered' : msg } };
        }
        if (r.ok) {
            const s = r.data.access_token ? r.data : null;
            if (s) { saveSession(s); scheduleRefresh(s.expires_at); emit('SIGNED_IN', s); }
            return { data: { session: s, user: r.data.user || (s && s.user) || null }, error: null };
        }
        return { data: null, error: { message: r.data?.message || 'Sign up failed' } };
    },

    signOut
};

// ── PostgREST Query Builder ──
function qb(table) {
    let _method = 'GET';
    let _body = null;
    let _params = [];
    let _headers = {};

    const q = {
        select(cols = '*') { _params.push(['select', cols]); return q; },
        eq(col, val) { _params.push([col + '.eq', val]); return q; },
        order(col, { ascending = true } = {}) {
            _params.push(['order', col + (ascending ? '.asc' : '.desc')]); return q;
        },
        insert(rows) {
            _method = 'POST';
            _body = JSON.stringify(Array.isArray(rows) ? rows : [rows]);
            _headers['Prefer'] = 'return=representation';
            return q;
        },
        upsert(rows, { onConflict } = {}) {
            _method = 'POST';
            _body = JSON.stringify(Array.isArray(rows) ? rows : [rows]);
            _headers['Prefer'] = 'resolution=merge-duplicates,return=representation';
            if (onConflict) _params.push(['on_conflict', onConflict]);
            return q;
        },
        delete() { _method = 'DELETE'; _headers['Prefer'] = 'return=representation'; return q; },

        async then(resolve) {
            const qs = _params.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
            const url = BASE + '/rest/v1/' + table + (qs ? '?' + qs : '');
            try {
                const r = await fetch(url, {
                    method: _method,
                    headers: { ...headers(_headers) },
                    body: _body || undefined
                });
                let data = null;
                try { data = await r.json(); } catch (_) { data = []; }
                if (!r.ok) {
                    const code = data?.code || (r.status === 404 ? '42P01' : String(r.status));
                    resolve({ data: null, error: { message: data?.message || data?.hint || 'Request failed', code } });
                } else {
                    resolve({ data: Array.isArray(data) ? data : (data ? [data] : []), error: null });
                }
            } catch (e) {
                resolve({ data: null, error: { message: e.message } });
            }
        }
    };
    return q;
}

export function from(table) { return qb(table); }

// ── Connectivity Check ──
let _sbOnline = null;
export async function checkSupabase() {
    if (_sbOnline !== null) return _sbOnline;
    try {
        const r = await fetch(BASE + '/rest/v1/', {
            headers: { apikey: KEY },
            signal: AbortSignal.timeout(4000)
        });
        _sbOnline = r.status < 500;
    } catch (_) {
        _sbOnline = false;
    }
    return _sbOnline;
}

// ── Boot: restore session ──
(async () => {
    const { data: { session } } = await auth.getSession();
    if (session) emit('INITIAL_SESSION', session);
    else emit('SIGNED_OUT', null);
})();
