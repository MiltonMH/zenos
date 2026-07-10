import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onCreateAccount, onLogin }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-6 pb-6">
      {/* The mascot floats above this (rendered by AuthFlow, see ghostJourney's
          "start" spot) — this block just needs to sit clear of it. */}
      <div className="flex-1 flex flex-col items-center justify-end pb-16 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">numiz</h1>
          <p className="text-muted-foreground">Din laddning. På autopilot.</p>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={onCreateAccount} size="lg" className="w-full h-[58px] text-base font-medium rounded-full">
          Skapa konto
        </Button>
        <Button onClick={onLogin} variant="glass" size="lg" className="w-full h-[58px] text-base font-medium">
          Logga in
        </Button>
      </div>
    </div>
  );
}
