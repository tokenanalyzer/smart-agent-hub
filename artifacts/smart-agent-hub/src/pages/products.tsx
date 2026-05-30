import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useListProducts } from "@workspace/api-client-react";
import ProductCard from "@/components/ProductCard";

const categories = ["All", "Developer Suite", "Productivity & Automation", "Crypto Intelligence", "AI Assistant", "Prompt Engineering", "Content Automation"];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: products = [], isLoading } = useListProducts();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Ecosystem</p>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">All Products</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Six products. One unified ecosystem. Each built to solve a real problem.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="relative max-w-lg mx-auto mb-8"
      >
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/60 backdrop-blur-sm border border-white/10 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
          data-testid="input-search-products"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex flex-wrap justify-center gap-2 mb-12"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "")}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card/60 border border-white/8 text-muted-foreground hover:text-foreground hover:border-white/15"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading products…</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
          <div className="w-14 h-14 rounded-2xl bg-card/60 border border-white/8 flex items-center justify-center mx-auto mb-4">
            <Search size={20} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg font-medium mb-2">No products found</p>
          <p className="text-muted-foreground/60 text-sm">Try a different search term or category</p>
        </motion.div>
      )}
    </div>
  );
}
