import { Link } from "wouter";
import { FaGithub, FaXTwitter, FaTelegram } from "react-icons/fa6";
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
    <footer className="border-t border-white/8 bg-background/60 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span className="text-primary font-black text-sm tracking-tight">S_A</span>
              </div>
              <span className="text-foreground font-bold text-base">SMART AGENT HUB</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              One Ecosystem. Multiple Products. Built for Real-World Use.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                data-testid="footer-social-github"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                data-testid="footer-social-twitter"
                aria-label="Twitter/X"
              >
                <FaXTwitter size={16} />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                data-testid="footer-social-telegram"
                aria-label="Telegram"
              >
                <FaTelegram size={16} />
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
            <h3 className="text-foreground text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:support@smartagenthub.io" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  support@smartagenthub.io
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://t.me/SmartAgentHub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Telegram
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

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; 2026 Smart Agent Hub. Built by Adil Hussain. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-xs">
            AI Applications &bull; Automation Systems &bull; Developer Tools
          </p>
        </div>
      </div>
    </footer>
  );
}
