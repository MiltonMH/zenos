import { Settings, Wifi } from "lucide-react";

interface HomeHeaderProps {
  userName: string;
  isOnline: boolean;
  onSettingsClick?: () => void;
}

export function HomeHeader({ userName, isOnline, onSettingsClick }: HomeHeaderProps) {
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

      <h1 className="text-lg font-semibold text-foreground">
        Hej, {userName}
      </h1>

      <div className={`p-2.5 glass-subtle rounded-2xl ${isOnline ? "text-primary" : "text-foreground/80"}`}>
        <Wifi className="w-6 h-6" />
      </div>
    </div>
  );
}
