// =====================================================================
// Proposal vs. Build — Section 04
// Renders proposalTracking data: headline metrics, per-agent coverage,
// 12-step pipeline status, and gap register.
// Follows the same design tokens and component patterns as sections.jsx
// =====================================================================

import { useState } from 'react';
import { T, RAG, RagDot, RagPill, StatusPill, Eyebrow, Card } from './core';
import { Table } from './sections';

// ─── Capability status map ────────────────────────────────────────────

const CAP_STATUS = {
  'done':        { rag: 'green', label: 'Done' },
  'in-progress': { rag: 'amber', label: 'In progress' },
  'partial':     { rag: 'amber', label: 'Partial' },
  'not-started': { rag: null,    label: 'Not started' },
};

function CapPill({ status }) {
  const s = CAP_STATUS[status] || { rag: null, label: status };
  if (!s.rag) {
    return (
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
        textTransform: 'uppercase', padding: '3px 8px',
        border: `1px solid ${T.border}`, color: T.textMute, borderRadius: 2,
        whiteSpace: 'nowrap',
      }}>{s.label}</span>
    );
  }
  return <RagPill rag={s.rag} label={s.label} />;
}

// ─── Pipeline step status ─────────────────────────────────────────────

const PIPE_STATUS = {
  'done':        { color: T.green,    label: 'Done' },
  'in-progress': { color: T.amber,    label: 'In progress' },
  'blocked':     { color: T.red,      label: 'Blocked' },
  'not-started': { color: T.textMute, label: 'Not started' },
};

// ─── Headline Metrics ─────────────────────────────────────────────────

