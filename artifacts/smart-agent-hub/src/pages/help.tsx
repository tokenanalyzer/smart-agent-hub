import { motion } from "framer-motion";
import { FaGithub, FaTelegram, FaWhatsapp, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { Mail, ExternalLink } from "lucide-react";

const contactActions = [
  {
    icon: <FaWhatsapp size={24} />,
    title: "WhatsApp Chat",
    description: "Direct chat on WhatsApp",
    value: "+91 99678 73413",
    href: "https://wa.me/919967873413",
    color: "from-emerald-500/15 to-green-500/10 border-emerald-500/25 hover:border-emerald-500/40",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400",
    label: "Open WhatsApp",
  },
  {
    icon: <FaTelegram size={24} />,
    title: "Telegram Chat",
    description: "Message on Telegram",
    value: "@dil3413",
    href: "https://t.me/dil3413",
    color: "from-sky-500/15 to-blue-500/10 border-sky-500/25 hover:border-sky-500/40",
    iconColor: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-400",
    label: "Open Telegram",
  },
  {
    icon: <Mail size={24} />,
    title: "Send Email",
    description: "Email (primary)",
    value: "adilcryptonews@gmail.com",
    href: "mailto:adilcryptonews@gmail.com",
    color: "from-violet-500/15 to-purple-500/10 border-violet-500/25 hover:border-violet-500/40",
    iconColor: "text-violet-400",
    badge: "bg-violet-500/15 text-violet-400",
    label: "Send Email",
  },
  {
    icon: <Mail size={24} />,
    title: "Send Email",
    description: "Email (secondary)",
    value: "adilhusain3176@gmail.com",
    href: "mailto:adilhusain3176@gmail.com",
    color: "from-purple-500/15 to-fuchsia-500/10 border-purple-500/25 hover:border-purple-500/40",
    iconColor: "text-purple-400",
    badge: "bg-purple-500/15 text-purple-400",
    label: "Send Email",
  },
  {
    icon: <FaGithub size={24} />,
    title: "GitHub Profile",
    description: "Code repositories",
    value: "github.com/tokenanalyzer",
    href: "https://github.com/tokenanalyzer",
    color: "from-zinc-500/15 to-slate-500/10 border-zinc-500/25 hover:border-zinc-400/40",
    iconColor: "text-zinc-300",
    badge: "bg-zinc-500/15 text-zinc-300",
    label: "View GitHub",
  },
  {
    icon: <FaLinkedin size={24} />,
    title: "LinkedIn Profile",
    description: "Professional network",
    value: "Adil Hussain",
    href: "https://linkedin.com/in/adil-hussain",
    color: "from-blue-600/15 to-blue-500/10 border-blue-500/25 hover:border-blue-400/40",
    iconColor: "text-blue-400",
    badge: "bg-blue-500/15 text-blue-400",
    label: "View LinkedIn",
  },
  {
    icon: <FaXTwitter size={24} />,
    title: "X / Twitter",
    description: "Follow on X/Twitter",
    value: "@Husain3413",
    href: "https://twitter.com/Husain3413",
    color: "from-zinc-600/15 to-zinc-500/10 border-zinc-500/25 hover:border-zinc-400/40",
    iconColor: "text-zinc-200",
    badge: "bg-zinc-600/15 text-zinc-200",
    label: "Open X/Twitter",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-14"
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Contact</p>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Help & Contact</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Reach out directly through any of the channels below. Pick the one that works best for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
        {contactActions.map((action, i) => (
          <motion.a
            key={`${action.title}-${i}`}
            href={action.href}
            target={action.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
            className={`block p-6 rounded-2xl bg-gradient-to-br ${action.color} backdrop-blur-sm border hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 cursor-pointer group`}
            data-testid={`card-contact-${action.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "")}-${i}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${action.iconColor} group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <ExternalLink size={13} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-0.5" />
            </div>
            <p className="text-foreground font-semibold text-base mb-1">{action.title}</p>
            <p className="text-muted-foreground/70 text-xs mb-3">{action.description}</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${action.badge}`}>
              {action.value}
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.5, ease: "easeOut" }}
        className="rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-8 sm:p-10 text-center"
      >
        <h2 className="text-xl font-bold text-foreground mb-2">Response Time</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-lg mx-auto">
          WhatsApp and Telegram are the fastest ways to reach Adil directly. Email responses are typically within 24 hours.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/919967873413"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
            data-testid="button-whatsapp-primary"
          >
            <FaWhatsapp size={14} />
            Chat on WhatsApp
          </a>
          <a
            href="https://t.me/dil3413"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 active:scale-95 transition-all shadow-lg shadow-sky-600/20"
            data-testid="button-telegram-primary"
          >
            <FaTelegram size={14} />
            Message on Telegram
          </a>
          <a
            href="mailto:adilcryptonews@gmail.com"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-foreground text-sm font-semibold hover:bg-white/5 active:scale-95 transition-all"
            data-testid="button-email-primary"
          >
            <Mail size={14} />
            Send Email
          </a>
        </div>
      </motion.div>
    </div>
  );
}
