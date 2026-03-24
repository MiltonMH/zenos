import { useId } from "react";
import { motion } from "framer-motion";

interface HomeBatteryWaterProps {
  batteryLevel: number;
  mode: "idle" | "charging" | "v2h" | "v2g";
}

const clampLevel = (level: number) => Math.max(6, Math.min(100, level));

function getWaveAmplitude(level: number) {
  return Math.max(0, Math.min(2.2, (100 - level) * 0.04));
}

function createWavePath(level: number, amplitude: number, variant: 0 | 1 | 2) {
  const surfaceY = 100 - level;
  const crest = Math.max(0, surfaceY - amplitude);
  const trough = Math.min(100, surfaceY + amplitude);

  if (variant === 0) {
    return `M0 ${surfaceY} C12 ${crest}, 24 ${crest}, 38 ${surfaceY} C52 ${trough}, 66 ${trough}, 80 ${surfaceY} C90 ${crest}, 96 ${crest}, 100 ${surfaceY} L100 100 L0 100 Z`;
  }

  if (variant === 1) {
    return `M0 ${surfaceY} C10 ${trough}, 22 ${trough}, 36 ${surfaceY} C50 ${crest}, 64 ${crest}, 78 ${surfaceY} C90 ${trough}, 96 ${trough}, 100 ${surfaceY} L100 100 L0 100 Z`;
  }

  return `M0 ${surfaceY} C14 ${crest}, 28 ${trough}, 42 ${surfaceY} C56 ${crest}, 70 ${trough}, 84 ${surfaceY} C92 ${crest}, 98 ${crest}, 100 ${surfaceY} L100 100 L0 100 Z`;
}

function createWaveLinePath(level: number, amplitude: number, variant: 0 | 1 | 2) {
  const surfaceY = 100 - level;
  const crest = Math.max(0, surfaceY - amplitude);
  const trough = Math.min(100, surfaceY + amplitude);

  if (variant === 0) {
    return `M0 ${surfaceY} C12 ${crest}, 24 ${crest}, 38 ${surfaceY} C52 ${trough}, 66 ${trough}, 80 ${surfaceY} C90 ${crest}, 96 ${crest}, 100 ${surfaceY}`;
  }

  if (variant === 1) {
    return `M0 ${surfaceY} C10 ${trough}, 22 ${trough}, 36 ${surfaceY} C50 ${crest}, 64 ${crest}, 78 ${surfaceY} C90 ${trough}, 96 ${trough}, 100 ${surfaceY}`;
  }

  return `M0 ${surfaceY} C14 ${crest}, 28 ${trough}, 42 ${surfaceY} C56 ${crest}, 70 ${trough}, 84 ${surfaceY} C92 ${crest}, 98 ${crest}, 100 ${surfaceY}`;
}

export function HomeBatteryWater({ batteryLevel, mode }: HomeBatteryWaterProps) {
  const waveClipId = useId().replace(/:/g, "");
  const level = clampLevel(batteryLevel);
  const surfaceY = 100 - level;
  const isCharging = mode === "charging";
  const isDischarging = mode === "v2h" || mode === "v2g";
  const amplitude = getWaveAmplitude(level);
  const wavePaths = [
    createWavePath(level, amplitude, 0),
    createWavePath(level, amplitude, 1),
    createWavePath(level, amplitude, 2),
  ];
  const waveLoop = [wavePaths[0], wavePaths[1], wavePaths[2], wavePaths[1], wavePaths[0]];
  const waveLineLoop = [
    createWaveLinePath(level, amplitude, 0),
    createWaveLinePath(level, amplitude, 1),
    createWaveLinePath(level, amplitude, 2),
    createWaveLinePath(level, amplitude, 1),
    createWaveLinePath(level, amplitude, 0),
  ];

  const chargeFillStart = 100;
  const chargeFillEnd = Math.max(surfaceY - amplitude, 2);
  const chargeFillHeight = chargeFillStart - chargeFillEnd;

  const fillColor = isDischarging
    ? "hsl(var(--energy-v2g) / 0.2)"
    : "hsl(var(--primary) / 0.2)";
  const glowColor = isDischarging ? "hsl(var(--energy-v2g) / 0.1)" : "hsl(var(--primary) / 0.12)";

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: mode === "idle" ? 0.92 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 -8px 24px ${glowColor})` }}
      >
        <defs>
          <clipPath id={waveClipId}>
            <motion.path
              initial={{ d: wavePaths[0] }}
              animate={{ d: waveLoop }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
          </clipPath>
        </defs>

        <motion.path
          initial={{ d: wavePaths[0] }}
          animate={{ d: waveLoop }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          fill={fillColor}
        />

        <motion.path
          initial={{ d: waveLineLoop[0] }}
          animate={{ d: waveLineLoop }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          fill="none"
          stroke="rgba(255, 255, 255, 0.78)"
          strokeWidth="0.18"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {isCharging && (
          <rect
            clipPath={`url(#${waveClipId})`}
            x="0"
            y={chargeFillStart}
            width="100"
            height="0"
            fill="hsl(var(--primary) / 0.55)"
            opacity="0.72"
          >
            <animate
              attributeName="y"
              values={`${chargeFillStart};${chargeFillEnd}`}
              dur="5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0 0 0.2 1"
            />
            <animate
              attributeName="height"
              values={`0;${chargeFillHeight}`}
              dur="5s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0 0 0.2 1"
            />
          </rect>
        )}
      </motion.svg>

      <div className="absolute inset-0">
        {isCharging && (
          <>
            <motion.div
              className="absolute left-[18%] top-[58%] h-2.5 w-2.5 rounded-full bg-white/22"
              animate={{ y: [0, -18, -36], opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute left-[62%] top-[64%] h-2 w-2 rounded-full bg-white/18"
              animate={{ y: [0, -16, -34], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
            />
            <motion.div
              className="absolute left-[78%] top-[54%] h-1.5 w-1.5 rounded-full bg-white/20"
              animate={{ y: [0, -14, -28], opacity: [0, 0.55, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
            />
          </>
        )}
      </div>
    </div>
  );
}
