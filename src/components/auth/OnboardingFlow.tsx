import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OnboardingStepShell } from "./OnboardingStepShell";
import type { useBackground, BackgroundOption } from "@/hooks/useBackground";
import { useLanguage } from "@/lib/i18n";
import { getOnboardingTexts } from "@/lib/onboarding-i18n";
import { cn } from "@/lib/utils";

interface OnboardingFlowProps {
  onBack: () => void;
  onComplete: (name: string) => void;
  background: ReturnType<typeof useBackground>;
  onStepChange?: (index: number) => void;
}

const stepKeys = ["theme", "name", "email", "phone", "address", "password"] as const;
type StepKey = (typeof stepKeys)[number];

const slideVariants = {
  enter: (direction: number) => ({ y: direction > 0 ? 14 : -14, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({ y: direction < 0 ? 14 : -14, opacity: 0 }),
};

// bg-white/75, not /50: on the busy "Färgrik" background, 50% let too much of
// the photo bleed through, making typed/placeholder text harder to read.
//
// Fixed slate text, not text-foreground/text-muted-foreground: this field's
// background is always light regardless of which of the 4 themes is active.
// But "Mörk" overrides --foreground/--muted-foreground to LIGHT colors (for
// text sitting on ITS dark page background) — which would land here too,
// since custom properties inherit, producing near-invisible light-on-light
// text. A chip/field with its own fixed light fill needs its own fixed dark
// text, independent of the page-level theme.
const fieldClass = "h-12 rounded-2xl bg-white/75 text-center text-base font-medium text-slate-800 placeholder:text-slate-400";
// Backgrounds now include a busy photo (Färgrik) and a flat white one (Ljus),
// so text sitting directly on them needs its own contrast instead of relying
// on the backdrop. A soft white halo keeps headings readable over the photo's
// darker patches without changing how they look on light backgrounds. This
// one DOES use text-foreground (not fixed slate) because it sits directly on
// the page, not on a light chip — it's meant to flip light-on-dark in Mörk.
const titleClass = "text-xl font-semibold text-foreground [text-shadow:0_1px_16px_rgba(255,255,255,0.9)]";
// Hints are small and light-weight, so a halo alone isn't enough — give them
// the same "chip" backing as the theme swatch labels below, which already
// reads clearly against any of the four backgrounds. Fixed slate text for the
// same reason as fieldClass above.
const hintClass = "text-xs text-slate-600 bg-white/65 backdrop-blur-sm px-3 py-1 rounded-full";

export function OnboardingFlow({ onBack, onComplete, background, onStepChange }: OnboardingFlowProps) {
  const { language } = useLanguage();
  const i18n = getOnboardingTexts(language);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selected, setSelected, backgrounds } = background;

  const submitTimeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(submitTimeout.current), []);

  useEffect(() => {
    onStepChange?.(stepIndex);
  }, [stepIndex, onStepChange]);

  const key: StepKey = stepKeys[stepIndex];

  const themeLabel = (id: BackgroundOption) =>
    i18n.themeLabels[id as keyof typeof i18n.themeLabels] ?? id;

  const goBack = () => {
    if (stepIndex === 0) {
      onBack();
      return;
    }
    setDirection(-1);
    setStepIndex((i) => i - 1);
  };

  const goNext = () => {
    if (stepIndex === stepKeys.length - 1) {
      setIsSubmitting(true);
      submitTimeout.current = setTimeout(() => onComplete(name.trim()), 500);
      return;
    }
    setDirection(1);
    setStepIndex((i) => i + 1);
  };

  const canContinue: Record<StepKey, boolean> = {
    theme: true,
    name: name.trim().length >= 2,
    email: /\S+@\S+\.\S+/.test(email),
    phone: phone.replace(/\D/g, "").length >= 7,
    address: address.trim().length >= 4,
    password: password.length >= 8,
  };

  return (
    <OnboardingStepShell
      onBack={goBack}
      stepIndex={stepIndex}
      stepCount={stepKeys.length}
      canContinue={canContinue[key]}
      isSubmitting={key === "password" ? isSubmitting : false}
      onContinue={goNext}
      continueLabel={key === "password" ? i18n.createAccount : i18n.continue}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={key}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="w-full flex flex-col items-center gap-6 text-center"
        >
          {key === "theme" && (
            <>
              <h1 className={titleClass}>{i18n.themeTitle}</h1>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {backgrounds.map((bg) => {
                  const isSelected = selected === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelected(bg.id)}
                      className={cn(
                        "relative h-24 rounded-3xl overflow-hidden transition-all duration-300 border border-black/10",
                        bg.preview,
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.05]"
                          : "opacity-90 hover:opacity-100"
                      )}
                      style={
                        bg.image
                          ? { backgroundImage: `url(${bg.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : undefined
                      }
                    >
                      {/* border-black/10: without it this chip disappears into
                          its own swatch on "Ljus" (white on white). Fixed
                          slate text, not text-foreground: see fieldClass —
                          this chip's fill is always light even when "Mörk"
                          is the ACTIVE selection and has flipped --foreground
                          to a light color for the rest of the page. */}
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/85 border border-black/10 text-xs font-medium text-slate-800 shadow-sm">
                        {themeLabel(bg.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className={hintClass}>{i18n.themeHint}</p>
            </>
          )}

          {key === "name" && (
            <>
              <h1 className={titleClass}>{i18n.nameTitle}</h1>
              <div className="w-full max-w-xs">
                <Input
                  autoFocus
                  placeholder={i18n.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.name && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className={hintClass}>{i18n.nameHint}</p>
            </>
          )}

          {key === "email" && (
            <>
              <h1 className={titleClass}>{i18n.emailTitle}</h1>
              <div className="w-full max-w-xs">
                <Input
                  type="email"
                  inputMode="email"
                  autoFocus
                  placeholder={i18n.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.email && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className={hintClass}>{i18n.emailHint}</p>
            </>
          )}

          {key === "phone" && (
            <>
              <h1 className={titleClass}>{i18n.phoneTitle}</h1>
              <div className="w-full max-w-xs">
                <Input
                  type="tel"
                  inputMode="tel"
                  autoFocus
                  placeholder={i18n.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.phone && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className={hintClass}>{i18n.phoneHint}</p>
            </>
          )}

          {key === "address" && (
            <>
              <h1 className={titleClass}>{i18n.addressTitle}</h1>
              <div className="w-full max-w-xs">
                <Input
                  autoFocus
                  placeholder={i18n.addressPlaceholder}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.address && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className={hintClass}>{i18n.addressHint}</p>
            </>
          )}

          {key === "password" && (
            <>
              <h1 className={titleClass}>{i18n.passwordTitle}</h1>
              <div className="relative w-full max-w-xs">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.password && !isSubmitting && goNext()}
                  className={cn(fieldClass, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? i18n.hidePassword : i18n.showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className={hintClass}>{i18n.passwordHint}</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </OnboardingStepShell>
  );
}
