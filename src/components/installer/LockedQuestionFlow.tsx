import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LockedQuestionShell } from "./LockedQuestionShell";
import { evBrands, evModelsByBrand, evModels } from "@/lib/installer-mock-data";

export interface RequiredInstallerDetails {
  fuse: string;
  consumption: string;
  evModel: string;
}

interface LockedQuestionFlowProps {
  onBack: () => void;
  onComplete: (details: RequiredInstallerDetails) => void;
}

const questionKeys = ["fuse", "consumption", "evModel"] as const;
type QuestionKey = (typeof questionKeys)[number];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 40 : -40, opacity: 0 }),
};

// Buttons here sit on the frosted "locked room" backdrop instead of the app's
// colorful background, so they need more of their own contrast than the standard
// gradient-stroke pill (which relies partly on a busy backdrop to read).
const pillClass = (isSelected: boolean) =>
  `w-full h-11 rounded-xl text-sm font-medium transition-all ${
    isSelected
      ? "bg-primary text-primary-foreground shadow-sm"
      : "gradient-stroke-ring bg-white/80 text-foreground shadow-sm hover:bg-white"
  }`;

export function LockedQuestionFlow({ onBack, onComplete }: LockedQuestionFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [fuse, setFuse] = useState("");
  const [consumption, setConsumption] = useState("");
  const [evModel, setEvModel] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const evSuggestions = useMemo(
    () => evModels.filter((m) => m.toLowerCase().includes(evModel.trim().toLowerCase())),
    [evModel]
  );

  const key: QuestionKey = questionKeys[stepIndex];

  const goBack = () => {
    if (stepIndex === 0) {
      onBack();
      return;
    }
    setDirection(-1);
    setStepIndex((i) => i - 1);
  };

  const goNext = () => {
    if (stepIndex === questionKeys.length - 1) {
      onComplete({ fuse, consumption, evModel });
      return;
    }
    setDirection(1);
    setStepIndex((i) => i + 1);
  };

  const canContinue = {
    fuse: fuse.trim().length === 2,
    consumption: consumption.trim() !== "",
    evModel: evModel.trim() !== "",
  }[key];

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden min-h-0">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={key}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          {key === "fuse" && (
            <LockedQuestionShell
              onBack={goBack}
              stepIndex={0}
              stepCount={questionKeys.length}
              prompt="Vilken säkring har kunden?"
              hint="Står på elcentralen"
              canContinue={canContinue}
              onContinue={goNext}
            >
              <div className="flex items-center justify-center gap-3">
                <InputOTP maxLength={2} inputMode="numeric" value={fuse} onChange={setFuse}>
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="h-16 w-14 text-2xl rounded-2xl border-2 bg-white/50" />
                    <InputOTPSlot index={1} className="h-16 w-14 text-2xl rounded-2xl border-2 bg-white/50" />
                  </InputOTPGroup>
                </InputOTP>
                <span className="text-2xl font-semibold text-muted-foreground">A</span>
              </div>
            </LockedQuestionShell>
          )}

          {key === "consumption" && (
            <LockedQuestionShell
              onBack={goBack}
              stepIndex={1}
              stepCount={questionKeys.length}
              prompt="Hur mycket förbrukar kunden per år?"
              hint="Står på elfakturan"
              canContinue={canContinue}
              onContinue={goNext}
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">kWh/år</p>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                  className="w-full bg-transparent text-center text-4xl font-semibold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                />
              </div>
            </LockedQuestionShell>
          )}

          {key === "evModel" && (
            <LockedQuestionShell
              onBack={goBack}
              stepIndex={2}
              stepCount={questionKeys.length}
              prompt="Vilken elbil har kunden?"
              canContinue={canContinue}
              onContinue={goNext}
            >
              <div className="space-y-3">
                <input
                  type="text"
                  autoFocus
                  value={evModel}
                  onChange={(e) => {
                    setEvModel(e.target.value);
                    setSelectedBrand(null);
                  }}
                  placeholder="Sök eller välj märke…"
                  className="w-full bg-transparent text-lg font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none text-center border-b-2 border-primary/25 pb-2"
                />

                {evModel.trim() === "" ? (
                  selectedBrand === null ? (
                    <div className="grid grid-cols-2 gap-2">
                      {evBrands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => setSelectedBrand(brand)}
                          className="h-14 rounded-xl text-sm font-medium gradient-stroke-ring bg-white/80 shadow-sm hover:bg-white text-foreground"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBrand(null)}
                        className="text-xs font-medium text-foreground underline underline-offset-2"
                      >
                        ← Alla märken
                      </button>
                      <div className="space-y-1.5 max-h-[32vh] overflow-y-auto scrollbar-hide">
                        {evModelsByBrand[selectedBrand].map((model) => (
                          <button
                            key={model}
                            type="button"
                            onClick={() => setEvModel(model)}
                            className={pillClass(evModel === model)}
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  evSuggestions.length > 0 && (
                    <div className="space-y-1.5 max-h-[38vh] overflow-y-auto scrollbar-hide">
                      {evSuggestions.map((model) => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => setEvModel(model)}
                          className={pillClass(evModel === model)}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  )
                )}
              </div>
            </LockedQuestionShell>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
