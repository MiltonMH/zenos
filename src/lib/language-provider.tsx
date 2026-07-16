import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getStoredLanguage, ZENOS_LANG_KEY, type AppLanguage } from "@/lib/i18n-core";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => getStoredLanguage());

  const setLanguage = useCallback((next: AppLanguage) => {
    try {
      localStorage.setItem(ZENOS_LANG_KEY, next);
    } catch {
      // Ignore storage errors.
    }
    setLanguageState(next);
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: getStoredLanguage(),
      setLanguage: (next) => {
        try {
          localStorage.setItem(ZENOS_LANG_KEY, next);
        } catch {
          // Ignore.
        }
      },
    };
  }
  return context;
}
