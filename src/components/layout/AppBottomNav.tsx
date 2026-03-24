import { motion } from "framer-motion";
import { Home, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Hem" },
  { id: "statistics", icon: BarChart2, label: "Statistik" },
  { id: "profile", icon: User, label: "Profil" },
];

interface AppBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppBottomNav({ activeTab, onTabChange }: AppBottomNavProps) {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-0 right-0 z-50 px-6 pb-12 safe-bottom"
    >
      <div className="glass-strong rounded-[2.5rem] px-4 py-4 border-2 border-white/60 shadow-xl shadow-black/5">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative flex flex-col items-center gap-1 px-6 py-2 transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white/80 rounded-2xl shadow-sm"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-6 h-6 relative z-10 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs relative z-10 transition-colors",
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
