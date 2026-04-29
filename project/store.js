// =====================================================================
// Collaborative store. Persists to localStorage + broadcasts across tabs
// via BroadcastChannel so two windows feel like a real-time backend.
// Architected so a real backend (Supabase / Firestore / etc.) can be
// dropped in later by replacing the load/save/subscribe internals.
// =====================================================================

(function () {
  const KEY = "s360.engagement.v1";
  const PRESENCE_KEY = "s360.engagement.presence.v1";
  const CH_NAME = "s360-engagement";
  const ch = ("BroadcastChannel" in window) ? new BroadcastChannel(CH_NAME) : null;

  // ---- Identity (the viewer) ------------------------------------
  function pickIdentity() {
    const url = new URL(location.href);
    const param = url.searchParams.get("as");
    const stored = localStorage.getItem("s360.me");
    const id = param || stored || "rey";
    if (param) localStorage.setItem("s360.me", param);
    return id;
  }
  const PEOPLE = {
    rey:  { id: "rey",  name: "Rey Dumasig", initials: "RD", color: "#5BB8D6", role: "AI Director" },
    adot: { id: "adot", name: "Adot Diuyan", initials: "AD", color: "#E8B976", role: "COO" },
  };
  const ME = PEOPLE[pickIdentity()] || PEOPLE.rey;

  // ---- Load / save ---------------------------------------------
  function deepSeed() {
    // Seed: marry the static SEED with a meta map for "last edited by".
    const seed = window.ENGAGEMENT_SEED || {};
    const meta = {}; // path -> { by, at }
    return { data: JSON.parse(JSON.stringify(seed)), meta, version: 1 };
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return deepSeed();
      const parsed = JSON.parse(raw);
      if (!parsed.data) return deepSeed();
      return parsed;
    } catch (e) {
      return deepSeed();
    }
  }
  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  let STATE = load();

  // ---- Subscriptions -------------------------------------------
  const listeners = new Set();
  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  function emit() { listeners.forEach(fn => fn(STATE)); }

  // ---- Path helpers (dot+index, e.g. "thisWeek.shipped.2") ----
  function getAt(obj, path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  function setAt(obj, path, value) {
    const keys = path.split(".");
    let o = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (o[keys[i]] == null) o[keys[i]] = {};
      o = o[keys[i]];
    }
    o[keys[keys.length - 1]] = value;
  }

  function update(path, value, opts = {}) {
    setAt(STATE.data, path, value);
    if (!opts.skipMeta) {
      // stamp the section root, not every leaf, so UI stays clean.
      const sectionRoot = path.split(".").slice(0, 2).join(".") || path;
      STATE.meta[sectionRoot] = { by: ME.id, at: Date.now() };
    }
    save(STATE);
    emit();
    if (ch) ch.postMessage({ kind: "state", state: STATE, from: ME.id });
  }

  function replace(newData) {
    STATE = { ...STATE, data: newData };
    save(STATE);
    emit();
    if (ch) ch.postMessage({ kind: "state", state: STATE, from: ME.id });
  }

  // ---- Cross-tab sync ------------------------------------------
  if (ch) {
    ch.onmessage = (ev) => {
      const m = ev.data;
      if (!m) return;
      if (m.kind === "state" && m.from !== ME.id) {
        STATE = m.state;
        emit();
      } else if (m.kind === "presence") {
        PRESENCE.set(m.who.id, { ...m.who, at: Date.now() });
        presenceEmit();
      } else if (m.kind === "typing") {
        TYPING.set(m.who + ":" + m.path, { who: m.who, path: m.path, at: Date.now() });
        presenceEmit();
      }
    };
  }

  // ---- Presence -------------------------------------------------
  const PRESENCE = new Map();
  PRESENCE.set(ME.id, { ...ME, at: Date.now() });
  const TYPING = new Map();
  const presenceListeners = new Set();
  function subscribePresence(fn) { presenceListeners.add(fn); return () => presenceListeners.delete(fn); }
  function presenceEmit() {
    // expire stale typings (10s) and presence (60s)
    const now = Date.now();
    for (const [k, v] of TYPING) if (now - v.at > 10000) TYPING.delete(k);
    for (const [k, v] of PRESENCE) if (k !== ME.id && now - v.at > 60000) PRESENCE.delete(k);
    presenceListeners.forEach(fn => fn({ presence: [...PRESENCE.values()], typing: [...TYPING.values()] }));
  }
  function ping() {
    if (ch) ch.postMessage({ kind: "presence", who: { ...ME, at: Date.now() } });
    presenceEmit();
  }
  setInterval(ping, 5000); ping();
  function announceTyping(path) {
    if (ch) ch.postMessage({ kind: "typing", who: ME.id, path });
    TYPING.set(ME.id + ":" + path, { who: ME.id, path, at: Date.now() });
    presenceEmit();
  }

  // ---- Weekly ritual: archive current week ----------------------
  function startNewWeek() {
    const d = STATE.data;
    const archived = {
      week: d.thisWeek.week,
      dates: d.thisWeek.dates,
      tldr: d.thisWeek.tldr,
      rag: d.client.overallRAG,
      shipped: [...(d.thisWeek.shipped || [])],
      next: [...(d.thisWeek.next || [])],
      risks: (d.thisWeek.risks || []).map(r => r.label),
      decisions: (d.thisWeek.decisions || []).map(x => x.label),
    };
    d.priorWeeks = [archived, ...(d.priorWeeks || [])];
    d.thisWeek = {
      week: d.thisWeek.week + 1,
      dates: "",
      tldr: "",
      workstreamRAG: (d.thisWeek.workstreamRAG || []).map(w => ({ ...w, note: "" })),
      shipped: [],
      next: [],
      risks: [],
      decisions: [],
      metrics: (d.thisWeek.metrics || []).map(m => ({ ...m, current: null })),
      progress: { ...(d.thisWeek.progress || {}), milestonesDone: d.thisWeek?.progress?.milestonesDone || 0 },
    };
    if (d.client) d.client.currentWeek = Math.min((d.client.currentWeek || 1) + 1, d.client.totalWeeks || d.client.currentWeek + 1);
    STATE.meta["thisWeek"] = { by: ME.id, at: Date.now() };
    save(STATE);
    emit();
    if (ch) ch.postMessage({ kind: "state", state: STATE, from: ME.id });
  }

  // ---- Stale check: was this section edited in the last 7 days? --
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  function isStale(sectionPath) {
    const m = STATE.meta[sectionPath];
    if (!m) return true;
    return Date.now() - m.at > WEEK_MS;
  }
  function lastEdited(sectionPath) {
    return STATE.meta[sectionPath] || null;
  }
  function fmtAgo(ts) {
    if (!ts) return "—";
    const s = (Date.now() - ts) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s/60) + "m ago";
    if (s < 86400) return Math.floor(s/3600) + "h ago";
    return Math.floor(s/86400) + "d ago";
  }

  // ---- Public API -----------------------------------------------
  window.STORE = {
    get: () => STATE,
    getData: () => STATE.data,
    update,
    replace,
    subscribe,
    subscribePresence,
    announceTyping,
    startNewWeek,
    isStale,
    lastEdited,
    fmtAgo,
    me: ME,
    PEOPLE,
    reset: () => { localStorage.removeItem(KEY); STATE = deepSeed(); save(STATE); emit(); if (ch) ch.postMessage({ kind: "state", state: STATE, from: ME.id }); },
    switchIdentity: (id) => {
      if (!PEOPLE[id]) return;
      localStorage.setItem("s360.me", id);
      location.search = "?as=" + id;
    },
  };

  // expose for debug
  window.ENGAGEMENT = STATE.data;
})();
