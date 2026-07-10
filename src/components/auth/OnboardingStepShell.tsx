import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingStepShellProps {
  onBack: () => void;
  stepIndex: number;
  stepCount: number;
  canContinue: boolean;
  isSubmitting?: boolean;
  onContinue: () => void;
  continueLabel?: string;
  children: ReactNode;
}

// The chrome (back arrow, progress dots, continue button) renders ONCE here
// and never remounts between questions — only `children` (the question
// itself) gets swapped by the caller's AnimatePresence. Keeping the chrome
// out of that transition is what stops the arrow/dots/button from visibly
// shifting position on every step change.
export function OnboardingStepShell({
  onBack,
  stepIndex,
  stepCount,
  canContinue,
  isSubmitting,
  onContinue,
  continueLabel = "Fortsätt",
  children,
}: OnboardingStepShellProps) {
  const isActive = canContinue && !isSubmitting;

  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pt-2 pb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Tillbaka"
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

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center pt-8 overflow-hidden">
        {children}
      </div>

      <motion.div
        animate={{ opacity: isActive ? 1 : 0.25, y: isActive ? 0 : 6 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
      >
        <Button
          onClick={onContinue}
          disabled={!canContinue || isSubmitting}
          size="lg"
          className="w-full h-12 text-base font-medium rounded-full"
        >
          {isSubmitting ? "Ett ögonblick…" : continueLabel}
        </Button>
      </motion.div>
    </div>
  );
}
