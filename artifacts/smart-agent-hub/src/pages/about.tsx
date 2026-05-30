import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Zap, Code2, Smartphone, BarChart3, Globe, Cloud, Target, Shield } from "lucide-react";
import { FaGithub, FaXTwitter, FaTelegram, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { Mail } from "lucide-react";

const specializations = [
  { icon: <Bot size={20} />, label: "AI Applications" },
  { icon: <Zap size={20} />, label: "Automation Systems" },
  { icon: <Code2 size={20} />, label: "Developer Tools" },
  { icon: <Smartphone size={20} />, label: "Mobile Apps" },
  { icon: <BarChart3 size={20} />, label: "Productivity Platforms" },
  { icon: <Globe size={20} />, label: "API Integrations" },
  { icon: <Cloud size={20} />, label: "Cloud Deployments" },
  { icon: <Shield size={20} />, label: "Security Research" },
];

const timelineStats = [
  { value: "6", label: "Products Released" },
  { value: "12+", label: "Tools Built" },
  { value: "3+", label: "Years Building" },
  { value: "8", label: "Active Projects" },
];

const socialLinks = [
  {
    icon: <FaWhatsapp size={16} />,
    label: "WhatsApp",
    value: "+91 99678 73413",
    href: "https://wa.me/919967873413",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15",
  },
  {
    icon: <FaTelegram size={16} />,
    label: "Telegram",
    value: "@dil3413",
    href: "https://t.me/dil3413",
    color: "text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/15",
  },
  {
    icon: <Mail size={16} />,
    label: "Email",
    value: "adilcryptonews@gmail.com",
    href: "mailto:adilcryptonews@gmail.com",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/15",
  },
  {
    icon: <FaGithub size={16} />,
    label: "GitHub",
    value: "tokenanalyzer",
    href: "https://github.com/tokenanalyzer",
    color: "text-zinc-300 bg-zinc-500/10 border-zinc-500/20 hover:bg-zinc-500/15",
  },
  {
    icon: <FaXTwitter size={16} />,
    label: "X / Twitter",
    value: "@Husain3413",
    href: "https://twitter.com/Husain3413",
    color: "text-zinc-200 bg-zinc-600/10 border-zinc-500/20 hover:bg-zinc-600/15",
  },
  {
    icon: <FaLinkedin size={16} />,
    label: "LinkedIn",
    value: "Adil Hussain",
    href: "https://linkedin.com/in/adil-hussain",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15",
  },
];

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Story</p>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">About SAH Ecosystem</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          A single builder. A growing ecosystem. Built to solve real problems.
        </p>
      </motion.div>

      {/* Founder */}
      <FadeInSection>
        <div className="rounded-3xl bg-card/50 backdrop-blur-sm border border-white/8 p-8 sm:p-12 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl shadow-xl shadow-primary/10">
                  AH
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1" data-testid="text-founder-name">Adil Husain</h2>
                <p className="text-primary text-sm font-semibold mb-4">Founder & Builder, SAH Ecosystem</p>
                <p className="text-muted-foreground leading-relaxed text-base">
                  AI Builder, Automation Engineer, Product Creator and Independent Developer focused on building practical AI applications, automation systems, developer tools and productivity platforms.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:-translate-y-0.5 ${link.color}`}
                  data-testid={`about-social-${link.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "")}`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  <div className="min-w-0">
                    <p className="text-foreground/60 text-xs">{link.label}</p>
                    <p className="text-foreground text-xs font-medium truncate">{link.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Stats */}
      <FadeInSection delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {timelineStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-card/60 backdrop-blur-sm border border-white/8 p-5 text-center hover:border-primary/20 transition-colors"
              data-testid={`stat-about-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* Specializations */}
      <FadeInSection delay={0.1}>
        <div className="rounded-3xl bg-card/40 backdrop-blur-sm border border-white/8 p-8 mb-10">
          <h2 className="text-xl font-bold text-foreground mb-6">Specializing In</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {specializations.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/8 border border-primary/15 hover:bg-primary/12 hover:border-primary/25 transition-all"
                data-testid={`spec-${spec.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="text-primary flex-shrink-0">{spec.icon}</span>
                <span className="text-foreground/90 text-sm font-medium">{spec.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* Mission */}
      <FadeInSection delay={0.15}>
        <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-primary/8 to-transparent border border-primary/20 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <Target size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Mission</h2>
            <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-4">Build. Automate. Scale.</p>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Build intelligent software that automates work, improves productivity and solves real-world problems — one product at a time.
            </p>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
