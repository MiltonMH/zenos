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
  /** "shy" = eyes closed — used for the one beat where the mascot looks away. */
  expression?: "open" | "shy";
}

export type GhostStage = "start" | "login" | "flow" | "welcome" | "home";

const frame = { w: 393, h: 852 };
const pct = (x: number, y: number, size: number, opacity: number, expression?: "open" | "shy"): GhostSpot => ({
  x: Math.round((x / frame.w) * 10000) / 100,
  y: Math.round((y / frame.h) * 10000) / 100,
  size: Math.round((size / frame.w) * 10000) / 100,
  opacity,
  expression,
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
 * One resting spot per onboarding question. Unlike the old version (a tight
 * jitter around one point), these swing genuinely closer/further and
 * left/right between steps — bigger + more opaque reads as "flying in close
 * to you", smaller + fainter reads as "drifting further away" — so the
 * mascot visibly travels each time you move to a new question instead of
 * just nudging in place. Stays above the field/button either way.
 */
export const GHOST_FLOW_STEPS: GhostSpot[] = [
  pct(196, 140, 72, 0.95), // theme — front and center, introducing itself
  pct(112, 108, 48, 0.8), // name — drifts left, a little shy getting to know you
  pct(292, 132, 68, 0.94), // email — swoops in close on the right, practical
  pct(96, 168, 42, 0.72), // phone — floats further off, upper-left, smaller
  pct(302, 92, 40, 0.7), // address — flies far to the upper-right, distant, curious
  pct(345, 34, 22, 0.32, "shy"), // password — shrinks away to the top-right corner (clear of the back arrow), eyes closed: doesn't want to peek
];
