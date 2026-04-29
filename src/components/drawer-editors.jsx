// =====================================================================
// Drawer editors for each section. Each reads from STORE, writes back
// through STORE.update(), and includes AI assist where useful.
// =====================================================================

import { useState } from 'react';
import { STORE } from '../store';
import { complete as claudeComplete } from '../claude';
import { T } from './core';
import { Field, TextInput, Select, ListEditor, AIButton, DrawerActions } from './collab-shell';

async function aiPrompt(prompt) {
  return claudeComplete({ messages: [{ role: 'user', content: prompt }] });
}

// =================================================================
// HEADER editor
// =================================================================
export function HeaderEditor({ close }) {
  const data = STORE.getData().client;
  const [draft, setDraft] = useState({ ...data });
  function commit(k, v) { setDraft(d => ({ ...d, [k]: v })); }
  function save() {
    Object.entries(draft).forEach(([k, v]) => STORE.update(`client.${k}`, v));
    close();
  }
  return (
    <div>
      <Field label="Client name"><TextInput value={draft.name} onChange={v => commit('name', v)} /></Field>
      <Field label="Engagement type"><TextInput value={draft.engagementType} onChange={v => commit('engagementType', v)} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="S360 lead"><TextInput value={draft.s360Lead} onChange={v => commit('s360Lead', v)} /></Field>
        <Field label="Title"><TextInput value={draft.s360LeadTitle} onChange={v => commit('s360LeadTitle', v)} /></Field>
        <Field label="Sponsor"><TextInput value={draft.sponsor} onChange={v => commit('sponsor', v)} /></Field>
        <Field label="Title"><TextInput value={draft.sponsorTitle} onChange={v => commit('sponsorTitle', v)} /></Field>
        <Field label="Start date"><TextInput value={draft.startDate} onChange={v => commit('startDate', v)} placeholder="Apr 20, 2026" /></Field>
        <Field label="Target close"><TextInput value={draft.targetClose} onChange={v => commit('targetClose', v)} placeholder="May 8, 2026" /></Field>
        <Field label="Current week"><TextInput value={String(draft.currentWeek)} onChange={v => commit('currentWeek', parseInt(v) || 1)} /></Field>
        <Field label="Total weeks"><TextInput value={String(draft.totalWeeks)} onChange={v => commit('totalWeeks', parseInt(v) || 1)} /></Field>
      </div>
      <Field label="Engagement code"><TextInput value={draft.code} onChange={v => commit('code', v)} /></Field>
      <Field label="Overall RAG">
        <Select
          value={draft.overallRAG}
          onChange={v => commit('overallRAG', v)}
          options={[
            { value: 'green', label: 'Green — on plan' },
            { value: 'amber', label: 'Amber — at risk' },
            { value: 'red',   label: 'Red — off track' },
          ]}
        />
      </Field>
      <Field label="Status note"><TextInput multiline value={draft.overallRAGNote} onChange={v => commit('overallRAGNote', v)} /></Field>
      <DrawerActions onSave={save} onCancel={close} />
    </div>
  );
}

