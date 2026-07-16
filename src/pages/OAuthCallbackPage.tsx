import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import type { SsoProvider } from "@/lib/auth-config";
import { useLanguage } from "@/lib/i18n";
import {
  exchangeAppleToken,
  exchangeGoogleToken,
  tokenResponseToSsoSession,
} from "@/lib/numiz-api";
import { getOnboardingTexts } from "@/lib/onboarding-i18n";
import { getRedirectUri, verifyOAuthState } from "@/lib/oauth";

function isSsoProvider(value: string | undefined): value is SsoProvider {
  return value === "google" || value === "apple";
}

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { provider: providerParam } = useParams();
  const [searchParams] = useSearchParams();
  const { loginWithSso } = useAuth();
  const { language } = useLanguage();
  const i18n = getOnboardingTexts(language);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSsoProvider(providerParam)) {
      setError(i18n.oauthInvalidProvider);
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const providerError = searchParams.get("error");

    if (providerError) {
      setError(i18n.oauthCancelled);
      return;
    }

    if (!code) {
      setError(i18n.oauthMissingCode);
      return;
    }

    if (!verifyOAuthState(state)) {
      setError(i18n.oauthInvalidState);
      return;
    }

    const redirectUri = getRedirectUri(providerParam);
    const exchange = providerParam === "google" ? exchangeGoogleToken : exchangeAppleToken;

    exchange(code, redirectUri)
      .then((tokens) => {
        const session = tokenResponseToSsoSession(providerParam, tokens);
        try {
          sessionStorage.setItem("zenos-sso-enter-app", "1");
        } catch {
          // Ignore storage errors.
        }
        loginWithSso(session);
        navigate("/", { replace: true });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : i18n.oauthGenericError;
        setError(message);
      });
  }, [providerParam, searchParams, loginWithSso, navigate, i18n.oauthInvalidProvider, i18n.oauthCancelled, i18n.oauthMissingCode, i18n.oauthInvalidState, i18n.oauthGenericError]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 text-center space-y-4 shadow-sm"
      >
        {error ? (
          <>
            <p className="text-sm text-destructive bg-destructive/8 px-3 py-2.5 rounded-xl">{error}</p>
            <Link to="/" className="text-sm text-foreground underline underline-offset-2">
              {i18n.oauthBackToLogin}
            </Link>
          </>
        ) : (
          <>
            <span className="mx-auto h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin block" />
            <p className="text-sm text-muted-foreground">{i18n.oauthCompleting}</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
