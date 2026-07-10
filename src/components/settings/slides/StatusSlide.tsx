import { RefreshCw, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ApiField } from "@/components/settings/ApiField";
import { cn } from "@/lib/utils";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getSettingsTexts } from "@/lib/settings-i18n";
import type { SettingsUiStatus } from "@/lib/numiz-mappers";

interface StatusSlideProps {
  chargeLimit: number[];
  onChargeLimitChange: (value: number[]) => void;
  status?: SettingsUiStatus;
  firmwareVersion?: string | null;
  statusFromApi?: boolean;
  versionFromApi?: boolean;
  chargeLimitFromApi?: boolean;
  chargeLimitDisabled?: boolean;
  onRestart?: () => void;
  saving?: boolean;
}

export function StatusSlide({
  chargeLimit,
  onChargeLimitChange,
  status = "idle",
  firmwareVersion,
  statusFromApi = false,
  versionFromApi = false,
  chargeLimitFromApi = false,
  chargeLimitDisabled = false,
  onRestart,
  saving = false,
}: StatusSlideProps) {
  const { language } = useLanguage();
  const settings = getSettingsTexts(language);

  const getStatusConfig = (current: SettingsUiStatus) => {
    switch (current) {
      case "charging":
        return { color: "bg-green-500", text: settings.status.charging, animate: "animate-pulse" };
      case "idle":
        return { color: "bg-muted-foreground", text: settings.status.idle, animate: "" };
      case "v2h":
        return { color: "bg-blue-500", text: settings.status.v2h, animate: "animate-pulse" };
      case "v2g":
        return { color: "bg-yellow-500", text: settings.status.v2g, animate: "animate-pulse" };
      case "searching":
        return { color: "bg-orange-500", text: settings.status.searching, animate: "animate-ping" };
      case "error":
        return { color: "bg-destructive", text: settings.status.error, animate: "animate-ping" };
      default:
        return { color: "bg-muted-foreground", text: settings.status.unknown, animate: "" };
    }
  };

  const statusConfig = getStatusConfig(status);
  const versionLabel = firmwareVersion?.trim() || (versionFromApi ? "—" : "2.1.4");

  return (
    <div className="px-4 py-2 pb-8">
      <h2 className="text-base font-semibold text-foreground text-center mb-4">{settings.status.title}</h2>

      <div className="space-y-3">
        <div className="glass-subtle rounded-2xl p-4 space-y-2">
          <ApiField fromApi={statusFromApi} className="rounded-xl px-1 -mx-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">{settings.status.statusLabel}</span>
              <div className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full", statusConfig.color, statusConfig.animate)} />
                <span className="text-sm font-medium text-foreground">{statusConfig.text}</span>
              </div>
            </div>
          </ApiField>
          <ApiField fromApi={versionFromApi} className="rounded-xl px-1 -mx-1">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground">{settings.status.versionLabel}</span>
              <span className="text-sm font-medium text-foreground">{versionLabel}</span>
            </div>
          </ApiField>
          <Button
            type="button"
            variant="glass"
            size="sm"
            className="w-full mt-2"
            onClick={onRestart}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {settings.status.restartCharger}
          </Button>
        </div>

        <ApiField fromApi={chargeLimitFromApi}>
          <div
            className={cn(
              "glass-subtle rounded-2xl p-4 space-y-3",
              chargeLimitDisabled && "opacity-60",
            )}
          >
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-foreground text-sm">{settings.status.maxChargeLevel}</h3>
              {saving && (
                <span className="text-[10px] text-muted-foreground ml-auto">{settings.save.saving}</span>
              )}
            </div>
            <Slider
              value={chargeLimit}
              onValueChange={onChargeLimitChange}
              min={50}
              max={100}
              step={5}
              disabled={chargeLimitDisabled}
              className="w-full"
              aria-label={settings.status.maxChargeLevel}
            />
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{chargeLimit[0]}%</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {formatMessage(settings.status.maxChargeHint, { percent: chargeLimit[0] })}
            </p>
          </div>
        </ApiField>
      </div>
    </div>
  );
}
