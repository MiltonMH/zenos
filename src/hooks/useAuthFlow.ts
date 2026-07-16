import { useState, useEffect } from "react";

const STORAGE_KEY = "numiz-auth-onboarded";

/** Local onboarding completion (create-account path without backend register). */
export function useAuthFlow() {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isOnboarded) localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors.
    }
  }, [isOnboarded]);

  const clearOnboarded = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
    setIsOnboarded(false);
  };

  return {
    isOnboarded,
    completeAuth: () => setIsOnboarded(true),
    clearOnboarded,
  };
}
