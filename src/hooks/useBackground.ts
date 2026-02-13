import { useState, useEffect } from "react";

export type BackgroundOption = "default" | "black" | "white";

export interface BackgroundConfig {
  id: BackgroundOption;
  label: string;
  style: string; // CSS class or inline style identifier
  preview: string; // Preview color/gradient for the selector
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
    style: "bg-black",
    preview: "bg-black",
  },
  {
    id: "white",
    label: "Ljus",
    style: "bg-white",
    preview: "bg-white",
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
