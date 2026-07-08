import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginBoltHero } from "@/components/auth/LoginBoltHero";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (authLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = login(email, password);
    if (success) {
      navigate("/", { replace: true });
    } else {
      setError("Felaktigt e-post eller lösenord");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[38%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[96px]"
          style={{ animation: "pulse 4s ease-in-out infinite" }}
        />
        <div
          className="absolute left-1/2 top-[38%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[64px]"
          style={{ animation: "pulse 3s ease-in-out infinite 0.5s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        <LoginBoltHero />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="surface-card p-7 shadow-[0_8px_40px_hsl(var(--primary)/0.08)]"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium text-center mb-5">
            ZenOS
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-post
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@foretag.se"
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Lösenord
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive bg-destructive/8 px-3 py-2.5 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="action-glass-button w-full h-11 text-sm font-semibold tracking-wide mt-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2.5">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Loggar in…
                </span>
              ) : (
                "Logga in"
              )}
            </Button>
          </form>
        </motion.div>

        <p className="text-[11px] text-muted-foreground text-center mt-6 tracking-wide">
          Kontakta Zenion för att få ett konto
        </p>
      </motion.div>
    </div>
  );
}
