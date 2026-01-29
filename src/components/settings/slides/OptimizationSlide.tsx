import { Shield, Scale, Home, Coins } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
  const showWarning = !v2hEnabled && !v2gEnabled;

  return (
    <div className="px-4 py-2 pb-8">
      <h2 className="text-base font-semibold text-foreground text-center mb-4">V2H & V2G</h2>
      
      <div className="space-y-3">
        {/* V2H Toggle */}
        <div className="glass-subtle rounded-2xl p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl shrink-0">
                <Home className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm leading-tight">V2H - Hemmet</h3>
                <p className="text-[11px] text-muted-foreground">Ladda ur till hemmet</p>
              </div>
            </div>
            <Switch checked={v2hEnabled} onCheckedChange={onV2hChange} />
          </div>
        </div>

        {/* V2G Toggle */}
        <div className="glass-subtle rounded-2xl p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-xl shrink-0">
                <Coins className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-medium text-foreground text-sm leading-tight">V2G - Elnätet</h3>
                  <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0">PRO</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Sälj och tjäna pengar</p>
              </div>
            </div>
            <Switch checked={v2gEnabled} onCheckedChange={onV2gChange} />
          </div>
        </div>

        {/* Warning */}
        {showWarning && (
          <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-2xl p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <p className="text-[11px] text-yellow-700 dark:text-yellow-400">
                V2H och V2G avstängda. Bilen laddar bara.
              </p>
            </div>
          </div>
        )}

        {/* Discharge Limit */}
        <div className="glass-subtle rounded-2xl p-3 space-y-2">
          <h3 className="font-medium text-foreground text-xs">Max urladdning</h3>
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
              Laddar aldrig ur under
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
              <span className="font-medium text-xs text-foreground">Maximal Besparing</span>
              <p className="text-[10px] text-muted-foreground truncate">Mest pengar • Mer slitage</p>
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
                <span className="font-medium text-xs text-foreground">Balanserad</span>
                <Badge className="bg-green-500/20 text-green-600 border-0 text-[9px] px-1 py-0">REC</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">Bra ekonomi • Skyddar batteriet</p>
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
            <Shield className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs text-foreground">Batteriskydd</span>
              <p className="text-[10px] text-muted-foreground truncate">Längsta liv • Mindre V2X</p>
            </div>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
}
