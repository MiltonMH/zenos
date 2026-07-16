import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { getPremiumTexts } from "@/lib/premium-i18n";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  variant?: "primary" | "secondary" | "premium";
  isActive?: boolean;
  isPremium?: boolean;
  onClick?: () => void;
}

export function QuickActionButton({
  icon: Icon,
  label,
  sublabel,
  variant = "secondary",
  isActive = false,
  isPremium = false,
  onClick,
}: QuickActionButtonProps) {
  const { language } = useLanguage();
  const premium = getPremiumTexts(language);

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all",
        "glass hover:bg-glass-highlight/50",
        isActive && variant === "primary" && "ring-2 ring-primary glow-primary",
        isActive && variant === "secondary" && "ring-2 ring-accent",
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isPremium && (
        <span className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full">
          {premium.badge}
        </span>
      )}
      
      <div className={cn(
        "p-3 rounded-xl",
        variant === "primary" && "bg-primary/20",
        variant === "secondary" && "bg-muted",
        variant === "premium" && "bg-gradient-to-br from-primary/20 to-accent/20",
        isActive && "bg-primary text-primary-foreground"
      )}>
        <Icon className={cn(
          "w-6 h-6",
          variant === "primary" && !isActive && "text-primary",
          variant === "secondary" && "text-foreground",
          variant === "premium" && "text-primary",
          isActive && "text-primary-foreground"
        )} />
      </div>
      
      <div className="text-center">
        <span className="text-sm font-medium block">{label}</span>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </motion.button>
  );
}
