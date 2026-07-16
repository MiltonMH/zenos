import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SsoButton } from "@/components/auth/SsoButton";
import { useAuth } from "@/hooks/useAuth";
import type { SsoProvider } from "@/lib/auth-config";
import { useLanguage } from "@/lib/i18n";
import { getLoginTexts } from "@/lib/login-i18n";
import { fetchAuthProviders } from "@/lib/numiz-api";
import { cn } from "@/lib/utils";

interface LoginScreenProps {
  onBack: () => void;
  onLoggedIn: () => void;
  onCreateAccount: () => void;
}

// Fixed slate text, not text-foreground: this field's fill is always light
// regardless of theme, but "Mörk" flips --foreground to a light color for
// the rest of the page — which would inherit in here too and produce
// light-on-light text. A light chip needs its own fixed dark text.
const fieldClass =
  "h-12 rounded-2xl bg-white/75 text-center text-base font-medium text-slate-800 placeholder:text-slate-400";
const DEFAULT_SSO_PROVIDERS = { google: false, apple: false };

export function LoginScreen({ onBack, onLoggedIn, onCreateAccount }: LoginScreenProps) {
  const { login, startSsoLogin } = useAuth();
  const { language } = useLanguage();
  const i18n = getLoginTexts(language);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [enabledProviders, setEnabledProviders] = useState(DEFAULT_SSO_PROVIDERS);
  const [ssoLoading, setSsoLoading] = useState<SsoProvider | null>(null);

  const canSubmit = email.trim() !== "" && password.trim() !== "";
  const showSso = enabledProviders.google || enabledProviders.apple;

  useEffect(() => {
    fetchAuthProviders()
      .then((providers) => {
        setEnabledProviders({
          google: Boolean(providers.google?.client_id),
          apple: Boolean(providers.apple?.client_id),
        });
      })
      .catch(() => {
        setEnabledProviders(DEFAULT_SSO_PROVIDERS);
      });
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      onLoggedIn();
    } catch {
      setError(i18n.invalidCredentials);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSsoLogin = async (provider: SsoProvider) => {
    setError("");
    setSsoLoading(provider);

    try {
      await startSsoLogin(provider);
    } catch (err) {
      const message = err instanceof Error ? err.message : i18n.ssoStartFailed;
      setError(message);
      setSsoLoading(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pt-2 pb-6">
      {/* glass-subtle: floats directly on whichever background is active
          (incl. the busy "Färgrik" photo), so it needs its own backdrop
          to stay visible instead of relying on the page behind it. */}
      <button
        onClick={onBack}
        className="glass-subtle self-start p-2 -ml-1 rounded-full text-slate-700 hover:text-slate-900 transition-colors"
        aria-label={i18n.back}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* The mascot floats above this (rendered by AuthFlow, see ghostJourney's
          "login" spot) — this block just needs to sit clear of it. */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-10">
        <h1 className="text-xl font-semibold text-foreground [text-shadow:0_1px_16px_rgba(255,255,255,0.9)]">
          {i18n.welcomeBack}
        </h1>

        <div className="w-full max-w-xs space-y-3">
          <Input
            type="email"
            inputMode="email"
            autoFocus
            autoComplete="username"
            placeholder={i18n.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={i18n.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSubmit();
              }}
              className={cn(fieldClass, "pr-11")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label={showPassword ? i18n.hidePassword : i18n.showPassword}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-xl text-center">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || isSubmitting}
          className="w-full h-12 text-base font-medium rounded-2xl"
        >
          {isSubmitting ? i18n.signingIn : i18n.signIn}
        </Button>

        {showSso && (
          <div className="space-y-2">
            <p className="text-center text-xs text-muted-foreground">{i18n.or}</p>
            {enabledProviders.google && (
              <SsoButton
                provider="google"
                label={i18n.continueWithGoogle}
                onClick={() => void handleSsoLogin("google")}
                disabled={isSubmitting}
                loading={ssoLoading === "google"}
              />
            )}
            {enabledProviders.apple && (
              <SsoButton
                provider="apple"
                label={i18n.continueWithApple}
                onClick={() => void handleSsoLogin("apple")}
                disabled={isSubmitting}
                loading={ssoLoading === "apple"}
              />
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onCreateAccount}
          className="inline-block w-full text-center text-sm text-foreground/90 hover:text-foreground underline underline-offset-2 [text-shadow:0_1px_10px_rgba(255,255,255,0.9)]"
        >
          {i18n.createAccountLink}
        </button>
      </div>
    </div>
  );
}
