/**
 * The mascot's journey — position, size and opacity per stage of the auth
 * flow, as percentages of the screen (converted from the reference 393×852
 * phone frame in the design handoff, so it scales proportionally to any
 * real device size instead of assuming one fixed viewport).
 *
 * Rule: big when the mascot has the stage (start, welcome-celebration),
 * small when the user should focus on something else (the question steps).
 * It never disappears — it just moves.
 */
export interface GhostSpot {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export type GhostStage = "start" | "login" | "flow" | "welcome" | "home";

const frame = { w: 393, h: 852 };
const pct = (x: number, y: number, size: number, opacity: number): GhostSpot => ({
  x: Math.round((x / frame.w) * 10000) / 100,
  y: Math.round((y / frame.h) * 10000) / 100,
  size: Math.round((size / frame.w) * 10000) / 100,
  opacity,
});

export const GHOST_JOURNEY: Record<GhostStage, GhostSpot> = {
  /** Welcome screen — the hero on stage, above the wordmark */
  start: pct(196, 255, 150, 0.95),
  /** Login — steps aside, waits politely above the heading */
  login: pct(196, 155, 70, 0.85),
  /** Every onboarding question ("the room") — small, above the question, out of the way */
  flow: pct(196, 128, 58, 0.9),
  /** "Welcome in" celebration — grows and takes center stage */
  welcome: pct(196, 330, 190, 1),
  /** Real home screen — shrinks and lands top-right; it lives in the app now */
  home: pct(332, 76, 36, 0.85),
};

/**
 * One small resting spot per onboarding question — all close to the base
 * "flow" spot (small, above the field, never in the way) but each a little
 * different, so the mascot visibly re-settles each time you move to a new
 * question instead of sitting dead-still for all six steps.
 */
export const GHOST_FLOW_STEPS: GhostSpot[] = [
  pct(196, 128, 58, 0.9), // theme
  pct(160, 108, 52, 0.88), // name
  pct(232, 118, 62, 0.92), // email
  pct(168, 132, 54, 0.88), // phone
  pct(226, 104, 60, 0.9), // address
  pct(196, 122, 56, 0.9), // password
];
