import { ReactNode } from "react";
import { Settings, Wifi } from "lucide-react";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getHomeTexts } from "@/lib/home-i18n";

interface HomeHeaderProps {
  userName: string;
  isOnline: boolean;
  onSettingsClick?: () => void;
  centerContent?: ReactNode;
}

export function HomeHeader({ userName, isOnline, onSettingsClick, centerContent }: HomeHeaderProps) {
  const { language } = useLanguage();
  const home = getHomeTexts(language);
  const greeting = formatMessage(home.greeting, { name: userName });

  return (
    <div className="relative flex items-center justify-between px-6 py-4">
      <button
        type="button"
        onClick={onSettingsClick}
        aria-label={home.ariaOpenSettings}
        className="p-2.5 glass-subtle gradient-stroke-ring rounded-full shadow-sm text-foreground/80 hover:text-foreground transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>

      <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center px-20">
        <div className="pointer-events-auto">
          {centerContent ?? (
            <h1 className="text-lg font-semibold text-foreground">
              {greeting}
            </h1>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center px-4 opacity-0 pointer-events-none" aria-hidden="true">
        {centerContent ?? (
          <h1 className="text-lg font-semibold text-foreground">
            {greeting}
          </h1>
        )}
      </div>

      <div className={isOnline ? "text-primary" : "text-foreground/70"}>
        <Wifi className="w-7 h-7" />
      </div>
    </div>
  );
}
