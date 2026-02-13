import { ArrowLeft } from "lucide-react";
import { SettingsCarousel } from "@/components/settings/SettingsCarousel";

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
        <button 
          onClick={onBack}
          className="p-2.5 glass-subtle rounded-2xl text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Inställningar</h1>
        <div className="w-11" />
      </div>

      {/* Carousel Content */}
      <SettingsCarousel />
    </div>
  );
}
