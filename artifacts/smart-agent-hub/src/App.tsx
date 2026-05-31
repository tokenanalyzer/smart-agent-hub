import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";

const HomePage = lazy(() => import("@/pages/home"));
const ProductsPage = lazy(() => import("@/pages/products"));
const ProductDetailPage = lazy(() => import("@/pages/product-detail"));
const AboutPage = lazy(() => import("@/pages/about"));
const HelpPage = lazy(() => import("@/pages/help"));
const UpdatesPage = lazy(() => import("@/pages/updates"));
const AdminPage = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={20} className="animate-spin text-primary/50" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function AdminLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminPage />
    </Suspense>
  );
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/products/:id" component={ProductDetailPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/help" component={HelpPage} />
            <Route path="/updates" component={UpdatesPage} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminLayout} />
      <Route component={PublicLayout} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
