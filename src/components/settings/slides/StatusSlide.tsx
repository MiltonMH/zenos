import { useState } from "react";
import { RefreshCw, Home, Coins } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ChargingStatus = "charging" | "idle" | "v2h" | "v2g" | "searching" | "error";

interface StatusSlideProps {
  v2hEnabled: boolean;
  v2gEnabled: boolean;
  onV2hChange: (enabled: boolean) => void;
  onV2gChange: (enabled: boolean) => void;
}

export function StatusSlide({ v2hEnabled, v2gEnabled, onV2hChange, onV2gChange }: StatusSlideProps) {
  const [status] = useState<ChargingStatus>("idle");

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
    <div className="px-4 py-2 pb-8">
      <h2 className="text-base font-semibold text-foreground text-center mb-4">Status & V2X</h2>
      
      <div className="space-y-3">
        {/* Status Card */}
        <div className="glass-subtle rounded-2xl p-4 space-y-2">
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
            className="w-full glass-subtle border-white/30 hover:bg-white/20 text-foreground mt-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Starta om laddbox
          </Button>
        </div>

        {/* V2H Card */}
        <div className="glass-subtle rounded-2xl p-4">
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
            <Switch checked={v2hEnabled} onCheckedChange={onV2hChange} />
          </div>
        </div>

        {/* V2G Card */}
        <div className="glass-subtle rounded-2xl p-4">
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
            <Switch checked={v2gEnabled} onCheckedChange={onV2gChange} />
          </div>
        </div>

        {/* Warning */}
        {showWarning && (
          <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                V2H och V2G avstängda. Bilen laddar bara.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
