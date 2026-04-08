import { useState } from "react";
import { RefreshCw, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type ChargingStatus = "charging" | "idle" | "v2h" | "v2g" | "searching" | "error";

interface StatusSlideProps {
  chargeLimit: number[];
  onChargeLimitChange: (value: number[]) => void;
}

export function StatusSlide({ chargeLimit, onChargeLimitChange }: StatusSlideProps) {
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

  return (
    <div className="px-4 py-2 pb-8">
      <h2 className="text-base font-semibold text-foreground text-center mb-4">Status & Laddning</h2>

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

        {/* Max Charge Limit */}
        <div className="glass-subtle rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-foreground text-sm">Max laddningsnivå</h3>
          </div>
          <Slider
            value={chargeLimit}
            onValueChange={onChargeLimitChange}
            min={50}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="text-center">
            <span className="text-3xl font-bold text-primary">{chargeLimit[0]}%</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Laddboxen laddar upp till {chargeLimit[0]}%
          </p>
        </div>
      </div>
    </div>
  );
}
