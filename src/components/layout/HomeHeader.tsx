import { Settings, Wifi } from "lucide-react";

interface HomeHeaderProps {
  userName: string;
  isOnline: boolean;
}

export function HomeHeader({ userName, isOnline }: HomeHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <button className="p-2.5 glass rounded-xl text-foreground/70 hover:text-foreground transition-colors">
        <Settings className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-foreground">
        Hello, {userName}
      </h1>

      <div className={`p-2.5 glass rounded-xl ${isOnline ? "text-primary" : "text-foreground/70"}`}>
        <Wifi className="w-5 h-5" />
      </div>
    </div>
  );
}
