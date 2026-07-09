import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { InstallerStepHeader } from "./InstallerStepHeader";
import { installerFuseOptions, evModels } from "@/lib/installer-mock-data";
import { gridCompanies, electricityProviders } from "@/lib/mock-data";

export interface InstallerDetails {
  fuse: string;
  consumption: string;
  evModel: string;
  electricityProvider: string | null;
  gridCompany: string | null;
}

interface DetailsStepProps {
  onBack: () => void;
  onComplete: (details: InstallerDetails) => void;
}

function DeferrableSelect({
  label,
  value,
  options,
  onChange,
  deferred,
  onToggleDefer,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  deferred: boolean;
  onToggleDefer: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <button
          type="button"
          onClick={onToggleDefer}
          className="text-[11px] text-primary hover:underline"
        >
          {deferred ? "Fyll i nu" : "Kund fyller i senare"}
        </button>
      </div>
      {deferred ? (
        <div className="h-10 rounded-xl bg-muted/40 flex items-center px-3">
          <span className="text-xs text-muted-foreground">Kunden fyller i detta själv</span>
        </div>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-10 rounded-xl bg-white/50">
            <SelectValue placeholder="Välj…" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-xl border shadow-lg z-50">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export function DetailsStep({ onBack, onComplete }: DetailsStepProps) {
  const [fuse, setFuse] = useState("");
  const [consumption, setConsumption] = useState("");
  const [evModel, setEvModel] = useState("");
  const [electricityProvider, setElectricityProvider] = useState("");
  const [gridCompany, setGridCompany] = useState("");
  const [providerDeferred, setProviderDeferred] = useState(false);
  const [gridDeferred, setGridDeferred] = useState(false);

  const canComplete =
    fuse !== "" &&
    consumption.trim() !== "" &&
    evModel !== "" &&
    (providerDeferred || electricityProvider !== "") &&
    (gridDeferred || gridCompany !== "");

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-2 pb-4">
      <InstallerStepHeader title="Kunduppgifter" onBack={onBack} stepIndex={2} stepCount={3} />

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
        <GlassCard className="p-4 space-y-4" variant="subtle">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Säkring</Label>
            <div className="flex gap-2">
              {installerFuseOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFuse(option)}
                  className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                    fuse === option
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-white/50 text-foreground hover:bg-white/70"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consumption" className="text-xs text-muted-foreground">
              Årsförbrukning (kWh) — står på elfakturan
            </Label>
            <Input
              id="consumption"
              type="number"
              inputMode="numeric"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              placeholder="t.ex. 18 000"
              className="h-10 rounded-xl bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Elbilsmodell</Label>
            <Select value={evModel} onValueChange={setEvModel}>
              <SelectTrigger className="h-10 rounded-xl bg-white/50">
                <SelectValue placeholder="Välj modell…" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl border shadow-lg z-50">
                {evModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-4" variant="subtle">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Elavtal — om du inte har uppgifterna kan kunden fylla i själv
          </p>
          <DeferrableSelect
            label="Elhandelsbolag"
            value={electricityProvider}
            options={electricityProviders}
            onChange={setElectricityProvider}
            deferred={providerDeferred}
            onToggleDefer={() => setProviderDeferred((v) => !v)}
          />
          <DeferrableSelect
            label="Elnätsbolag"
            value={gridCompany}
            options={gridCompanies}
            onChange={setGridCompany}
            deferred={gridDeferred}
            onToggleDefer={() => setGridDeferred((v) => !v)}
          />
        </GlassCard>
      </div>

      <div className="pt-4">
        <Button
          onClick={() =>
            onComplete({
              fuse,
              consumption,
              evModel,
              electricityProvider: providerDeferred ? null : electricityProvider,
              gridCompany: gridDeferred ? null : gridCompany,
            })
          }
          disabled={!canComplete}
          className="w-full h-12 text-base font-medium rounded-2xl"
        >
          Slutför installation
        </Button>
      </div>
    </div>
  );
}
