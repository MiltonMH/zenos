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
      className="fixed bottom-3 left-0 right-0 z-50 px-6 pb-12 safe-bottom"
    >
      <div
        className="relative glass-main"
      >
        {/* Animated gradient blob background */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(168, 212, 207, 0.3), transparent)",
          }}
          animate={{
            background: [
              "radial-gradient(ellipse 80% 60% at 30% 120%, rgba(168, 212, 207, 0.3), transparent)",
              "radial-gradient(ellipse 80% 60% at 70% 120%, rgba(168, 212, 207, 0.3), transparent)",
              "radial-gradient(ellipse 80% 60% at 30% 120%, rgba(168, 212, 207, 0.3), transparent)",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 3,
          }}
        />

        <div className="flex items-center justify-around relative z-10">
          {navItems.map((item) => {
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
                    className="absolute inset-0 rounded-full overflow-hidden backdrop-blur-md"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 100%)",
                      boxShadow: "0 4px 15px -3px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.5)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      mass: 0.8,
                    }}
                  >
                    {/* Liquid inner glow */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "radial-gradient(circle at 50% 0%, rgba(168, 212, 207, 0.4), transparent 70%)",
                      }}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
                <Icon
                  className={cn(
                    "w-6 h-6 relative z-10 transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs relative z-10 transition-colors duration-300",
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
