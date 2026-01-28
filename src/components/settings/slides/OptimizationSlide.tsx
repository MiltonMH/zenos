import { Shield, Scale, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OptimizationSlideProps {
  dischargeLimit: number[];
  optimizationMode: string;
  onDischargeLimitChange: (value: number[]) => void;
  onOptimizationModeChange: (mode: string) => void;
}

export function OptimizationSlide({ 
  dischargeLimit, 
  optimizationMode, 
  onDischargeLimitChange, 
  onOptimizationModeChange 
}: OptimizationSlideProps) {
  return (
    <div className="px-4 py-2 pb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-base font-semibold text-foreground">ZenAI Optimering</h2>
      </div>
      
      <div className="space-y-4">
        {/* Discharge Limit */}
        <div className="glass-subtle rounded-2xl p-4 space-y-3">
          <h3 className="font-medium text-foreground text-sm">Max urladdning V2H/V2G</h3>
          <Slider
            value={dischargeLimit}
            onValueChange={onDischargeLimitChange}
            min={20}
            max={80}
            step={5}
            className="w-full"
          />
          <div className="text-center">
            <span className="text-2xl font-bold text-primary">{dischargeLimit[0]}%</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Bilen laddar aldrig ur under {dischargeLimit[0]}%
          </p>
        </div>

        {/* Optimization Mode */}
        <RadioGroup value={optimizationMode} onValueChange={onOptimizationModeChange} className="space-y-2">
          {/* Max Savings */}
          <Label
            htmlFor="savings"
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
              optimizationMode === "savings" 
                ? "border-primary bg-primary/10" 
                : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
          >
            <RadioGroupItem value="savings" id="savings" />
            <span className="text-lg">💰</span>
            <div className="flex-1">
              <span className="font-medium text-sm text-foreground">Maximal Besparing</span>
              <p className="text-xs text-muted-foreground">Mest pengar • Mer batterislitage</p>
            </div>
          </Label>

          {/* Balanced */}
          <Label
            htmlFor="balanced"
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
              optimizationMode === "balanced" 
                ? "border-primary bg-primary/10" 
                : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
          >
            <RadioGroupItem value="balanced" id="balanced" />
            <Scale className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm text-foreground">Balanserad</span>
                <Badge className="bg-green-500/20 text-green-600 border-0 text-[10px] px-1.5 py-0">REC</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Bra ekonomi • Skyddar batteriet</p>
            </div>
          </Label>

          {/* Battery Protection */}
          <Label
            htmlFor="protection"
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
              optimizationMode === "protection" 
                ? "border-primary bg-primary/10" 
                : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
          >
            <RadioGroupItem value="protection" id="protection" />
            <Shield className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <span className="font-medium text-sm text-foreground">Batteriskydd</span>
              <p className="text-xs text-muted-foreground">Längsta liv • Mindre V2X</p>
            </div>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
}
