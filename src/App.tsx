import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNativeApp } from "@/hooks/useNativeApp";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AuthFlow } from "@/components/auth/AuthFlow";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize native app features (status bar, splash screen)
  useNativeApp();
  const { isAuthenticated, completeAuth } = useAuthFlow();
  // Owned once at the root: applies the chosen brand theme (accent + tokens)
  // to <html> so it stays in effect across the auth flow and the real app.
  const appTheme = useAppTheme();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {isAuthenticated ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <AuthFlow onComplete={completeAuth} appTheme={appTheme} />
      )}
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
