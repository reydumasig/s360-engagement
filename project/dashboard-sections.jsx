// =====================================================================
// This-week (executive) and details + history sections.
// =====================================================================

// ---------- THIS WEEK (executive) ---------------------------------

function ThisWeek() {
  const w = window.ENGAGEMENT.thisWeek;
  return (
    <section style={{ padding: "40px 40px 8px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle
          n="01"
          title="This week"
          sub={`Week ${w.week} · ${w.dates}`}
          right={<span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: T.textMute }}>EXECUTIVE</span>}
        />

        {/* TL;DR */}
        <div style={{ background: "rgba(91,184,214,0.05)", border: `1px solid rgba(91,184,214,0.22)`, borderLeft: `2px solid ${T.accent}`, padding: "20px 24px", marginBottom: 20 }}>
          <Eyebrow accent>TL;DR</Eyebrow>
          <p style={{ fontFamily: "Sora", fontWeight: 300, fontSize: 20, lineHeight: 1.4, color: T.text, margin: 0, letterSpacing: "-0.005em", textWrap: "pretty" }}>
            {w.tldr}
          </p>
        </div>

        {/* Workstream RAG row */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${w.workstreamRAG.length}, 1fr)`, gap: 12, marginBottom: 20 }}>
          {w.workstreamRAG.map((ws) => (
            <div key={ws.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${RAG[ws.rag].color}`, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "Sora", fontSize: 13, fontWeight: 500, color: T.text, letterSpacing: "-0.005em" }}>{ws.name}</span>
                <RagDot rag={ws.rag} size={8} />
              </div>
              <div style={{ fontFamily: "Manrope", fontSize: 12, color: T.textDim, lineHeight: 1.45 }}>{ws.note}</div>
            </div>
          ))}
        </div>

        {/* Top metrics + progress */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 20 }}>
          <MetricsBlock metrics={w.metrics} />
          <ProgressBlock progress={w.progress} />
        </div>

        {/* Shipped / Next */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <BulletCard label="Shipped this week" tone="accent" items={w.shipped} />
          <BulletCard label="Next week" items={w.next} />
        </div>

        {/* Risks / Decisions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <RisksBlock risks={w.risks} />
          <DecisionsBlock decisions={w.decisions} />
        </div>
      </div>
    </section>
  );
}

function BulletCard({ label, items, tone }) {
  return (
    <Card>
      <Eyebrow accent={tone === "accent"}>{label}</Eyebrow>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontFamily: "Manrope", fontSize: 14, lineHeight: 1.55, color: T.textDim, paddingLeft: 18, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 9, width: 10, height: 1, background: tone === "accent" ? T.accent : T.borderHi }} />
            {it}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RisksBlock({ risks }) {
  return (
    <Card>
      <Eyebrow>Risks · Blockers</Eyebrow>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
        {risks.map((r, i) => (
          <li key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start" }}>
            <RagDot rag={r.severity} size={8} />
            <span style={{ fontFamily: "Manrope", fontSize: 14, lineHeight: 1.5, color: T.text }}>{r.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function DecisionsBlock({ decisions }) {
  return (
    <Card style={{ borderLeft: `2px solid ${T.accent}` }}>
      <Eyebrow accent>Decisions needed from client</Eyebrow>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {decisions.map((d, i) => (
          <li key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start", paddingBottom: 10, borderBottom: i === decisions.length - 1 ? "none" : `1px solid ${T.border}` }}>
            <span style={{ fontFamily: "Manrope", fontSize: 14, lineHeight: 1.5, color: T.text }}>{d.label}</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.14em", color: T.accent, textTransform: "uppercase", whiteSpace: "nowrap" }}>
              by {d.needBy}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function MetricsBlock({ metrics }) {
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 20px 10px", borderBottom: `1px solid ${T.border}` }}>
        <Eyebrow>Top metrics</Eyebrow>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${metrics.length}, 1fr)` }}>
        {metrics.map((m, i) => <MetricCell key={i} metric={m} last={i === metrics.length - 1} />)}
      </div>
    </Card>
  );
}

function MetricCell({ metric, last }) {
  const { current, target, lowerBetter, label, unit } = metric;
  const has = current !== null && current !== undefined;
  let pct = 0, rag = "amber";
  if (has) {
    if (lowerBetter) {
      pct = Math.max(0, Math.min(100, (target / Math.max(current, 1)) * 100));
      rag = current <= target ? "green" : current <= target * 1.5 ? "amber" : "red";
    } else {
      pct = Math.max(0, Math.min(100, (current / target) * 100));
      rag = current >= target ? "green" : current >= target * 0.5 ? "amber" : "red";
    }
  }
  return (
    <div style={{ padding: "16px 20px", borderRight: last ? "none" : `1px solid ${T.border}` }}>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.18em", color: T.textMute, textTransform: "uppercase", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
        <span style={{ fontFamily: "Sora", fontWeight: 200, fontSize: 32, color: has ? T.text : T.textMute, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {has ? current : "—"}<span style={{ fontSize: 14, color: T.textDim, marginLeft: 2 }}>{unit}</span>
        </span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: T.textMute, letterSpacing: "0.06em" }}>
          / {target}{unit} target
        </span>
      </div>
      <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: RAG[rag].color }} />
      </div>
    </div>
  );
}

function ProgressBlock({ progress }) {
  const milePct = Math.round((progress.milestonesDone / progress.milestonesTotal) * 100);
  const dayPct  = Math.round((progress.daysElapsed / progress.daysTotal) * 100);
  return (
    <Card>
      <Eyebrow>Progress against plan</Eyebrow>
      <ProgressRow label="Milestones hit" value={`${progress.milestonesDone} / ${progress.milestonesTotal}`} pct={milePct} />
      <div style={{ height: 14 }} />
      <ProgressRow label="Days elapsed" value={`${progress.daysElapsed} / ${progress.daysTotal}`} pct={dayPct} />
    </Card>
  );
}

function ProgressRow({ label, value, pct }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textDim, letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.text, letterSpacing: "0.08em" }}>{value}</span>
      </div>
      <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: T.accent }} />
      </div>
    </div>
  );
}

// ---------- DETAILS ------------------------------------------------

function Details() {
  const e = window.ENGAGEMENT;
  return (
    <section style={{ padding: "16px 40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle
          n="02"
          title="Detail"
          sub="Workstreams, deliverables, risks, decisions, actions, milestones"
          right={<span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: T.textMute }}>APPENDIX</span>}
        />

        <Workstreams workstreams={e.workstreams} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <RiskRegister risks={e.riskRegister} />
          <DecisionLog decisions={e.decisionLog} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, marginTop: 12 }}>
          <Actions actions={e.actions} />
          <MilestoneCalendar milestones={e.milestones} />
        </div>

        <NotesLinks notes={e.notes} />
      </div>
    </section>
  );
}

function Workstreams({ workstreams }) {
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow>Workstreams</Eyebrow>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.18em", color: T.textMute }}>
          {workstreams.length} streams · {workstreams.reduce((a, w) => a + w.deliverables.length, 0)} deliverables
        </span>
      </div>
      {workstreams.map((ws, i) => (
        <div key={ws.name} style={{ borderBottom: i === workstreams.length - 1 ? "none" : `1px solid ${T.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1fr) 100px 1fr", padding: "14px 20px", background: T.surfaceLo, borderBottom: `1px solid ${T.border}`, alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <RagDot rag={ws.rag} size={10} />
              <span style={{ fontFamily: "Sora", fontWeight: 500, fontSize: 15, color: T.text, letterSpacing: "-0.005em" }}>{ws.name}</span>
            </div>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute, letterSpacing: "0.1em" }}>{ws.owner}</span>
            <div style={{ textAlign: "right" }}><RagPill rag={ws.rag} /></div>
          </div>
          <Table
            headers={["Deliverable", "Owner", "Date", "Status"]}
            cols="2.4fr 1fr 1fr 130px"
            rows={ws.deliverables.map(d => [
              <span style={{ fontFamily: "Manrope", fontSize: 14, color: T.text }}>{d.name}</span>,
              <span style={{ fontFamily: "Manrope", fontSize: 13, color: T.textDim }}>{d.owner}</span>,
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: T.textDim, letterSpacing: "0.04em" }}>{d.date}</span>,
              <span style={{ textAlign: "right", display: "block" }}><StatusPill status={d.status} /></span>,
            ])}
          />
        </div>
      ))}
    </Card>
  );
}

function Table({ headers, cols, rows }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 16, padding: "10px 20px", borderBottom: `1px solid ${T.border}` }}>
        {headers.map((h, i) => (
          <span key={i} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.2em", color: T.textMute, textTransform: "uppercase", textAlign: i === headers.length - 1 ? "right" : "left" }}>{h}</span>
        ))}
      </div>
      {rows.map((cells, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: cols, gap: 16, padding: "12px 20px", borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${T.border}`, alignItems: "center" }}>
          {cells.map((c, ci) => <div key={ci}>{c}</div>)}
        </div>
      ))}
    </div>
  );
}

function RiskRegister({ risks }) {
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}><Eyebrow>Risk register</Eyebrow></div>
      <Table
        headers={["ID", "Risk · Mitigation", "I/L", "Owner", "Status"]}
        cols="50px 2.6fr 60px 1fr 110px"
        rows={risks.map(r => [
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute }}>{r.id}</span>,
          <div>
            <div style={{ fontFamily: "Manrope", fontSize: 13, color: T.text, lineHeight: 1.4 }}>{r.risk}</div>
            <div style={{ fontFamily: "Manrope", fontSize: 12, color: T.textMute, marginTop: 4, lineHeight: 1.45 }}>↳ {r.mitigation}</div>
          </div>,
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textDim, letterSpacing: "0.1em" }}>{r.impact}/{r.likelihood}</span>,
          <span style={{ fontFamily: "Manrope", fontSize: 12, color: T.textDim }}>{r.owner}</span>,
          <span style={{ textAlign: "right", display: "block" }}><StatusPill status={r.status} /></span>,
        ])}
      />
    </Card>
  );
}

function DecisionLog({ decisions }) {
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}><Eyebrow>Decision log</Eyebrow></div>
      <Table
        headers={["ID", "Decision", "By", "Date", "Status"]}
        cols="50px 2fr 1fr 80px 110px"
        rows={decisions.map(d => [
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute }}>{d.id}</span>,
          <span style={{ fontFamily: "Manrope", fontSize: 13, color: T.text, lineHeight: 1.4 }}>{d.decision}</span>,
          <span style={{ fontFamily: "Manrope", fontSize: 12, color: T.textDim }}>{d.decidedBy}</span>,
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textDim }}>{d.date}</span>,
          <span style={{ textAlign: "right", display: "block" }}><StatusPill status={d.status} /></span>,
        ])}
      />
    </Card>
  );
}

function Actions({ actions }) {
  const [filter, setFilter] = React.useState("open");
  const list = actions.filter(a => filter === "all" ? true : a.status === filter);
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow>Action items</Eyebrow>
        <div style={{ display: "flex", gap: 4 }}>
          {[["open", "Open"], ["closed", "Closed"], ["all", "All"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "4px 10px", border: `1px solid ${filter === k ? T.accent : T.border}`, color: filter === k ? T.accent : T.textMute,
              background: filter === k ? "rgba(91,184,214,0.06)" : "transparent", borderRadius: 2, cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>
      </div>
      <Table
        headers={["ID", "Action", "Owner", "Due", "Status"]}
        cols="50px 2.4fr 1fr 80px 110px"
        rows={list.map(a => [
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute }}>{a.id}</span>,
          <span style={{ fontFamily: "Manrope", fontSize: 13, color: T.text }}>{a.action}</span>,
          <span style={{ fontFamily: "Manrope", fontSize: 12, color: T.textDim }}>{a.owner}</span>,
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textDim }}>{a.due}</span>,
          <span style={{ textAlign: "right", display: "block" }}><StatusPill status={a.status} /></span>,
        ])}
      />
    </Card>
  );
}

function MilestoneCalendar({ milestones }) {
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}><Eyebrow>Milestones</Eyebrow></div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {milestones.map((m, i) => (
          <li key={i} style={{ display: "grid", gridTemplateColumns: "70px auto 1fr auto", gap: 14, alignItems: "center", padding: "12px 20px", borderBottom: i === milestones.length - 1 ? "none" : `1px solid ${T.border}`, background: m.current ? "rgba(232,185,118,0.05)" : "transparent" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: m.done ? T.accent : T.textDim, letterSpacing: "0.06em" }}>{m.date}</span>
            <span style={{
              width: 12, height: 12, borderRadius: "50%",
              background: m.done ? T.accent : m.current ? T.amber : "transparent",
              border: `1px solid ${m.done ? T.accent : m.current ? T.amber : T.borderHi}`,
              boxShadow: m.done ? `0 0 8px ${T.accent}` : m.current ? `0 0 8px ${T.amber}` : "none",
            }} />
            <span style={{ fontFamily: "Manrope", fontSize: 14, color: T.text, lineHeight: 1.4 }}>{m.label}</span>
            {m.current && <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.16em", color: T.amber, textTransform: "uppercase" }}>NEXT</span>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function NotesLinks({ notes }) {
  const icons = { loom: "▶", doc: "≡", repo: "</>" };
  return (
    <Card style={{ marginTop: 12 }}>
      <Eyebrow>Notes & links</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
        {notes.map((n, i) => (
          <a key={i} href={n.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1px solid ${T.border}`, color: T.text, textDecoration: "none", background: T.surfaceLo, borderRadius: 2, transition: "border-color .2s" }}
             onMouseOver={e => e.currentTarget.style.borderColor = T.accent}
             onMouseOut={e => e.currentTarget.style.borderColor = T.border}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.accent, width: 22 }}>{icons[n.kind] || "·"}</span>
            <span style={{ fontFamily: "Manrope", fontSize: 13, color: T.text, flex: 1 }}>{n.label}</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: T.textMute, letterSpacing: "0.16em", textTransform: "uppercase" }}>{n.kind}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}

// ---------- DIAGNOSIS (collapsible) -------------------------------

function DiagnosisBlock() {
  const d = window.ENGAGEMENT.diagnosis;
  const [open, setOpen] = React.useState(false);
  if (!d || !d.enabled) return null;
  return (
    <section style={{ padding: "16px 40px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Card padding={0}>
          <button onClick={() => setOpen(!open)} style={{
            width: "100%", textAlign: "left", cursor: "pointer", padding: "16px 20px",
            background: "transparent", border: "none", color: T.text,
            display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", borderBottom: open ? `1px solid ${T.border}` : "none",
          }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.accent, letterSpacing: "0.18em" }}>00</span>
            <span style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: "Sora", fontWeight: 400, fontSize: 18, color: T.text }}>Diagnosis</span>
              <span style={{ fontFamily: "Manrope", fontSize: 13, color: T.textDim, fontStyle: "italic" }}>
                — {d.summary}
              </span>
            </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              {open ? "Collapse ▴" : "Expand ▾"}
            </span>
          </button>
          {open && (
            <div style={{ padding: "20px 20px 24px", display: "grid", gridTemplateColumns: `repeat(${d.sections.length}, 1fr)`, gap: 24 }}>
              {d.sections.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "Sora", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: T.accent, marginBottom: 10 }}>{s.label}</div>
                  <p style={{ fontFamily: "Manrope", fontSize: 14, lineHeight: 1.65, color: T.textDim, margin: 0, textWrap: "pretty" }}>{s.body}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

// ---------- HISTORY -----------------------------------------------

function History() {
  const weeks = window.ENGAGEMENT.priorWeeks;
  const [openWeek, setOpenWeek] = React.useState(null);
  if (!weeks || !weeks.length) return null;
  return (
    <section style={{ padding: "32px 40px 64px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle n="03" title="Prior weeks" sub={`${weeks.length} ${weeks.length === 1 ? "entry" : "entries"}`} />
        <div style={{ display: "grid", gap: 8 }}>
          {weeks.map((w) => (
            <PriorWeek key={w.week} week={w} open={openWeek === w.week} onToggle={() => setOpenWeek(openWeek === w.week ? null : w.week)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PriorWeek({ week, open, onToggle }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${RAG[week.rag].color}`, borderRadius: 2 }}>
      <button onClick={onToggle} style={{
        width: "100%", textAlign: "left", cursor: "pointer", padding: "14px 18px",
        background: "transparent", border: "none", color: T.text,
        display: "grid", gridTemplateColumns: "70px auto 1fr auto auto", gap: 16, alignItems: "center",
      }}>
        <span style={{ fontFamily: "Sora", fontWeight: 200, fontSize: 22, color: T.text, letterSpacing: "-0.02em" }}>W{String(week.week).padStart(2, "0")}</span>
        <RagDot rag={week.rag} size={8} />
        <span style={{ fontFamily: "Manrope", fontSize: 14, color: T.text, lineHeight: 1.4 }}>{week.tldr}</span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute, letterSpacing: "0.08em" }}>{week.dates}</span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: T.textMute, letterSpacing: "0.16em", textTransform: "uppercase" }}>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <Eyebrow accent>Shipped</Eyebrow>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {week.shipped.map((s, i) => (
                <li key={i} style={{ fontFamily: "Manrope", fontSize: 13, color: T.textDim, paddingLeft: 16, position: "relative", lineHeight: 1.55 }}>
                  <span style={{ position: "absolute", left: 0, top: 9, width: 8, height: 1, background: T.accent }} />{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Next</Eyebrow>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {week.next.map((s, i) => (
                <li key={i} style={{ fontFamily: "Manrope", fontSize: 13, color: T.textDim, paddingLeft: 16, position: "relative", lineHeight: 1.55 }}>
                  <span style={{ position: "absolute", left: 0, top: 9, width: 8, height: 1, background: T.borderHi }} />{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ThisWeek, Details, DiagnosisBlock, History });
