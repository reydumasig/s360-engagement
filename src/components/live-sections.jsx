// =====================================================================
// Live, editable section components. Each reads from STORE and shows
// edit buttons + "last edited by" stamps.
// =====================================================================

import { useState, useEffect } from 'react';
import { STORE } from '../store';
import { T, RAG, RagDot, RagPill, Eyebrow, Card, SectionTitle, HField } from './core';
import { useStore, useDrawer, EditButton, EditStamp, PresenceBar } from './collab-shell';
import {
  BulletCard, RisksBlock, DecisionsBlock, MetricsBlock, ProgressBlock,
  Workstreams, RiskRegister, DecisionLog, Actions, MilestoneCalendar, NotesLinks, PriorWeek,
} from './sections';
import { HeaderEditor, ThisWeekEditor, JsonSectionEditor, DiagnosisEditor } from './drawer-editors';
import { ProposalHeadline, AgentCoverageGrid, ProposalPipeline, GapRegister } from './proposal-section';
import { ProposalTimeline } from './timeline-section';

function useTime() {
  const [, set] = useState(0);
  useEffect(() => {
    const id = setInterval(() => set(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);
}

// ---------- HEADER ---------------------------------------------------

export function LiveHeader() {
  useStore();
  useTime();
  const drawer = useDrawer();
  const c = STORE.getData().client;
  const ragInfo = RAG[c.overallRAG] || RAG.amber;
  const pct = Math.max(0, Math.min(100, Math.round((c.currentWeek / c.totalWeeks) * 100)));

  return (
    <header style={{
      borderBottom: `1px solid ${T.border}`,
      background: 'rgba(11,15,22,0.7)',
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 40px 18px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, rgba(91,184,214,0.30), rgba(11,15,22,0.95) 70%)',
              border: '1px solid rgba(91,184,214,0.40)',
              boxShadow: '0 0 12px rgba(91,184,214,0.25)',
            }} />
            <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', color: T.text }}>
              SUMMIT<span style={{ color: T.accent }}>360</span>
              <span style={{ color: T.textMute, fontWeight: 400, marginLeft: 10, letterSpacing: '0.18em', fontSize: 11 }}>ENGAGEMENT</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <PresenceBar />
            <span style={{ width: 1, height: 16, background: T.border }} />
            <button
              onClick={() => {
                if (confirm('Snapshot This Week into Prior Weeks and start a fresh week?')) STORE.startNewWeek();
              }}
              style={{
                background: 'rgba(91,184,214,0.06)', border: `1px solid ${T.accent}`, color: T.accent,
                padding: '6px 12px', borderRadius: 2, cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
              }}
            >+ Start new week</button>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.textMute, letterSpacing: '0.14em' }}>{c.code}</span>
          </div>
        </div>

        {/* Client strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.6fr) repeat(4, 1fr) auto auto', gap: 24, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase', marginBottom: 6 }}>Client</div>
            <div style={{ fontFamily: 'Sora', fontWeight: 500, fontSize: 18, color: T.text, letterSpacing: '-0.005em', lineHeight: 1.2 }}>{c.name}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.textMute, marginTop: 4, letterSpacing: '0.1em' }}>{c.engagementType}</div>
          </div>
          <HField label="Week" value={`${c.currentWeek} / ${c.totalWeeks}`} sub={`${pct}% elapsed`} />
          <HField label="Window" value={`${c.startDate} → ${c.targetClose}`} mono />
          <HField label="S360 Lead" value={c.s360Lead} sub={c.s360LeadTitle} accent />
          <HField label="Sponsor" value={c.sponsor} sub={c.sponsorTitle} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase' }}>Status</span>
            <RagPill rag={c.overallRAG} />
          </div>
          <EditButton onClick={() => drawer.open({ title: 'Engagement header', render: ({ close }) => <HeaderEditor close={close} /> })} />
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: T.accent, boxShadow: `0 0 10px ${T.accent}` }} />
            {Array.from({ length: c.totalWeeks + 1 }).map((_, i) => (
              <span key={i} style={{
                position: 'absolute', left: `${(i / c.totalWeeks) * 100}%`, top: -3, width: 1, height: 8,
                background: i <= c.currentWeek ? T.accent : 'rgba(255,255,255,0.20)',
                transform: 'translateX(-0.5px)',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
            {c.overallRAGNote ? (
              <div style={{ fontFamily: 'Manrope', fontSize: 12, color: ragInfo.color }}>
                <RagDot rag={c.overallRAG} size={6} glow={false} /> &nbsp;{c.overallRAGNote}
              </div>
            ) : <span />}
            <EditStamp section="client" />
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------- DIAGNOSIS ------------------------------------------------

export function LiveDiagnosis() {
  useStore();
  useTime();
  const drawer = useDrawer();
  const d = STORE.getData().diagnosis;
  const [open, setOpen] = useState(false);

  if (!d) return null;

  if (!d.enabled) {
    return (
      <section style={{ padding: '16px 40px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => drawer.open({ title: 'Diagnosis', render: ({ close }) => <DiagnosisEditor close={close} /> })}
            style={{
              background: 'transparent', border: `1px dashed ${T.border}`, color: T.textMute,
              padding: '8px 14px', borderRadius: 2, cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
            }}
          >+ Add diagnosis</button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '16px 40px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Card padding={0}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', borderBottom: open ? `1px solid ${T.border}` : 'none' }}>
            <button
              onClick={() => setOpen(!open)}
              style={{
                textAlign: 'left', cursor: 'pointer', padding: '16px 20px',
                background: 'transparent', border: 'none', color: T.text,
                display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.accent, letterSpacing: '0.18em' }}>00</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Sora', fontWeight: 400, fontSize: 18, color: T.text }}>Diagnosis</span>
                <span style={{ fontFamily: 'Manrope', fontSize: 13, color: T.textDim, fontStyle: 'italic' }}>— {d.summary}</span>
              </span>
            </button>
            <div style={{ padding: '0 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <EditStamp section="diagnosis" />
              <EditButton onClick={() => drawer.open({ title: 'Diagnosis', render: ({ close }) => <DiagnosisEditor close={close} /> })} />
              <button
                onClick={() => setOpen(!open)}
                style={{
                  background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute,
                  padding: '5px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 2, cursor: 'pointer', marginRight: 12,
                }}
              >{open ? 'Collapse' : 'Expand'}</button>
            </div>
          </div>
          {open && (
            <div style={{ padding: '20px 20px 24px', display: 'grid', gridTemplateColumns: `repeat(${d.sections.length}, 1fr)`, gap: 24 }}>
              {d.sections.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Sora', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: T.accent, marginBottom: 10 }}>{s.label}</div>
                  <p style={{ fontFamily: 'Manrope', fontSize: 14, lineHeight: 1.65, color: T.textDim, margin: 0 }}>{s.body}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

// ---------- THIS WEEK ------------------------------------------------

export function LiveThisWeek() {
  useStore();
  useTime();
  const drawer = useDrawer();
  const w = STORE.getData().thisWeek;

  return (
    <section style={{ padding: '32px 40px 8px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle
          n="01"
          title="This week"
          sub={`Week ${w.week} · ${w.dates || '— set dates —'}`}
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <EditStamp section="thisWeek" />
              <EditButton onClick={() => drawer.open({ title: 'This week', render: ({ close }) => <ThisWeekEditor close={close} /> })} />
            </div>
          }
        />

        {/* TL;DR */}
        <div style={{
          background: 'rgba(91,184,214,0.05)', border: '1px solid rgba(91,184,214,0.22)',
          borderLeft: `2px solid ${T.accent}`, padding: '20px 24px', marginBottom: 20,
        }}>
          <Eyebrow accent>TL;DR</Eyebrow>
          {w.tldr ? (
            <p style={{ fontFamily: 'Sora', fontWeight: 300, fontSize: 20, lineHeight: 1.4, color: T.text, margin: 0, letterSpacing: '-0.005em' }}>{w.tldr}</p>
          ) : (
            <p style={{ fontFamily: 'Sora', fontWeight: 300, fontSize: 16, lineHeight: 1.4, color: T.textMute, margin: 0, fontStyle: 'italic' }}>
              No TL;DR yet — open the editor to draft one (AI can help).
            </p>
          )}
        </div>

        {/* Workstream RAG */}
        {w.workstreamRAG && w.workstreamRAG.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${w.workstreamRAG.length}, 1fr)`, gap: 12, marginBottom: 20 }}>
            {w.workstreamRAG.map((ws, i) => (
              <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${RAG[ws.rag]?.color || T.border}`, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Sora', fontSize: 13, fontWeight: 500, color: T.text }}>{ws.name}</span>
                  <RagDot rag={ws.rag} size={8} />
                </div>
                <div style={{ fontFamily: 'Manrope', fontSize: 12, color: T.textDim, lineHeight: 1.45 }}>
                  {ws.note || <em style={{ color: T.textMute }}>—</em>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Metrics + progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
          <MetricsBlock metrics={w.metrics || []} />
          <ProgressBlock progress={w.progress || { milestonesDone: 0, milestonesTotal: 1, daysElapsed: 0, daysTotal: 1 }} />
        </div>

        {/* Shipped / Next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <BulletCard label="Shipped this week" tone="accent" items={w.shipped || []} />
          <BulletCard label="Next week" items={w.next || []} />
        </div>

        {/* Risks / Decisions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <RisksBlock risks={w.risks || []} />
          <DecisionsBlock decisions={w.decisions || []} />
        </div>
      </div>
    </section>
  );
}

// ---------- DETAILS --------------------------------------------------

export function LiveDetails() {
  useStore();
  useTime();
  const drawer = useDrawer();
  const e = STORE.getData();

  const editJson = (path, label) => () => drawer.open({
    title: label,
    render: ({ close }) => <JsonSectionEditor path={path} label={label} close={close} />,
  });

  return (
    <section style={{ padding: '16px 40px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle
          n="02"
          title="Detail"
          sub="Workstreams · risks · decisions · actions · milestones"
          right={<span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.14em', color: T.textMute }}>APPENDIX</span>}
        />

        <SectionFrame title="Workstreams" stamp="workstreams" onEdit={editJson('workstreams', 'Workstreams')}>
          <Workstreams workstreams={e.workstreams || []} />
        </SectionFrame>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <SectionFrame title="Risk register" stamp="riskRegister" onEdit={editJson('riskRegister', 'Risk register')}>
            <RiskRegister risks={e.riskRegister || []} />
          </SectionFrame>
          <SectionFrame title="Decision log" stamp="decisionLog" onEdit={editJson('decisionLog', 'Decision log')}>
            <DecisionLog decisions={e.decisionLog || []} />
          </SectionFrame>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginTop: 12 }}>
          <SectionFrame title="Action items" stamp="actions" onEdit={editJson('actions', 'Action items')}>
            <Actions actions={e.actions || []} />
          </SectionFrame>
          <SectionFrame title="Milestones" stamp="milestones" onEdit={editJson('milestones', 'Milestones')}>
            <MilestoneCalendar milestones={e.milestones || []} />
          </SectionFrame>
        </div>

      </div>
    </section>
  );
}

function SectionFrame({ title, stamp, onEdit, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: '0 4px' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <EditStamp section={stamp} />
          <EditButton onClick={onEdit} />
        </div>
      </div>
      {children}
    </div>
  );
}

// ---------- PROPOSAL TRACKING ----------------------------------------

export function LiveProposal() {
  useStore();
  const pt = STORE.getData().proposalTracking;
  if (!pt) return null;

  return (
    <section style={{ padding: '32px 40px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle
          n="03"
          title="Proposal vs. Build"
          sub="Coverage · pipeline · gaps"
          right={
            <a
              href={`https://drive.google.com/file/d/${pt.driveFileId}/view`}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: T.accent, textDecoration: 'none',
                padding: '5px 12px', border: `1px solid rgba(91,184,214,0.32)`,
                background: 'rgba(91,184,214,0.06)', borderRadius: 2,
              }}
            >↗ View proposal</a>
          }
        />

        {/* Timeline */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 8, padding: '0 4px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase' }}>
              Delivery timeline — proposed vs. actual
            </span>
          </div>
          <ProposalTimeline tl={STORE.getData().proposalTimeline} />
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'Manrope', fontSize: 14, color: T.textDim, lineHeight: 1.65,
          fontStyle: 'italic', marginBottom: 20,
          padding: '14px 20px', background: T.surface,
          border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.accent}`,
          borderRadius: 2,
        }}>
          "{pt.headline}"
        </div>

        {/* Headline metrics */}
        <div style={{ marginBottom: 12 }}>
          <ProposalHeadline metrics={pt.headlineMetrics} />
        </div>

        {/* Agent coverage */}
        <div style={{ marginBottom: 8, padding: '0 4px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase' }}>
            Agent coverage — click to expand
          </span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <AgentCoverageGrid agents={pt.agents} />
        </div>

        {/* Pipeline */}
        <div style={{ marginBottom: 12 }}>
          <ProposalPipeline pipeline={pt.pipeline} />
        </div>

        {/* Gap register */}
        <div style={{ marginBottom: 12 }}>
          <GapRegister gaps={pt.gaps} />
        </div>
      </div>
    </section>
  );
}

// ---------- NOTES & LINKS (bottom) -----------------------------------

export function LiveNotes() {
  useStore();
  const drawer = useDrawer();
  const e = STORE.getData();
  const editJson = (path, label) => () => drawer.open({
    title: label,
    render: ({ close }) => <JsonSectionEditor path={path} label={label} close={close} />,
  });

  return (
    <section style={{ padding: '32px 40px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle
          n="05"
          title="Notes & Links"
          sub="Proposal · repos · boards · channels"
        />
        <SectionFrame title="Notes & links" stamp="notes" onEdit={editJson('notes', 'Notes & links')}>
          <NotesLinks notes={e.notes || []} />
        </SectionFrame>
      </div>
    </section>
  );
}

// ---------- HISTORY --------------------------------------------------

export function LiveHistory() {
  useStore();
  useTime();
  const weeks = STORE.getData().priorWeeks || [];
  const [openWeek, setOpenWeek] = useState(null);

  if (!weeks.length) {
    return (
      <section style={{ padding: '32px 40px 64px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionTitle
            n="06"
          title="Prior weeks"
            sub="No archived weeks yet — first 'Start new week' will land here."
          />
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '32px 40px 64px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle
          n="06"
          title="Prior weeks"
          sub={`${weeks.length} ${weeks.length === 1 ? 'entry' : 'entries'}`}
        />
        <div style={{ display: 'grid', gap: 8 }}>
          {weeks.map((w, idx) => (
            <PriorWeek
              key={idx}
              week={w}
              open={openWeek === idx}
              onToggle={() => setOpenWeek(openWeek === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
