import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileInfoCardProps {
  icon: LucideIcon | string;
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
    <div className="glass p-3.5 rounded-2xl flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 shrink-0">
        {typeof Icon === "string" ? (
          <img src={Icon} alt="" className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5 text-primary" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground/80 mb-0.5 font-medium">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">{value}</p>
          {badge && (
            <Badge
              className={cn(
                "text-[10px] px-2 py-0.5 font-medium",
                badge.variant === "premium"
                  ? "bg-success/15 text-success border-success/25"
                  : "bg-muted/80 text-muted-foreground border-muted"
              )}
              variant="outline"
            >
              {badge.text}
            </Badge>
          )}
        </div>
        {secondaryValue && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">{secondaryValue}</p>
        )}
      </div>

      {action && (
        <Button
          size="sm"
          variant={action.variant === "secondary" ? "ghost" : "default"}
          onClick={action.onClick}
          className={action.variant === "secondary"
            ? "shrink-0 text-xs h-8 px-3.5 rounded-xl font-medium bg-white/40 backdrop-blur-lg border border-transparent shadow-sm hover:bg-white/60"
            : "shrink-0 text-xs h-8 px-3.5 rounded-xl font-medium"
          }
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
