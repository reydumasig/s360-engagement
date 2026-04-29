export const ENGAGEMENT_SEED = {
  client: {
    name: "Summit 360 (Internal)",
    sponsor: "Adot Diuyan",
    sponsorTitle: "COO",
    s360Lead: "Rey Dumasig",
    s360LeadTitle: "AI Director",
    startDate: "2026-04-07",
    targetClose: "2026-05-09",
    currentWeek: 4,
    totalWeeks: 4,
    code: "S360-REC-OPS-26-04",
    engagementType: "AI Pathfinder · Recruitment & Ops Build",
    overallRAG: "green",
    overallRAGNote: "All four agents live and operational",
  },

  diagnosis: {
    enabled: true,
    summary:
      "Build a fully autonomous AI recruitment and operations backbone for Summit 360 — sourcing candidates, screening and shortlisting, managing Pathfinder success post-placement, and giving leadership full pipeline visibility — before scaling it to client engagements.",
    sections: [
      {
        label: "Context",
        body: "S360 was running recruitment and ops manually: sourcing on Indeed ad hoc, screening by hand, onboarding via Canva decks, and stitching weekly reports from Slack and JazzHR. Senior bench time on ops was estimated at 14+ hrs/week.",
      },
      {
        label: "Real Problem",
        body: "Not a tooling gap — an orchestration gap. JazzHR, Indeed, Slack, Monday.com, and Google Drive all existed. Nobody was connecting them. The data was there; the automation wasn't.",
      },
      {
        label: "Opportunity",
        body: "Build four interconnected AI agents that cover the full lifecycle — top-of-funnel sourcing through post-placement Pathfinder success — and package the same architecture as a repeatable client deliverable.",
      },
    ],
  },

  thisWeek: {
    week: 4,
    dates: "Apr 28 – May 2, 2026",
    tldr:
      "All four agents are live and operational. The recruitment loop is connected end-to-end. Outstanding: first real shortlist (May 2), outreach approval backlog needs a human owner, Pathfinder data registration in Trailblazer.",
    workstreamRAG: [
      {
        name: "Atlas Sourcing",
        rag: "green",
        note: "130 candidates in pipeline, daily reports live, JazzHR synced",
      },
      {
        name: "Atlas Recruiter",
        rag: "amber",
        note: "All flows live but end-to-end shortlist not yet run with a real candidate",
      },
      {
        name: "Atlas Trailblazer",
        rag: "green",
        note: "4 Pathfinders + 4 Summit Partners live on Monday.com",
      },
      {
        name: "Atlas OM",
        rag: "green",
        note: "Full reporting live — weekly, monthly, and KPI dashboard",
      },
    ],
    shipped: [
      "Atlas OM full reporting live (weekly narrative + monthly exec report)",
      "KPI dashboard summary embedded in Monday report",
      "Trailblazer Monday.com integration (4 Pathfinders, 4 Summit Partners)",
      "Profile Builder data package (JSON + markdown)",
      "Daily #trailblazer report (9AM KL)",
    ],
    next: [
      "First real shortlist run end-to-end (May 2)",
      "Candidate Q&A via email flow live (May 5)",
      "Outreach approval backlog — assign owner",
      "External pilot packaging proposal (Rey + Adot, May 5)",
    ],
    risks: [
      {
        label: "Outreach approval backlog: 123 drafts pending, no Sourcing Specialist actioning",
        severity: "high",
      },
      {
        label: "No shortlisted candidates yet — end-to-end recruiter flow untested",
        severity: "medium",
      },
      {
        label: "Trailblazer active_pathfinders.json not yet loaded into agent store",
        severity: "low",
      },
    ],
    decisions: [
      {
        label: "Who owns the outreach approval backlog?",
        asker: "Rey D.",
        needBy: "2026-05-01",
      },
      {
        label: "Package this architecture as external client deliverable — which agent first?",
        asker: "Rey D. + Adot",
        needBy: "2026-05-05",
      },
    ],
    metrics: [
      {
        label: "Candidates in pipeline",
        current: 130,
        target: 50,
        unit: "candidates",
        lowerBetter: false,
      },
      {
        label: "Agents live",
        current: 4,
        target: 4,
        unit: "of 4",
        lowerBetter: false,
      },
      {
        label: "Outreach drafts pending approval",
        current: 123,
        target: 0,
        unit: "drafts",
        lowerBetter: true,
      },
      {
        label: "Active Pathfinders monitored",
        current: 4,
        target: 4,
        unit: "Pathfinders",
        lowerBetter: false,
      },
      {
        label: "Weekly reports delivered",
        current: 4,
        target: 4,
        unit: "reports",
        lowerBetter: false,
      },
      {
        label: "Pipeline stalls detected",
        current: 0,
        target: 0,
        unit: "stalls",
        lowerBetter: true,
      },
    ],
    progress: {
      milestonesDone: 5,
      milestonesTotal: 8,
      daysElapsed: 22,
      daysTotal: 32,
    },
  },

  workstreams: [
    {
      name: "Atlas Sourcing",
      owner: "Rey D.",
      rag: "green",
      mission:
        "Top-of-funnel recruitment. JazzHR polling every 4h, personalised candidate outreach drafts, Day 3/7 follow-up sequences, Slack approval flow, daily pipeline reports.",
      deliverables: [
        {
          name: "JazzHR ↔ Indeed native integration",
          date: "2026-04-10",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Candidate pipeline store (candidates.jsonl)",
          date: "2026-04-12",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Outreach draft engine (personalised, no blasts)",
          date: "2026-04-14",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Slack approval flow (#sourcing)",
          date: "2026-04-15",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Day 3 / Day 7 follow-up sequences",
          date: "2026-04-16",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Screening question email pipeline",
          date: "2026-04-21",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "4-profile rubric scoring engine (AI/Tech, Finance/Ops, Healthcare, Sales/Marketing)",
          date: "2026-04-21",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Daily pipeline report (9AM KL, auto-post)",
          date: "2026-04-22",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "JazzHR sync (enriched profiles + engagement notes)",
          date: "2026-04-22",
          owner: "Rey D.",
          status: "done",
        },
      ],
    },
    {
      name: "Atlas Recruiter",
      owner: "Adot D. / Rey D.",
      rag: "amber",
      mission:
        "Screening, scoring, shortlisting. Picks up candidates from Sourcing, runs structured 5-competency scorecard, builds shortlists, preps S360 Profile Builder packages.",
      deliverables: [
        {
          name: "JazzHR daily applicant poll",
          date: "2026-04-15",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "5-competency scorecard engine (1–5 scale, 20% each)",
          date: "2026-04-16",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Resume scoring + structured brief",
          date: "2026-04-18",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "AI screening interview (email questionnaire)",
          date: "2026-04-19",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: 'Shortlist builder with "why this candidate" brief',
          date: "2026-04-20",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Profile Builder data package (JSON + markdown)",
          date: "2026-04-22",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Daily #recruiter report (9AM KL)",
          date: "2026-04-23",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Shortlist approval flow",
          date: "2026-04-23",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Candidate Q&A via email",
          date: "2026-05-02",
          owner: "Rey D.",
          status: "in-progress",
        },
      ],
    },
    {
      name: "Atlas Trailblazer",
      owner: "Adot D.",
      rag: "green",
      mission:
        "Post-placement Pathfinder success. Onboarding sequences, weekly pulse checks, health scoring, Summit Partner routine comms, risk/upsell signal detection.",
      deliverables: [
        {
          name: "Pathfinder onboarding sequence (Day 1/3/7/14/30 emails)",
          date: "2026-04-10",
          owner: "Adot D.",
          status: "done",
        },
        {
          name: "Weekly pulse check system (3-question survey)",
          date: "2026-04-13",
          owner: "Adot D.",
          status: "done",
        },
        {
          name: "Health scoring engine (Green/Yellow/Red thresholds)",
          date: "2026-04-14",
          owner: "Adot D.",
          status: "done",
        },
        {
          name: "Summit Partner weekly update drafts",
          date: "2026-04-16",
          owner: "Adot D.",
          status: "done",
        },
        {
          name: "Risk + upsell signal detection",
          date: "2026-04-18",
          owner: "Adot D.",
          status: "done",
        },
        {
          name: "Escalation brief drafting",
          date: "2026-04-19",
          owner: "Adot D.",
          status: "done",
        },
        {
          name: "Monday.com integration (4 Pathfinders, 4 Summit Partners live)",
          date: "2026-04-24",
          owner: "Adot D.",
          status: "done",
        },
        {
          name: "Daily #trailblazer report (9AM KL)",
          date: "2026-04-25",
          owner: "Adot D.",
          status: "done",
        },
      ],
    },
    {
      name: "Atlas OM",
      owner: "Rey D.",
      rag: "green",
      mission:
        "Pipeline orchestration and leadership visibility. Monitors all three agents, generates weekly narrative reports, routes escalations, answers SOP questions via Google Drive.",
      deliverables: [
        {
          name: "Pipeline health monitoring (every 4h, all 3 agents)",
          date: "2026-04-18",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Weekly narrative report (Monday 8AM KL, #operations)",
          date: "2026-04-20",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Escalation routing engine (structured brief → right human)",
          date: "2026-04-21",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "SOP Q&A (Google Drive folder search, cites source doc)",
          date: "2026-04-23",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "Monthly executive report (first Monday of month)",
          date: "2026-04-27",
          owner: "Rey D.",
          status: "done",
        },
        {
          name: "KPI dashboard summary (weekly, embedded in Monday report)",
          date: "2026-04-27",
          owner: "Rey D.",
          status: "done",
        },
      ],
    },
  ],

  riskRegister: [
    {
      id: "R-01",
      risk: "Outreach approval backlog — 123 drafts pending, no Sourcing Specialist actioning",
      impact: "high",
      likelihood: "high",
      mitigation: "Assign dedicated Sourcing Specialist; Adot to action or delegate",
      owner: "Adot",
      status: "open",
    },
    {
      id: "R-02",
      risk: "No shortlisted candidates yet — pipeline filling but end-to-end recruiter flow untested with real candidate",
      impact: "medium",
      likelihood: "medium",
      mitigation: "Push first batch through by May 2",
      owner: "Rey D.",
      status: "open",
    },
    {
      id: "R-03",
      risk: "Trailblazer active_pathfinders.json empty — data not yet loaded into agent store",
      impact: "low",
      likelihood: "high",
      mitigation: "Adot to register 4 active Pathfinders in system",
      owner: "Adot",
      status: "open",
    },
  ],

  decisionLog: [
    {
      id: "D-01",
      decision: "Sourcing approval flow via Slack reaction (✅)",
      decidedBy: "Rey",
      date: "2026-04-15",
      status: "closed",
    },
    {
      id: "D-02",
      decision: "4-profile rubric (AI/Tech, Finance/Ops, Healthcare, Sales/Marketing)",
      decidedBy: "Rey + Adot",
      date: "2026-04-20",
      status: "closed",
    },
    {
      id: "D-03",
      decision: "Monday.com as Trailblazer data source (vs. local JSON)",
      decidedBy: "Adot",
      date: "2026-04-22",
      status: "closed",
    },
    {
      id: "D-04",
      decision: "Who owns outreach approval backlog?",
      decidedBy: null,
      date: "2026-05-01",
      status: "open",
    },
    {
      id: "D-05",
      decision: "Package this architecture as external client deliverable — which agent first?",
      decidedBy: null,
      date: "2026-05-05",
      status: "open",
    },
  ],

  actions: [
    {
      id: "A-01",
      action: "Assign Sourcing Specialist to clear 123-draft approval backlog",
      owner: "Adot",
      due: "2026-05-01",
      status: "open",
    },
    {
      id: "A-02",
      action: "Run first real candidate through end-to-end shortlist flow",
      owner: "Rey D.",
      due: "2026-05-02",
      status: "open",
    },
    {
      id: "A-03",
      action: "Register 4 Pathfinders in Trailblazer agent store",
      owner: "Adot",
      due: "2026-05-01",
      status: "open",
    },
    {
      id: "A-04",
      action: "Candidate Q&A email flow",
      owner: "Rey D.",
      due: "2026-05-05",
      status: "in-progress",
    },
    {
      id: "A-05",
      action: "Draft external pilot packaging proposal",
      owner: "Rey D. + Adot",
      due: "2026-05-05",
      status: "open",
    },
    {
      id: "A-06",
      action: "Candidate Q&A live",
      owner: "Rey D.",
      due: "2026-04-23",
      status: "closed",
    },
    {
      id: "A-07",
      action: "Daily reports all four agents live",
      owner: "Rey D.",
      due: "2026-04-27",
      status: "closed",
    },
  ],

  milestones: [
    {
      date: "2026-04-07",
      label: "Engagement kicked off",
      done: true,
    },
    {
      date: "2026-04-15",
      label: "Sourcing pipeline live",
      done: true,
    },
    {
      date: "2026-04-23",
      label: "Full recruitment loop (Sourcing → Recruiter) live",
      done: true,
    },
    {
      date: "2026-04-25",
      label: "Trailblazer live with Monday.com",
      done: true,
    },
    {
      date: "2026-04-28",
      label: "Atlas OM full reporting live",
      done: true,
    },
    {
      date: "2026-05-02",
      label: "First end-to-end shortlist with real candidate",
      done: false,
      current: true,
    },
    {
      date: "2026-05-05",
      label: "Candidate Q&A via email live",
      done: false,
    },
    {
      date: "2026-05-09",
      label: "Internal handoff + external pilot packaging",
      done: false,
    },
  ],

  notes: [
    {
      kind: "folder",
      label: "SOP Folder (Google Drive)",
      href: null,
    },
    {
      kind: "slack",
      label: "#sourcing",
      href: null,
    },
    {
      kind: "slack",
      label: "#recruiter",
      href: null,
    },
    {
      kind: "slack",
      label: "#trailblazer",
      href: null,
    },
    {
      kind: "slack",
      label: "#operations",
      href: null,
    },
  ],

  priorWeeks: [
    {
      week: 3,
      dates: "Apr 21 – Apr 27, 2026",
      tldr: "Sourcing pipeline at 91 candidates. Recruiter scoring live. Trailblazer health engine live.",
      rag: "green",
      shipped: [
        "Rubric scoring engine (4-profile)",
        "Profile Builder data prep",
        "Trailblazer risk/upsell signal detection",
        "Escalation brief drafting",
      ],
      next: [
        "Atlas OM reporting",
        "Monday.com Trailblazer integration",
        "Shortlist flow",
      ],
      risks: [
        "Approval backlog growing with no assigned owner",
      ],
      decisions: [
        "Monday.com as Trailblazer data source (D-03) — closed by Adot",
      ],
    },
    {
      week: 2,
      dates: "Apr 14 – Apr 20, 2026",
      tldr: "Sourcing live. First candidates in JazzHR. Recruiter build started.",
      rag: "green",
      shipped: [
        "Outreach draft engine (personalised)",
        "Slack approval flow (#sourcing)",
        "Day 3/7 follow-up sequences",
        "JazzHR sync (enriched profiles + engagement notes)",
      ],
      next: [
        "Screening rubric",
        "Recruiter agent build",
        "Trailblazer start",
      ],
      risks: [],
      decisions: [
        "4-profile rubric (D-02) — closed by Rey + Adot",
      ],
    },
    {
      week: 1,
      dates: "Apr 7 – Apr 13, 2026",
      tldr: "Foundations laid. JazzHR ↔ Indeed wired. Sourcing pipeline store live. First architecture decisions made.",
      rag: "green",
      shipped: [
        "JazzHR ↔ Indeed native integration",
        "Candidate pipeline store (candidates.jsonl)",
        "Outreach engine draft",
        "Slack bot config",
        "Pathfinder onboarding sequence (Day 1/3/7/14/30)",
        "Weekly pulse check system",
      ],
      next: [
        "Approval flow",
        "Follow-up sequences",
        "Recruiter agent start",
      ],
      risks: [],
      decisions: [
        "Sourcing approval flow via Slack reaction ✅ (D-01) — closed by Rey",
      ],
    },
  ],
};
