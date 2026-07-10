import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LoginScreenProps {
  onBack: () => void;
  onLoggedIn: () => void;
  onCreateAccount: () => void;
}

const fieldClass = "h-12 rounded-2xl bg-white/50 text-center text-base font-medium text-foreground";

export function LoginScreen({ onBack, onLoggedIn, onCreateAccount }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = email.trim() !== "" && password.trim() !== "";

  const submitTimeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(submitTimeout.current), []);

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    submitTimeout.current = setTimeout(onLoggedIn, 500);
  };

  return (
    // theme-mint: Welcome and Login share the same canonical background image
    // (see AuthFlow's imageBackgroundScreens) and should match it — always
    // Numiz's own color, not whatever theme is left over from a previous
    // session, since we don't know which account is logging in yet anyway.
    <div className="theme-mint flex flex-col flex-1 min-h-0 px-6 pt-2 pb-6">
      <button
        onClick={onBack}
        className="p-2 -ml-2 self-start text-foreground/70 hover:text-foreground transition-colors"
        aria-label="Tillbaka"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* The mascot floats above this (rendered by AuthFlow, see ghostJourney's
          "login" spot) — this block just needs to sit clear of it. */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-10">
        <h1 className="text-xl font-semibold text-foreground">Välkommen tillbaka</h1>

        <div className="w-full max-w-xs space-y-3">
          <Input
            type="email"
            inputMode="email"
            autoFocus
            placeholder="namn@mejl.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full h-12 text-base font-medium rounded-2xl"
        >
          {isSubmitting ? "Loggar in…" : "Logga in"}
        </Button>
        <button
          type="button"
          onClick={onCreateAccount}
          className="w-full text-center text-sm text-foreground/80 hover:text-foreground underline underline-offset-2"
        >
          Inget konto? Skapa ett
        </button>
      </div>
    </div>
  );
}
