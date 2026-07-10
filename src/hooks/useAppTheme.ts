import { useState, useEffect } from "react";

export type ThemeId = "mint" | "lavendel" | "persika" | "ocean";

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  accent: string;
  glow: string;
}

// Accent/glow hex values come straight from the Numiz brand book (see the
// onboarding handoff doc). Mint mirrors the app's existing default tokens,
// so it has no .theme-mint CSS class — removing all theme-* classes IS mint.
export const themes: ThemeConfig[] = [
  { id: "mint", label: "Mint", accent: "#1D8F82", glow: "#6fdccb" },
  { id: "lavendel", label: "Lavendel", accent: "#6366F1", glow: "#a5a7ff" },
  { id: "persika", label: "Persika", accent: "#BD694E", glow: "#ffb99e" },
  { id: "ocean", label: "Ocean", accent: "#2C7EA6", glow: "#8fd4f0" },
];

const STORAGE_KEY = "numiz-theme";
const THEME_CLASSES = themes.filter((t) => t.id !== "mint").map((t) => `theme-${t.id}`);

export function useAppTheme() {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (themes.some((t) => t.id === stored)) return stored as ThemeId;
    } catch {}
    return "mint";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...THEME_CLASSES);
    if (themeId !== "mint") root.classList.add(`theme-${themeId}`);
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {}
  }, [themeId]);

  return { themeId, setThemeId, themes };
}
