import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Crown, Zap, Car, Wrench, Pencil } from "lucide-react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { Button } from "@/components/ui/button";
import { EditProfile } from "./EditProfile";

// Mock user data
const mockUser = {
  name: "Milton Svensson",
  carModel: "Tesla Model Y",
  email: "milton@example.com",
  isPremium: true,
  chargerModel: "Zenion Arc",
  chargerVersion: "2.1.4",
  installer: "ElTech Solutions AB",
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <EditProfile onBack={() => setIsEditing(false)} />;
  }

  return (
    <div className="flex flex-col h-full px-3 py-3">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <h1 className="text-xl font-semibold text-foreground">{mockUser.name}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{mockUser.carModel}</p>
      </motion.div>

      {/* Information Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProfileInfoCard
            icon={Mail}
            label="E-post"
            value={mockUser.email}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <ProfileInfoCard
            icon={Crown}
            label="Prenumeration"
            value={mockUser.isPremium ? "Premium" : "Gratis"}
            badge={{
              text: mockUser.isPremium ? "Premium" : "Gratis",
              variant: mockUser.isPremium ? "premium" : "free",
            }}
            action={{
              label: mockUser.isPremium ? "Hantera" : "Uppgradera",
              onClick: () => console.log("Subscription action"),
              variant: mockUser.isPremium ? "secondary" : "default",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProfileInfoCard
            icon={Zap}
            label="Laddbox"
            value={mockUser.chargerModel}
            secondaryValue={`Version ${mockUser.chargerVersion}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <ProfileInfoCard
            icon={Car}
            label="Bil"
            value={mockUser.carModel}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProfileInfoCard
            icon={Wrench}
            label="Installatör"
            value={mockUser.installer}
            action={{
              label: "Kontakta",
              onClick: () => console.log("Contact installer"),
              variant: "secondary",
            }}
          />
        </motion.div>
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="pt-2"
      >
        <Button
          onClick={() => setIsEditing(true)}
          className="w-full h-10 text-sm font-medium rounded-2xl"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Redigera Profil
        </Button>
      </motion.div>
    </div>
  );
}
