import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-sm"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <h1 className="text-5xl font-black text-foreground mb-2">404</h1>
        <p className="text-xl font-semibold text-foreground mb-2">Page Not Found</p>
        <p className="text-muted-foreground text-sm mb-8">
          This page doesn't exist in the SAH Ecosystem.
        </p>
        <Link href="/">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all mx-auto">
            <ArrowLeft size={14} />
            Back to Home
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
