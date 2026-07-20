import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Zap, ShieldCheck, HardHat, Pencil, LogOut } from "lucide-react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { BackgroundCarousel } from "@/components/profile/BackgroundCarousel";
import { Button } from "@/components/ui/button";
import { DataSourceField } from "@/components/ui/data-source-field";
import { EditProfile } from "@/pages/EditProfile";
import type { BackgroundOption } from "@/hooks/useBackground";
import type { InstallerCompanyView } from "@/hooks/useInstallerData";
import { formatMessage, useLanguage, type AppLanguage } from "@/lib/i18n";
import { getInstallerTexts } from "@/lib/installer-i18n";
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
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

interface InstallerProfilTabProps {
  company: InstallerCompanyView;
  unitCount: number;
  selectedBackground: BackgroundOption;
  onBackgroundChange: (bg: BackgroundOption) => void;
  onExitDevMode: () => void;
  onLogout?: () => void;
}

export function InstallerProfilTab({
  company,
  unitCount,
  selectedBackground,
  onBackgroundChange,
  onExitDevMode,
  onLogout,
}: InstallerProfilTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = getInstallerTexts(language).profil;
  const texts = getProfileTexts(language);
  const { fromApi } = company;

  if (isEditing) {
    return <EditProfile onBack={() => setIsEditing(false)} onLogout={onLogout} />;
  }

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 ring-2 ring-white/50 shadow-lg">
          <HardHat className="w-10 h-10 text-primary/70" />
        </div>
        <DataSourceField fromApi={fromApi.companyName} className="px-3 py-1">
          <h1 className="text-xl font-semibold text-foreground text-center">{company.companyName}</h1>
        </DataSourceField>
        <DataSourceField fromApi={fromApi.certification} className="mt-0.5 px-3 py-0.5">
          <p className="text-sm text-muted-foreground text-center">{company.certification}</p>
        </DataSourceField>
      </motion.div>

      <motion.div
        className="flex-1 space-y-2.5 overflow-y-auto scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <DataSourceField fromApi={fromApi.contactName}>
            <ProfileInfoCard icon={User} label={t.contactPerson} value={company.contactName} />
          </DataSourceField>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataSourceField fromApi={fromApi.phone}>
            <ProfileInfoCard icon={Phone} label={t.phone} value={company.phone} />
          </DataSourceField>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataSourceField fromApi={fromApi.installations}>
            <ProfileInfoCard
              icon={Zap}
              label={t.installations}
              value={formatMessage(t.installationsCount, { count: unitCount })}
            />
          </DataSourceField>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DataSourceField fromApi={fromApi.certification}>
            <ProfileInfoCard icon={ShieldCheck} label={t.certification} value={company.certification} />
          </DataSourceField>
        </motion.div>

        {import.meta.env.DEV && (
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={onExitDevMode}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-muted-foreground/10">
                <HardHat className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{texts.devMode.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatMessage(texts.devMode.subtitle, { mode: texts.devMode.installerView })}
                </p>
              </div>
            </button>
          </motion.div>
        )}

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
                <p className="text-[11px] text-muted-foreground">{texts.devLogin.subtitle}</p>
              </div>
            </button>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <div className="glass p-3.5 rounded-2xl flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{texts.language}</p>
            </div>
            <div className="pill-toggle relative shrink-0">
              {(
                [
                  { id: "sv" as AppLanguage, label: texts.swedish },
                  { id: "en" as AppLanguage, label: texts.english },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLanguage(opt.id)}
                  className={cn(
                    "pill-toggle-item relative z-10 px-3",
                    language === opt.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {language === opt.id && (
                    <motion.span
                      layoutId="installer-profile-language-indicator"
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

        <motion.div variants={itemVariants}>
          <BackgroundCarousel selected={selectedBackground} onSelect={onBackgroundChange} />
        </motion.div>
      </motion.div>

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
