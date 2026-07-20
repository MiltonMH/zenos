import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNativeApp } from "@/hooks/useNativeApp";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { SiteDataProvider } from "@/hooks/useSiteData";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { LanguageProvider } from "@/lib/i18n";
import { AuthFlow } from "@/components/auth/AuthFlow";
import Index from "./pages/Index";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, loading, signOut } = useAuth();
  const { isOnboarded, completeAuth, clearOnboarded } = useAuthFlow();
  const [showApp, setShowApp] = useState(false);
  const bootstrapped = useRef(false);

  // Restore existing session on first load — skip welcome/login celebration.
  useEffect(() => {
    if (loading || bootstrapped.current) return;
    bootstrapped.current = true;
    if (isAuthenticated || isOnboarded) {
      setShowApp(true);
    }
  }, [loading, isAuthenticated, isOnboarded]);

  // SSO callback stores tokens then navigates home — open the app without AuthFlow Done.
  useEffect(() => {
    if (loading || !isAuthenticated || showApp) return;
    try {
      if (sessionStorage.getItem("zenos-sso-enter-app") === "1") {
        sessionStorage.removeItem("zenos-sso-enter-app");
        setShowApp(true);
      }
    } catch {
      // Ignore storage errors.
    }
  }, [loading, isAuthenticated, showApp]);

  const handleLogout = () => {
    signOut();
    clearOnboarded();
    setShowApp(false);
  };

  const handleAuthFlowComplete = (variant: "created" | "login") => {
    // Create-account has no backend register yet — mark local onboarding only.
    // Login already persisted JWT via useAuth.login.
    if (variant === "created") completeAuth();
    setShowApp(true);
  };

  if (loading) {
    return <div className="min-h-dvh bg-background" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback/:provider" element={<OAuthCallbackPage />} />
        {showApp ? (
          <>
            <Route
              path="/"
              element={
                <SiteDataProvider>
                  <Index onLogout={handleLogout} />
                </SiteDataProvider>
              }
            />
            <Route path="*" element={<NotFound />} />
          </>
        ) : (
          <Route path="*" element={<AuthFlow onComplete={handleAuthFlowComplete} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

const App = () => {
  useNativeApp();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
