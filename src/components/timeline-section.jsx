// =====================================================================
// Proposal Timeline vs. Actual — Section component
// Shows sprint-by-sprint delivery vs. proposed plan, highlighting
// how much ahead of schedule each deliverable landed.
// =====================================================================

import { useState } from 'react';
import { T, RAG, RagDot, Eyebrow, Card } from './core';

// ─── Status config ────────────────────────────────────────────────────

const SPRINT_STATUS = {
  'delivered':   { color: T.green,    label: 'Delivered',   bg: 'rgba(91,184,214,0.06)' },
  'ahead':       { color: T.accent,   label: 'Ahead',       bg: 'rgba(91,184,214,0.08)' },
  'in-progress': { color: T.amber,    label: 'In progress', bg: 'rgba(232,185,118,0.06)' },
  'not-started': { color: T.textMute, label: 'Not started', bg: 'transparent' },
};

const PHASE_COLOR = {
  'P1':     T.accent,
  'P1→P2': T.amber,
  'P2':     'rgba(91,184,214,0.50)',
};

// ─── Summary banner ───────────────────────────────────────────────────

function TimelineBanner({ tl }) {
  return (
    <div style={{
      background: 'rgba(91,184,214,0.06)',
      border: '1px solid rgba(91,184,214,0.22)',
      borderLeft: `3px solid ${T.accent}`,
      borderRadius: 4,
      padding: '20px 24px',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 32,
      alignItems: 'center',
    }}>
      <div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.accent, textTransform: 'uppercase', marginBottom: 10 }}>
          Delivery summary
        </div>
        <p style={{ fontFamily: 'Sora', fontWeight: 300, fontSize: 18, color: T.text, margin: 0, lineHeight: 1.5, letterSpacing: '-0.005em' }}>
          {tl.summary}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 200, fontSize: 42, color: T.accent, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {tl.weeksAhead}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: T.textMute, textTransform: 'uppercase', marginTop: 6 }}>
            weeks ahead
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: T.textDim, letterSpacing: '0.04em', marginBottom: 4 }}>
            Proposed close
          </div>
          <div style={{ fontFamily: 'Sora', fontWeight: 300, fontSize: 16, color: T.textDim, letterSpacing: '-0.01em', textDecoration: 'line-through' }}>
            {tl.proposedPhase1End}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.14em', color: T.textMute, textTransform: 'uppercase', margin: '6px 0 4px' }}>
            Actual delivery
          </div>
          <div style={{ fontFamily: 'Sora', fontWeight: 500, fontSize: 16, color: T.accent, letterSpacing: '-0.01em' }}>
            {tl.actualPhase1End}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sprint row ───────────────────────────────────────────────────────

