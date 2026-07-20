import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ScanStep } from "./ScanStep";
import { ConfigureStep } from "./ConfigureStep";
import { LockedQuestionFlow, type RequiredInstallerDetails } from "./LockedQuestionFlow";
import { LockedRoomOverlay } from "./LockedRoomOverlay";
import { OptionalDetailsStep, type OptionalInstallerDetails } from "./OptionalDetailsStep";
import { DoneStep } from "./DoneStep";
import type { InstalledUnit } from "@/lib/installer-mock-data";
import {
  buildCreateInstallationRequest,
  mapInstallationToUnit,
} from "@/lib/numiz-mappers";
import type { CreateInstallationRequest, InstallationCreateResponse } from "@/lib/numiz-types";
import { useLanguage } from "@/lib/i18n";
import { getInstallerTexts } from "@/lib/installer-i18n";
import { toast } from "@/hooks/use-toast";

type FlowStep = "scan" | "configure" | "required" | "optional" | "done";

interface CustomerDraft {
  email: string;
  address: string;
  customerExists: boolean;
}

export interface InstallerAddFlowResult {
  unit: InstalledUnit;
  customerPassword: string | null;
}

interface InstallerAddFlowProps {
  companyName: string;
  onCancel: () => void;
  onComplete: (result: InstallerAddFlowResult) => void;
  createInstallation: (
    params: CreateInstallationRequest,
  ) => Promise<InstallationCreateResponse>;
}

export function InstallerAddFlow({
  companyName,
  onCancel,
  onComplete,
  createInstallation,
}: InstallerAddFlowProps) {
  const { language } = useLanguage();
  const t = getInstallerTexts(language).dash;
  const [step, setStep] = useState<FlowStep>("scan");
  const [hardwareId, setHardwareId] = useState("");
  const [customerDraft, setCustomerDraft] = useState<CustomerDraft | null>(null);
  const [requiredDetails, setRequiredDetails] = useState<RequiredInstallerDetails | null>(null);
  const [createdUnit, setCreatedUnit] = useState<InstalledUnit | null>(null);
  const [customerPassword, setCustomerPassword] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOptionalComplete = async (optional: OptionalInstallerDetails) => {
    if (!customerDraft || !requiredDetails || !hardwareId) return;

    setSubmitting(true);

    try {
      const request = buildCreateInstallationRequest({
        customerEmail: customerDraft.email,
        address: customerDraft.address,
        hardwareId,
        fuse: requiredDetails.fuse,
        consumption: requiredDetails.consumption,
        evModel: requiredDetails.evModel,
        gridCompany: optional.gridCompany,
        electricityProvider: optional.electricityProvider,
      });

      const response = await createInstallation(request);
      const unit = mapInstallationToUnit(
        response.installation,
        language === "en" ? "en-GB" : "sv-SE",
      );

      setCreatedUnit(unit);
      setCustomerPassword(response.customerPassword);
      setStep("done");
    } catch (error) {
      toast({
        title: t.addErrorTitle,
        description: error instanceof Error ? error.message : "REQUEST_FAILED",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">{t.addSubmitting}</p>
      </div>
    );
  }

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
          {step === "scan" && (
            <ScanStep
              onBack={onCancel}
              onConfigure={(serial) => {
                setHardwareId(serial);
                setStep("configure");
              }}
            />
          )}

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
              companyName={companyName}
              customerExists={createdUnit.status === "active"}
              customerPassword={customerPassword}
              onDone={() => onComplete({ unit: createdUnit, customerPassword })}
              onAddAnother={() => {
                setCustomerDraft(null);
                setRequiredDetails(null);
                setCreatedUnit(null);
                setCustomerPassword(null);
                setHardwareId("");
                setStep("scan");
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
