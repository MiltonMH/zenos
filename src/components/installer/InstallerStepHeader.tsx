import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getCommonTexts } from "@/lib/common-i18n";

interface InstallerStepHeaderProps {
  title: string;
  onBack?: () => void;
  stepIndex?: number;
  stepCount?: number;
}

export function InstallerStepHeader({ title, onBack, stepIndex, stepCount }: InstallerStepHeaderProps) {
  const { language } = useLanguage();
  const common = getCommonTexts(language);

  return (
    <div className="flex flex-col gap-3 px-2 pt-2 pb-4">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-foreground/80 hover:text-foreground transition-colors"
            aria-label={common.back}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <div className="w-10" />
      </div>

      {stepIndex !== undefined && stepCount !== undefined && (
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: stepCount }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex ? "w-6 bg-primary" : i < stepIndex ? "w-1.5 bg-primary/50" : "w-1.5 bg-primary/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
