import { ReactNode } from "react";
import { Settings, Wifi } from "lucide-react";

interface HomeHeaderProps {
  userName: string;
  isOnline: boolean;
  onSettingsClick?: () => void;
  centerContent?: ReactNode;
}

export function HomeHeader({ userName, isOnline, onSettingsClick, centerContent }: HomeHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <button
        type="button"
        onClick={onSettingsClick}
        aria-label="Öppna inställningar"
        className="p-2.5 glass-subtle rounded-2xl text-foreground/80 hover:text-foreground transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center px-4">
        {centerContent ?? (
          <h1 className="text-lg font-semibold text-foreground">
            Hej, {userName}
          </h1>
        )}
      </div>

      <div className={isOnline ? "text-primary" : "text-foreground/70"}>
        <Wifi className="w-7 h-7" />
      </div>
    </div>
  );
}
