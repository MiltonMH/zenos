import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  secondaryValue?: string;
  badge?: {
    text: string;
    variant: "premium" | "free";
  };
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary";
  };
}

export function ProfileInfoCard({
  icon: Icon,
  label,
  value,
  secondaryValue,
  badge,
  action,
}: ProfileInfoCardProps) {
  return (
    <GlassCard className="p-3 flex items-center gap-3">
      <div className="p-2 rounded-xl bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{value}</p>
          {badge && (
            <Badge
              className={cn(
                "text-[10px] px-2 py-0.5",
                badge.variant === "premium"
                  ? "bg-success/20 text-success border-success/30"
                  : "bg-muted text-muted-foreground border-muted"
              )}
              variant="outline"
            >
              {badge.text}
            </Badge>
          )}
        </div>
        {secondaryValue && (
          <p className="text-xs text-muted-foreground mt-0.5">{secondaryValue}</p>
        )}
      </div>

      {action && (
        <Button
          size="sm"
          variant={action.variant === "secondary" ? "outline" : "default"}
          onClick={action.onClick}
          className="shrink-0 text-xs h-8 px-3"
        >
          {action.label}
        </Button>
      )}
    </GlassCard>
  );
}
