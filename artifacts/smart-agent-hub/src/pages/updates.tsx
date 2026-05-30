import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { updates, UpdateEntry } from "@/data/updates";
import { Rocket, RefreshCw, GitMerge, Map, CheckCircle2 } from "lucide-react";

const typeConfig: Record<UpdateEntry["type"], { icon: React.ReactNode; color: string; label: string }> = {
  release: {
    icon: <Rocket size={14} />,
    color: "bg-primary/10 text-primary border-primary/20",
    label: "Release",
  },
  update: {
    icon: <RefreshCw size={14} />,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    label: "Update",
  },
  patch: {
    icon: <GitMerge size={14} />,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Patch",
  },
  roadmap: {
    icon: <Map size={14} />,
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    label: "Roadmap",
  },
};

const changelog = updates.filter((u) => u.type !== "roadmap");
const roadmap = updates.filter((u) => u.type === "roadmap");

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function UpdatesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Changelog</p>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Updates & Roadmap</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Version history, product updates, and what's coming next.
        </p>
      </motion.div>

      {/* Changelog */}
      <FadeInSection>
        <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
          <RefreshCw size={18} className="text-primary" />
          Version History
        </h2>
      </FadeInSection>

      <div className="relative mb-20">
        {/* Timeline line */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

        <div className="space-y-8">
          {changelog.map((entry, i) => {
            const config = typeConfig[entry.type];
            return (
              <FadeInSection key={i} delay={i * 0.06}>
                <div className="relative pl-12 sm:pl-16" data-testid={`update-entry-${i}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-2 sm:left-4 top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary/70" />
                  </div>

                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-white/8 p-5 hover:border-white/15 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded-md border border-white/8">{entry.version}</span>
                      <span className="text-xs text-muted-foreground">{entry.product}</span>
                      <span className="ml-auto text-xs text-muted-foreground/50">{entry.date}</span>
                    </div>

                    <h3 className="text-foreground font-semibold text-base mb-3">{entry.title}</h3>

                    <ul className="space-y-1.5">
                      {entry.changes.map((change, j) => (
                        <li key={j} className="flex items-start gap-2 text-muted-foreground text-sm">
                          <CheckCircle2 size={13} className="text-primary/60 flex-shrink-0 mt-0.5" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeInSection>
            );
          })}
        </div>
      </div>

      {/* Roadmap */}
      <FadeInSection>
        <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Map size={18} className="text-amber-400" />
          Future Roadmap
        </h2>
      </FadeInSection>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {roadmap.map((entry, i) => (
          <FadeInSection key={i} delay={i * 0.08}>
            <div
              className="rounded-2xl bg-gradient-to-br from-amber-500/8 to-orange-500/5 border border-amber-500/15 p-6 hover:border-amber-500/25 transition-colors"
              data-testid={`roadmap-entry-${i}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Coming Soon
                </span>
                <span className="text-xs text-muted-foreground/60 font-mono">{entry.date}</span>
              </div>
              <h3 className="text-foreground font-semibold text-base mb-2">{entry.title}</h3>
              <p className="text-muted-foreground/70 text-xs mb-4">{entry.product}</p>
              <ul className="space-y-1.5">
                {entry.changes.map((change, j) => (
                  <li key={j} className="flex items-start gap-2 text-muted-foreground/80 text-xs">
                    <div className="w-1 h-1 rounded-full bg-amber-400/60 flex-shrink-0 mt-1.5" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
}
