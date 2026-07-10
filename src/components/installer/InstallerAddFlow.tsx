import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScanStep } from "./ScanStep";
import { ConfigureStep } from "./ConfigureStep";
import { LockedQuestionFlow, type RequiredInstallerDetails } from "./LockedQuestionFlow";
import { LockedRoomOverlay } from "./LockedRoomOverlay";
import { OptionalDetailsStep, type OptionalInstallerDetails } from "./OptionalDetailsStep";
import { DoneStep } from "./DoneStep";
import type { InstalledUnit } from "@/lib/installer-mock-data";

type FlowStep = "scan" | "configure" | "required" | "optional" | "done";

interface CustomerDraft {
  email: string;
  address: string;
  customerExists: boolean;
}

interface InstallerAddFlowProps {
  onCancel: () => void;
  onComplete: (unit: InstalledUnit) => void;
}

export function InstallerAddFlow({ onCancel, onComplete }: InstallerAddFlowProps) {
  const [step, setStep] = useState<FlowStep>("scan");
  const [customerDraft, setCustomerDraft] = useState<CustomerDraft | null>(null);
  const [requiredDetails, setRequiredDetails] = useState<RequiredInstallerDetails | null>(null);
  const [createdUnit, setCreatedUnit] = useState<InstalledUnit | null>(null);

  const handleOptionalComplete = (_optional: OptionalInstallerDetails) => {
    if (!customerDraft) return;
    const unit: InstalledUnit = {
      id: `arc-${Date.now()}`,
      customerName: customerDraft.email,
      address: customerDraft.address,
      installedDate: "Idag",
      status: customerDraft.customerExists ? "active" : "awaiting_customer",
      chargingMode: "idle",
      batteryLevel: 0,
      online: customerDraft.customerExists,
    };
    setCreatedUnit(unit);
    setStep("done");
  };

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden min-h-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col min-h-0"
        >
          {step === "scan" && <ScanStep onBack={onCancel} onConfigure={() => setStep("configure")} />}

          {step === "configure" && (
            <ConfigureStep
              onBack={() => setStep("scan")}
              onNext={(data) => {
                setCustomerDraft(data);
                setStep("required");
              }}
            />
          )}

          {step === "required" && (
            <LockedRoomOverlay>
              <LockedQuestionFlow
                onBack={() => setStep("configure")}
                onComplete={(details) => {
                  setRequiredDetails(details);
                  setStep("optional");
                }}
              />
            </LockedRoomOverlay>
          )}

          {step === "optional" && (
            <OptionalDetailsStep onBack={() => setStep("required")} onComplete={handleOptionalComplete} />
          )}

          {step === "done" && createdUnit && (
            <DoneStep
              customerExists={createdUnit.status === "active"}
              onDone={() => onComplete(createdUnit)}
              onAddAnother={() => {
                setCustomerDraft(null);
                setRequiredDetails(null);
                setCreatedUnit(null);
                setStep("scan");
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
