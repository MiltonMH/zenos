import { useState, useEffect } from "react";
import bgColorful from "@/assets/bg-colorful.png";
import bgAurora from "@/assets/bg-aurora.png";
import bgMint from "@/assets/bg-mint.png";

export type BackgroundOption = "default" | "black" | "white" | "colorful" | "aurora" | "mint";

export interface BackgroundConfig {
  id: BackgroundOption;
  label: string;
  style: string;
  preview: string;
  image?: string;
}

export const backgrounds: BackgroundConfig[] = [
  {
    id: "default",
    label: "Standard",
    style: "bg-gradient-mesh",
    preview: "bg-gradient-to-br from-teal-200 to-emerald-100",
  },
  {
    id: "black",
    label: "Mörk",
    style: "bg-nocturne",
    preview: "bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950",
  },
  {
    id: "white",
    label: "Ljus",
    style: "bg-white",
    preview: "bg-white",
  },
  {
    id: "colorful",
    label: "Färgrik",
    style: "",
    preview: "",
    image: bgColorful,
  },
  {
    id: "aurora",
    label: "Aurora",
    style: "",
    preview: "",
    image: bgAurora,
  },
  {
    id: "mint",
    label: "Mint",
    style: "",
    preview: "",
    image: bgMint,
  },
];

const STORAGE_KEY = "zenio-background";

export function useBackground() {
  const [selected, setSelected] = useState<BackgroundOption>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && backgrounds.some((b) => b.id === stored)) {
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

  const current = backgrounds.find((b) => b.id === selected)!;

  return { selected, setSelected, current, backgrounds };
}
