// =====================================================================
// Components for the engagement dashboard.
// Dark, dense, scannable. No website chrome.
// =====================================================================

const T = {
  ink: "#06080C",
  bg: "#0B0F16",
  surface: "#11161F",
  surfaceHi: "#1A2230",
  surfaceLo: "#0E131B",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.16)",
  text: "#F5F7FA",
  textDim: "#A8B2C1",
  textMute: "#6B7689",
  accent: "#5BB8D6",
  accentHi: "#7CCDE5",
  green: "#5BB8D6",     // brand-aligned: cyan reads as green/healthy
  amber: "#E8B976",
  red:   "#E07A5F",
};

const RAG = {
  green: { label: "Green", color: T.green, bg: "rgba(91,184,214,0.10)",  bd: "rgba(91,184,214,0.32)" },
  amber: { label: "Amber", color: T.amber, bg: "rgba(232,185,118,0.10)", bd: "rgba(232,185,118,0.32)" },
  red:   { label: "Red",   color: T.red,   bg: "rgba(224,122,95,0.10)",  bd: "rgba(224,122,95,0.32)" },
};

// ---------- Atoms --------------------------------------------------

function RagDot({ rag, size = 8, glow = true }) {
  const c = RAG[rag] || RAG.amber;
  return (
    <span style={{
      display: "inline-block", width: size, height: size, borderRadius: "50%",
      background: c.color,
      boxShadow: glow ? `0 0 8px ${c.color}` : "none",
      flexShrink: 0,
    }} />
  );
}

function RagPill({ rag, label }) {
  const c = RAG[rag] || RAG.amber;
  return (
    <span style={{
      fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
      padding: "4px 10px", border: `1px solid ${c.bd}`, color: c.color, background: c.bg, borderRadius: 2,
      display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
    }}>
      <RagDot rag={rag} size={6} glow={false} />{label || c.label}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    "done":        { rag: "green", l: "Done" },
    "in-progress": { rag: "amber", l: "In progress" },
    "todo":        { rag: null,    l: "To do" },
    "open":        { rag: "amber", l: "Open" },
    "closed":      { rag: "green", l: "Closed" },
  };
  const m = map[status] || { rag: null, l: status };
  if (!m.rag) {
    return (
      <span style={{
        fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
        padding: "4px 10px", border: `1px solid ${T.border}`, color: T.textMute, borderRadius: 2,
        display: "inline-flex", alignItems: "center", gap: 8,
      }}>{m.l}</span>
    );
  }
  return <RagPill rag={m.rag} label={m.l} />;
}

function Eyebrow({ children, accent }) {
  return (
    <div style={{
      fontFamily: "Sora", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase",
      color: accent ? T.accent : T.textMute, marginBottom: 14,
    }}>{children}</div>
  );
}

function Card({ children, padding = 24, style }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4,
      padding, ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ n, title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        {n && (
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.accent, letterSpacing: "0.18em" }}>
            {n}
          </span>
        )}
        <h2 style={{ fontFamily: "Sora", fontWeight: 400, fontSize: 22, letterSpacing: "-0.005em", color: T.text, margin: 0 }}>
          {title}
        </h2>
        {sub && (
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute, letterSpacing: "0.1em" }}>
            {sub}
          </span>
        )}
      </div>
      {right}
    </div>
  );
}

// ---------- Header strip ------------------------------------------

function Header() {
  const c = window.ENGAGEMENT.client;
  const ragInfo = RAG[c.overallRAG];
  const pct = Math.round((c.currentWeek / c.totalWeeks) * 100);
  return (
    <header style={{
      borderBottom: `1px solid ${T.border}`,
      background: "rgba(11,15,22,0.6)",
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 40px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 16 }}>
          {/* left: brand mini */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, rgba(91,184,214,0.30), rgba(11,15,22,0.95) 70%)`,
              border: `1px solid rgba(91,184,214,0.40)`,
              boxShadow: `0 0 12px rgba(91,184,214,0.25)`,
            }} />
            <span style={{ fontFamily: "Sora", fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", color: T.text }}>
              SUMMIT<span style={{ color: T.accent }}>360</span>
              <span style={{ color: T.textMute, fontWeight: 400, marginLeft: 10, letterSpacing: "0.18em", fontSize: 11 }}>
                ENGAGEMENT
              </span>
            </span>
          </div>
          {/* right: code */}
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: T.textMute, letterSpacing: "0.14em" }}>
            {c.code}
          </div>
        </div>

        {/* Title row */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1.6fr) repeat(4, 1fr) auto", gap: 28, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.22em", color: T.textMute, textTransform: "uppercase", marginBottom: 6 }}>
              Client
            </div>
            <div style={{ fontFamily: "Sora", fontWeight: 500, fontSize: 18, color: T.text, letterSpacing: "-0.005em", lineHeight: 1.2 }}>
              {c.name}
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: T.textMute, marginTop: 4, letterSpacing: "0.1em" }}>
              {c.engagementType}
            </div>
          </div>
          <HField label="Week"      value={`${c.currentWeek} / ${c.totalWeeks}`} sub={`${pct}% elapsed`} />
          <HField label="Window"    value={`${c.startDate} → ${c.targetClose}`} mono />
          <HField label="S360 Lead" value={c.s360Lead}  sub={c.s360LeadTitle} accent />
          <HField label="Sponsor"   value={c.sponsor}   sub={c.sponsorTitle} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.22em", color: T.textMute, textTransform: "uppercase" }}>
              Status
            </span>
            <RagPill rag={c.overallRAG} />
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 18 }}>
          <div style={{ position: "relative", height: 2, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ position: "absolute", inset: 0, width: `${pct}%`, background: T.accent, boxShadow: `0 0 10px ${T.accent}` }} />
            {Array.from({ length: c.totalWeeks + 1 }).map((_, i) => (
              <span key={i} style={{
                position: "absolute", left: `${(i / c.totalWeeks) * 100}%`, top: -3, width: 1, height: 8,
                background: i <= c.currentWeek ? T.accent : "rgba(255,255,255,0.20)",
                transform: "translateX(-0.5px)",
              }} />
            ))}
          </div>
          {c.overallRAGNote && (
            <div style={{ fontFamily: "Manrope", fontSize: 12, color: ragInfo.color, marginTop: 10, letterSpacing: "0.01em" }}>
              <RagDot rag={c.overallRAG} size={6} glow={false} /> &nbsp;{c.overallRAGNote}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function HField({ label, value, sub, accent, mono }) {
  return (
    <div>
      <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: "0.22em", color: T.textMute, textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{
        fontFamily: mono ? "JetBrains Mono, monospace" : "Sora",
        fontWeight: mono ? 400 : 500,
        fontSize: mono ? 13 : 15,
        color: accent ? T.accent : T.text, lineHeight: 1.25,
        letterSpacing: mono ? "0.04em" : "0.005em",
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: T.textMute, marginTop: 4, letterSpacing: "0.1em" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { T, RAG, RagDot, RagPill, StatusPill, Eyebrow, Card, SectionTitle, Header, HField });
