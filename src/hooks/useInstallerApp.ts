import { useState } from "react";
import type { InstalledUnit } from "@/lib/installer-mock-data";

export type InstallerTab = "hem" | "dash" | "profil";
export type InstallerOverlay = "settings" | "add" | null;

export function useInstallerApp(units: InstalledUnit[]) {
  const [tab, setTab] = useState<InstallerTab>("hem");
  const [overlay, setOverlay] = useState<InstallerOverlay>(null);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  const safeIndex = units.length === 0 ? 0 : Math.min(activeUnitIndex, units.length - 1);
  const currentUnit: InstalledUnit | undefined = units[safeIndex];

  const updateCurrentUnit = (_patch: Partial<InstalledUnit>) => {
    // Runtime fields are read-only when backed by the installer API.
  };

  const openUnit = (index: number) => {
    setActiveUnitIndex(index);
    setTab("hem");
  };

  return {
    tab,
    setTab,
    overlay,
    setOverlay,
    activeUnitIndex: safeIndex,
    setActiveUnitIndex,
    currentUnit,
    updateCurrentUnit,
    openUnit,
  };
}
