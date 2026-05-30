export interface UpdateEntry {
  date: string;
  product: string;
  version: string;
  type: "release" | "update" | "patch" | "roadmap";
  title: string;
  changes: string[];
}

export const updates: UpdateEntry[] = [
  { date: "2026-05-20", product: "S_A.H Ultimate", version: "v8.7.0", type: "release", title: "Major Release: Workflow Engine v2", changes: ["Rebuilt automation engine from ground up", "50% faster task execution", "New drag-and-drop workflow builder", "Improved mobile companion app"] },
  { date: "2026-05-10", product: "Nexa AI", version: "v3.1.0", type: "update", title: "Long-term Memory & Voice", changes: ["Persistent conversation memory across sessions", "Voice input/output support", "Improved context window handling", "New API endpoints"] },
  { date: "2026-04-28", product: "GhostHub", version: "v2.4.1", type: "patch", title: "Stability & Performance", changes: ["Fixed webhook timeout issues", "Improved deployment logs", "Security patches applied", "Reduced cold start time by 30%"] },
  { date: "2026-04-15", product: "Prompt Pilot", version: "v2.0.0", type: "release", title: "Version 2.0 Launch", changes: ["Complete UI redesign", "Added GPT-4o and Claude 3.5 support", "Team collaboration features", "Version control system for prompts"] },
  { date: "2026-03-30", product: "TokenAnalyzer", version: "v1.8.3", type: "update", title: "DeFi Protocol Expansion", changes: ["Added 50+ new DeFi protocol trackers", "Real-time alert system", "Portfolio export to CSV", "Improved wallet labeling"] },
  { date: "2026-03-15", product: "Post Agent", version: "v1.2.0", type: "update", title: "Platform Expansion", changes: ["Added LinkedIn and Threads support", "AI content generation improvements", "New content calendar view", "Analytics dashboard beta"] },
  { date: "2026-Q3", product: "Ecosystem", version: "upcoming", type: "roadmap", title: "Unified Dashboard (Q3 2026)", changes: ["Single dashboard across all products", "Cross-product analytics", "Unified notification center"] },
  { date: "2026-Q4", product: "S_A.H Mobile", version: "upcoming", type: "roadmap", title: "Mobile App Launch (Q4 2026)", changes: ["Native iOS and Android apps", "Biometric authentication", "Offline mode support"] },
  { date: "2027-Q1", product: "API Platform", version: "upcoming", type: "roadmap", title: "Public API Platform (Q1 2027)", changes: ["Public REST API for all products", "Developer portal and docs", "Webhook marketplace"] },
];