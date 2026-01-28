import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Home, Coins, Shield, Scale, Sparkles, Settings as SettingsIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type ChargingStatus = "charging" | "idle" | "v2h" | "v2g" | "searching" | "error";

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  const [status] = useState<ChargingStatus>("idle");
  const [v2hEnabled, setV2hEnabled] = useState(false);
  const [v2gEnabled, setV2gEnabled] = useState(false);
  const [dischargeLimit, setDischargeLimit] = useState([50]);
  const [optimizationMode, setOptimizationMode] = useState("balanced");
  const [minV2gBattery, setMinV2gBattery] = useState("70");
  const [conflictPriority, setConflictPriority] = useState("ai");
  const [timeRestriction, setTimeRestriction] = useState("always");

  const getStatusConfig = (status: ChargingStatus) => {
    switch (status) {
      case "charging":
        return { color: "bg-green-500", text: "Laddar", animate: "animate-pulse" };
      case "idle":
        return { color: "bg-muted-foreground", text: "Idle", animate: "" };
      case "v2h":
        return { color: "bg-blue-500", text: "V2H", animate: "animate-pulse" };
      case "v2g":
        return { color: "bg-yellow-500", text: "V2G", animate: "animate-pulse" };
      case "searching":
        return { color: "bg-orange-500", text: "Söker WiFi", animate: "animate-ping" };
      case "error":
        return { color: "bg-destructive", text: "Error", animate: "animate-ping" };
      default:
        return { color: "bg-muted-foreground", text: "Okänd", animate: "" };
    }
  };

  const statusConfig = getStatusConfig(status);
  const showWarning = !v2hEnabled && !v2gEnabled;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
        <button 
          onClick={onBack}
          className="p-2.5 glass-subtle rounded-2xl text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Inställningar</h1>
        <div className="w-11" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-subtle rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full", statusConfig.color, statusConfig.animate)} />
              <span className="text-sm font-medium text-foreground">{statusConfig.text}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Version:</span>
            <span className="text-sm font-medium text-foreground">2.1.4</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full glass-subtle border-white/30 hover:bg-white/20 text-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Starta om laddbox
          </Button>
        </motion.div>

        {/* V2H Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-subtle rounded-2xl p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl shrink-0">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm leading-tight">V2H - Hemmet</h3>
                <p className="text-xs text-muted-foreground">Ladda ur till hemmet</p>
              </div>
            </div>
            <Switch checked={v2hEnabled} onCheckedChange={setV2hEnabled} />
          </div>
        </motion.div>

        {/* V2G Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-subtle rounded-2xl p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-xl shrink-0">
                <Coins className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-medium text-foreground text-sm leading-tight">V2G - Elnätet</h3>
                  <Badge className="bg-primary/20 text-primary border-0 text-[10px] px-1.5 py-0">PRO</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Sälj och tjäna pengar</p>
              </div>
            </div>
            <Switch checked={v2gEnabled} onCheckedChange={setV2gEnabled} />
          </div>
        </motion.div>

        {/* Warning */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-500/15 border border-yellow-500/30 rounded-2xl p-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                V2H och V2G avstängda. Bilen laddar bara, laddar inte ur.
              </p>
            </div>
          </motion.div>
        )}

        {/* Discharge Limit Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-subtle rounded-2xl p-4 space-y-3"
        >
          <h3 className="font-medium text-foreground text-sm">Max urladdning för V2H/V2G</h3>
          <Slider
            value={dischargeLimit}
            onValueChange={setDischargeLimit}
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
        </motion.div>

        {/* ZenAI Optimization Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-subtle rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-foreground text-sm">ZenAI - Smart Optimering</h3>
          </div>
          <p className="text-xs text-muted-foreground">Hur ska AI optimera din laddning?</p>
          
          <RadioGroup value={optimizationMode} onValueChange={setOptimizationMode} className="space-y-2">
            {/* Max Savings */}
            <Label
              htmlFor="savings"
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                optimizationMode === "savings" 
                  ? "border-primary bg-primary/10" 
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              )}
            >
              <RadioGroupItem value="savings" id="savings" className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">💰</span>
                  <span className="font-medium text-sm text-foreground">Maximal Besparing</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mest pengar sparade • Mer slitage på batteri
                </p>
              </div>
            </Label>

            {/* Balanced */}
            <Label
              htmlFor="balanced"
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                optimizationMode === "balanced" 
                  ? "border-primary bg-primary/10" 
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              )}
            >
              <RadioGroupItem value="balanced" id="balanced" className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm text-foreground">Balanserad</span>
                  <Badge className="bg-green-500/20 text-green-600 border-0 text-[10px] px-1.5 py-0">REKOMMENDERAT</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bra ekonomi • Skyddar batteriet
                </p>
              </div>
            </Label>

            {/* Battery Protection */}
            <Label
              htmlFor="protection"
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                optimizationMode === "protection" 
                  ? "border-primary bg-primary/10" 
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              )}
            >
              <RadioGroupItem value="protection" id="protection" className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm text-foreground">Batteriskydd</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Längsta batterilivet • Mindre V2X-användning
                </p>
              </div>
            </Label>
          </RadioGroup>
        </motion.div>

        {/* Advanced Settings Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Accordion type="single" collapsible className="glass-subtle rounded-2xl overflow-hidden">
            <AccordionItem value="advanced" className="border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline text-sm">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Avancerade inställningar</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-5">
                {/* Min V2G Battery */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Starta inte V2G om batteri under:
                  </Label>
                  <Select value={minV2gBattery} onValueChange={setMinV2gBattery}>
                    <SelectTrigger className="glass-subtle border-white/20 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conflict Priority */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Om både V2H och V2G är lönsamma:
                  </Label>
                  <RadioGroup value={conflictPriority} onValueChange={setConflictPriority} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="v2h" id="priority-v2h" />
                      <Label htmlFor="priority-v2h" className="text-sm cursor-pointer text-foreground">Prioritera V2H</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="v2g" id="priority-v2g" />
                      <Label htmlFor="priority-v2g" className="text-sm cursor-pointer text-foreground">Prioritera V2G</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="ai" id="priority-ai" />
                      <Label htmlFor="priority-ai" className="text-sm cursor-pointer text-foreground">AI bestämmer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Time Restrictions */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Tillåt V2X under:
                  </Label>
                  <RadioGroup value={timeRestriction} onValueChange={setTimeRestriction} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="always" id="time-always" />
                      <Label htmlFor="time-always" className="text-sm cursor-pointer text-foreground">Alltid (24/7)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="night" id="time-night" />
                      <Label htmlFor="time-night" className="text-sm cursor-pointer text-foreground">Endast natt (22-06)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="time-custom" />
                      <Label htmlFor="time-custom" className="text-sm cursor-pointer text-foreground">Anpassat schema →</Label>
                    </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
