import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ExternalLink, Github, Smartphone } from "lucide-react";
import { FaTelegram } from "react-icons/fa6";
import type { ApiProduct } from "@workspace/api-client-react";
import { storageUrl } from "@/lib/storage";

interface ProductCardProps {
  product: ApiProduct;
  index?: number;
}

const statusColor: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Beta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Coming Soon": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [, navigate] = useLocation();
  const logoSrc = storageUrl(product.logoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      data-testid={`card-product-${product.id}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/products/${product.id}`)}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/products/${product.id}`)}
        className="group relative rounded-2xl backdrop-blur-sm p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
        style={{
          background: "rgba(245,200,66,0.03)",
          border: "1px solid rgba(245,200,66,0.1)",
          boxShadow: "0 0 0 0 rgba(245,200,66,0)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(245,200,66,0.25)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(245,200,66,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(245,200,66,0.1)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 0 rgba(245,200,66,0)";
        }}
      >
        {/* Gold hover gradient overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(245,200,66,0.04) 0%, transparent 60%)" }}
        />

        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-xl ${logoSrc ? "" : product.accentColor} flex items-center justify-center text-white font-black text-lg shadow-lg overflow-hidden flex-shrink-0`}
            style={logoSrc ? { background: "rgba(245,200,66,0.1)", border: "1px solid rgba(245,200,66,0.2)" } : {}}>
            {logoSrc ? (
              <img src={logoSrc} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontFamily: "'Cinzel', serif" }}>{product.name.charAt(0)}</span>
            )}
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor[product.status] ?? statusColor["Active"]}`}>
            {product.status}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-foreground font-semibold text-base mb-1.5 group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <span className="text-xs text-amber-400/70 font-medium px-2 py-0.5 rounded-md"
            style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.15)" }}>
            {product.category}
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-2">
          {product.tagline}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/50 font-mono">{product.version}</span>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.websiteUrl && (
              <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-400/8 transition-colors"
                aria-label="Website">
                <ExternalLink size={13} />
              </a>
            )}
            {product.telegramUrl && (
              <a href={product.telegramUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                aria-label="Telegram">
                <FaTelegram size={13} />
              </a>
            )}
            {product.apkUrl && (
              <a href={product.apkUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-400/8 transition-colors"
                aria-label="Download APK">
                <Smartphone size={13} />
              </a>
            )}
            {product.githubUrl && (
              <a href={product.githubUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-400/8 transition-colors"
                aria-label="GitHub">
                <Github size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
