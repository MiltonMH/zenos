import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "success" | "warning" | "accent";
}

export function StatsCard({ icon: Icon, label, value, unit, trend, color = "primary" }: StatsCardProps) {
  const colorClasses = {
    primary: "text-primary bg-primary/20",
    success: "text-success bg-success/20",
    warning: "text-warning bg-warning/20",
    accent: "text-accent bg-accent/20",
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      
      <div>
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-2xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {value}
          </motion.span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </GlassCard>
  );
}
