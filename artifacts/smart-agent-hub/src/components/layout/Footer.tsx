import { Link } from "wouter";
import { FaGithub, FaXTwitter, FaTelegram, FaLinkedin } from "react-icons/fa6";
import { useListProducts } from "@workspace/api-client-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Help", href: "/help" },
];

export default function Footer() {
  const { data: products = [] } = useListProducts();

  return (
    <footer className="mt-20" style={{ borderTop: "1px solid rgba(245,200,66,0.12)", background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5c842, #c97c08)" }}>
                <span className="text-black font-black text-xs tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>SAH</span>
              </div>
              <span className="text-foreground font-bold text-base">SAH Ecosystem</span>
            </div>
            <p className="text-primary/70 text-xs font-medium tracking-widest uppercase mb-4">Build. Automate. Scale.</p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              One Ecosystem. Multiple Products. Built for Real-World Use.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/tokenanalyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors"
                style={{ background: "rgba(245,200,66,0.05)", border: "1px solid rgba(245,200,66,0.12)" }}
                aria-label="GitHub"
              >
                <FaGithub size={15} />
              </a>
              <a
                href="https://twitter.com/Husain3413"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors"
                style={{ background: "rgba(245,200,66,0.05)", border: "1px solid rgba(245,200,66,0.12)" }}
                aria-label="X / Twitter"
              >
                <FaXTwitter size={15} />
              </a>
              <a
                href="https://t.me/dil3413"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors"
                style={{ background: "rgba(245,200,66,0.05)", border: "1px solid rgba(245,200,66,0.12)" }}
                aria-label="Telegram"
              >
                <FaTelegram size={15} />
              </a>
              <a
                href="https://linkedin.com/in/adil-hussain"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-amber-400 transition-colors"
                style={{ background: "rgba(245,200,66,0.05)", border: "1px solid rgba(245,200,66,0.12)" }}
                aria-label="LinkedIn"
              >
                <FaLinkedin size={15} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-foreground text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground text-sm font-semibold mb-4 uppercase tracking-wider">Products</h3>
            <ul className="space-y-2.5">
              {products.length > 0 ? (
                products.map((p) => (
                  <li key={p.id}>
                    <Link href={`/products/${p.id}`}>
                      <span className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer">
                        {p.name}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/products">
                    <span className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer">
                      View All Products
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:adilcryptonews@gmail.com" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  adilcryptonews@gmail.com
                </a>
              </li>
              <li>
                <a href="https://t.me/dil3413" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Telegram: @dil3413
                </a>
              </li>
              <li>
                <a href="https://wa.me/919967873413" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <Link href="/help">
                  <span className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer">
                    Contact Support
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(245,200,66,0.1)" }}>
          <p className="text-muted-foreground text-sm">
            &copy; 2026 SAH Ecosystem. Built by Adil Husain. All rights reserved.
          </p>
          <p className="text-muted-foreground/50 text-xs tracking-widest uppercase">
            Build. Automate. Scale.
          </p>
        </div>
      </div>
    </footer>
  );
}
