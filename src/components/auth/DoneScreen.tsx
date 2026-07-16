import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { getOnboardingTexts } from "@/lib/onboarding-i18n";

interface DoneScreenProps {
  variant: "created" | "login";
  name?: string;
  /** True once the mascot has started gliding off to its home-screen spot — fade the greeting out of its way. */
  isLanding: boolean;
}

// Purely presentational: AuthFlow owns the hold/land timing and drives the
// persistent NumizGhost to its "welcome" spot before this mounts. The
// greeting is positioned on the same percentage grid as the mascot's journey
// (see ghostJourney.ts's "welcome" spot: centered at y≈38.7%, ~48% wide) so
// it always lands just under the ghost regardless of screen size, rather
// than relying on flex-centering two independently-positioned elements.
export function DoneScreen({ variant, name, isLanding }: DoneScreenProps) {
  const { language } = useLanguage();
  const i18n = getOnboardingTexts(language);

  return (
    <div className="relative flex-1">
      {/* Static centering lives on this plain div — a motion.div here would fight
          Tailwind's -translate-x-1/2 for ownership of the `transform` property
          (framer-motion writes its own inline transform for `y`, which wins over
          the class and silently drops the x-centering). Keep the animated
          element a plain child with no positioning transform of its own. */}
      <div className="absolute left-1/2 top-[54%] w-full max-w-xs -translate-x-1/2 px-6 text-center">
        <AnimatePresence>
          {!isLanding && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-2"
            >
              {variant === "created" ? (
                <>
                  <h1 className="text-2xl font-semibold text-foreground [text-shadow:0_1px_20px_rgba(255,255,255,0.9)]">
                    {i18n.doneCreatedTitle}
                    {name ? `, ${name}` : ""}!
                  </h1>
                  {/* Fixed slate, not text-muted-foreground: see WelcomeScreen's
                      tagline chip for why — this fill is always light. */}
                  <p className="inline-block text-sm text-slate-600 bg-white/65 backdrop-blur-sm px-3 py-1 rounded-full">
                    {i18n.doneCreatedSubtitle}
                  </p>
                </>
              ) : (
                <h1 className="text-2xl font-semibold text-foreground [text-shadow:0_1px_20px_rgba(255,255,255,0.9)]">
                  {i18n.doneLoginTitle}
                </h1>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
