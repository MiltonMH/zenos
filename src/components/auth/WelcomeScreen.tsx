import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onCreateAccount, onLogin }: WelcomeScreenProps) {
  return (
    // theme-mint: this is the first screen a brand-new user sees, and it must
    // always read as Numiz's own color — not whatever theme a *previous*
    // session left active globally on <html> (e.g. after logging out post-
    // onboarding with a different theme chosen).
    <div className="theme-mint flex flex-col flex-1 min-h-0 px-6 pb-6">
      {/* The mascot floats above this (rendered by AuthFlow, see ghostJourney's
          "start" spot) — this block just needs to sit clear of it. */}
      <div className="flex-1 flex flex-col items-center justify-end pb-16 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">numiz</h1>
          <p className="text-muted-foreground">Din laddning. På autopilot.</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={onCreateAccount} className="w-full h-12 text-base font-medium rounded-2xl">
          Skapa konto
        </Button>
        {/* A true frosted-glass pill: translucent + blurred (lets the wallpaper
            show through softly) with a crisp, fully-visible 2px border and a
            real drop shadow — not glass-strong's near-opaque fill with inset
            highlights, which reads as a flat white bar with a broken edge on
            a backdrop this light. */}
        <Button
          onClick={onLogin}
          variant="ghost"
          className="w-full h-12 text-base font-medium rounded-2xl text-foreground bg-white/55 backdrop-blur-xl border-2 border-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.10)] hover:bg-white/65"
        >
          Logga in
        </Button>
      </div>
    </div>
  );
}
