// ══════════════════════════════════════════════════════════════
// Cookie-based Session Store — Tracking Prevention immune
// Uses chunked cookies to stay under 4KB per cookie limit
// ══════════════════════════════════════════════════════════════

const PRE = 'lh_';
const CHUNK = 3800;

function cGet(k) {
  const m = document.cookie.match('(?:^|;)\\s*' + encodeURIComponent(PRE + k) + '=([^;]*)');
  return m ? decodeURIComponent(m[1]) : null;
}

function cSet(k, v) {
  const exp = new Date(Date.now() + 30 * 864e5).toUTCString();
  document.cookie = encodeURIComponent(PRE + k) + '=' + encodeURIComponent(v) +
    ';expires=' + exp + ';path=/;SameSite=Lax';
}

function cDel(k) {
  document.cookie = encodeURIComponent(PRE + k) +
    '=;expires=Thu,01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
}

export const sessionStore = {
  get(k) {
    const c0 = cGet(k + '_0');
    if (c0 !== null) {
      let v = c0, i = 1, c;
      while ((c = cGet(k + '_' + i)) !== null) { v += c; i++; }
      return v;
    }
    return cGet(k);
  },

  set(k, v) {
    for (let i = 0; i < 12; i++) cDel(k + '_' + i);
    cDel(k);
    if (!v) return;
    if (v.length <= CHUNK) { cSet(k, v); return; }
    for (let i = 0, pos = 0; pos < v.length; pos += CHUNK, i++)
      cSet(k + '_' + i, v.slice(pos, pos + CHUNK));
  },

  del(k) {
    for (let i = 0; i < 12; i++) cDel(k + '_' + i);
    cDel(k);
  }
};
