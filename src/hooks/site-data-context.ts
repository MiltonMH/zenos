import { createContext } from "react";
import type { SiteDataContextValue } from "./useSiteData";

/** Stable module so Vite HMR does not recreate the context identity on hot reload. */
export const SiteDataContext = createContext<SiteDataContextValue | null>(null);