export function ProposalHeadline({ metrics }) {
  return (
    <Card padding={0}>
      <div style={{ padding: '14px 20px 10px', borderBottom: `1px solid ${T.border}` }}>
        <Eyebrow accent>Proposal target outcomes</Eyebrow>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${metrics.length}, 1fr)` }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            padding: '20px 24px',
            borderRight: i === metrics.length - 1 ? 'none' : `1px solid ${T.border}`,
          }}>
            <div style={{
              fontFamily: 'Sora', fontWeight: 200, fontSize: 36, color: T.accent,
              letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8,
            }}>{m.value}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em',
              color: T.textMute, textTransform: 'uppercase',
            }}>{m.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Agent Coverage Card ──────────────────────────────────────────────

function AgentCoverageCard({ agent, open, onToggle }) {
  const doneCount  = agent.proposedCapabilities.filter(c => c.status === 'done').length;
  const totalCount = agent.proposedCapabilities.length;
  const pct = Math.round((doneCount / Math.max(totalCount, 1)) * 100);

  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderTop: `2px solid ${RAG[agent.rag]?.color || T.border}`,
      borderRadius: 4, overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent',
          border: 'none', padding: '16px 20px',
          display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, alignItems: 'start',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <RagDot rag={agent.rag} size={9} />
            <span style={{ fontFamily: 'Sora', fontWeight: 500, fontSize: 15, color: T.text, letterSpacing: '-0.005em' }}>
              {agent.builtName}
            </span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: T.textMute, textTransform: 'uppercase', marginBottom: 10 }}>
            {agent.proposalName}
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>
            {agent.role}
          </div>
        </div>

        {/* Completion ring */}
        <div style={{ textAlign: 'center', paddingTop: 2 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 200, fontSize: 26, color: pct === 100 ? T.green : T.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {pct}<span style={{ fontSize: 13, color: T.textDim }}>%</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.14em', color: T.textMute, textTransform: 'uppercase', marginTop: 4 }}>
            {doneCount}/{totalCount} done
          </div>
        </div>

        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.textMute, letterSpacing: '0.16em', paddingTop: 4 }}>
          {open ? '▴' : '▾'}
        </span>
      </button>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', margin: '0 20px 0' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: RAG[agent.rag]?.color || T.accent }} />
      </div>

      {/* Expanded capabilities */}
      {open && (
        <div style={{ padding: '16px 20px 20px' }}>

          {/* Tools diff */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: T.textMute, textTransform: 'uppercase', marginBottom: 8 }}>
                Proposed tools
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {agent.proposedTools.map((t, i) => (
                  <span key={i} style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em',
                    padding: '3px 8px', border: `1px solid ${T.border}`, color: T.textDim,
                    borderRadius: 2,
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: T.accent, textTransform: 'uppercase', marginBottom: 8 }}>
                Built with
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {agent.builtTools.map((t, i) => (
                  <span key={i} style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em',
                    padding: '3px 8px', border: `1px solid rgba(91,184,214,0.32)`,
                    color: T.accent, background: 'rgba(91,184,214,0.06)', borderRadius: 2,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Capabilities list */}
          <div style={{ display: 'grid', gap: 8 }}>
            {agent.proposedCapabilities.map((cap, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
                padding: '8px 12px',
                background: cap.status === 'done' ? 'rgba(91,184,214,0.04)' : cap.status === 'not-started' ? 'transparent' : 'rgba(232,185,118,0.04)',
                border: `1px solid ${T.border}`, borderRadius: 2,
              }}>
                <span style={{
                  fontFamily: 'Manrope', fontSize: 13, lineHeight: 1.45,
                  color: cap.status === 'not-started' ? T.textMute : T.text,
                  textDecoration: 'none',
                }}>
                  {cap.capability}
                </span>
                <CapPill status={cap.status} />
              </div>
            ))}
          </div>

          {/* Gaps */}
          {agent.gaps && agent.gaps.length > 0 && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(232,185,118,0.06)', border: `1px solid rgba(232,185,118,0.22)`, borderRadius: 2 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.2em', color: T.amber, textTransform: 'uppercase', marginBottom: 8 }}>
                Open gaps
              </div>
              {agent.gaps.map((g, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: i > 0 ? 6 : 0 }}>
                  <span style={{ color: T.amber, marginTop: 1, flexShrink: 0 }}>↳</span>
                  <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>{g}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pipeline Steps ───────────────────────────────────────────────────

export function ProposalPipeline({ pipeline }) {
  return (
    <Card padding={0}>
      <div style={{ padding: '14px 20px 10px', borderBottom: `1px solid ${T.border}` }}>
        <Eyebrow>End-to-end pipeline — 12 steps</Eyebrow>
      </div>
      <div style={{ display: 'grid', gap: 0 }}>
        {pipeline.map((step, i) => {
          const s = PIPE_STATUS[step.status] || PIPE_STATUS['not-started'];
          const isLast = i === pipeline.length - 1;
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '40px 100px 1fr auto',
              gap: 16, alignItems: 'center',
              padding: '11px 20px',
              borderBottom: isLast ? 'none' : `1px solid ${T.border}`,
              background: step.status === 'blocked' ? 'rgba(224,122,95,0.04)' : step.status === 'in-progress' ? 'rgba(232,185,118,0.04)' : 'transparent',
            }}>
              {/* Step number */}
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.1em',
                color: s.color, fontWeight: step.status === 'done' ? 400 : 300,
              }}>
                {String(step.step).padStart(2, '0')}
              </span>

              {/* Actor */}
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em',
                color: T.textMute, textTransform: 'uppercase',
              }}>
                {step.actor}
              </span>

              {/* Label + note */}
              <div>
                <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 13, color: step.status === 'not-started' ? T.textMute : T.text }}>
                  {step.label}
                </span>
                {step.note && (
                  <span style={{ fontFamily: 'Manrope', fontSize: 12, color: T.textMute, marginLeft: 10 }}>
                    — {step.note}
                  </span>
                )}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: s.color,
                  boxShadow: step.status !== 'not-started' ? `0 0 6px ${s.color}` : 'none',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
                  color: s.color, textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Gap Register ─────────────────────────────────────────────────────

const IMPACT_COLOR = { high: T.red, medium: T.amber, low: T.textMute };

export function GapRegister({ gaps }) {
  return (
    <Card padding={0}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Eyebrow>Gap register — proposal vs. build</Eyebrow>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', color: T.textMute }}>
          {gaps.filter(g => g.status === 'open').length} open · {gaps.length} total
        </span>
      </div>
      <Table
        headers={['ID', 'Area', 'Gap', 'Impact', 'Status']}
        cols="50px 110px 2.4fr 80px 120px"
        rows={gaps.map(g => [
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.textMute }}>{g.id}</span>,
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em', color: T.textDim, textTransform: 'uppercase' }}>{g.area}</span>,
          <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.text, lineHeight: 1.4 }}>{g.gap}</span>,
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: IMPACT_COLOR[g.impact] || T.textDim, textTransform: 'uppercase' }}>{g.impact}</span>,
          <span style={{ textAlign: 'right', display: 'block' }}><StatusPill status={g.status} /></span>,
        ])}
      />
    </Card>
  );
}

// ─── Agent Coverage Grid ──────────────────────────────────────────────

export function AgentCoverageGrid({ agents }) {
  const [openAgent, setOpenAgent] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {agents.map((agent, i) => (
        <AgentCoverageCard
          key={agent.id}
          agent={agent}
          open={openAgent === agent.id}
          onToggle={() => setOpenAgent(openAgent === agent.id ? null : agent.id)}
        />
      ))}
    </div>
  );
}
