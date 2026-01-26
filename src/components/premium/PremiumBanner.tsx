import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Zap, Home, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface PremiumBannerProps {
  daysLeft?: number;
  onUpgrade: () => void;
}

export function PremiumBanner({ daysLeft, onUpgrade }: PremiumBannerProps) {
  const isTrial = daysLeft !== undefined && daysLeft > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <GlassCard 
        className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-transparent"
        glow="primary"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {isTrial ? `${daysLeft} dagar kvar av Premium` : "Uppgradera till Premium"}
            </span>
          </div>

          {/* Features */}
          <h3 className="text-lg font-semibold mb-2">
            {isTrial ? "Fortsätt njuta av alla funktioner" : "Lås upp smarta funktioner"}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 text-xs">
              <Zap className="w-3 h-3 text-energy-charging" />
              AI-optimering
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 text-xs">
              <Home className="w-3 h-3 text-energy-v2h" />
              Smart V2H
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 text-xs">
              <TrendingUp className="w-3 h-3 text-energy-v2g" />
              V2G-intäkter
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onUpgrade}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            {isTrial ? "Behåll Premium" : "Prova gratis i 60 dagar"}
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isTrial && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Sedan 129 SEK/månad • Avsluta när som helst
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
