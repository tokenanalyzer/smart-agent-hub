import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Help", href: "/help" },
];

function SahLogo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div
      className={`relative flex-shrink-0 ${isLg ? "w-20 h-20" : "w-10 h-10"} flex items-center justify-center`}
    >
      <div
        className={`
          absolute inset-0 rounded-2xl
          border border-dashed animate-spin-slow
          border-amber-400/25
        `}
      />
      <div
        className={`
          relative ${isLg ? "w-16 h-16" : "w-8 h-8"} rounded-xl
          flex items-center justify-center
          animate-pulse-glow overflow-hidden
        `}
        style={{
          background: "linear-gradient(135deg, #f5c842 0%, #e8a200 50%, #c9860a 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)" }}
        />
        <span
          className={`relative z-10 font-black tracking-tight text-black/90 ${isLg ? "text-2xl" : "text-[10px]"}`}
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}
        >
          SAH
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/85 backdrop-blur-xl border-b border-amber-400/10 shadow-lg shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" data-testid="nav-logo">
              <div className="flex items-center gap-3 group cursor-pointer">
                <SahLogo size="sm" />
                <div className="hidden sm:block">
                  <span
                    className="font-bold text-base tracking-wide text-gold-gradient"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    SAH Ecosystem
                  </span>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
              {navLinks.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link key={link.href} href={link.href} data-testid={`nav-link-${link.label.toLowerCase()}`}>
                    <span
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? "text-amber-400"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 bg-amber-400/10 rounded-lg border border-amber-400/25"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-400/8 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="nav-mobile-toggle"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
            data-testid="nav-mobile-menu"
          >
            <div className="mx-4 mt-2 rounded-2xl bg-[#0d0d0d]/98 backdrop-blur-xl border border-amber-400/15 shadow-2xl shadow-black/60 overflow-hidden">
              <nav className="flex flex-col p-3 gap-1">
                {navLinks.map((link) => {
                  const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                  return (
                    <Link key={link.href} href={link.href} data-testid={`nav-mobile-link-${link.label.toLowerCase()}`}>
                      <span
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "bg-amber-400/12 text-amber-400 border border-amber-400/25"
                            : "text-muted-foreground hover:text-foreground hover:bg-amber-400/6"
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
