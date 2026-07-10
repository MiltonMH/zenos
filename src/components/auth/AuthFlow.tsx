import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeScreen } from "./WelcomeScreen";
import { LoginScreen } from "./LoginScreen";
import { OnboardingFlow } from "./OnboardingFlow";
import { DoneScreen } from "./DoneScreen";
import { NumizGhost } from "./NumizGhost";
import { GHOST_JOURNEY, GHOST_FLOW_STEPS, type GhostStage } from "./ghostJourney";
import type { useAppTheme } from "@/hooks/useAppTheme";
import { cn } from "@/lib/utils";

interface AuthFlowProps {
  onComplete: () => void;
  appTheme: ReturnType<typeof useAppTheme>;
}

type Screen = "welcome" | "login" | "onboarding" | "done";

// Welcome/login keep today's actual background image (per design direction:
// the very first screen always matches the current app), since no theme has
// been chosen yet. Once a theme exists (onboarding step 1 onward, and the
// post-signup/-login landing) the pure-CSS theme mesh takes over so the
// chosen brand color shows through live.
const imageBackgroundScreens: Screen[] = ["welcome", "login"];

const HOLD_MS: Record<"created" | "login", number> = { created: 2800, login: 1400 };
const LAND_MS = 1100;

export function AuthFlow({ onComplete, appTheme }: AuthFlowProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [doneVariant, setDoneVariant] = useState<"created" | "login">("created");
  const [newAccountName, setNewAccountName] = useState("");
  const [isLanding, setIsLanding] = useState(false);
  const [onboardingStepIndex, setOnboardingStepIndex] = useState(0);

  const holdTimeout = useRef<ReturnType<typeof setTimeout>>();
  const landTimeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => {
    clearTimeout(holdTimeout.current);
    clearTimeout(landTimeout.current);
  }, []);

  const enterDone = (variant: "created" | "login", name = "") => {
    setNewAccountName(name);
    setDoneVariant(variant);
    setIsLanding(false);
    setScreen("done");
    holdTimeout.current = setTimeout(() => {
      setIsLanding(true);
      landTimeout.current = setTimeout(onComplete, LAND_MS);
    }, HOLD_MS[variant]);
  };

  const ghostGlow = appTheme.themes.find((t) => t.id === appTheme.themeId)?.glow ?? appTheme.themes[0].glow;
  const ghostStage: GhostStage =
    screen === "welcome"
      ? "start"
      : screen === "login"
        ? "login"
        : screen === "onboarding"
          ? "flow"
          : isLanding
            ? "home"
            : "welcome";
  // During onboarding, re-settle to a slightly different nearby spot per
  // question instead of sitting frozen at one fixed point for all six steps.
  const ghostSpot =
    ghostStage === "flow"
      ? GHOST_FLOW_STEPS[onboardingStepIndex % GHOST_FLOW_STEPS.length]
      : GHOST_JOURNEY[ghostStage];

  return (
    <div
      className={cn(
        "relative min-h-dvh flex flex-col",
        imageBackgroundScreens.includes(screen) ? "bg-gradient-mesh" : "bg-theme-mesh"
      )}
    >
      <NumizGhost x={ghostSpot.x} y={ghostSpot.y} size={ghostSpot.size} opacity={ghostSpot.opacity} glow={ghostGlow} />

      <div className="flex-1 flex flex-col safe-top safe-bottom min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col min-h-0"
          >
            {screen === "welcome" && (
              <WelcomeScreen onCreateAccount={() => setScreen("onboarding")} onLogin={() => setScreen("login")} />
            )}
            {screen === "login" && (
              <LoginScreen
                onBack={() => setScreen("welcome")}
                onLoggedIn={() => enterDone("login")}
                onCreateAccount={() => setScreen("onboarding")}
              />
            )}
            {screen === "onboarding" && (
              <OnboardingFlow
                onBack={() => setScreen("welcome")}
                appTheme={appTheme}
                onStepChange={setOnboardingStepIndex}
                onComplete={(name) => enterDone("created", name)}
              />
            )}
            {screen === "done" && <DoneScreen variant={doneVariant} name={newAccountName} isLanding={isLanding} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
