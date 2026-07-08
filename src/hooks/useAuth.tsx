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
  AUTH_STORAGE_KEY,
  clearSsoSession,
  hasHardcodedAuth,
  readSsoSession,
  type SsoProvider,
  type SsoSession,
  validateCredentials,
  writeSsoSession,
} from "@/lib/auth-config";
import { getLoginLanguage, getLoginTexts } from "@/lib/login-i18n";
import { fetchAuthProviders } from "@/lib/numiz-api";
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
  login: (email: string, password: string) => boolean;
  loginWithSso: (session: SsoSession) => void;
  startSsoLogin: (provider: SsoProvider) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isSessionAuthenticated(): boolean {
  return hasHardcodedAuth() || readSsoSession() !== null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(isSessionAuthenticated());
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (!validateCredentials(email, password)) {
      return false;
    }

    try {
      clearSsoSession();
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
    } catch {
      // Continue even if storage fails in restricted environments.
    }

    setIsAuthenticated(true);
    return true;
  }, []);

  const loginWithSso = useCallback((session: SsoSession) => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
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
      localStorage.removeItem(AUTH_STORAGE_KEY);
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