function SprintRow({ sprint, open, onToggle }) {
  const s = SPRINT_STATUS[sprint.status] || SPRINT_STATUS['not-started'];
  const phaseColor = PHASE_COLOR[sprint.phase] || T.textMute;

  return (
    <div style={{
      border: `1px solid ${T.border}`,
      borderLeft: `2px solid ${sprint.status === 'not-started' ? T.border : s.color}`,
      borderRadius: 2,
      background: s.bg,
      overflow: 'hidden',
    }}>
      {/* Row header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'transparent', border: 'none', padding: '12px 16px',
          display: 'grid',
          gridTemplateColumns: '36px 60px 1fr 110px 100px 80px 24px',
          gap: 14, alignItems: 'center',
        }}
      >
        {/* Week number */}
        <span style={{ fontFamily: 'Sora', fontWeight: 200, fontSize: 18, color: sprint.status === 'not-started' ? T.textMute : T.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
          W{String(sprint.week).padStart(2, '0')}
        </span>

        {/* Phase badge */}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.18em',
          textTransform: 'uppercase', padding: '3px 7px',
          border: `1px solid ${phaseColor}`, color: phaseColor,
          background: `${phaseColor}12`, borderRadius: 2,
          whiteSpace: 'nowrap', textAlign: 'center',
        }}>
          {sprint.phase}
        </span>

        {/* Sprint label */}
        <span style={{ fontFamily: 'Sora', fontSize: 13, fontWeight: 500, color: sprint.status === 'not-started' ? T.textMute : T.text, letterSpacing: '-0.005em' }}>
          {sprint.label}
        </span>

        {/* Proposed dates */}
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.06em', color: T.textMute, textDecoration: sprint.actualDates ? 'line-through' : 'none' }}>
          {sprint.proposedDates}
        </span>

        {/* Actual dates */}
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.06em', color: sprint.actualDates ? T.accent : T.textMute }}>
          {sprint.actualDates || '—'}
        </span>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: s.color,
            boxShadow: sprint.status !== 'not-started' ? `0 0 5px ${s.color}` : 'none',
          }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.14em', color: s.color, textTransform: 'uppercase' }}>
            {s.label}
          </span>
        </div>

        {/* Chevron */}
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.textMute, textAlign: 'right' }}>
          {open ? '▴' : '▾'}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Proposed */}
          <div style={{ padding: '12px 14px', background: T.surfaceLo, border: `1px solid ${T.border}`, borderRadius: 2 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>
              Proposed deliverable
            </div>
            <p style={{ fontFamily: 'Manrope', fontSize: 13, color: T.textDim, lineHeight: 1.6, margin: 0 }}>
              {sprint.proposedDeliverable}
            </p>
          </div>

          {/* Actual */}
          <div style={{
            padding: '12px 14px',
            background: sprint.actualDeliverable ? 'rgba(91,184,214,0.05)' : T.surfaceLo,
            border: `1px solid ${sprint.actualDeliverable ? 'rgba(91,184,214,0.22)' : T.border}`,
            borderRadius: 2,
          }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: sprint.actualDeliverable ? T.accent : T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>
              {sprint.actualDeliverable ? 'Actual delivery' : 'Not yet started'}
            </div>
            <p style={{ fontFamily: 'Manrope', fontSize: 13, color: sprint.actualDeliverable ? T.text : T.textMute, lineHeight: 1.6, margin: 0, fontStyle: sprint.actualDeliverable ? 'normal' : 'italic' }}>
              {sprint.actualDeliverable || 'Scheduled for a future sprint.'}
            </p>
          </div>

          {/* Note */}
          {sprint.note && (
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ color: T.accent, flexShrink: 0, marginTop: 1 }}>→</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.textDim, lineHeight: 1.55 }}>{sprint.note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────

export function ProposalTimeline({ tl }) {
  const [openSprint, setOpenSprint] = useState(null);
  if (!tl) return null;

  const delivered = tl.sprints.filter(s => s.status === 'delivered' || s.status === 'ahead').length;
  const total = tl.sprints.length;

  return (
    <div>
      {/* Banner */}
      <div style={{ marginBottom: 12 }}>
        <TimelineBanner tl={tl} />
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '36px 60px 1fr 110px 100px 80px 24px',
        gap: 14, padding: '8px 16px',
        borderBottom: `1px solid ${T.border}`,
        marginBottom: 6,
      }}>
        {['Week', 'Phase', 'Sprint goal', 'Proposed dates', 'Actual dates', 'Status', ''].map((h, i) => (
          <span key={i} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em',
            color: T.textMute, textTransform: 'uppercase',
          }}>{h}</span>
        ))}
      </div>

      {/* Sprint rows */}
      <div style={{ display: 'grid', gap: 4 }}>
        {tl.sprints.map((sprint, i) => (
          <SprintRow
            key={i}
            sprint={sprint}
            open={openSprint === i}
            onToggle={() => setOpenSprint(openSprint === i ? null : i)}
          />
        ))}
      </div>

      {/* Footer stat */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: T.textMute }}>
          {delivered} of {total} sprints delivered · click any row to expand
        </span>
      </div>
    </div>
  );
}
