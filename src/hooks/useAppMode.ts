import { useState, useEffect } from "react";

export type AppMode = "customer" | "installer";

const STORAGE_KEY = "numiz-dev-app-mode";

export function useAppMode() {
  const [mode, setMode] = useState<AppMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "customer" || stored === "installer") return stored;
    } catch {}
    return "customer";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "customer" ? "installer" : "customer"));

  return { mode, setMode, toggleMode };
}
