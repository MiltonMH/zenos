import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AUTH_STORAGE_KEY, validateCredentials } from "@/lib/auth-config";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setIsAuthenticated(localStorage.getItem(AUTH_STORAGE_KEY) === "true");
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (!validateCredentials(email, password)) {
      return false;
    }

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
    } catch {
      // Continue even if storage fails in restricted environments.
    }

    setIsAuthenticated(true);
    return true;
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage errors on sign out.
    }

    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, loading, login, signOut }),
    [isAuthenticated, loading, login, signOut],
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
