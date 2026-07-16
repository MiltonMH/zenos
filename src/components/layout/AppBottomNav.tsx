import { motion } from "framer-motion";
import { Home, BarChart2, User, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { getNavTexts } from "@/lib/nav-i18n";

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface AppBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  items?: NavItem[];
}

export function AppBottomNav({ activeTab, onTabChange, items }: AppBottomNavProps) {
  const { language } = useLanguage();
  const nav = getNavTexts(language);

  const defaultNavItems: NavItem[] = [
    { id: "home", icon: Home, label: nav.home },
    { id: "statistics", icon: BarChart2, label: nav.statistics },
    { id: "profile", icon: User, label: nav.profile },
  ];

  const resolvedItems = items ?? defaultNavItems;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-3 left-0 right-0 z-50 px-6 pb-12 safe-bottom"
    >
      <div
        className="relative glass-main !py-2"
      >
        <div className="flex items-center justify-around relative z-10">
          {resolvedItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="relative flex w-24 flex-col items-center gap-1 py-2 transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="active-nav-pill absolute inset-0 rounded-full backdrop-blur-md"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8,
                    }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-6 h-6 relative z-10 transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[14px] relative z-10 transition-colors duration-300",
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
