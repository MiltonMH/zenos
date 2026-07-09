import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { InstallerStepHeader } from "./InstallerStepHeader";
import { mockCustomerExists } from "@/lib/installer-mock-data";

interface ConfigureStepProps {
  onBack: () => void;
  onNext: (data: { email: string; address: string; customerExists: boolean }) => void;
}

function ConnectionRow({ label, state }: { label: string; state: "pending" | "active" | "done" }) {
  return (
    <div className="flex items-center gap-2.5">
      {state === "done" && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
      {state === "active" && <Loader2 className="w-4 h-4 text-primary shrink-0 animate-spin" />}
      {state === "pending" && <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
      <span className={`text-sm ${state === "pending" ? "text-muted-foreground/60" : "text-foreground"}`}>
        {label}
      </span>
    </div>
  );
}

export function ConfigureStep({ onBack, onNext }: ConfigureStepProps) {
  const [connStep, setConnStep] = useState(0); // 0: connecting, 1: downloading, 2: ready
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmedExists, setConfirmedExists] = useState<boolean | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setConnStep(1), 1200);
    const t2 = setTimeout(() => setConnStep(2), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const canConfirmCustomer = address.trim().length > 2 && email.includes("@");

  const handleConfirmClick = () => {
    if (!canConfirmCustomer) return;
    setConfirming(true);
  };

  const handleAccept = () => {
    setConfirmedExists(mockCustomerExists(email));
    setConfirming(false);
  };

  const handleEdit = () => {
    setConfirming(false);
    setConfirmedExists(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-2 pb-4">
      <InstallerStepHeader title="Konfigurera" onBack={onBack} stepIndex={1} stepCount={3} />

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
        <GlassCard className="p-4 space-y-3" variant="subtle">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Laddbox</p>
          <ConnectionRow label="Ansluter till internet" state={connStep === 0 ? "active" : "done"} />
          <ConnectionRow
            label="Installerar Numiz"
            state={connStep < 1 ? "pending" : connStep === 1 ? "active" : "done"}
          />
          {connStep === 2 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-success pl-6">
              Numiz är redo att kopplas till kund
            </motion.p>
          )}
        </GlassCard>

        <GlassCard className="p-4 space-y-4" variant="subtle">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rikta mot kund</p>

          <div className="space-y-2">
            <Label htmlFor="install-address" className="text-xs text-muted-foreground">Installationsadress</Label>
            <Input
              id="install-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Gatuadress, ort"
              disabled={confirmedExists !== null}
              className="h-10 rounded-xl bg-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-email" className="text-xs text-muted-foreground">Kundens e-post</Label>
            <Input
              id="customer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kund@exempel.se"
              disabled={confirmedExists !== null}
              className="h-10 rounded-xl bg-white/50"
            />
          </div>

          <AnimatePresence mode="wait">
            {confirmedExists !== null ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-success/10 p-3 text-xs text-foreground"
              >
                {confirmedExists
                  ? "Konto hittat – laddboxen kopplas direkt till kundens konto i Numiz."
                  : "Nytt konto – kunden får ett mejl för att slutföra sin registrering i Numiz."}
              </motion.div>
            ) : confirming ? (
              <motion.div
                key="confirming"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-primary/10 p-3 space-y-3"
              >
                <p className="text-xs text-foreground">
                  Skicka aktivering till <span className="font-medium">{email}</span> — stämmer detta?
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1 h-9 rounded-lg" onClick={handleEdit}>
                    Redigera
                  </Button>
                  <Button size="sm" className="flex-1 h-9 rounded-lg" onClick={handleAccept}>
                    Ja, stämmer
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  variant="outline"
                  disabled={!canConfirmCustomer}
                  onClick={handleConfirmClick}
                  className="w-full h-10 rounded-xl"
                >
                  Bekräfta kund
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>

      <div className="pt-4">
        <Button
          onClick={() => onNext({ email, address, customerExists: !!confirmedExists })}
          disabled={confirmedExists === null}
          className="w-full h-12 text-base font-medium rounded-2xl"
        >
          Nästa
        </Button>
      </div>
    </div>
  );
}
