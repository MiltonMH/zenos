import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import type { SsoProvider } from "@/lib/auth-config";
import {
  exchangeAppleToken,
  exchangeGoogleToken,
  tokenResponseToSsoSession,
} from "@/lib/numiz-api";
import { getRedirectUri, verifyOAuthState } from "@/lib/oauth";

function isSsoProvider(value: string | undefined): value is SsoProvider {
  return value === "google" || value === "apple";
}

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { provider: providerParam } = useParams();
  const [searchParams] = useSearchParams();
  const { loginWithSso } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSsoProvider(providerParam)) {
      setError("Ogiltig inloggningsleverantör");
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const providerError = searchParams.get("error");

    if (providerError) {
      setError("Inloggningen avbröts eller nekades");
      return;
    }

    if (!code) {
      setError("Inloggningskod saknas");
      return;
    }

    if (!verifyOAuthState(state)) {
      setError("Ogiltig inloggningssession. Försök igen.");
      return;
    }

    const redirectUri = getRedirectUri(providerParam);

    const exchange = providerParam === "google" ? exchangeGoogleToken : exchangeAppleToken;

    exchange(code, redirectUri)
      .then((tokens) => {
        const session = tokenResponseToSsoSession(providerParam, tokens);
        loginWithSso(session);
        navigate("/", { replace: true });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Något gick fel vid inloggningen";
        setError(message);
      });
  }, [providerParam, searchParams, loginWithSso, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card w-full max-w-sm p-7 text-center space-y-4"
      >
        {error ? (
          <>
            <p className="text-sm text-destructive bg-destructive/8 px-3 py-2.5 rounded-xl">
              {error}
            </p>
            <Link to="/login" className="text-sm text-primary hover:underline">
              Tillbaka till inloggning
            </Link>
          </>
        ) : (
          <>
            <span className="mx-auto h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin block" />
            <p className="text-sm text-muted-foreground">Slutför inloggning…</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
