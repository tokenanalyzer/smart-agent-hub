import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap, Code2, Bot, Shield, Cpu, TrendingUp, Mail } from "lucide-react";
import { FaGithub, FaXTwitter, FaTelegram, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { useListProducts } from "@workspace/api-client-react";
import ProductCard from "@/components/ProductCard";

const ecosystemStats = [
  { label: "Products", value: "6", icon: <Cpu size={16} /> },
  { label: "Tools Built", value: "12+", icon: <Zap size={16} /> },
  { label: "Active Projects", value: "8", icon: <TrendingUp size={16} /> },
  { label: "Years Building", value: "3+", icon: <Shield size={16} /> },
];

const specializations = [
  { icon: <Bot size={18} />, label: "AI Applications" },
  { icon: <Zap size={18} />, label: "Automation Systems" },
  { icon: <Code2 size={18} />, label: "Developer Tools" },
];

const missionPoints = [
  { title: "Build", description: "Create practical AI-powered tools that work in the real world." },
  { title: "Automate", description: "Remove repetitive work through intelligent automation systems." },
  { title: "Scale", description: "Ship products that grow with users and businesses of any size." },
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

export default function HomePage() {
  const { data: products = [] } = useListProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/7 blur-[130px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full bg-violet-500/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/15 border border-primary/30 mb-8 shadow-2xl shadow-primary/20"
          >
            <span className="text-primary font-black text-3xl tracking-tight">SAH</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black text-foreground tracking-tight mb-4 leading-none"
          >
            SAH Ecosystem
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-primary/80 font-semibold text-lg sm:text-xl tracking-widest uppercase mb-8"
          >
            Build. Automate. Scale.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            One Ecosystem.{" "}
            <span className="text-primary font-medium">Multiple Products.</span>{" "}
            Built for Real-World Use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/products" data-testid="hero-cta-products">
              <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 group">
                Explore Products
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/about" data-testid="hero-cta-about">
              <button className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 hover:border-white/25 active:scale-95 transition-all">
                About the Ecosystem
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          >
            {ecosystemStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-card/50 backdrop-blur-sm border border-white/8 p-4 text-center hover:border-primary/20 transition-colors"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex justify-center text-primary/60 mb-2">{stat.icon}</div>
                <div className="text-2xl font-black text-primary mb-0.5">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featuredProducts.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInSection>
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Ecosystem</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Featured Products</h2>
              </div>
              <Link href="/products" data-testid="section-view-all">
                <button className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                  View All
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <FadeInSection key={product.id} delay={i * 0.1}>
                <ProductCard product={product} index={0} />
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.3}>
            <div className="flex justify-center mt-10 sm:hidden">
              <Link href="/products">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                  View All Products
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </FadeInSection>
        </section>
      )}

      {/* ── Mission ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Purpose</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Mission</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Build intelligent software that automates work, improves productivity and solves real-world problems.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {missionPoints.map((point, i) => (
            <FadeInSection key={point.title} delay={i * 0.1}>
              <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-white/8 p-8 hover:border-primary/20 transition-colors text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-5">
                  <span className="text-primary font-black text-base">{point.title[0]}</span>
                </div>
                <h3 className="text-foreground font-bold text-xl mb-3">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <div className="rounded-3xl bg-card/40 backdrop-blur-sm border border-white/8 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl shadow-2xl shadow-primary/10 mb-4">
                  AH
                </div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((s) => (
                    <span key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                      {s.icon}
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Founder & Builder</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">Adil Husain</h2>
                <p className="text-muted-foreground text-sm font-medium mb-5">Founder & Builder, SAH Ecosystem</p>
                <p className="text-muted-foreground leading-relaxed text-base mb-8 max-w-2xl">
                  AI Builder, Automation Engineer, Product Creator and Independent Developer focused on building practical AI applications, automation systems, developer tools and productivity platforms.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/919967873413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 active:scale-95 transition-all"
                    data-testid="founder-whatsapp"
                  >
                    <FaWhatsapp size={14} />
                    WhatsApp
                  </a>
                  <a
                    href="https://t.me/dil3413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 active:scale-95 transition-all"
                    data-testid="founder-telegram"
                  >
                    <FaTelegram size={14} />
                    Telegram
                  </a>
                  <a
                    href="mailto:adilcryptonews@gmail.com"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-foreground text-sm font-semibold hover:bg-white/5 active:scale-95 transition-all"
                    data-testid="founder-email"
                  >
                    <Mail size={14} />
                    Email
                  </a>
                  <a
                    href="https://github.com/tokenanalyzer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-foreground text-sm font-semibold hover:bg-white/5 active:scale-95 transition-all"
                    data-testid="founder-github"
                  >
                    <FaGithub size={14} />
                    GitHub
                  </a>
                  <a
                    href="https://twitter.com/Husain3413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-foreground text-sm font-semibold hover:bg-white/5 active:scale-95 transition-all"
                    data-testid="founder-twitter"
                  >
                    <FaXTwitter size={14} />
                    X / Twitter
                  </a>
                  <a
                    href="https://linkedin.com/in/adil-hussain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-foreground text-sm font-semibold hover:bg-white/5 active:scale-95 transition-all"
                    data-testid="founder-linkedin"
                  >
                    <FaLinkedin size={14} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <div className="rounded-3xl relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8 sm:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">Get Started</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Explore?
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
                Browse the full product ecosystem or get in touch directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products" data-testid="cta-explore">
                  <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 group">
                    Explore Products
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/help" data-testid="cta-contact">
                  <button className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 active:scale-95 transition-all">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
