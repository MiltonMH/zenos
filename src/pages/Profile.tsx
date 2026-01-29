import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Crown, Zap, Car, Wrench, Pencil, User } from "lucide-react";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { Button } from "@/components/ui/button";
import { EditProfile } from "./EditProfile";

// Mock user data
const mockUser = {
  name: "Max Andersson",
  carModel: "Tesla Model Y",
  email: "max@example.com",
  isPremium: true,
  chargerModel: "Zenion Arc",
  chargerVersion: "2.1.4",
  installer: "ElTech Solutions AB",
};

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

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <EditProfile onBack={() => setIsEditing(false)} />;
  }

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
            label="E-post"
            value={mockUser.email}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
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

        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={Zap}
            label="Laddbox"
            value={mockUser.chargerModel}
            secondaryValue={`Version ${mockUser.chargerVersion}`}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProfileInfoCard
            icon={Car}
            label="Bil"
            value={mockUser.carModel}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
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
          Redigera Profil
        </Button>
      </motion.div>
    </div>
  );
}
