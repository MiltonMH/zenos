import { Settings, Wifi } from "lucide-react";

interface HomeHeaderProps {
  userName: string;
  isOnline: boolean;
  onSettingsClick?: () => void;
}

export function HomeHeader({ userName, isOnline, onSettingsClick }: HomeHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-8 pb-4">
      <button 
        onClick={onSettingsClick}
        className="text-foreground/70 hover:text-foreground transition-colors"
      >
        <Settings className="w-7 h-7" />
      </button>

      <h1 className="text-lg font-semibold text-foreground">
        Hej, {userName}
      </h1>

      <div className={isOnline ? "text-primary" : "text-foreground/70"}>
        <Wifi className="w-7 h-7" />
      </div>
    </div>
  );
}
