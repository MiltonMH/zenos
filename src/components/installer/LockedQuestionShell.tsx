import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { getCommonTexts } from "@/lib/common-i18n";
import { getInstallerTexts } from "@/lib/installer-i18n";

interface LockedQuestionShellProps {
  onBack: () => void;
  stepIndex: number;
  stepCount: number;
  eyebrow?: string;
  prompt: string;
  hint?: string;
  canContinue: boolean;
  onContinue: () => void;
  continueLabel?: string;
  children: ReactNode;
}

export function LockedQuestionShell({
  onBack,
  stepIndex,
  stepCount,
  eyebrow,
  prompt,
  hint,
  canContinue,
  onContinue,
  continueLabel,
  children,
}: LockedQuestionShellProps) {
  const { language } = useLanguage();
  const common = getCommonTexts(language);
  const t = getInstallerTexts(language).locked;

  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pt-2 pb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
          aria-label={common.back}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: stepCount }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex ? "w-5 bg-primary" : i < stepIndex ? "w-1.5 bg-primary/50" : "w-1.5 bg-primary/20"
              }`}
            />
          ))}
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="space-y-2">
          {eyebrow && <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{eyebrow}</p>}
          <h1 className="text-xl font-semibold text-foreground">{prompt}</h1>
        </div>

        <div className="w-full max-w-xs">{children}</div>

        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>

      <AnimatePresence>
        {canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
          >
            <Button onClick={onContinue} className="w-full h-12 text-base font-medium rounded-2xl">
              {continueLabel ?? t.continue}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
