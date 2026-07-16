import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { gridCompanies, electricityProviders } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n";
import { getInstallerTexts } from "@/lib/installer-i18n";

export interface OptionalInstallerDetails {
  electricityProvider: string | null;
  gridCompany: string | null;
}

interface OptionalDetailsStepProps {
  onBack: () => void;
  onComplete: (details: OptionalInstallerDetails) => void;
}

function DeferrableSelect({
  label,
  value,
  options,
  onChange,
  deferred,
  onToggleDefer,
  fillInNow,
  skip,
  deferredHint,
  selectPlaceholder,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  deferred: boolean;
  onToggleDefer: () => void;
  fillInNow: string;
  skip: string;
  deferredHint: string;
  selectPlaceholder: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <button
          type="button"
          onClick={onToggleDefer}
          className="text-[11px] font-medium text-foreground underline underline-offset-2 decoration-foreground/30 hover:decoration-foreground"
        >
          {deferred ? fillInNow : skip}
        </button>
      </div>
      {deferred ? (
        <div className="h-10 rounded-xl bg-muted/40 flex items-center px-3">
          <span className="text-xs text-muted-foreground">{deferredHint}</span>
        </div>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-10 rounded-xl bg-white/50">
            <SelectValue placeholder={selectPlaceholder} />
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

export function OptionalDetailsStep({ onBack, onComplete }: OptionalDetailsStepProps) {
  const { language } = useLanguage();
  const t = getInstallerTexts(language).optional;
  const [electricityProvider, setElectricityProvider] = useState("");
  const [gridCompany, setGridCompany] = useState("");
  const [providerDeferred, setProviderDeferred] = useState(false);
  const [gridDeferred, setGridDeferred] = useState(false);

  const canComplete = (providerDeferred || electricityProvider !== "") && (gridDeferred || gridCompany !== "");

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-2 pb-4">
      <InstallerStepHeader title={t.title} onBack={onBack} stepIndex={2} stepCount={3} />

      <div className="flex-1 min-h-0 space-y-3">
        <GlassCard className="p-4 space-y-4" variant="subtle">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.intro}</p>
          <DeferrableSelect
            label={t.fieldElectricityProvider}
            value={electricityProvider}
            options={electricityProviders}
            onChange={setElectricityProvider}
            deferred={providerDeferred}
            onToggleDefer={() => setProviderDeferred((v) => !v)}
            fillInNow={t.fillInNow}
            skip={t.skip}
            deferredHint={t.deferredHint}
            selectPlaceholder={t.selectPlaceholder}
          />
          <DeferrableSelect
            label={t.fieldGridCompany}
            value={gridCompany}
            options={gridCompanies}
            onChange={setGridCompany}
            deferred={gridDeferred}
            onToggleDefer={() => setGridDeferred((v) => !v)}
            fillInNow={t.fillInNow}
            skip={t.skip}
            deferredHint={t.deferredHint}
            selectPlaceholder={t.selectPlaceholder}
          />
        </GlassCard>
      </div>

      <div className="pt-4">
        <Button
          onClick={() =>
            onComplete({
              electricityProvider: providerDeferred ? null : electricityProvider,
              gridCompany: gridDeferred ? null : gridCompany,
            })
          }
          disabled={!canComplete}
          className="w-full h-12 text-base font-medium rounded-2xl"
        >
          {t.complete}
        </Button>
      </div>
    </div>
  );
}