// =================================================================
// THIS WEEK editor
// =================================================================
export function ThisWeekEditor({ close }) {
  const data = STORE.getData().thisWeek;
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(data)));
  function commit(k, v) { setDraft(d => ({ ...d, [k]: v })); }
  function save() {
    Object.entries(draft).forEach(([k, v]) => STORE.update(`thisWeek.${k}`, v));
    close();
  }

  async function aiTLDR() {
    const ctx = `You are drafting a concise weekly executive TL;DR (1 sentence, ~25 words) for a consulting engagement. Plain prose, present tense, no fluff.\n\nShipped this week:\n- ${(draft.shipped || []).join('\n- ')}\n\nNext week:\n- ${(draft.next || []).join('\n- ')}\n\nRisks:\n- ${(draft.risks || []).map(r => r.label).join('\n- ')}\n\nReturn only the sentence.`;
    const out = await aiPrompt(ctx);
    commit('tldr', out.trim().replace(/^["']|["']$/g, ''));
  }

  async function aiPolish(field) {
    const list = draft[field] || [];
    if (!list.length) return;
    const out = await aiPrompt(`Rewrite each bullet in a tight executive voice (max 18 words, present tense, no filler). Return as a plain numbered list, one per line, no other text.\n\n${list.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
    const lines = out.split('\n').map(l => l.replace(/^\s*\d+[.)]\s*/, '').trim()).filter(Boolean);
    if (lines.length) commit(field, lines.slice(0, list.length));
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Week #"><TextInput value={String(draft.week)} onChange={v => commit('week', parseInt(v) || 1)} /></Field>
        <Field label="Dates"><TextInput value={draft.dates} onChange={v => commit('dates', v)} placeholder="Apr 27 — May 1, 2026" /></Field>
      </div>

      <Field label="TL;DR" hint="One sentence. Where are we, in plain English.">
        <TextInput multiline rows={3} value={draft.tldr} onChange={v => commit('tldr', v)} />
        <div style={{ marginTop: 8 }}><AIButton onClick={aiTLDR} label="Draft TL;DR from bullets" /></div>
      </Field>

      <Field label="Shipped this week">
        <ListEditor items={draft.shipped || []} onChange={v => commit('shipped', v)} placeholder="What landed?" />
        <div style={{ marginTop: 8 }}><AIButton onClick={() => aiPolish('shipped')} label="Polish bullets" /></div>
      </Field>

      <Field label="Next week">
        <ListEditor items={draft.next || []} onChange={v => commit('next', v)} placeholder="What's planned?" />
        <div style={{ marginTop: 8 }}><AIButton onClick={() => aiPolish('next')} label="Polish bullets" /></div>
      </Field>

      <Field label="Workstream RAG">
        {(draft.workstreamRAG || []).map((ws, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 1.4fr', gap: 6, marginBottom: 6 }}>
            <input
              value={ws.name}
              onChange={(e) => commit('workstreamRAG', draft.workstreamRAG.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <select
              value={ws.rag}
              onChange={(e) => commit('workstreamRAG', draft.workstreamRAG.map((x, idx) => idx === i ? { ...x, rag: e.target.value } : x))}
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 6px', fontFamily: 'Manrope', fontSize: 12, borderRadius: 2 }}
            >
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="red">Red</option>
            </select>
            <input
              value={ws.note}
              onChange={(e) => commit('workstreamRAG', draft.workstreamRAG.map((x, idx) => idx === i ? { ...x, note: e.target.value } : x))}
              placeholder="Why?"
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
          </div>
        ))}
      </Field>

      <Field label="Risks">
        {(draft.risks || []).map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 32px', gap: 6, marginBottom: 6 }}>
            <input
              value={r.label}
              onChange={(e) => commit('risks', draft.risks.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <select
              value={r.severity}
              onChange={(e) => commit('risks', draft.risks.map((x, idx) => idx === i ? { ...x, severity: e.target.value } : x))}
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 6px', fontFamily: 'Manrope', fontSize: 12, borderRadius: 2 }}
            >
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="red">Red</option>
            </select>
            <button
              onClick={() => commit('risks', draft.risks.filter((_, idx) => idx !== i))}
              style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute, borderRadius: 2, cursor: 'pointer' }}
            >✕</button>
          </div>
        ))}
        <button
          onClick={() => commit('risks', [...(draft.risks || []), { label: '', severity: 'amber' }])}
          style={{ background: 'rgba(91,184,214,0.06)', border: `1px solid ${T.accent}`, color: T.accent, padding: '6px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}
        >+ Add risk</button>
      </Field>

      <Field label="Decisions needed from client">
        {(draft.decisions || []).map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 32px', gap: 6, marginBottom: 6 }}>
            <input
              value={d.label}
              onChange={(e) => commit('decisions', draft.decisions.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <input
              value={d.needBy}
              onChange={(e) => commit('decisions', draft.decisions.map((x, idx) => idx === i ? { ...x, needBy: e.target.value } : x))}
              placeholder="Need by"
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <button
              onClick={() => commit('decisions', draft.decisions.filter((_, idx) => idx !== i))}
              style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute, borderRadius: 2, cursor: 'pointer' }}
            >✕</button>
          </div>
        ))}
        <button
          onClick={() => commit('decisions', [...(draft.decisions || []), { label: '', needBy: '' }])}
          style={{ background: 'rgba(91,184,214,0.06)', border: `1px solid ${T.accent}`, color: T.accent, padding: '6px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}
        >+ Add decision</button>
      </Field>

      <Field label="Top metrics">
        {(draft.metrics || []).map((m, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 70px 70px 60px 32px', gap: 6, marginBottom: 6 }}>
            <input
              value={m.label}
              onChange={(e) => commit('metrics', draft.metrics.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
              placeholder="Metric"
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <input
              type="number"
              value={m.current ?? ''}
              onChange={(e) => commit('metrics', draft.metrics.map((x, idx) => idx === i ? { ...x, current: e.target.value === '' ? null : Number(e.target.value) } : x))}
              placeholder="now"
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <input
              type="number"
              value={m.target ?? ''}
              onChange={(e) => commit('metrics', draft.metrics.map((x, idx) => idx === i ? { ...x, target: Number(e.target.value) } : x))}
              placeholder="target"
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <input
              value={m.unit || ''}
              onChange={(e) => commit('metrics', draft.metrics.map((x, idx) => idx === i ? { ...x, unit: e.target.value } : x))}
              placeholder="unit"
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <button
              onClick={() => commit('metrics', draft.metrics.filter((_, idx) => idx !== i))}
              style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute, borderRadius: 2, cursor: 'pointer' }}
            >✕</button>
          </div>
        ))}
        <button
          onClick={() => commit('metrics', [...(draft.metrics || []), { label: '', current: null, target: 0, unit: '', lowerBetter: false }])}
          style={{ background: 'rgba(91,184,214,0.06)', border: `1px solid ${T.accent}`, color: T.accent, padding: '6px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}
        >+ Add metric</button>
      </Field>

      <DrawerActions onSave={save} onCancel={close} />
    </div>
  );
}

// =================================================================
// JSON editor — for tables (workstreams, actions, risks, etc.)
// =================================================================
export function JsonSectionEditor({ path, label, close }) {
  const value = path.split('.').reduce((o, k) => o?.[k], STORE.getData());
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [err, setErr] = useState(null);
  function save() {
    try {
      const parsed = JSON.parse(text);
      STORE.update(path, parsed);
      close();
    } catch (e) { setErr(e.message); }
  }
  return (
    <div>
      <Field label={label} hint="Edit JSON directly. Save applies immediately.">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setErr(null); }}
          rows={22}
          style={{
            width: '100%', background: T.surfaceLo, border: `1px solid ${err ? T.red : T.border}`, color: T.text,
            padding: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.55, borderRadius: 2,
            outline: 'none', resize: 'vertical',
          }}
        />
        {err && <div style={{ color: T.red, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, marginTop: 6 }}>JSON error: {err}</div>}
      </Field>
      <DrawerActions onSave={save} onCancel={close} />
    </div>
  );
}

// =================================================================
// DIAGNOSIS editor
// =================================================================
export function DiagnosisEditor({ close }) {
  const d = STORE.getData().diagnosis || { enabled: true, summary: '', sections: [] };
  const [draft, setDraft] = useState(JSON.parse(JSON.stringify(d)));
  function commit(patch) { setDraft(prev => ({ ...prev, ...patch })); }
  function save() { STORE.update('diagnosis', draft); close(); }
  return (
    <div>
      <Field label="Enabled">
        <Select
          value={String(draft.enabled)}
          onChange={v => commit({ enabled: v === 'true' })}
          options={[
            { value: 'true', label: 'Show diagnosis section' },
            { value: 'false', label: 'Hide' },
          ]}
        />
      </Field>
      <Field label="One-line summary">
        <TextInput multiline value={draft.summary} onChange={v => commit({ summary: v })} />
      </Field>
      {(draft.sections || []).map((s, i) => (
        <div key={i} style={{ border: `1px solid ${T.border}`, padding: 12, marginBottom: 10, borderRadius: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginBottom: 8 }}>
            <input
              value={s.label}
              onChange={(e) => commit({ sections: draft.sections.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x) })}
              style={{ background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, borderRadius: 2, outline: 'none' }}
            />
            <button
              onClick={() => commit({ sections: draft.sections.filter((_, idx) => idx !== i) })}
              style={{ background: 'transparent', border: `1px solid ${T.border}`, color: T.textMute, padding: '0 12px', borderRadius: 2, cursor: 'pointer' }}
            >✕</button>
          </div>
          <textarea
            value={s.body}
            onChange={(e) => commit({ sections: draft.sections.map((x, idx) => idx === i ? { ...x, body: e.target.value } : x) })}
            rows={3}
            style={{ width: '100%', background: T.surfaceLo, border: `1px solid ${T.border}`, color: T.text, padding: '8px 10px', fontFamily: 'Manrope', fontSize: 13, lineHeight: 1.5, borderRadius: 2, outline: 'none', resize: 'vertical' }}
          />
        </div>
      ))}
      <button
        onClick={() => commit({ sections: [...(draft.sections || []), { label: 'Section', body: '' }] })}
        style={{ background: 'rgba(91,184,214,0.06)', border: `1px solid ${T.accent}`, color: T.accent, padding: '8px 14px', borderRadius: 2, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}
      >+ Add section</button>
      <DrawerActions onSave={save} onCancel={close} />
    </div>
  );
}
