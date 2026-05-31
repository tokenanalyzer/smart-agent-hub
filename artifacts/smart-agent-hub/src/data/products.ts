export interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  version: string;
  status: "Active" | "Beta" | "Coming Soon";
  features: string[];
  websiteUrl?: string;
  apkUrl?: string;
  githubUrl?: string;
  accentColor: string;
}

export const products: Product[] = [
  {
    id: "ghosthub",
    name: "GhostHub",
    category: "Developer Suite",
    tagline: "Invisible infrastructure for modern developers.",
    description: "GhostHub is a comprehensive developer suite that provides invisible infrastructure management, automated deployments, and seamless CI/CD integrations. Built for developers who need reliability without the overhead.",
    version: "v2.4.1",
    status: "Active",
    features: ["Automated CI/CD pipelines", "Zero-downtime deployments", "Infrastructure monitoring", "Multi-environment support", "Webhook integrations", "Team collaboration tools"],
    accentColor: "bg-violet-600"
  },
  {
    id: "sah-ultimate",
    name: "S.A.H Ultimate 8.7",
    category: "Productivity & Automation",
    tagline: "The ultimate automation suite for peak productivity.",
    description: "S.A.H Ultimate is the flagship productivity and automation platform. Combines task automation, workflow orchestration, and AI-powered scheduling into a single unified workspace for individuals and teams.",
    version: "v8.7.0",
    status: "Active",
    features: ["Workflow automation engine", "AI task scheduling", "Cross-app integrations", "Smart notifications", "Analytics dashboard", "Mobile companion app"],
    accentColor: "bg-purple-600"
  },
  {
    id: "tokenanalyzer",
    name: "TokenAnalyzer",
    category: "Crypto Intelligence",
    tagline: "Real-time crypto intelligence at your fingertips.",
    description: "TokenAnalyzer delivers real-time cryptocurrency analytics, on-chain data aggregation, and market intelligence. Track token movements, wallet behaviors, and DeFi protocol activity with precision.",
    version: "v1.8.3",
    status: "Beta",
    features: ["Real-time price feeds", "On-chain analytics", "Wallet tracking", "DeFi protocol monitoring", "Alert system", "Portfolio overview"],
    accentColor: "bg-indigo-600"
  },
  {
    id: "nexa-ai",
    name: "Nexa AI",
    category: "AI Assistant",
    tagline: "Your intelligent AI companion for every task.",
    description: "Nexa AI is a context-aware AI assistant built for power users. Features long-term memory, multi-modal support, custom persona configuration, and deep integration with productivity workflows.",
    version: "v3.1.0",
    status: "Active",
    features: ["Long-term memory context", "Multi-modal inputs", "Custom AI personas", "Workflow integrations", "Voice interaction", "API access"],
    accentColor: "bg-blue-600"
  },
  {
    id: "prompt-pilot",
    name: "Prompt Pilot",
    category: "Prompt Engineering",
    tagline: "Engineer better prompts. Get better results.",
    description: "Prompt Pilot is a professional prompt engineering environment. Test, iterate, version, and deploy prompts across multiple LLM providers. Built for AI engineers who treat prompts as production code.",
    version: "v2.0.0",
    status: "Active",
    features: ["Visual prompt builder", "Multi-LLM testing", "Version control for prompts", "Performance benchmarking", "Team prompt library", "One-click deployment"],
    accentColor: "bg-fuchsia-600"
  },
  {
    id: "post-agent",
    name: "Post Agent",
    category: "Content Automation",
    tagline: "Automate your content. Amplify your reach.",
    description: "Post Agent automates social media content creation and scheduling across platforms. Uses AI to generate platform-optimized content, manage posting schedules, and analyze engagement metrics.",
    version: "v1.2.0",
    status: "Beta",
    features: ["AI content generation", "Multi-platform scheduling", "Engagement analytics", "Content calendar", "Brand voice training", "Hashtag optimization"],
    accentColor: "bg-pink-600"
  }
];
