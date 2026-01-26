import { motion } from "framer-motion";
import { Bell, User, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userName: string;
  chargerName: string;
  isOnline: boolean;
  hasNotifications?: boolean;
}

export function Header({ userName, chargerName, isOnline, hasNotifications = false }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong sticky top-0 z-40 px-6 py-4 safe-top"
    >
      <div className="flex items-center justify-between">
        {/* User greeting */}
        <div>
          <p className="text-sm text-muted-foreground">Välkommen tillbaka,</p>
          <h1 className="text-xl font-semibold">{userName}</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
            isOnline 
              ? "bg-success/20 text-success" 
              : "bg-destructive/20 text-destructive"
          )}>
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}
            <span>{isOnline ? "Online" : "Offline"}</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl glass hover:bg-glass-highlight transition-colors">
            <Bell className="w-5 h-5" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>

          {/* Profile */}
          <button className="p-2 rounded-xl glass hover:bg-glass-highlight transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active charger indicator */}
      <div className="flex items-center gap-2 mt-3 text-sm">
        <div className="w-2 h-2 rounded-full bg-success status-pulse" />
        <span className="text-muted-foreground">Aktiv laddare:</span>
        <span className="font-medium">{chargerName}</span>
      </div>
    </motion.header>
  );
}
