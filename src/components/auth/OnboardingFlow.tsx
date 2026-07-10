import { useState, useRef, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OnboardingStepShell } from "./OnboardingStepShell";
import type { useAppTheme } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";

interface OnboardingFlowProps {
  onBack: () => void;
  onComplete: (name: string) => void;
  appTheme: ReturnType<typeof useAppTheme>;
  onStepChange?: (index: number) => void;
}

const stepKeys = ["theme", "name", "email", "phone", "address", "password"] as const;
type StepKey = (typeof stepKeys)[number];

const slideVariants = {
  enter: (direction: number) => ({ y: direction > 0 ? 14 : -14, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (direction: number) => ({ y: direction < 0 ? 14 : -14, opacity: 0 }),
};

const fieldClass = "h-12 rounded-2xl bg-white/50 text-center text-base font-medium text-foreground";

export function OnboardingFlow({ onBack, onComplete, appTheme, onStepChange }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { themeId, setThemeId, themes } = appTheme;

  const submitTimeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(submitTimeout.current), []);

  useEffect(() => {
    onStepChange?.(stepIndex);
  }, [stepIndex, onStepChange]);

  const key: StepKey = stepKeys[stepIndex];

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
      continueLabel={key === "password" ? "Skapa konto" : "Fortsätt"}
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
              <h1 className="text-xl font-semibold text-foreground">Gör appen till din</h1>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {themes.map((theme) => {
                  const isSelected = themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      className={cn(
                        "relative h-24 rounded-3xl overflow-hidden transition-all duration-300",
                        isSelected ? "ring ring-offset-2 ring-offset-background scale-[1.05]" : "opacity-90 hover:opacity-100"
                      )}
                      style={{
                        background: `linear-gradient(135deg, ${theme.glow} 0%, ${theme.accent} 100%)`,
                        ...(isSelected ? ({ "--tw-ring-color": theme.accent } as CSSProperties) : {}),
                      }}
                    >
                      <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/80 text-xs font-medium text-foreground shadow-sm">
                        {theme.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">Välj ett tema – du kan ändra när du vill</p>
            </>
          )}

          {key === "name" && (
            <>
              <h1 className="text-xl font-semibold text-foreground">Vad heter du?</h1>
              <div className="w-full max-w-xs">
                <Input
                  autoFocus
                  placeholder="För- och efternamn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.name && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className="text-xs text-muted-foreground">Så vi kan hälsa på dig</p>
            </>
          )}

          {key === "email" && (
            <>
              <h1 className="text-xl font-semibold text-foreground">Din mejladress?</h1>
              <div className="w-full max-w-xs">
                <Input
                  type="email"
                  inputMode="email"
                  autoFocus
                  placeholder="namn@mejl.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.email && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className="text-xs text-muted-foreground">Hit skickar vi viktiga saker – aldrig skräp</p>
            </>
          )}

          {key === "phone" && (
            <>
              <h1 className="text-xl font-semibold text-foreground">Ditt telefonnummer?</h1>
              <div className="w-full max-w-xs">
                <Input
                  type="tel"
                  inputMode="tel"
                  autoFocus
                  placeholder="070-123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.phone && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className="text-xs text-muted-foreground">Om vi behöver nå dig</p>
            </>
          )}

          {key === "address" && (
            <>
              <h1 className="text-xl font-semibold text-foreground">Var bor du?</h1>
              <div className="w-full max-w-xs">
                <Input
                  autoFocus
                  placeholder="Gata, postnummer, ort"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canContinue.address && goNext()}
                  className={fieldClass}
                />
              </div>
              <p className="text-xs text-muted-foreground">Adressen där din laddare finns</p>
            </>
          )}

          {key === "password" && (
            <>
              <h1 className="text-xl font-semibold text-foreground">Välj ett lösenord</h1>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Minst 8 tecken</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </OnboardingStepShell>
  );
}
