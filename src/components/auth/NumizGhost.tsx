import type { CSSProperties } from "react";

/**
 * The Numiz mascot — a small CSS ghost/blob that glows in the active theme's
 * color. Pure CSS, no images: a glow layer, a morphing body, two eyes.
 *
 * Render ONE instance for the whole auth flow (outside the per-screen
 * AnimatePresence swap) and just change x/y/size/opacity as the screen
 * changes — the CSS transition below handles the glide between spots, so it
 * reads as one character following the user through onboarding rather than
 * a fresh orb appearing on each screen.
 */
export interface NumizGhostProps {
  /** Center x, as a percentage of the containing block's width (0–100). */
  x: number;
  /** Center y, as a percentage of the containing block's height (0–100). */
  y: number;
  /** Diameter, as a percentage of the containing block's width (0–100) — face, glow and shadow scale with it. */
  size: number;
  /** 0–1 */
  opacity?: number;
  /** Active theme's glow color, e.g. #6fdccb (Mint) */
  glow: string;
}

const EASE = "cubic-bezier(.3, 1, .35, 1)"; // soft "glide and land"

export function NumizGhost({ x, y, size, opacity = 0.95, glow }: NumizGhostProps) {
  const wrapper: CSSProperties = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}%`,
    aspectRatio: "1 / 1",
    transform: "translate(-50%, -50%)",
    opacity,
    zIndex: 3,
    pointerEvents: "none", // decorative — never blocks a tap
    transition: `left 1.1s ${EASE}, top 1.1s ${EASE}, width 1.1s ${EASE}, opacity 0.9s ease`,
  };

  // The glow sits still behind the body so the light doesn't "shake" with it.
  const glowLayer: CSSProperties = {
    position: "absolute",
    inset: "8%",
    borderRadius: "50%",
    boxShadow: `0 0 min(28vw, 110px) min(11vw, 45px) ${glow}59`,
    background: `radial-gradient(circle, ${glow}40 0%, rgba(255,255,255,0) 70%)`,
  };

  const body: CSSProperties = {
    position: "absolute",
    inset: "2% 5% 8% 5%",
    borderRadius: "52% 48% 46% 54% / 62% 64% 38% 40%",
    background: `linear-gradient(180deg, #ffffff 48%, ${glow}4d 100%)`,
    boxShadow: "0 6px 18px rgba(40, 80, 70, 0.16)",
  };

  const eye: CSSProperties = {
    position: "absolute",
    top: "32%",
    width: "15%",
    height: "19%",
    borderRadius: "50%",
    background: "#23262e",
  };

  const glint: CSSProperties = {
    position: "absolute",
    left: "20%",
    top: "14%",
    width: "40%",
    height: "36%",
    borderRadius: "50%",
    background: "#ffffff",
  };

  const mouth: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "57%",
    width: "15%",
    height: "7%",
    transform: "translateX(-50%)",
    background: "#23262e",
    borderRadius: "0 0 999px 999px",
  };

  return (
    <div style={wrapper} aria-hidden>
      <div style={glowLayer} />
      <div className="numiz-ghost-body" style={body}>
        <div style={{ ...eye, left: "25%" }}>
          <div style={glint} />
        </div>
        <div style={{ ...eye, right: "25%" }}>
          <div style={glint} />
        </div>
        <div style={mouth} />
      </div>
    </div>
  );
}
