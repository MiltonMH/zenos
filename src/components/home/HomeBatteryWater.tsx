import { useId } from "react";
import { motion } from "framer-motion";

interface HomeBatteryWaterProps {
  batteryLevel: number;
  mode: "idle" | "charging" | "v2h" | "v2g";
}

const clampLevel = (level: number) => Math.max(0, Math.min(100, level));

export function HomeBatteryWater({ batteryLevel, mode }: HomeBatteryWaterProps) {
  if (!["charging", "v2h", "v2g"].includes(mode)) {
    return null;
  }

  const chargedLayerId = useId().replace(/:/g, "");
  const sweepLayerId = `${chargedLayerId}-sweep`;
  const bottomFadeId = `${chargedLayerId}-bottom-fade`;
  const bottomMaskId = `${chargedLayerId}-bottom-mask`;
  const level = clampLevel(batteryLevel);
  const fillHeight = 50;
  const chargedWidth = level;
  const isFullyCharged = chargedWidth >= 100;
  const chargeFillWidth = chargedWidth;
  const cornerFadeMask =
    "radial-gradient(145% 145% at 50% 50%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0) 100%)";
  const fillColor = "hsl(var(--primary) / 0.2)";
  const unchargedColor = "rgba(255, 255, 255, 0.9)";
  const chargedColor = "hsl(var(--primary) / 0.34)";
  const sweepColor = "hsl(var(--primary) / 0.5)";

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
            <stop offset="98%" stopColor="rgba(255, 255, 255, 0.95)" />
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
            <stop offset="0%" stopColor={sweepColor} stopOpacity="0.95" />
            <stop offset="72%" stopColor={sweepColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={sweepColor} stopOpacity="0" />
          </linearGradient>
          <filter id={`${sweepLayerId}-blur`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.9" />
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
                attributeName="width"
                values={`0;${chargeFillWidth}`}
                dur="5s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0 0 0.2 1"
              />
            </rect>
          )}
        </g>
      </motion.svg>

    </div>
  );
}
