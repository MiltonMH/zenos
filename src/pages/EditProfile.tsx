import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Copy, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlassCard } from "@/components/ui/glass-card";
import { mockUser, fuseOptions, gridCompanies, electricityProviders } from "@/lib/mock-data";
import { useLanguage } from "@/lib/i18n";
import { getProfileTexts } from "@/lib/profile-i18n";

interface EditProfileProps {
  onBack: () => void;
  onLogout?: () => void;
}

export function EditProfile({ onBack, onLogout }: EditProfileProps) {
  const { language } = useLanguage();
  const texts = getProfileTexts(language).edit;

  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    address: mockUser.address,
    chargerModel: mockUser.charger.model,
    serialNumber: mockUser.charger.serialNumber,
    pinCode: mockUser.charger.pinCode,
    fuse: mockUser.fuse,
    gridCompany: mockUser.gridCompany,
    electricityProvider: mockUser.electricityProvider,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const copiedTimeout = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(copiedTimeout.current), []);

  const handleCopySerial = () => {
    navigator.clipboard.writeText(formData.serialNumber);
    setCopied(true);
    copiedTimeout.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    console.log("Saving:", formData);
    setHasChanges(false);
    onBack();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-4">
        <button
          onClick={onBack}
          className="p-2 text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <h1 className="text-lg font-semibold text-foreground">{texts.title}</h1>
        
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Form Sections */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-4">
        <Accordion type="single" collapsible defaultValue="personal" className="space-y-3">
          {/* Personal Information */}
          <AccordionItem value="personal" className="border-0">
            <GlassCard className="p-0 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">{texts.sectionPersonal}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs text-muted-foreground">{texts.fieldName}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-10 rounded-xl bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-muted-foreground">{texts.fieldEmail}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-10 rounded-xl bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs text-muted-foreground">{texts.fieldPhone}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="h-10 rounded-xl bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs text-muted-foreground">{texts.fieldAddress}</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="min-h-[80px] rounded-xl bg-white/50 resize-none"
                  />
                </div>
              </AccordionContent>
            </GlassCard>
          </AccordionItem>

          {/* Charger Section */}
          <AccordionItem value="charger" className="border-0">
            <GlassCard className="p-0 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">{texts.sectionCharger}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{texts.fieldChargerModel}</Label>
                  <p className="text-sm text-muted-foreground/70 py-2">{formData.chargerModel}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{texts.fieldSerialNumber}</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground/70 py-2 flex-1">{formData.serialNumber}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopySerial}
                      className="h-8 w-8 p-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{texts.fieldPinCode}</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground/70 py-2 flex-1 font-mono">
                      {showPin ? formData.pinCode : "••••"}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPin(!showPin)}
                      className="h-8 w-8 p-0"
                    >
                      {showPin ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{texts.fieldHomeFuse}</Label>
                  <Select
                    value={formData.fuse}
                    onValueChange={(value) => handleChange("fuse", value)}
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl border shadow-lg z-50">
                      {fuseOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </GlassCard>
          </AccordionItem>

          {/* Electricity Section */}
          <AccordionItem value="electricity" className="border-0">
            <GlassCard className="p-0 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">{texts.sectionElectricity}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{texts.fieldGridCompany}</Label>
                  <Select
                    value={formData.gridCompany}
                    onValueChange={(value) => handleChange("gridCompany", value)}
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl border shadow-lg z-50">
                      {gridCompanies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{texts.fieldElectricityProvider}</Label>
                  <Select
                    value={formData.electricityProvider}
                    onValueChange={(value) => handleChange("electricityProvider", value)}
                  >
                    <SelectTrigger className="h-10 rounded-xl bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl border shadow-lg z-50">
                      {electricityProviders.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </GlassCard>
          </AccordionItem>

          {/* Security Section */}
          <AccordionItem value="security" className="border-0">
            <GlassCard className="p-0 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="text-sm font-medium">{texts.sectionSecurity}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-xl justify-start"
                  onClick={() => console.log("Change password")}
                >
                  {texts.changePassword}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-xl justify-start"
                  onClick={() => console.log("Share charger")}
                >
                  {texts.shareCharger}
                </Button>
              </AccordionContent>
            </GlassCard>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Bottom Actions */}
      <div className="px-2 py-4 space-y-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="w-full h-12 text-base font-medium rounded-2xl"
          size="lg"
        >
          {texts.save}
        </Button>
        <Button
          variant="ghost"
          className="w-full h-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {texts.logOut}
        </Button>
      </div>
    </div>
  );
}
