import { Shield, Scale, Home, Coins } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { getSettingsTexts } from "@/lib/settings-i18n";

interface OptimizationSlideProps {
  v2hEnabled: boolean;
  v2gEnabled: boolean;
  dischargeLimit: number[];
  optimizationMode: string;
  onV2hChange: (enabled: boolean) => void;
  onV2gChange: (enabled: boolean) => void;
  onDischargeLimitChange: (value: number[]) => void;
  onOptimizationModeChange: (mode: string) => void;
}

export function OptimizationSlide({ 
  v2hEnabled,
  v2gEnabled,
  dischargeLimit, 
  optimizationMode, 
  onV2hChange,
  onV2gChange,
  onDischargeLimitChange, 
  onOptimizationModeChange 
}: OptimizationSlideProps) {
  const { language } = useLanguage();
  const settings = getSettingsTexts(language);
  const opt = settings.optimization;
  const showWarning = !v2hEnabled && !v2gEnabled;

  return (
    <div className="px-4 py-2 pb-8">
      <h2 className="text-base font-semibold text-foreground text-center mb-4">{opt.title}</h2>
      
      <div className="space-y-3">
        {/* Discharge Limit - TOP */}
        <div className="glass-subtle rounded-2xl p-3 space-y-2">
          <h3 className="font-medium text-foreground text-xs">{opt.maxDischarge}</h3>
          <Slider
            value={dischargeLimit}
            onValueChange={onDischargeLimitChange}
            min={20}
            max={80}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              {opt.neverDischargeBelow}
            </p>
            <span className="text-lg font-bold text-primary">{dischargeLimit[0]}%</span>
          </div>
        </div>

        {/* Optimization Mode */}
        <RadioGroup value={optimizationMode} onValueChange={onOptimizationModeChange} className="space-y-2">
          <Label
            htmlFor="savings"
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all",
              optimizationMode === "savings" 
                ? "border-primary bg-primary/10" 
                : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
          >
            <RadioGroupItem value="savings" id="savings" className="shrink-0" />
            <span className="text-base">💰</span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs text-foreground">{opt.modeSavingsTitle}</span>
              <p className="text-[10px] text-muted-foreground truncate">{opt.modeSavingsSubtitle}</p>
            </div>
          </Label>

          <Label
            htmlFor="balanced"
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all",
              optimizationMode === "balanced" 
                ? "border-primary bg-primary/10" 
                : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
          >
            <RadioGroupItem value="balanced" id="balanced" className="shrink-0" />
            <Scale className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-medium text-xs text-foreground">{opt.modeBalancedTitle}</span>
                <Badge className="bg-success/20 text-success border-0 text-[9px] px-1 py-0">{opt.modeBalancedBadge}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{opt.modeBalancedSubtitle}</p>
            </div>
          </Label>

          <Label
            htmlFor="protection"
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all",
              optimizationMode === "protection" 
                ? "border-primary bg-primary/10" 
                : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
          >
            <RadioGroupItem value="protection" id="protection" className="shrink-0" />
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs text-foreground">{opt.modeProtectionTitle}</span>
              <p className="text-[10px] text-muted-foreground truncate">{opt.modeProtectionSubtitle}</p>
            </div>
          </Label>
        </RadioGroup>

        {/* Warning */}
        {showWarning && (
          <div className="bg-warning/15 border border-warning/30 rounded-2xl p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <p className="text-[11px] text-warning-foreground">
                {opt.warningBothOff}
              </p>
            </div>
          </div>
        )}

        {/* V2H Toggle - BOTTOM */}
        <div className="glass-subtle rounded-2xl p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl shrink-0">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm leading-tight">{opt.v2hTitle}</h3>
                <p className="text-[11px] text-muted-foreground">{opt.v2hSubtitle}</p>
              </div>
            </div>
            <Switch checked={v2hEnabled} onCheckedChange={onV2hChange} />
          </div>
        </div>

        {/* V2G Toggle - BOTTOM */}
        <div className="glass-subtle rounded-2xl p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-xl shrink-0">
                <Coins className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-medium text-foreground text-sm leading-tight">{opt.v2gTitle}</h3>
                  <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0">{opt.v2gBadge}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">{opt.v2gSubtitle}</p>
              </div>
            </div>
            <Switch checked={v2gEnabled} onCheckedChange={onV2gChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
