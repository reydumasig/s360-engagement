// =====================================================================
// Drawer + presence + edit affordances + form primitives.
// =====================================================================

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { STORE, PEOPLE } from '../store';
import { T } from './core';

// ---------- Store hooks ----------------------------------------------

export function useStore() {
  const [state, setState] = useState(() => STORE.get());
  useEffect(() => STORE.subscribe(setState), []);
  return state;
}

export function usePresence() {
  const [p, setP] = useState({ presence: [], typing: [] });
  useEffect(() => STORE.subscribePresence(setP), []);
  return p;
}

// ---------- Drawer host ----------------------------------------------

const DrawerCtx = createContext(null);

export function DrawerProvider({ children }) {
  const [drawer, setDrawer] = useState(null);
  const open = useCallback((spec) => setDrawer(spec), []);
  const close = useCallback(() => setDrawer(null), []);
  return (
    <DrawerCtx.Provider value={{ open, close, current: drawer }}>
      {children}
      <Drawer drawer={drawer} onClose={close} />
    </DrawerCtx.Provider>
  );
}

export function useDrawer() { return useContext(DrawerCtx); }

function Drawer({ drawer, onClose }) {
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer, onClose]);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(6,8,12,0.6)', backdropFilter: 'blur(4px)',
        opacity: drawer ? 1 : 0, pointerEvents: drawer ? 'auto' : 'none',
        transition: 'opacity .2s ease', zIndex: 90,
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, maxWidth: '100vw',
        background: '#0E131B', borderLeft: `1px solid ${T.border}`, zIndex: 100,
        transform: drawer ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .25s ease',
        display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
      }}>
        {drawer && (
          <>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.accent, textTransform: 'uppercase', marginBottom: 4 }}>EDIT</div>
                <div style={{ fontFamily: 'Sora', fontWeight: 500, fontSize: 18, color: T.text }}>{drawer.title}</div>
              </div>
              <button onClick={onClose} aria-label="Close" style={{
                background: 'transparent', border: `1px solid ${T.border}`, color: T.textDim,
                width: 32, height: 32, borderRadius: 2, cursor: 'pointer', fontSize: 16,
              }}>✕</button>
            </div>
            <div style={{ padding: 24, overflow: 'auto', flex: 1 }}>
              {drawer.render({ close: onClose })}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ---------- Edit button ----------------------------------------------

export function EditButton({ onClick, label = 'Edit' }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseOver={() => setHov(true)}
      onMouseOut={() => setHov(false)}
      style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        padding: '5px 10px 5px 8px', border: `1px solid ${hov ? T.accent : T.border}`,
        background: 'rgba(91,184,214,0.04)', color: hov ? T.accent : T.textDim,
        borderRadius: 2, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'color .15s, border-color .15s',
      }}
    >
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      {label}
    </button>
  );
}

// ---------- Stamps ---------------------------------------------------

export function EditStamp({ section }) {
  const m = STORE.lastEdited(section);
  const stale = STORE.isStale(section);
  if (!m) return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.red, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.red }} />Never edited
    </span>
  );
  const person = PEOPLE[m.by];
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: stale ? T.red : T.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {stale && <span title="Stale — not edited this week" style={{ width: 6, height: 6, borderRadius: '50%', background: T.red }} />}
      {person && <Avatar person={person} size={14} />}
      {person?.name?.split(' ')[0] || m.by} · {STORE.fmtAgo(m.at)}
    </span>
  );
}

export function Avatar({ person, size = 22, ring = false }) {
  return (
    <span title={person.name} style={{
      width: size, height: size, borderRadius: '50%',
      background: person.color, color: '#06080C',
      fontFamily: 'Sora', fontWeight: 600, fontSize: size * 0.42,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      letterSpacing: '0.04em', flexShrink: 0,
      boxShadow: ring ? `0 0 0 2px #0B0F16, 0 0 0 3px ${person.color}` : 'none',
    }}>{person.initials}</span>
  );
}

// ---------- Presence bar ---------------------------------------------

