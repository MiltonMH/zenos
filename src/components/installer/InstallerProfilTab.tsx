import { motion } from "framer-motion";
import { User, Phone, Zap, ShieldCheck, HardHat } from "lucide-react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { mockInstaller } from "@/lib/installer-mock-data";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getInstallerTexts } from "@/lib/installer-i18n";

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
  unitCount: number;
  onExitDevMode: () => void;
}

export function InstallerProfilTab({ unitCount, onExitDevMode }: InstallerProfilTabProps) {
  const { language } = useLanguage();
  const t = getInstallerTexts(language).profil;

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-6 pb-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 ring-2 ring-white/50 shadow-lg">
          <HardHat className="w-10 h-10 text-primary/70" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">{mockInstaller.companyName}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{mockInstaller.certification}</p>
      </motion.div>

      <motion.div
        className="flex-1 min-h-0 space-y-2.5 overflow-y-auto scrollbar-hide"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <ProfileInfoCard icon={User} label={t.contactPerson} value={mockInstaller.contactName} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard icon={Phone} label={t.phone} value={mockInstaller.phone} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={Zap}
            label={t.installations}
            value={formatMessage(t.installationsCount, { count: unitCount })}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard icon={ShieldCheck} label={t.certification} value={mockInstaller.certification} />
        </motion.div>

        {/* Dev-only: switch back to customer view. Never shown in production. */}
        {import.meta.env.DEV && (
          <motion.div variants={itemVariants}>
            <button
              type="button"
              onClick={onExitDevMode}
              className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-muted-foreground/10">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{t.devModeTitle}</p>
                <p className="text-[11px] text-muted-foreground">{t.devModeSubtitle}</p>
              </div>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
