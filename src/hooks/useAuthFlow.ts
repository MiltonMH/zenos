import { useState, useEffect } from "react";

const STORAGE_KEY = "numiz-auth-onboarded";

export function useAuthFlow() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isAuthenticated) localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  }, [isAuthenticated]);

  return { isAuthenticated, completeAuth: () => setIsAuthenticated(true) };
}
