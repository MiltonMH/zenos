import { motion } from "framer-motion";

interface HomeBatteryWaterProps {
  batteryLevel: number;
  mode: "idle" | "charging" | "v2h" | "v2g";
}

const clampLevel = (level: number) => Math.max(6, Math.min(100, level));

export function HomeBatteryWater({ batteryLevel, mode }: HomeBatteryWaterProps) {
  if (mode !== "charging") {
    return null;
  }

  const level = clampLevel(batteryLevel);
  const fillHeight = level;
  const chargeFillWidth = 100;
  const fillColor = "hsl(var(--primary) / 0.2)";
  const sweepColor = "hsl(var(--primary) / 0.5)";
  const particleColor = "hsl(var(--primary) / 0.5)";

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <rect
          x="0"
          y="0"
          width="100"
          height={fillHeight}
          fill={fillColor}
        />

        <rect
          x="0"
          y="0"
          width="0"
          height={fillHeight}
          fill={sweepColor}
        >
          <animate
            attributeName="width"
            values={`0;${chargeFillWidth}`}
            dur="5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0 0 0.2 1"
          />
        </rect>
      </motion.svg>

      <div className="absolute inset-0">
        <>
          <motion.div
            className="absolute left-[18%] top-[12%] h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: particleColor }}
            animate={{ x: [0, 28, 54], opacity: [0, 0.7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute left-[62%] top-[18%] h-2 w-2 rounded-full"
            style={{ backgroundColor: particleColor }}
            animate={{ x: [0, 24, 48], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
          />
          <motion.div
            className="absolute left-[78%] top-[9%] h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: particleColor }}
            animate={{ x: [0, 18, 36], opacity: [0, 0.55, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
          />
        </>
      </div>
    </div>
  );
}
