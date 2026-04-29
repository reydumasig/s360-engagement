// =====================================================================
// Design tokens and base atoms.
// =====================================================================

export const T = {
  ink: '#06080C',
  bg: '#0B0F16',
  surface: '#11161F',
  surfaceHi: '#1A2230',
  surfaceLo: '#0E131B',
  border: 'rgba(255,255,255,0.08)',
  borderHi: 'rgba(255,255,255,0.16)',
  text: '#F5F7FA',
  textDim: '#A8B2C1',
  textMute: '#6B7689',
  accent: '#5BB8D6',
  accentHi: '#7CCDE5',
  green: '#5BB8D6',
  amber: '#E8B976',
  red: '#E07A5F',
};

export const RAG = {
  green: { label: 'Green', color: T.green, bg: 'rgba(91,184,214,0.10)',  bd: 'rgba(91,184,214,0.32)' },
  amber: { label: 'Amber', color: T.amber, bg: 'rgba(232,185,118,0.10)', bd: 'rgba(232,185,118,0.32)' },
  red:   { label: 'Red',   color: T.red,   bg: 'rgba(224,122,95,0.10)',  bd: 'rgba(224,122,95,0.32)' },
};

// ---------- Atoms ----------------------------------------------------

export function RagDot({ rag, size = 8, glow = true }) {
  const c = RAG[rag] || RAG.amber;
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: c.color,
      boxShadow: glow ? `0 0 8px ${c.color}` : 'none',
      flexShrink: 0,
    }} />
  );
}

export function RagPill({ rag, label }) {
  const c = RAG[rag] || RAG.amber;
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
      padding: '4px 10px', border: `1px solid ${c.bd}`, color: c.color, background: c.bg, borderRadius: 2,
      display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
    }}>
      <RagDot rag={rag} size={6} glow={false} />{label || c.label}
    </span>
  );
}

export function StatusPill({ status }) {
  const map = {
    'done':        { rag: 'green', l: 'Done' },
    'in-progress': { rag: 'amber', l: 'In progress' },
    'todo':        { rag: null,    l: 'To do' },
    'open':        { rag: 'amber', l: 'Open' },
    'closed':      { rag: 'green', l: 'Closed' },
  };
  const m = map[status] || { rag: null, l: status };
  if (!m.rag) {
    return (
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
        padding: '4px 10px', border: `1px solid ${T.border}`, color: T.textMute, borderRadius: 2,
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>{m.l}</span>
    );
  }
  return <RagPill rag={m.rag} label={m.l} />;
}

export function Eyebrow({ children, accent }) {
  return (
    <div style={{
      fontFamily: 'Sora', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
      color: accent ? T.accent : T.textMute, marginBottom: 14,
    }}>{children}</div>
  );
}

export function Card({ children, padding = 24, style }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4,
      padding, ...style,
    }}>{children}</div>
  );
}

export function SectionTitle({ n, title, sub, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 24, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        {n && (
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.accent, letterSpacing: '0.18em' }}>
            {n}
          </span>
        )}
        <h2 style={{ fontFamily: 'Sora', fontWeight: 400, fontSize: 22, letterSpacing: '-0.005em', color: T.text, margin: 0 }}>
          {title}
        </h2>
        {sub && (
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.textMute, letterSpacing: '0.1em' }}>
            {sub}
          </span>
        )}
      </div>
      {right}
    </div>
  );
}

export function HField({ label, value, sub, accent, mono }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'Sora',
        fontWeight: mono ? 400 : 500,
        fontSize: mono ? 13 : 15,
        color: accent ? T.accent : T.text, lineHeight: 1.25,
        letterSpacing: mono ? '0.04em' : '0.005em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.textMute, marginTop: 4, letterSpacing: '0.1em' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
