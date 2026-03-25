import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bolt,
  Cable,
  Headphones,
  Info,
  Leaf,
  Power,
  Sun,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SettingsProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsProps) {
  const [ecoModeEnabled, setEcoModeEnabled] = useState(true);
  const [v2gEnabled, setV2gEnabled] = useState(false);
  const [chargeLimit, setChargeLimit] = useState(65);

  return (
    <div className="flex h-full flex-col px-4 pt-5 pb-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between"
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/35 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-white/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <div className="h-10 w-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-3 rounded-[2rem] border border-white/45 bg-gradient-to-br from-white/40 via-white/20 to-[#d8deff]/45 p-5 shadow-[0_10px_30px_-20px_rgba(20,30,60,0.55)]"
      >
        <p className="text-center text-2xl font-semibold tracking-wide text-foreground/90">V2H - Max Charge</p>
        <div className="mt-7 px-2">
          <div className="relative h-8 rounded-full border border-white/70 bg-white/55 shadow-inner">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#45d4be] via-[#57dfc9] to-[#8de5da]"
              style={{ width: `${chargeLimit}%` }}
            />
            <div
              className="absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-white/80 bg-[#f2f6ff] shadow-[0_6px_16px_-6px_rgba(25,35,70,0.6)]"
              style={{ left: `calc(${chargeLimit}% - 20px)` }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full border border-[#cfd8ff] bg-white/80 text-[#9ca8dd]">
                <Bolt className="h-5 w-5" />
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-2xl font-semibold text-foreground/70">{chargeLimit}%</p>
          <input
            type="range"
            min={20}
            max={100}
            value={chargeLimit}
            onChange={(event) => setChargeLimit(Number(event.target.value))}
            className="mt-2 h-1 w-full cursor-pointer opacity-0"
            aria-label="Charge limit"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-[2rem] border border-white/45 bg-gradient-to-br from-white/35 via-[#dce1f5]/45 to-[#9ce0d4]/40"
      >
        <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
          <div className="flex items-center gap-4">
            <Leaf className="h-7 w-7 text-white" />
            <span className="text-xl font-medium text-foreground/90">Eco / Smart function</span>
          </div>
          <Switch checked={ecoModeEnabled} onCheckedChange={setEcoModeEnabled} />
        </div>

        <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
          <div className="flex items-center gap-4">
            <Cable className="h-7 w-7 text-white" />
            <span className="text-xl font-medium text-foreground/90">V2G - Vehicle To Grid</span>
          </div>
          <Switch checked={v2gEnabled} onCheckedChange={setV2gEnabled} />
        </div>

        <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
          <div className="flex items-center gap-4">
            <Sun className="h-7 w-7 text-white" />
            <span className="text-xl font-medium text-foreground/90">Indicator Light</span>
          </div>
          <div className="rounded-full border border-white/55 bg-white/35 px-3 py-1 text-sm font-medium text-foreground/70">
            Status
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
          <div className="flex items-center gap-4">
            <Power className="h-7 w-7 text-white" />
            <span className="text-xl font-medium text-foreground/90">Restart charger</span>
          </div>
          <div className="text-right text-xs text-foreground/55">
            <p>Last restart:</p>
            <p>2026-01-18 - 09:23</p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-4 border-b border-white/40 px-5 py-4 text-left"
        >
          <Headphones className="h-7 w-7 text-white" />
          <span className="text-xl font-medium text-foreground/90">Support</span>
        </button>

        <button type="button" className="flex w-full items-center gap-4 px-5 py-4 text-left">
          <Info className="h-7 w-7 text-white" />
          <span className="text-xl font-medium text-foreground/90">About</span>
        </button>
      </motion.div>
    </div>
  );
}
