import { Paintbrush, Check } from "lucide-react";
import { backgrounds, type BackgroundOption } from "@/hooks/useBackground";
import { cn } from "@/lib/utils";

interface AppearanceSlideProps {
  selectedBackground: BackgroundOption;
  onBackgroundChange: (bg: BackgroundOption) => void;
}

export function AppearanceSlide({ selectedBackground, onBackgroundChange }: AppearanceSlideProps) {
  return (
    <div className="px-4 py-2 pb-8">
      <h2 className="text-base font-semibold text-foreground text-center mb-4">Anpassa</h2>

      <div className="space-y-3">
        <div className="glass-subtle rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-foreground text-sm">Bakgrund</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onBackgroundChange(bg.id)}
                className={cn(
                  "relative aspect-[9/16] rounded-2xl border-2 transition-all duration-200 overflow-hidden",
                  selectedBackground === bg.id
                    ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                    : "border-white/30 hover:border-white/50"
                )}
              >
                <div className={cn("absolute inset-0", bg.preview)} />
                {selectedBackground === bg.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <span className={cn(
                  "absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-medium",
                  bg.id === "black" ? "text-white" : "text-foreground"
                )}>
                  {bg.label}
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Fler bakgrunder kommer snart
          </p>
        </div>
      </div>
    </div>
  );
}