export function PresenceBar() {
  const { presence } = usePresence();
  const me = STORE.me;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex' }}>
        {presence.slice(0, 4).map((p, i) => (
          <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -6 }}>
            <Avatar person={p} size={24} ring />
          </div>
        ))}
      </div>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.textMute, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        {presence.length} live
      </span>
      <span style={{ width: 1, height: 16, background: T.border }} />
      <select
        value={me.id}
        onChange={(e) => STORE.switchIdentity(e.target.value)}
        style={{
          background: 'transparent', border: `1px solid ${T.border}`, color: T.text, padding: '4px 8px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          borderRadius: 2, cursor: 'pointer',
        }}
      >
        {Object.values(PEOPLE).map(p => (
          <option key={p.id} value={p.id} style={{ background: '#0E131B' }}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}

// ---------- Form primitives ------------------------------------------

export function Field({ label, hint, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      {children}
      {hint && <div style={{ fontFamily: 'Manrope', fontSize: 11, color: T.textMute, marginTop: 6, lineHeight: 1.4 }}>{hint}</div>}
    </label>
  );
}

export function TextInput({ value, onChange, multiline, rows = 3, placeholder }) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <Tag
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={multiline ? rows : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: T.surfaceLo, border: `1px solid ${focused ? T.accent : T.border}`,
        color: T.text, padding: '10px 12px', fontFamily: 'Manrope', fontSize: 14, lineHeight: 1.5,
        borderRadius: 2, outline: 'none', resize: multiline ? 'vertical' : 'none',
        transition: 'border-color .15s',
      }}
    />
  );
}

export function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text,
        padding: '10px 12px', fontFamily: 'Manrope', fontSize: 14, borderRadius: 2, outline: 'none',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value} style={{ background: '#0E131B' }}>{o.label}</option>)}
    </select>
  );
}

export function ListEditor({ items, onChange, placeholder = 'Add item' }) {
  const [val, setVal] = useState('');
  function add() { if (val.trim()) { onChange([...items, val.trim()]); setVal(''); } }
  function remove(i) { onChange(items.filter((_, idx) => idx !== i)); }
  function edit(i, v) { onChange(items.map((x, idx) => idx === i ? v : x)); }
  return (
    <div>
      <div style={{ display: 'grid', gap: 6, marginBottom: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6, alignItems: 'stretch' }}>
            <input value={it} onChange={(e) => edit(i, e.target.value)} style={{
              background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text,
              padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none',
            }} />
            <button onClick={() => remove(i)} style={{
              background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute,
              padding: '0 10px', borderRadius: 2, cursor: 'pointer', fontSize: 14,
            }}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6 }}>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          style={{
            background: T.surfaceLo, border: `1px dashed ${T.border}`, color: T.text,
            padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none',
          }}
        />
        <button onClick={add} style={{
          background: 'rgba(91,184,214,0.10)', border: `1px solid ${T.accent}`, color: T.accent,
          padding: '0 14px', borderRadius: 2, cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>+ Add</button>
      </div>
    </div>
  );
}

// ---------- AI assist button -----------------------------------------

export function AIButton({ onClick, label = 'Draft with AI', disabled }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy || disabled}
      onClick={async () => {
        setBusy(true);
        try {
          await onClick();
        } catch (err) {
          if (err.code === 'NO_API_KEY' || err.code === 'INVALID_KEY') {
            window.dispatchEvent(new CustomEvent('claude:needKey', { detail: { reason: err.code } }));
          } else {
            console.error('AI assist error:', err);
            alert(`AI error: ${err.message}`);
          }
        } finally {
          setBusy(false);
        }
      }}
      style={{
        background: 'rgba(91,184,214,0.06)', border: `1px solid ${T.accent}`, color: T.accent,
        padding: '8px 14px', borderRadius: 2, cursor: busy ? 'wait' : 'pointer',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
        display: 'inline-flex', alignItems: 'center', gap: 8, opacity: busy ? 0.6 : 1,
        transition: 'opacity .15s',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M8 1l1.8 4.4L14 7l-4.2 1.6L8 13l-1.8-4.4L2 7l4.2-1.6L8 1z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      {busy ? 'Drafting…' : label}
    </button>
  );
}

// ---------- Save bar -------------------------------------------------

export function DrawerActions({ onSave, onCancel, extras }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
      <div>{extras}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} style={{
          background: 'transparent', border: `1px solid ${T.border}`, color: T.textDim,
          padding: '10px 16px', borderRadius: 2, cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>Cancel</button>
        <button onClick={onSave} style={{
          background: T.accent, border: `1px solid ${T.accent}`, color: '#06080C',
          padding: '10px 18px', borderRadius: 2, cursor: 'pointer', fontWeight: 600,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>Save · ⌘↵</button>
      </div>
    </div>
  );
}
