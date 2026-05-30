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
        className="group relative rounded-2xl bg-card/60 backdrop-blur-sm border border-white/8 p-6 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex items-start justify-between mb-5">
          <div className={`w-12 h-12 rounded-xl ${logoSrc ? "bg-black/30" : product.accentColor} flex items-center justify-center text-white font-black text-lg shadow-lg overflow-hidden flex-shrink-0`}>
            {logoSrc ? (
              <img src={logoSrc} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              product.name.charAt(0)
            )}
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor[product.status] ?? statusColor["Active"]}`}>
            {product.status}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-foreground font-semibold text-base mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <span className="text-xs text-primary/70 font-medium bg-primary/8 px-2 py-0.5 rounded-md border border-primary/15">
            {product.category}
          </span>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-2">
          {product.tagline}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/60 font-mono">{product.version}</span>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.websiteUrl && (
              <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
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
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
                aria-label="Download APK">
                <Smartphone size={13} />
              </a>
            )}
            {product.githubUrl && (
              <a href={product.githubUrl} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
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
