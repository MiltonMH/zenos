import { useState, useEffect } from "react";
import bgColorful from "@/assets/bg-colorful.png";
import bgLumen from "@/assets/bg-lumen.svg";
import bgNoir from "@/assets/bg-noir.svg";
import { useLanguage } from "@/lib/i18n";
import { getProfileTexts } from "@/lib/profile-i18n";

// Exactly 4 themes — this IS the app's theme system, not just a backdrop:
// picking one changes the background everywhere (here and in Profil →
// Bakgrund, same underlying choice) and, for "Mörk", the accent/text tokens
// too (see .bg-nocturne in index.css).
export type BackgroundOption = "default" | "colorful" | "white" | "black";

export interface BackgroundConfig {
  id: BackgroundOption;
  label: string;
  style: string;
  preview: string;
  image?: string;
}

const backgroundDefs: Omit<BackgroundConfig, "label">[] = [
  {
    id: "default",
    style: "bg-gradient-mesh",
    preview: "bg-gradient-to-br from-teal-200 to-emerald-100",
  },
  {
    id: "colorful",
    style: "",
    preview: "",
    image: bgColorful,
  },
  {
    id: "white",
    style: "bg-lumen",
    preview: "bg-white",
    image: bgLumen,
  },
  {
    id: "black",
    style: "bg-nocturne",
    preview: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950",
    image: bgNoir,
  },
];

/** Static list with Swedish fallback labels (for non-hook consumers). Prefer useBackground().backgrounds. */
export const backgrounds: BackgroundConfig[] = backgroundDefs.map((bg) => ({
  ...bg,
  label: getProfileTexts("sv").background[bg.id],
}));

const STORAGE_KEY = "zenio-background";

export function useBackground() {
  const { language } = useLanguage();
  const profile = getProfileTexts(language);

  const [selected, setSelected] = useState<BackgroundOption>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && backgroundDefs.some((b) => b.id === stored)) {
        return stored as BackgroundOption;
      }
    } catch {}
    return "default";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, selected);
    } catch {}
  }, [selected]);

  const localizedBackgrounds: BackgroundConfig[] = backgroundDefs.map((bg) => ({
    ...bg,
    label: profile.background[bg.id],
  }));

  const current = localizedBackgrounds.find((b) => b.id === selected)!;

  return { selected, setSelected, current, backgrounds: localizedBackgrounds };
}
