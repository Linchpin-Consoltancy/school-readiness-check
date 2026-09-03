import type { TierId } from "@/lib/scoring";

/* Styling shared across the whole experience, defined once so every screen
   looks like part of the same instrument. */

export const primaryButton =
  "inline-flex items-center justify-center rounded-[3px] bg-onyx px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-onyx/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:cursor-not-allowed disabled:bg-onyx/30";

export const secondaryButton =
  "inline-flex items-center justify-center rounded-[3px] border border-onyx/25 px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-onyx transition-colors hover:border-onyx/50 hover:bg-onyx/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:cursor-not-allowed disabled:opacity-40";

export const quietButton =
  "inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-dusk transition-colors hover:text-onyx focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:opacity-40";

export const eyebrowText =
  "text-[0.68rem] font-medium uppercase tracking-[0.26em] text-amber";

export const contextText =
  "text-[0.66rem] uppercase tracking-[0.22em] text-dusk";

/** Tier colours, written out in full because Tailwind reads class names
 *  literally and cannot resolve one assembled at runtime. */
export const TIER_STYLES: Record<
  TierId,
  { text: string; border: string; background: string; dot: string }
> = {
  critical: {
    text: "text-critical",
    border: "border-critical/30",
    background: "bg-critical/[0.06]",
    dot: "bg-critical",
  },
  high: {
    text: "text-high",
    border: "border-high/30",
    background: "bg-high/[0.06]",
    dot: "bg-high",
  },
  moderate: {
    text: "text-moderate",
    border: "border-moderate/30",
    background: "bg-moderate/[0.06]",
    dot: "bg-moderate",
  },
  sustain: {
    text: "text-sustain",
    border: "border-sustain/30",
    background: "bg-sustain/[0.06]",
    dot: "bg-sustain",
  },
};
