import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Zap, Home, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getPremiumTexts } from "@/lib/premium-i18n";

interface PremiumBannerProps {
  daysLeft?: number;
  onUpgrade: () => void;
}

export function PremiumBanner({ daysLeft, onUpgrade }: PremiumBannerProps) {
  const { language } = useLanguage();
  const premium = getPremiumTexts(language);
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
              {isTrial
                ? formatMessage(premium.trialHeader, { days: daysLeft! })
                : premium.upgradeHeader}
            </span>
          </div>

          {/* Features */}
          <h3 className="text-lg font-semibold mb-2">
            {isTrial ? premium.trialTitle : premium.upgradeTitle}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 text-xs">
              <Zap className="w-3 h-3 text-energy-charging" />
              {premium.featureAi}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 text-xs">
              <Home className="w-3 h-3 text-energy-v2h" />
              {premium.featureV2h}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 text-xs">
              <TrendingUp className="w-3 h-3 text-energy-v2g" />
              {premium.featureV2g}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onUpgrade}
            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            {isTrial ? premium.ctaKeep : premium.ctaTrial}
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isTrial && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              {premium.pricingFootnote}
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
