import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import type { ApiProduct, ProductInput } from "@workspace/api-client-react";
import {
  Plus, Pencil, Trash2, ExternalLink, Github, Smartphone,
  Lock, Eye, EyeOff, X, Save, Loader2, AlertTriangle, ChevronUp, ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ADMIN_PASSWORD = "sah-admin-2024";
const SESSION_KEY = "sah_admin_auth";

const ACCENT_COLORS = [
  { value: "bg-violet-600", label: "Violet" },
  { value: "bg-purple-600", label: "Purple" },
  { value: "bg-indigo-600", label: "Indigo" },
  { value: "bg-blue-600", label: "Blue" },
  { value: "bg-fuchsia-600", label: "Fuchsia" },
  { value: "bg-pink-600", label: "Pink" },
  { value: "bg-rose-600", label: "Rose" },
  { value: "bg-cyan-600", label: "Cyan" },
  { value: "bg-emerald-600", label: "Emerald" },
  { value: "bg-amber-600", label: "Amber" },
];

const CATEGORIES = [
  "Developer Suite",
  "Productivity & Automation",
  "Crypto Intelligence",
  "AI Assistant",
  "Prompt Engineering",
  "Content Automation",
];

const STATUSES = ["Active", "Beta", "Coming Soon"];

const statusColor: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Beta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Coming Soon": "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const productSchema = z.object({
  name: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  tagline: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  version: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  featuresRaw: z.string().min(1, "At least one feature required"),
  websiteUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
  apkUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
  githubUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
  accentColor: z.string().min(1, "Required"),
  sortOrder: z.coerce.number().int().default(0),
});

type ProductFormData = z.infer<typeof productSchema>;

function formToInput(data: ProductFormData): ProductInput {
  return {
    name: data.name,
    category: data.category,
    tagline: data.tagline,
    description: data.description,
    version: data.version,
    status: data.status,
    features: data.featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean),
    websiteUrl: data.websiteUrl || null,
    apkUrl: data.apkUrl || null,
    githubUrl: data.githubUrl || null,
    accentColor: data.accentColor,
    sortOrder: data.sortOrder,
  };
}

