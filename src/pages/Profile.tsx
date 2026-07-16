import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Crown, Wrench, Pencil, User, HardHat, LogOut } from "lucide-react";
import lightningIcon from "@/assets/Lightning_Vector1.svg";
import { CarIcon } from "@/components/icons/CarIcon";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { Button } from "@/components/ui/button";
import { EditProfile } from "./EditProfile";
import { BackgroundCarousel } from "@/components/profile/BackgroundCarousel";
import { mockUser } from "@/lib/mock-data";
import { type BackgroundOption } from "@/hooks/useBackground";
import { type AppMode } from "@/hooks/useAppMode";
import { formatMessage, useLanguage, type AppLanguage } from "@/lib/i18n";
import { getProfileTexts } from "@/lib/profile-i18n";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }
  },
};

interface ProfileProps {
  selectedBackground: BackgroundOption;
  onBackgroundChange: (bg: BackgroundOption) => void;
  appMode?: AppMode;
  onToggleAppMode?: () => void;
  onLogout?: () => void;
}

export default function Profile({ selectedBackground, onBackgroundChange, appMode, onToggleAppMode, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { language, setLanguage } = useLanguage();
  const texts = getProfileTexts(language);

  if (isEditing) {
    return <EditProfile onBack={() => setIsEditing(false)} onLogout={onLogout} />;
  }

  const modeLabel = appMode === "installer" ? texts.devMode.installerView : texts.devMode.customerView;

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-4">
      {/* Header Section with Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center mb-6"
      >
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 ring-2 ring-white/50 shadow-lg">
          <User className="w-10 h-10 text-primary/70" />
        </div>

        <h1 className="text-xl font-semibold text-foreground">{mockUser.name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{mockUser.carModel}</p>
      </motion.div>

      {/* Information Cards */}
      <motion.div
        className="flex-1 space-y-2.5 overflow-y-auto scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={Mail}
            label={texts.email}
            value={mockUser.email}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={Crown}
            label={texts.subscription}
            value={mockUser.isPremium ? texts.subscriptionPremium : texts.subscriptionFree}
            badge={{
              text: mockUser.isPremium ? texts.subscriptionPremium : texts.subscriptionFree,
              variant: mockUser.isPremium ? "premium" : "free",
            }}
            action={{
              label: mockUser.isPremium ? texts.subscriptionManage : texts.subscriptionUpgrade,
              onClick: () => console.log("Subscription action"),
              variant: mockUser.isPremium ? "secondary" : "default",
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={lightningIcon}
            label={texts.charger}
            value={mockUser.charger.model}
            secondaryValue={formatMessage(texts.versionTemplate, { version: mockUser.charger.version })}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={CarIcon}
            label={texts.car}
            value={mockUser.carModel}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={Wrench}
            label={texts.installer}
            value={mockUser.installer}
            action={{
              label: texts.contactInstaller,
              onClick: () => console.log("Contact installer"),
              variant: "secondary",
            }}
          />
        </motion.div>

        {/* Dev-only: switch between customer and installer view. Never shown in production. */}
        {import.meta.env.DEV && onToggleAppMode && (
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={onToggleAppMode}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-muted-foreground/10">
                <HardHat className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{texts.devMode.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatMessage(texts.devMode.subtitle, { mode: modeLabel })}
                </p>
              </div>
            </button>
          </motion.div>
        )}

        {/* Dev-only: jump straight back to the welcome/login/onboarding flow
            (incl. Numiz) without digging through Profil → Redigera → Säkerhet.
            Never shown in production. */}
        {import.meta.env.DEV && onLogout && (
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-muted-foreground/10">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{texts.devLogin.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {texts.devLogin.subtitle}
                </p>
              </div>
            </button>
          </motion.div>
        )}

        {/* Language switcher */}
        <motion.div variants={itemVariants}>
          <div className="glass p-3.5 rounded-2xl flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{texts.language}</p>
            </div>
            <div className="pill-toggle relative shrink-0">
              {([
                { id: "sv" as AppLanguage, label: texts.swedish },
                { id: "en" as AppLanguage, label: texts.english },
              ]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLanguage(opt.id)}
                  className={cn(
                    "pill-toggle-item relative z-10 px-3",
                    language === opt.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {language === opt.id && (
                    <motion.span
                      layoutId="profile-language-indicator"
                      className="absolute inset-0 rounded-full bg-primary/20 border border-primary/35 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
                    />
                  )}
                  <span className="relative z-10 text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Background Picker */}
        <motion.div variants={itemVariants}>
          <BackgroundCarousel
            selected={selectedBackground}
            onSelect={onBackgroundChange}
          />
        </motion.div>
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="pt-4"
      >
        <Button
          onClick={() => setIsEditing(true)}
          className="w-full h-11 text-sm font-medium rounded-2xl shadow-sm"
        >
          <Pencil className="w-4 h-4 mr-2" />
          {texts.editProfile}
        </Button>
      </motion.div>
    </div>
  );
}
