import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Home, Coins, Shield, Scale, Sparkles, Settings as SettingsIcon, ChevronDown } from "lucide-react";
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
        return { color: "bg-gray-400", text: "Idle", animate: "" };
      case "v2h":
        return { color: "bg-blue-500", text: "V2H", animate: "animate-pulse" };
      case "v2g":
        return { color: "bg-yellow-500", text: "V2G", animate: "animate-pulse" };
      case "searching":
        return { color: "bg-orange-500", text: "Söker WiFi", animate: "animate-ping" };
      case "error":
        return { color: "bg-red-500", text: "Error", animate: "animate-ping" };
      default:
        return { color: "bg-gray-400", text: "Okänd", animate: "" };
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
        <div className="w-11" /> {/* Spacer for centering */}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-subtle rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", statusConfig.color, statusConfig.animate)} />
              <span className="text-sm font-medium">{statusConfig.text}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Version:</span>
            <span className="text-sm font-medium">2.1.4</span>
          </div>
          <Button 
            variant="outline" 
            className="w-full glass-subtle border-white/20 hover:bg-white/20"
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
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Home className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">V2H - Ladda ur till hemmet</h3>
                <p className="text-sm text-muted-foreground mt-1">Låt bilen driva ditt hem</p>
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
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-xl">
                <Coins className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">V2G - Sälj till elnätet</h3>
                  <Badge className="bg-primary/20 text-primary border-0 text-xs">PREMIUM</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Tjäna pengar från nätet</p>
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
            className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
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
          className="glass-subtle rounded-2xl p-4 space-y-4"
        >
          <h3 className="font-semibold text-foreground">Max urladdning för V2H/V2G</h3>
          <Slider
            value={dischargeLimit}
            onValueChange={setDischargeLimit}
            min={20}
            max={80}
            step={5}
            className="w-full"
          />
          <div className="text-center">
            <span className="text-3xl font-bold text-primary">{dischargeLimit[0]}%</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Bilen laddar aldrig ur under {dischargeLimit[0]}%
          </p>
        </motion.div>

        {/* ZenAI Optimization Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-subtle rounded-2xl p-4 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">ZenAI - Smart Optimering</h3>
          </div>
          <p className="text-sm text-muted-foreground">Hur ska AI optimera din laddning?</p>
          
          <RadioGroup value={optimizationMode} onValueChange={setOptimizationMode} className="space-y-3">
            {/* Max Savings */}
            <Label
              htmlFor="savings"
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                optimizationMode === "savings" 
                  ? "border-primary bg-primary/10" 
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              )}
            >
              <RadioGroupItem value="savings" id="savings" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span className="font-semibold">Maximal Besparing</span>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Mest pengar sparade</li>
                  <li>• Mer slitage på batteri</li>
                </ul>
              </div>
            </Label>

            {/* Balanced */}
            <Label
              htmlFor="balanced"
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                optimizationMode === "balanced" 
                  ? "border-primary bg-primary/10" 
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              )}
            >
              <RadioGroupItem value="balanced" id="balanced" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Balanserad</span>
                  <Badge className="bg-green-500/20 text-green-600 border-0 text-xs">REKOMMENDERAT</Badge>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Bra ekonomi</li>
                  <li>• Skyddar batteriet</li>
                </ul>
              </div>
            </Label>

            {/* Battery Protection */}
            <Label
              htmlFor="protection"
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                optimizationMode === "protection" 
                  ? "border-primary bg-primary/10" 
                  : "border-white/20 bg-white/5 hover:bg-white/10"
              )}
            >
              <RadioGroupItem value="protection" id="protection" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Batteriskydd</span>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Längsta batterilivet</li>
                  <li>• Mindre V2X-användning</li>
                </ul>
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
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Avancerade inställningar</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-6">
                {/* Min V2G Battery */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Starta inte V2G om batteri under:
                  </Label>
                  <Select value={minV2gBattery} onValueChange={setMinV2gBattery}>
                    <SelectTrigger className="glass-subtle border-white/20">
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
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Om både V2H och V2G är lönsamma:
                  </Label>
                  <RadioGroup value={conflictPriority} onValueChange={setConflictPriority} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="v2h" id="priority-v2h" />
                      <Label htmlFor="priority-v2h" className="text-sm cursor-pointer">Prioritera V2H</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="v2g" id="priority-v2g" />
                      <Label htmlFor="priority-v2g" className="text-sm cursor-pointer">Prioritera V2G</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="ai" id="priority-ai" />
                      <Label htmlFor="priority-ai" className="text-sm cursor-pointer">AI bestämmer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Time Restrictions */}
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Tillåt V2X under:
                  </Label>
                  <RadioGroup value={timeRestriction} onValueChange={setTimeRestriction} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="always" id="time-always" />
                      <Label htmlFor="time-always" className="text-sm cursor-pointer">Alltid (24/7)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="night" id="time-night" />
                      <Label htmlFor="time-night" className="text-sm cursor-pointer">Endast natt (22-06)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="custom" id="time-custom" />
                      <Label htmlFor="time-custom" className="text-sm cursor-pointer">Anpassat schema →</Label>
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
