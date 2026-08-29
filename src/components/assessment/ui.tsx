import type { TierId } from "@/lib/scoring";

/* Shared styling for the assessment screens, defined once so that every
   screen in the flow looks like part of the same instrument. */

export const primaryButton =
  "inline-flex items-center justify-center rounded-[3px] bg-onyx px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-onyx/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:cursor-not-allowed disabled:bg-onyx/30";

export const secondaryButton =
  "inline-flex items-center justify-center rounded-[3px] border border-onyx/25 px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-onyx transition-colors hover:border-onyx/50 hover:bg-onyx/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:cursor-not-allowed disabled:opacity-40";

export const eyebrowText =
  "text-[0.68rem] font-medium uppercase tracking-[0.26em] text-amber";

export const contextText =
  "text-[0.66rem] uppercase tracking-[0.22em] text-dusk";

/** Tier colours. Written out in full because Tailwind reads class names
 *  literally and cannot resolve one that is assembled at runtime. */
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

export function ProgressBar({
  complete,
  total,
}: {
  complete: number;
  total: number;
}) {
  const percent = total === 0 ? 0 : (complete / total) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className={contextText}>
          {complete} of {total} sections complete
        </span>
        <span className="font-display text-[1.05rem] leading-none text-onyx">
          {Math.round(percent)}%
        </span>
      </div>
      <div
        className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-onyx/12"
        role="progressbar"
        aria-valuenow={complete}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${complete} of ${total} sections complete`}
      >
        <div
          className="h-full rounded-full bg-amber transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/** The small "D01 Instructional Leadership / Lens A" line above a screen. */
export function ContextLine({
  domainCode,
  domainName,
  lensLabel,
}: {
  domainCode: string;
  domainName: string;
  lensLabel?: string;
}) {
  return (
    <p className={contextText}>
      <span className="text-amber">{domainCode}</span>
      <span className="px-2 text-dusk/50">/</span>
      {domainName}
      {lensLabel ? (
        <>
          <span className="px-2 text-dusk/50">/</span>
          {lensLabel}
        </>
      ) : null}
    </p>
  );
}
