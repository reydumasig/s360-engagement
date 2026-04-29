import { useState, useEffect } from 'react';
import { DrawerProvider } from './components/collab-shell';
import { LiveHeader, LiveDiagnosis, LiveThisWeek, LiveDetails, LiveProposal, LiveNotes, LiveHistory } from './components/live-sections';
import { STORE } from './store';
import { getApiKey, setApiKey } from './claude';
import { T } from './components/core';

// ---------- API key modal --------------------------------------------

function ApiKeyModal({ reason, onClose }) {
  const [key, setKey] = useState(getApiKey());
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setApiKey(key);
    onClose();
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(6,8,12,0.7)', backdropFilter: 'blur(4px)', zIndex: 200 }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 480, background: '#0E131B', border: `1px solid ${T.border}`,
        borderTop: `2px solid ${T.accent}`, borderRadius: 4, padding: 32,
        zIndex: 201, boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.accent, textTransform: 'uppercase', marginBottom: 8 }}>
          AI Assist
        </div>
        <h2 style={{ fontFamily: 'Sora', fontWeight: 400, fontSize: 22, color: T.text, margin: '0 0 12px', letterSpacing: '-0.005em' }}>
          {reason === 'INVALID_KEY' ? 'Invalid API key' : 'Set up AI draft assist'}
        </h2>
        <p style={{ fontFamily: 'Manrope', fontSize: 14, color: T.textDim, lineHeight: 1.6, margin: '0 0 24px' }}>
          Enter your Anthropic API key to enable AI-powered TL;DR drafting and bullet polishing. The key is stored only in your browser.
        </p>
        <label style={{ display: 'block', marginBottom: 20 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>
            Anthropic API key
          </div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
            placeholder="sk-ant-..."
            autoFocus
            style={{
              width: '100%', background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text,
              padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
              borderRadius: 2, outline: 'none', letterSpacing: '0.04em',
            }}
          />
        </label>
        <p style={{ fontFamily: 'Manrope', fontSize: 12, color: T.textMute, margin: '0 0 24px', lineHeight: 1.5 }}>
          Get a key at <span style={{ color: T.accent }}>console.anthropic.com</span>. For an internal tool, embedding the key client-side is fine — just don't commit it anywhere.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: `1px solid ${T.border}`, color: T.textDim,
            padding: '10px 16px', borderRadius: 2, cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{
            background: T.accent, border: `1px solid ${T.accent}`, color: '#06080C',
            padding: '10px 18px', borderRadius: 2, cursor: 'pointer', fontWeight: 600,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>Save key</button>
        </div>
      </div>
    </>
  );
}

// ---------- App root -------------------------------------------------

export default function App() {
  const [keyModal, setKeyModal] = useState(null); // null | { reason }

  useEffect(() => {
    function handler(e) {
      setKeyModal({ reason: e.detail?.reason || 'NO_API_KEY' });
    }
    window.addEventListener('claude:needKey', handler);
    return () => window.removeEventListener('claude:needKey', handler);
  }, []);

  return (
    <DrawerProvider>
      <main>
        <LiveHeader />
        <LiveDiagnosis />
        <LiveThisWeek />
        <LiveDetails />
        <LiveProposal />
        <LiveHistory />
        <LiveNotes />
        <footer style={{
          padding: '32px 40px 48px',
          borderTop: `1px solid ${T.border}`,
          marginTop: 24,
        }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.textMute,
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            <span>Summit360 · {STORE.getData().client.code}</span>
            <span>
              <button
                onClick={() => { if (confirm('Reset all edits to seed data?')) STORE.reset(); }}
                style={{
                  background: 'transparent', border: 'none', color: T.textMute,
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 11,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                }}
              >Reset to seed</button>
              &nbsp;·&nbsp;Updated weekly · Friday AM
            </span>
          </div>
        </footer>
      </main>

      {keyModal && (
        <ApiKeyModal
          reason={keyModal.reason}
          onClose={() => setKeyModal(null)}
        />
      )}
    </DrawerProvider>
  );
}
