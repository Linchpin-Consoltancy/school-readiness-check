import { MARK } from "@/content/brand";

/**
 * The Linchpin mark and wordmark.
 *
 * The mark is drawn from the geometry in the supplied artwork, so it is sharp
 * at every size and needs no network request. The wordmark is set in real
 * Jost at the weights and letter spacing the logo files specify, rather than
 * as SVG text, which would depend on the viewer having the typeface.
 */
export function Brandmark({
  reversed = false,
  className = "",
}: {
  /** For a dark background: the outline turns ivory. */
  reversed?: boolean;
  className?: string;
}) {
  const stroke = reversed ? "#FDFBF8" : "#1B3040";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        aria-hidden
        viewBox={MARK.viewBox}
        className="h-7 w-auto shrink-0 sm:h-8"
        fill="none"
      >
        <circle
          cx={MARK.ring.cx}
          cy={MARK.ring.cy}
          r={MARK.ring.r}
          stroke={stroke}
          strokeWidth={MARK.strokeWidth}
        />
        <circle
          cx={MARK.core.cx}
          cy={MARK.core.cy}
          r={MARK.core.r}
          fill="#C07B2A"
        />
        <line
          x1={MARK.stem.x1}
          y1={MARK.stem.y1}
          x2={MARK.stem.x2}
          y2={MARK.stem.y2}
          stroke={stroke}
          strokeWidth={MARK.strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={MARK.legLeft}
          stroke={stroke}
          strokeWidth={MARK.strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={MARK.legRight}
          stroke={stroke}
          strokeWidth={MARK.strokeWidth}
          strokeLinecap="round"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`text-[0.92rem] font-semibold sm:text-[1.02rem] ${
            reversed ? "text-ivory" : "text-onyx"
          }`}
          style={{ letterSpacing: "0.1em" }}
        >
          LINCHPIN
        </span>
        <span
          className="mt-[0.28rem] text-[0.5rem] text-amber sm:text-[0.55rem]"
          style={{ letterSpacing: "0.32em" }}
        >
          EDUCATION
        </span>
      </span>
    </span>
  );
}
