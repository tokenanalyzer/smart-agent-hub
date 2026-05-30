import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Smartphone, Github, CheckCircle2 } from "lucide-react";
import { products } from "@/data/products";

const statusColor: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Beta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Coming Soon": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const screenshotLabels = ["Overview", "Dashboard", "Settings", "Mobile View"];
const screenshotGradients = [
  "from-violet-900/60 to-purple-900/40",
  "from-indigo-900/60 to-blue-900/40",
  "from-fuchsia-900/60 to-pink-900/40",
  "from-slate-900/60 to-zinc-800/40",
];

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">This product doesn't exist in the ecosystem.</p>
          <Link href="/products">
            <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link href="/products" data-testid="link-back-products">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </button>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-3xl bg-card/50 backdrop-blur-sm border border-white/8 p-8 sm:p-10 mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/6 blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${product.accentColor} flex items-center justify-center text-white font-black text-2xl shadow-xl flex-shrink-0`}>
              {product.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-foreground" data-testid="text-product-name">{product.name}</h1>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor[product.status]}`}>
                  {product.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-primary/80 font-medium bg-primary/8 px-3 py-1 rounded-lg border border-primary/15">
                  {product.category}
                </span>
                <span className="text-sm text-muted-foreground/70 font-mono">{product.version}</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base mb-6 max-w-2xl">
            {product.description}
          </p>

          {/* Link buttons */}
          <div className="flex flex-wrap gap-3">
            {product.websiteUrl && (
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-website"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all"
              >
                <ExternalLink size={14} />
                Visit Website
              </a>
            )}
            {product.apkUrl && (
              <a
                href={product.apkUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-apk"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 active:scale-95 transition-all"
              >
                <Smartphone size={14} />
                Download APK
              </a>
            )}
            {product.githubUrl && (
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-github"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/5 active:scale-95 transition-all"
              >
                <Github size={14} />
                GitHub
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Screenshots */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-foreground mb-4">Screenshots</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {screenshotLabels.map((label, i) => (
            <div
              key={label}
              className={`aspect-video rounded-xl bg-gradient-to-br ${screenshotGradients[i]} border border-white/8 flex items-end p-3 overflow-hidden relative`}
              data-testid={`screenshot-${i}`}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-3 left-3 right-3 h-1.5 rounded bg-white/30" />
                <div className="absolute top-7 left-3 right-6 h-1 rounded bg-white/20" />
                <div className="absolute top-10 left-3 right-8 h-1 rounded bg-white/15" />
                <div className="absolute top-14 left-3 w-8 h-8 rounded-lg bg-white/20" />
                <div className="absolute top-14 left-14 right-3 h-8 rounded-lg bg-white/10" />
              </div>
              <span className="relative z-10 text-white/60 text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
        className="rounded-3xl bg-card/40 backdrop-blur-sm border border-white/8 p-8"
      >
        <h2 className="text-xl font-bold text-foreground mb-6">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.features.map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
              className="flex items-center gap-3"
              data-testid={`feature-${i}`}
            >
              <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
              <span className="text-foreground/85 text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
