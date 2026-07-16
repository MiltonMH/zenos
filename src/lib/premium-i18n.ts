import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const premiumTexts = {
  sv: {
    badge: "PREMIUM",
    trialHeader: "{days} dagar kvar av Premium",
    upgradeHeader: "Uppgradera till Premium",
    trialTitle: "Fortsätt njuta av alla funktioner",
    upgradeTitle: "Lås upp smarta funktioner",
    featureAi: "AI-optimering",
    featureV2h: "Smart V2H",
    featureV2g: "V2G-intäkter",
    ctaKeep: "Behåll Premium",
    ctaTrial: "Prova gratis i 60 dagar",
    pricingFootnote: "Sedan 129 SEK/månad • Avsluta när som helst",
  },
  en: {
    badge: "PREMIUM",
    trialHeader: "{days} days of Premium left",
    upgradeHeader: "Upgrade to Premium",
    trialTitle: "Keep enjoying every feature",
    upgradeTitle: "Unlock smart features",
    featureAi: "AI optimization",
    featureV2h: "Smart V2H",
    featureV2g: "V2G earnings",
    ctaKeep: "Keep Premium",
    ctaTrial: "Try free for 60 days",
    pricingFootnote: "Then 129 SEK/month • Cancel anytime",
  },
} as const;

export type PremiumTexts = (typeof premiumTexts)[AppLanguage];

export function getPremiumTexts(
  language: AppLanguage = getStoredLanguage(),
): PremiumTexts {
  return premiumTexts[language];
}
