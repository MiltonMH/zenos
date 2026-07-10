import { useId } from "react";
import { motion } from "framer-motion";

interface HomeBatteryWaterProps {
  batteryLevel: number;
  mode: "idle" | "charging" | "v2h" | "v2g";
}

const clampLevel = (level: number) => Math.max(0, Math.min(100, level));

export function HomeBatteryWater({ batteryLevel, mode }: HomeBatteryWaterProps) {
  const chargedLayerId = useId().replace(/:/g, "");
  const sweepLayerId = `${chargedLayerId}-sweep`;
  const bottomFadeId = `${chargedLayerId}-bottom-fade`;
  const bottomMaskId = `${chargedLayerId}-bottom-mask`;

  if (!["charging", "v2h", "v2g"].includes(mode)) {
    return null;
  }

  const level = clampLevel(batteryLevel);
  const fillHeight = 50;
  const chargedWidth = level;
  const isFullyCharged = chargedWidth >= 100;
  const chargeFillWidth = chargedWidth;
  const isDarkMode =
    typeof document !== "undefined" &&
    (document.documentElement.classList.contains("dark") || document.querySelector(".bg-nocturne") !== null);
  const cornerFadeMask =
    "radial-gradient(145% 145% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0) 100%)";
  const fillColor = "#C5E7E7";
  const unchargedColor = isDarkMode ? "#1E3A5A" : "#FFFFFF";
  const chargedColor = "#C5E7E7";
  const sweepColor = "#99D1D1";
  const unchargedEdgeColor = isDarkMode ? "rgba(30, 58, 90, 0.95)" : "rgba(255, 255, 255, 0.95)";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ WebkitMaskImage: cornerFadeMask, maskImage: cornerFadeMask }}
    >
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <defs>
          <linearGradient id={chargedLayerId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={chargedColor} />
            <stop offset="88%" stopColor={chargedColor} />
            <stop offset="98%" stopColor={unchargedEdgeColor} />
            <stop offset="100%" stopColor={unchargedColor} />
          </linearGradient>
          <linearGradient id={bottomFadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="62%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="86%" stopColor="rgba(255, 255, 255, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <mask id={bottomMaskId}>
            <rect x="0" y="0" width="100" height={fillHeight} fill={`url(#${bottomFadeId})`} />
          </mask>
          <filter id={`${chargedLayerId}-blur`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <linearGradient id={sweepLayerId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={sweepColor} stopOpacity="0.82" />
            <stop offset="82%" stopColor={sweepColor} stopOpacity="0.62" />
            <stop offset="90%" stopColor={sweepColor} stopOpacity="0.5" />
            <stop offset="97%" stopColor={sweepColor} stopOpacity="0.28" />
            <stop offset="100%" stopColor={sweepColor} stopOpacity="0" />
          </linearGradient>
          {/* Static stdDeviation: an animated Gaussian blur forces the browser to
              recompute the filter every frame for as long as charging is active.
              The old pulse (0.75→1.05) was subtle enough that a fixed midpoint
              reads the same while removing a continuous main-thread repaint. */}
          <filter id={`${sweepLayerId}-blur`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.85" />
          </filter>
        </defs>

        <g mask={`url(#${bottomMaskId})`}>
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
            width="100"
            height={fillHeight}
            fill={unchargedColor}
          />

          <rect
            x="0"
            y="0"
            width={chargedWidth}
            height={fillHeight}
            fill={isFullyCharged ? chargedColor : `url(#${chargedLayerId})`}
            filter={isFullyCharged ? undefined : `url(#${chargedLayerId}-blur)`}
          />

          {!isFullyCharged && (
            <rect
              x="0"
              y="0"
              width="0"
              height={fillHeight}
              fill={`url(#${sweepLayerId})`}
              filter={`url(#${sweepLayerId}-blur)`}
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.06;0.92;1"
                dur="3.7s"
                repeatCount="indefinite"
                calcMode="linear"
              />
              <animate
                attributeName="width"
                values={`0;${chargeFillWidth}`}
                dur="3.7s"
                repeatCount="indefinite"
                calcMode="linear"
              />
            </rect>
          )}
        </g>
      </motion.svg>

    </div>
  );
}
