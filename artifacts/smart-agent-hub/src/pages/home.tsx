import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Zap, Code2, Bot, Shield, Cpu, TrendingUp, Mail } from "lucide-react";
import { FaGithub, FaXTwitter, FaTelegram, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { useListProducts } from "@workspace/api-client-react";
import ProductCard from "@/components/ProductCard";

/* ─────────────────────────────────────────────────────── data ── */

const ecosystemStats = [
  { label: "Products", value: 6, suffix: "", icon: <Cpu size={16} /> },
  { label: "Tools Built", value: 12, suffix: "+", icon: <Zap size={16} /> },
  { label: "Active Projects", value: 8, suffix: "", icon: <TrendingUp size={16} /> },
  { label: "Years Building", value: 3, suffix: "+", icon: <Shield size={16} /> },
];

const specializations = [
  { icon: <Bot size={18} />, label: "AI Applications" },
  { icon: <Zap size={18} />, label: "Automation Systems" },
  { icon: <Code2 size={18} />, label: "Developer Tools" },
];

const missionPoints = [
  { title: "Build", description: "Create practical AI-powered tools that work in the real world.", letter: "B" },
  { title: "Automate", description: "Remove repetitive work through intelligent automation systems.", letter: "A" },
  { title: "Scale", description: "Ship products that grow with users and businesses of any size.", letter: "S" },
];

const tickerItems = [
  "AI Tools", "Crypto Analytics", "Developer Suite",
  "Automation Systems", "AI Assistant", "Productivity Platform",
  "Web3 Tools", "DeFi Analytics", "Open Source", "Real-World Software",
];

/* ── Gold particles config ── */
const PARTICLES = [
  { x: 8,  y: 15, size: 2,   delay: 0,    dur: 18 },
  { x: 22, y: 60, size: 1.5, delay: 2.5,  dur: 14 },
  { x: 38, y: 30, size: 1,   delay: 1,    dur: 20 },
  { x: 55, y: 75, size: 2.5, delay: 3,    dur: 16 },
  { x: 70, y: 20, size: 1.5, delay: 0.5,  dur: 22 },
  { x: 82, y: 50, size: 1,   delay: 4,    dur: 13 },
  { x: 92, y: 80, size: 2,   delay: 1.5,  dur: 17 },
  { x: 15, y: 85, size: 1.5, delay: 5,    dur: 15 },
  { x: 45, y: 10, size: 1,   delay: 2,    dur: 19 },
  { x: 65, y: 90, size: 2,   delay: 3.5,  dur: 21 },
  { x: 30, y: 45, size: 1,   delay: 0.8,  dur: 16 },
  { x: 78, y: 65, size: 1.5, delay: 4.5,  dur: 14 },
  { x: 5,  y: 50, size: 2,   delay: 1.2,  dur: 18 },
  { x: 50, y: 95, size: 1,   delay: 2.8,  dur: 13 },
  { x: 88, y: 35, size: 2,   delay: 0.3,  dur: 20 },
];

/* ─────────────────────────────────────────────── components ── */

function GoldParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, #f5c842 0%, #e8a200 100%)",
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.34, 1.46, 0.64, 1] }}
      className="relative inline-flex items-center justify-center w-36 h-36 mb-10"
    >
      {/* Outer dashed ring — slow spin */}
      <div
        className="absolute inset-0 rounded-3xl border-2 border-dashed border-amber-400/20 animate-spin-slow"
      />
      {/* Mid ring */}
      <div
        className="absolute inset-3 rounded-2xl border border-amber-400/15"
      />
      {/* Glow halo */}
      <div
        className="absolute inset-4 rounded-2xl blur-xl"
        style={{ background: "radial-gradient(circle, rgba(245,200,66,0.35) 0%, transparent 70%)" }}
      />
      {/* Main badge */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(245,200,66,0.3), 0 0 60px rgba(245,200,66,0.1)",
            "0 0 35px rgba(245,200,66,0.5), 0 0 90px rgba(245,200,66,0.2)",
            "0 0 20px rgba(245,200,66,0.3), 0 0 60px rgba(245,200,66,0.1)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f5c842 0%, #e8a200 45%, #c97c08 80%, #f5c842 100%)",
        }}
      >
        {/* Shine sweep */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
        <span
          className="relative z-10 font-black text-black/85 text-3xl"
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.08em" }}
        >
          SAH
        </span>
      </motion.div>
    </motion.div>
  );
}

function AnimatedTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15 + wi * 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="relative overflow-hidden py-4 border-y border-amber-400/10 bg-amber-400/3">
      <div className="flex gap-0 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-medium text-amber-400/60 tracking-widest uppercase">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/50 flex-shrink-0"
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

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

function GoldDivider() {
  return (
    <div className="flex items-center gap-4 max-w-xs mx-auto my-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-400/30" />
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
      <div className="w-2 h-2 rounded-full bg-amber-400/80" />
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-400/30" />
    </div>
  );
}

/* ──────────────────────────────────────────────────── page ── */

export default function HomePage() {
  const { data: products = [] } = useListProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px]"
            style={{ background: "radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)" }}
          />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(245,160,20,0.05) 0%, transparent 70%)" }}
          />
        </div>

        {/* Floating gold particles */}
        <GoldParticles />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HeroLogo />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-4 leading-none"
            style={{ color: "#f5c842" }}
          >
            SAH{" "}
            <span style={{ color: "#e8a200" }}>Ecosystem</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
            className="text-amber-400/75 font-semibold text-lg sm:text-xl tracking-[0.25em] uppercase mb-8"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Build · Automate · Scale
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            One Ecosystem.{" "}
            <span className="text-amber-400 font-medium">Multiple Products.</span>{" "}
            Built for Real-World Use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/products" data-testid="hero-cta-products">
              <button
                className="relative flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm active:scale-95 transition-all group overflow-hidden text-black"
                style={{
                  background: "linear-gradient(135deg, #f5c842 0%, #e8a200 50%, #c97c08 100%)",
                  boxShadow: "0 8px 30px rgba(245,200,66,0.3)",
                }}
              >
                <motion.span
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                />
                <span className="relative z-10">Explore Products</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/about" data-testid="hero-cta-about">
              <button className="flex items-center gap-2 px-8 py-4 rounded-xl border border-amber-400/25 text-amber-400/80 font-semibold text-sm hover:bg-amber-400/6 hover:border-amber-400/40 hover:text-amber-400 active:scale-95 transition-all">
                About the Ecosystem
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          >
            {ecosystemStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl backdrop-blur-sm p-4 text-center transition-all duration-300 hover:-translate-y-0.5 group"
                style={{
                  background: "rgba(245,200,66,0.04)",
                  border: "1px solid rgba(245,200,66,0.12)",
                }}
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex justify-center text-amber-400/50 mb-2 group-hover:text-amber-400/80 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-amber-400 mb-0.5">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Ticker (my suggestion: scrolling tech marquee) ── */}
      <Ticker />

      {/* ── Featured Products ── */}
      {featuredProducts.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-4">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3"
                style={{ fontFamily: "'Cinzel', serif" }}>
                Ecosystem
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Featured Products</h2>
              <GoldDivider />
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div className="flex justify-end mb-8 -mt-2">
              <Link href="/products" data-testid="section-view-all">
                <button className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-400 transition-colors group">
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
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-400 transition-colors group">
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
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.3em] mb-3"
              style={{ fontFamily: "'Cinzel', serif" }}>
              Purpose
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Mission</h2>
            <GoldDivider />
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-6">
              Build intelligent software that automates work, improves productivity and solves real-world problems.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {missionPoints.map((point, i) => (
            <FadeInSection key={point.title} delay={i * 0.12}>
              <div
                className="rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  background: "rgba(245,200,66,0.03)",
                  border: "1px solid rgba(245,200,66,0.1)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #f5c842 0%, #c97c08 100%)",
                    boxShadow: "0 4px 20px rgba(245,200,66,0.2)",
                  }}
                >
                  <span className="text-black font-black text-xl" style={{ fontFamily: "'Cinzel', serif" }}>
                    {point.letter}
                  </span>
                </div>
                <h3 className="text-foreground font-bold text-xl mb-3 group-hover:text-amber-400 transition-colors">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <div
            className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            style={{
              background: "rgba(245,200,66,0.03)",
              border: "1px solid rgba(245,200,66,0.12)",
            }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none blur-[120px]"
              style={{ background: "radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%)" }}
            />
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-shrink-0">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-black font-black text-2xl mb-4 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #f5c842 0%, #e8a200 50%, #c97c08 100%)",
                    boxShadow: "0 8px 30px rgba(245,200,66,0.25)",
                    fontFamily: "'Cinzel', serif",
                  }}
                >
                  AH
                </div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((s) => (
                    <span
                      key={s.label}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-amber-400 text-xs font-medium"
                      style={{
                        background: "rgba(245,200,66,0.08)",
                        border: "1px solid rgba(245,200,66,0.18)",
                      }}
                    >
                      {s.icon}
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.25em] mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}>
                  Founder &amp; Builder
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">Adil Husain</h2>
                <p className="text-muted-foreground text-sm font-medium mb-5">Founder &amp; Builder, SAH Ecosystem</p>
                <p className="text-muted-foreground leading-relaxed text-base mb-8 max-w-2xl">
                  AI Builder, Automation Engineer, Product Creator and Independent Developer focused on building practical AI applications, automation systems, developer tools and productivity platforms.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a href="https://wa.me/919967873413" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 active:scale-95 transition-all"
                    data-testid="founder-whatsapp">
                    <FaWhatsapp size={14} /> WhatsApp
                  </a>
                  <a href="https://t.me/dil3413" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 active:scale-95 transition-all"
                    data-testid="founder-telegram">
                    <FaTelegram size={14} /> Telegram
                  </a>
                  <a href="mailto:adilcryptonews@gmail.com"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-amber-400/80 text-sm font-semibold hover:text-amber-400 active:scale-95 transition-all"
                    style={{ border: "1px solid rgba(245,200,66,0.2)" }}
                    data-testid="founder-email">
                    <Mail size={14} /> Email
                  </a>
                  <a href="https://github.com/tokenanalyzer" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground text-sm font-semibold hover:text-foreground hover:bg-amber-400/6 active:scale-95 transition-all"
                    style={{ border: "1px solid rgba(245,200,66,0.15)" }}
                    data-testid="founder-github">
                    <FaGithub size={14} /> GitHub
                  </a>
                  <a href="https://twitter.com/Husain3413" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground text-sm font-semibold hover:text-foreground hover:bg-amber-400/6 active:scale-95 transition-all"
                    style={{ border: "1px solid rgba(245,200,66,0.15)" }}
                    data-testid="founder-twitter">
                    <FaXTwitter size={14} /> X / Twitter
                  </a>
                  <a href="https://linkedin.com/in/adil-hussain" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground text-sm font-semibold hover:text-foreground hover:bg-amber-400/6 active:scale-95 transition-all"
                    style={{ border: "1px solid rgba(245,200,66,0.15)" }}
                    data-testid="founder-linkedin">
                    <FaLinkedin size={14} /> LinkedIn
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
          <div
            className="rounded-3xl relative overflow-hidden p-8 sm:p-16 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(245,200,66,0.08) 0%, rgba(245,160,20,0.04) 50%, rgba(0,0,0,0) 100%)",
              border: "1px solid rgba(245,200,66,0.18)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(245,200,66,0.1) 0%, transparent 60%)" }}
            />
            <div className="relative z-10">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.3em] mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}>
                Get Started
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Ready to Explore?
              </h2>
              <GoldDivider />
              <p className="text-muted-foreground text-lg mt-6 mb-10 max-w-lg mx-auto">
                Browse the full product ecosystem or get in touch directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products" data-testid="cta-explore">
                  <button
                    className="relative flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm active:scale-95 transition-all group overflow-hidden text-black"
                    style={{
                      background: "linear-gradient(135deg, #f5c842 0%, #e8a200 50%, #c97c08 100%)",
                      boxShadow: "0 8px 30px rgba(245,200,66,0.25)",
                    }}
                    data-testid="cta-explore"
                  >
                    <motion.span
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                    />
                    <span className="relative z-10">Explore Products</span>
                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/help" data-testid="cta-contact">
                  <button
                    className="flex items-center gap-2 px-8 py-4 rounded-xl text-amber-400/80 font-semibold text-sm hover:bg-amber-400/6 hover:text-amber-400 active:scale-95 transition-all"
                    style={{ border: "1px solid rgba(245,200,66,0.22)" }}
                  >
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
