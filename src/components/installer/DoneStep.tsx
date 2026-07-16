import { motion } from "framer-motion";
import { CheckCircle2, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { mockInstaller } from "@/lib/installer-mock-data";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getInstallerTexts } from "@/lib/installer-i18n";

interface DoneStepProps {
  customerExists: boolean;
  onDone: () => void;
  onAddAnother: () => void;
}

export function DoneStep({ customerExists, onDone, onAddAnother }: DoneStepProps) {
  const { language } = useLanguage();
  const t = getInstallerTexts(language).done;

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-6 pb-4 items-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-4"
      >
        <CheckCircle2 className="w-16 h-16 text-success" />
      </motion.div>

      <h1 className="text-xl font-semibold text-foreground text-center">{t.title}</h1>
      <p className="text-sm text-muted-foreground text-center mt-1 max-w-[280px]">
        {customerExists ? t.subtitleExisting : t.subtitleNew}
      </p>

      <GlassCard className="p-4 w-full mt-6 space-y-3" variant="subtle">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <UserPlus className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-foreground">
            {formatMessage(t.infoInstaller, { company: mockInstaller.companyName })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-foreground">{t.infoContact}</p>
        </div>
      </GlassCard>

      <div className="flex-1" />

      <div className="w-full space-y-2.5">
        <Button onClick={onDone} className="w-full h-12 text-base font-medium rounded-2xl">
          {t.toInstallations}
        </Button>
        <Button onClick={onAddAnother} variant="ghost" className="w-full h-10 rounded-xl">
          {t.addAnother}
        </Button>
      </div>
    </div>
  );
}
