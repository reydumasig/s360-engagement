// =====================================================================
// CLIENT ENGAGEMENT — single object drives the whole dashboard.
// Duplicate this file per client; edit values; ship.
// =====================================================================

export const ENGAGEMENT_SEED = {
  // -- Header / context ----------------------------------------------
  client: {
    name: "Summit360 Solutions — Internal",
    sponsor: "Adot Diuyan",
    sponsorTitle: "COO",
    s360Lead: "Rey Dumasig",
    s360LeadTitle: "AI Director",
    startDate: "Apr 20, 2026",
    targetClose: "May 8, 2026",
    currentWeek: 2,
    totalWeeks: 3,
    code: "S360-INT-26-04",
    engagementType: "AI Pathfinder · Internal pilot",
    overallRAG: "amber",
    overallRAGNote: "Edit-rate above target; on track to recover by Wed.",
  },

  // -- Diagnosis (optional, collapsible) -----------------------------
  diagnosis: {
    enabled: true,
    summary: "Before we sell AI to clients, we need to live it. Build a Claude-powered weekly-report agent in three weeks — one we can repackage as a client deliverable in week four.",
    sections: [
      { label: "Context", body: "Summit360 closed Q1 with seven AI-Pathfinder engagements while still running our own back office by hand. Status assembly burns ~14 hrs/wk of senior bench time across Notion, Slack, and Linear." },
      { label: "Real problem", body: "Not a tooling gap — an authoring gap. The data exists; nobody has the time to assemble it. We need an agent that drafts the weekly note from existing surfaces, not another dashboard." },
      { label: "Opportunity", body: "Build it internally; package it as the opening deliverable of every AI Pathfinder engagement. Proof we run on what we sell." },
    ],
  },

  // -- Current week — Executive ------------------------------------
  thisWeek: {
    week: 2,
    dates: "Apr 27 — May 1, 2026",
    tldr: "Agent v1 is drafting reports across two of four workstreams. Edit-rate at 42% — above target but trending down. Notion adapter to GA Wednesday will unlock the remaining two streams.",
    workstreamRAG: [
      { name: "Discovery & Baseline", rag: "green", note: "Closed last week." },
      { name: "Agent Build", rag: "amber", note: "Notion adapter trailing by 2 days." },
      { name: "Calibration & Adoption", rag: "amber", note: "Edit-rate above 30% target." },
      { name: "Productize", rag: "green", note: "Starts Mon; SOW template draft ready." },
    ],
    shipped: [
      "Linear + Slack ingest connectors live; agent reading from both.",
      "Claude weekly-draft prompt v1 producing usable output for Engagement Ops + Build.",
      "First Friday delivery dry-run landed in Adot's inbox Apr 30 (edit-rate 42%).",
      "Edit-rate instrumentation shipped — measuring per-section edit distance.",
    ],
    next: [
      "Notion read-only adapter to GA by Wed; expand agent to all 4 workstreams.",
      "Prompt v2 — tighten Risks/Decisions section based on Adot's edits.",
      "Daily 15-min review w/ engagement leads to compress edit-rate <30%.",
      "Begin SOW template — agent as opening deliverable.",
    ],
    risks: [
      { label: "Notion API rate limits may force polling fallback (+0.5d)", severity: "amber" },
      { label: "Two engagement leads on PTO Thu/Fri — review cadence delayed", severity: "amber" },
    ],
    decisions: [
      { label: "Ship agent-drafted note BEFORE Monday human review, or after?", asker: "Rey", needBy: "Mon May 4" },
      { label: "Include Sales pipeline channel in v1, or hold for v2?", asker: "Rey", needBy: "Wed May 6" },
    ],
    metrics: [
      { label: "Senior hours saved / wk", current: 4, target: 10, unit: "hrs", lowerBetter: false },
      { label: "Workstreams covered", current: 2, target: 4, unit: "", lowerBetter: false },
      { label: "Edit-rate on agent draft", current: 42, target: 30, unit: "%", lowerBetter: true },
    ],
    progress: { milestonesDone: 1, milestonesTotal: 5, daysElapsed: 8, daysTotal: 18 },
  },

  // -- Detailed appendix ---------------------------------------------
  workstreams: [
    {
      name: "Discovery & Baseline", owner: "Rey D.", rag: "green",
      deliverables: [
        { name: "Stakeholder interviews (×6)", date: "Apr 22", owner: "Rey D.", status: "done" },
        { name: "Time-tracking baseline", date: "Apr 23", owner: "Pathfinder ops", status: "done" },
        { name: "Surface inventory + access", date: "Apr 24", owner: "Rey D.", status: "done" },
      ],
    },
    {
      name: "Agent Build", owner: "Rey D.", rag: "amber",
      deliverables: [
        { name: "Linear + Slack ingest connectors", date: "Apr 28", owner: "Rey D.", status: "done" },
        { name: "Notion read-only adapter", date: "Apr 29", owner: "AI Eng", status: "in-progress" },
        { name: "Claude prompt: weekly draft v1", date: "Apr 30", owner: "Rey D.", status: "done" },
        { name: "Friday-morning delivery hook", date: "May 1", owner: "Rey D.", status: "done" },
        { name: "Prompt v2 — Risks/Decisions tightening", date: "May 4", owner: "Rey D.", status: "todo" },
      ],
    },
    {
      name: "Calibration & Adoption", owner: "Pathfinder ops", rag: "amber",
      deliverables: [
        { name: "Edit-rate instrumentation", date: "Apr 30", owner: "Pathfinder ops", status: "done" },
        { name: "Daily review w/ engagement leads", date: "May 1 — May 6", owner: "Rey D.", status: "in-progress" },
        { name: "Adoption playbook v1", date: "May 5", owner: "Pathfinder ops", status: "todo" },
      ],
    },
    {
      name: "Productize", owner: "Adot D.", rag: "green",
      deliverables: [
        { name: "SOW template (agent as deliverable)", date: "May 6", owner: "Adot D.", status: "todo" },
        { name: "Pricing + margin model", date: "May 7", owner: "Adot D.", status: "todo" },
        { name: "Two prospect conversations", date: "May 7 — May 8", owner: "Rey + Adot", status: "todo" },
      ],
    },
  ],

  riskRegister: [
    { id: "R-01", risk: "Notion API rate limits force polling fallback", impact: "M", likelihood: "M", mitigation: "Pre-cache via webhook fanout if limits hit; +0.5d buffer in plan", owner: "Rey D.", status: "open" },
    { id: "R-02", risk: "Engagement leads' edit-rate stays >30% past week 3", impact: "H", likelihood: "L", mitigation: "Daily review cadence; prompt v2 ships May 4", owner: "Rey D.", status: "open" },
    { id: "R-03", risk: "Two leads on PTO Thu/Fri delays review loop", impact: "L", likelihood: "H", mitigation: "Async Loom reviews; reschedule synchronous to Mon", owner: "Pathfinder ops", status: "open" },
    { id: "R-04", risk: "Notion permissions ambiguous in 2 workstreams", impact: "M", likelihood: "L", mitigation: "Owners assigned; resolved Apr 28", owner: "Rey D.", status: "closed" },
  ],

  decisionLog: [
    { id: "D-03", decision: "Pending: ship agent draft before/after Monday review", decidedBy: "—", date: "—", status: "open" },
    { id: "D-02", decision: "Friday morning is the delivery slot (vs. Thursday EOD)", decidedBy: "Adot D.", date: "Apr 28", status: "closed" },
    { id: "D-01", decision: "Scope locked to 4 workstreams; Sales channel deferred to v2", decidedBy: "Adot D., Rey D.", date: "Apr 22", status: "closed" },
  ],

  actions: [
    { id: "A-09", action: "Provision Notion adapter service account", owner: "Rey D.", due: "Apr 30", status: "open" },
    { id: "A-08", action: "Draft prompt v2 changes from Apr 30 edits", owner: "Rey D.", due: "May 1", status: "open" },
    { id: "A-07", action: "Schedule Mon/Wed/Fri 15-min review", owner: "Pathfinder", due: "May 1", status: "open" },
    { id: "A-06", action: "Send SOW template draft to Adot", owner: "Rey D.", due: "May 5", status: "open" },
    { id: "A-05", action: "Edit-rate dashboard live for engagement leads", owner: "Pathfinder", due: "Apr 30", status: "closed" },
    { id: "A-04", action: "First Friday dry-run shipped", owner: "Rey D.", due: "Apr 30", status: "closed" },
    { id: "A-03", action: "Stakeholder interviews complete", owner: "Rey D.", due: "Apr 22", status: "closed" },
  ],

  milestones: [
    { date: "Apr 24", label: "Baseline locked", done: true },
    { date: "Apr 30", label: "Agent v1 live (4 workstreams)", done: false, current: true },
    { date: "May 2", label: "Edit-rate <30%", done: false },
    { date: "May 6", label: "Internal handoff complete", done: false },
    { date: "May 8", label: "Packaged client offer drafted", done: false },
  ],

  notes: [
    { kind: "loom", label: "Apr 30 — Agent v1 demo (4 min)", href: "#" },
    { kind: "doc", label: "Diagnosis brief (canonical)", href: "#" },
    { kind: "repo", label: "github.com/s360/weekly-agent", href: "#" },
    { kind: "doc", label: "Edit-rate measurement spec", href: "#" },
    { kind: "loom", label: "Apr 22 — Stakeholder synthesis", href: "#" },
  ],

  // -- Prior weeks (collapsed by default) ----------------------------
  priorWeeks: [
    {
      week: 1,
      dates: "Apr 20 — Apr 24, 2026",
      tldr: "Baseline locked at 14.2 hrs/wk on status assembly. Surfaces wired. One pilot by hand. On plan, RAG green.",
      rag: "green",
      shipped: [
        "Six stakeholder interviews (3 leads, 2 Pathfinders, COO).",
        "Time-tracking baseline: 14.2 hrs/wk on status assembly.",
        "Linear + Slack + Notion access provisioned.",
        "First hand-assembled weekly note shipped Friday.",
      ],
      next: [
        "Wire Linear + Slack connectors against Claude.",
        "Stand up Notion read-only adapter.",
        "Draft prompt v1.",
      ],
      risks: ["Notion permissions ambiguous in 2 workstreams"],
      decisions: ["Scope: include Sales pipeline channel in v1?"],
    },
  ],
};