function productToForm(p: ApiProduct): ProductFormData {
  return {
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    version: p.version,
    status: p.status,
    featuresRaw: p.features.join("\n"),
    websiteUrl: p.websiteUrl ?? "",
    apkUrl: p.apkUrl ?? "",
    githubUrl: p.githubUrl ?? "",
    accentColor: p.accentColor,
    sortOrder: p.sortOrder,
  };
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-3xl bg-card/60 backdrop-blur-sm border border-white/10 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Lock size={22} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mb-8">Enter your admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className={`w-full px-4 py-3 pr-11 rounded-xl bg-background/60 border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:ring-primary/20 focus:border-primary/40"
                }`}
                data-testid="input-admin-password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs flex items-center gap-1.5 justify-center">
                <AlertTriangle size={12} />
                Incorrect password
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all"
              data-testid="button-admin-login"
            >
              Enter
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function ProductFormDrawer({
  product,
  onClose,
  onSave,
  isPending,
}: {
  product: ApiProduct | null;
  onClose: () => void;
  onSave: (data: ProductInput) => void;
  isPending: boolean;
}) {
  const isEdit = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? productToForm(product)
      : {
          name: "",
          category: "",
          tagline: "",
          description: "",
          version: "v1.0.0",
          status: "Active",
          featuresRaw: "",
          websiteUrl: "",
          apkUrl: "",
          githubUrl: "",
          accentColor: "bg-violet-600",
          sortOrder: 0,
        },
  });

  const onSubmit = (data: ProductFormData) => {
    onSave(formToInput(data));
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-lg bg-card/95 backdrop-blur-xl border-l border-white/10 flex flex-col h-full overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            data-testid="button-close-drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" className="bg-background/50 border-white/10" data-testid="input-product-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10" data-testid="select-category">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10" data-testid="select-status">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="version" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0.0" className="bg-background/50 border-white/10" data-testid="input-version" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="accentColor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-white/10" data-testid="select-accent-color">
                          <SelectValue placeholder="Color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCENT_COLORS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${c.value}`} />
                              {c.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="tagline" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="Short one-liner" className="bg-background/50 border-white/10" data-testid="input-tagline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Full description" className="bg-background/50 border-white/10 resize-none" data-testid="input-description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="featuresRaw" render={({ field }) => (
                <FormItem>
                  <FormLabel>Features <span className="text-muted-foreground font-normal">(one per line)</span></FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder={"Feature one\nFeature two\nFeature three"} className="bg-background/50 border-white/10 resize-none font-mono text-xs" data-testid="input-features" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground/80">Links <span className="text-muted-foreground font-normal">(optional)</span></p>
                <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Website URL" className="pl-9 bg-background/50 border-white/10" data-testid="input-website-url" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="apkUrl" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Smartphone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="APK Download URL" className="pl-9 bg-background/50 border-white/10" data-testid="input-apk-url" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="githubUrl" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="GitHub URL" className="pl-9 bg-background/50 border-white/10" data-testid="input-github-url" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="sortOrder" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order <span className="text-muted-foreground font-normal">(lower = first)</span></FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-background/50 border-white/10" data-testid="input-sort-order" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </form>
          </Form>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/8 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-muted-foreground text-sm font-medium hover:text-foreground hover:border-white/20 transition-colors"
            data-testid="button-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            data-testid="button-save-product"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isPending ? "Saving…" : "Save Product"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirm({ product, onCancel, onConfirm, isPending }: {
  product: ApiProduct;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        className="relative z-10 w-full max-w-sm rounded-2xl bg-card/95 backdrop-blur-xl border border-white/10 p-6 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={18} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Delete Product</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Are you sure you want to delete <span className="text-foreground font-medium">{product.name}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
            data-testid="button-cancel-delete"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 active:scale-95 transition-all disabled:opacity-60"
            data-testid="button-confirm-delete"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const queryClient = useQueryClient();
  const [drawerProduct, setDrawerProduct] = useState<ApiProduct | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiProduct | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const { data: products = [], isLoading } = useListProducts();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });

  const createMutation = useCreateProduct({
    mutation: {
      onSuccess: () => { invalidate(); setDrawerProduct(null); showToast("Product created"); },
      onError: () => showToast("Failed to save product", "error"),
    },
  });

  const updateMutation = useUpdateProduct({
    mutation: {
      onSuccess: () => { invalidate(); setDrawerProduct(null); showToast("Product updated"); },
      onError: () => showToast("Failed to update product", "error"),
    },
  });

  const deleteMutation = useDeleteProduct({
    mutation: {
      onSuccess: () => { invalidate(); setDeleteTarget(null); showToast("Product deleted"); },
      onError: () => showToast("Failed to delete product", "error"),
    },
  });

  const handleSave = (data: ProductInput) => {
    if (drawerProduct === "new") {
      createMutation.mutate({ data });
    } else if (drawerProduct) {
      updateMutation.mutate({ id: drawerProduct.id, data });
    }
  };

  const isSavePending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-xl ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-black text-xs">S_A</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground text-sm">Manage your product ecosystem</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-muted-foreground text-sm hover:text-foreground hover:border-white/20 transition-colors"
          data-testid="button-admin-logout"
        >
          <Lock size={14} />
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-card/60 border border-white/8 p-4 text-center">
          <div className="text-3xl font-black text-primary mb-1">{products.length}</div>
          <div className="text-xs text-muted-foreground">Total Products</div>
        </div>
        <div className="rounded-2xl bg-card/60 border border-white/8 p-4 text-center">
          <div className="text-3xl font-black text-emerald-400 mb-1">
            {products.filter((p) => p.status === "Active").length}
          </div>
          <div className="text-xs text-muted-foreground">Active</div>
        </div>
        <div className="rounded-2xl bg-card/60 border border-white/8 p-4 text-center">
          <div className="text-3xl font-black text-amber-400 mb-1">
            {products.filter((p) => p.status === "Beta").length}
          </div>
          <div className="text-xs text-muted-foreground">Beta</div>
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-2xl bg-card/50 backdrop-blur-sm border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-foreground">Products</h2>
          <button
            onClick={() => setDrawerProduct("new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all"
            data-testid="button-add-product"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading products…</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm mb-4">No products yet.</p>
            <button
              onClick={() => setDrawerProduct("new")}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors group"
                data-testid={`admin-row-${product.id}`}
              >
                <div className={`w-10 h-10 rounded-xl ${product.accentColor} flex items-center justify-center text-white font-black text-base flex-shrink-0`}>
                  {product.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-foreground font-semibold text-sm truncate">{product.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${statusColor[product.status] || statusColor["Active"]}`}>
                      {product.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs truncate">{product.category} &bull; {product.version}</p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => setDrawerProduct(product)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
                    data-testid={`button-edit-${product.id}`}
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(product)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    data-testid={`button-delete-${product.id}`}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex flex-col">
                    <button
                      onClick={() => updateMutation.mutate({ id: product.id, data: { sortOrder: product.sortOrder - 1 } })}
                      className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Move up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => updateMutation.mutate({ id: product.id, data: { sortOrder: product.sortOrder + 1 } })}
                      className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Move down"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerProduct !== null && (
          <ProductFormDrawer
            product={drawerProduct === "new" ? null : drawerProduct}
            onClose={() => setDrawerProduct(null)}
            onSave={handleSave}
            isPending={isSavePending}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirm
            product={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={() => deleteMutation.mutate({ id: deleteTarget.id })}
            isPending={deleteMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (authed === null) return null;

  return authed ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <LoginScreen onSuccess={() => setAuthed(true)} />
  );
}
