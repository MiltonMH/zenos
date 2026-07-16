import { motion } from "framer-motion";
import { Home, Zap, Calendar, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { getNavTexts } from "@/lib/nav-i18n";

interface NavItem {
  id: string;
  icon: typeof Home;
  label: string;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { language } = useLanguage();
  const nav = getNavTexts(language);

  const navItems: NavItem[] = [
    { id: "home", icon: Home, label: nav.home },
    { id: "charging", icon: Zap, label: nav.charging },
    { id: "schedule", icon: Calendar, label: nav.schedule },
    { id: "stats", icon: BarChart3, label: nav.statistics },
    { id: "settings", icon: Settings, label: nav.settings },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
    >
      <div className="mx-4 mb-4 glass-strong rounded-2xl">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative flex flex-col items-center gap-1 px-4 py-2 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/20 rounded-xl"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-5 h-5 relative z-10 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs relative z-10 transition-colors",
                    isActive ? "text-primary font-medium" : "text-muted-foreground"
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
