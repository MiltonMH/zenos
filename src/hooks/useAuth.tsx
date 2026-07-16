import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearBasicSession,
  clearSsoSession,
  isBasicSessionAccessValid,
  readBasicSession,
  readSsoSession,
  type SsoProvider,
  type SsoSession,
  writeBasicSession,
  writeSsoSession,
} from "@/lib/auth-config";
import { getLoginLanguage, getLoginTexts } from "@/lib/login-i18n";
import {
  fetchAuthProviders,
  loginResponseToBasicSession,
  loginWithBasicAuth,
  refreshBasicAuth,
} from "@/lib/numiz-api";
import {
  buildAppleAuthUrl,
  buildGoogleAuthUrl,
  generateOAuthState,
  getRedirectUri,
  storeOAuthState,
} from "@/lib/oauth";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSso: (session: SsoSession) => void;
  startSsoLogin: (provider: SsoProvider) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function restoreBasicSession(): Promise<boolean> {
  const session = readBasicSession();
  if (!session) return false;

  if (isBasicSessionAccessValid(session)) {
    return true;
  }

  try {
    const response = await refreshBasicAuth(session.refreshToken);
    writeBasicSession(loginResponseToBasicSession(response));
    return true;
  } catch {
    clearBasicSession();
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const basicAuthenticated = await restoreBasicSession();
      if (cancelled) return;

      if (basicAuthenticated || readSsoSession() !== null) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginWithBasicAuth(email, password);

    try {
      clearSsoSession();
      writeBasicSession(loginResponseToBasicSession(response));
    } catch {
      // Continue even if storage fails in restricted environments.
    }

    setIsAuthenticated(true);
  }, []);

  const loginWithSso = useCallback((session: SsoSession) => {
    try {
      clearBasicSession();
      writeSsoSession(session);
    } catch {
      // Continue even if storage fails in restricted environments.
    }

    setIsAuthenticated(true);
  }, []);

  const startSsoLogin = useCallback(async (provider: SsoProvider) => {
    const providers = await fetchAuthProviders();
    const clientId = providers[provider]?.client_id;
    const i18n = getLoginTexts(getLoginLanguage());

    if (!clientId) {
      throw new Error(i18n.providerNotAvailable);
    }

    const state = generateOAuthState();
    storeOAuthState(state);

    const redirectUri = getRedirectUri(provider);
    const authUrl =
      provider === "google"
        ? buildGoogleAuthUrl(clientId, state, redirectUri)
        : buildAppleAuthUrl(clientId, state, redirectUri);

    window.location.assign(authUrl);
  }, []);

  const signOut = useCallback(() => {
    try {
      clearBasicSession();
      clearSsoSession();
    } catch {
      // Ignore storage errors on sign out.
    }

    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, loading, login, loginWithSso, startSsoLogin, signOut }),
    [isAuthenticated, loading, login, loginWithSso, startSsoLogin, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
