import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap, Code2, Bot } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const stats = [
  { label: "Products", value: "6" },
  { label: "Tools", value: "12" },
  { label: "Active Projects", value: "8" },
];

const heroTags = ["AI Applications", "Developer Tools", "Automation Systems"];

const specializations = [
  { icon: <Bot size={18} />, label: "AI Applications" },
  { icon: <Zap size={18} />, label: "Automation Systems" },
  { icon: <Code2 size={18} />, label: "Developer Tools" },
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
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/15 border border-primary/30 mb-8 shadow-2xl shadow-primary/20"
          >
            <span className="text-primary font-black text-2xl tracking-tight">S_A</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground tracking-tight mb-6 leading-none"
          >
            SMART AGENT HUB
          </motion.h1>

          {/* Animated tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {heroTags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                className="text-sm sm:text-base font-medium text-muted-foreground px-4 py-1.5 rounded-full border border-white/10 bg-white/5"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-12"
          >
            One Ecosystem.{" "}
            <span className="text-primary font-medium">Multiple Products.</span>{" "}
            Built for Real-World Use.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/products" data-testid="hero-cta-products">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 group">
                Explore Products
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/help" data-testid="hero-cta-contact">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 hover:border-white/25 active:scale-95 transition-all">
                Contact
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-card/60 backdrop-blur-sm border border-white/8 p-4 text-center hover:border-primary/20 transition-colors"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
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

      {/* About Builder */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <div className="rounded-3xl bg-card/40 backdrop-blur-sm border border-white/8 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/8 blur-[80px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">About the Builder</p>
              <h2 className="text-3xl font-bold text-foreground mb-4">Adil Hussain</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                AI Builder, Automation Engineer, Security Researcher and Product Creator focused on building practical software powered by artificial intelligence.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {specializations.map((s) => (
                  <span
                    key={s.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                  >
                    {s.icon}
                    {s.label}
                  </span>
                ))}
              </div>
              <Link href="/about" data-testid="about-learn-more">
                <button className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group">
                  Learn More
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* CTA Strip */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeInSection>
          <div className="rounded-3xl relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8 sm:p-14 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Explore the Ecosystem?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Browse all 6 products, read the latest updates, or get in touch.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products" data-testid="cta-explore">
                  <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 group">
                    Explore Products
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/help" data-testid="cta-contact">
                  <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 active:scale-95 transition-all">
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
