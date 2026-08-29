import {
  DOMAINS,
  type Domain,
  type Lens,
  type LensId,
} from "@/content/assessment";

/**
 * A principal's ratings, keyed by question id. A missing or null value means
 * the question has not been answered.
 */
export type Ratings = Record<string, number | null | undefined>;

export type TierId = "critical" | "high" | "moderate" | "sustain";

export type Tier = {
  id: TierId;
  label: string;
  /** Inclusive bounds, applied to the score rounded to one decimal place. */
  min: number;
  max: number;
};

export const TIERS: readonly Tier[] = [
  { id: "critical", label: "Critical Priority", min: 1.0, max: 1.9 },
  { id: "high", label: "High Priority", min: 2.0, max: 2.5 },
  { id: "moderate", label: "Moderate Priority", min: 2.6, max: 3.2 },
  { id: "sustain", label: "Sustain and Extend", min: 3.3, max: 4.0 },
];

/** Guards against binary floating point drift in comparisons. */
const EPSILON = 1e-9;

/** A lens counts as a gap when it sits this far below its domain score. */
export const GAP_THRESHOLD = 1.0;

export function roundToOneDecimal(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

/** Formats a score the way it is displayed everywhere, for example "2.7". */
export function formatScore(value: number): string {
  return roundToOneDecimal(value).toFixed(1);
}

/**
 * The tier bands are defined on one decimal place and leave deliberate gaps
 * between them, for example nothing sits between 1.9 and 2.0. The score is
 * therefore rounded before it is banded, which makes every possible score
 * land in exactly one tier.
 */
export function tierFor(score: number): Tier | null {
  const rounded = roundToOneDecimal(score);
  return (
    TIERS.find(
      (tier) =>
        rounded >= tier.min - EPSILON && rounded <= tier.max + EPSILON,
    ) ?? null
  );
}

/**
 * Step 1. The average of the two question ratings in a lens.
 * Returns null unless both questions are answered.
 */
export function lensScore(lens: Lens, ratings: Ratings): number | null {
  const first = ratings[lens.questions[0].id];
  const second = ratings[lens.questions[1].id];
  if (first == null || second == null) return null;
  return (first + second) / 2;
}

export type LensResult = {
  lensId: LensId;
  /** Exact average, always a whole number or a half. Null when incomplete. */
  score: number | null;
  complete: boolean;
  /** True when this lens sits a full point or more below the domain score. */
  gap: boolean;
};

export type DomainResult = {
  domainId: string;
  lenses: [LensResult, LensResult, LensResult];
  /** Rounded to one decimal place. Null until all three lenses are complete. */
  score: number | null;
  tier: Tier | null;
  /** Which lenses triggered the gap flag, in lens order. */
  gapLenses: LensId[];
  complete: boolean;
};

/**
 * Steps 2 to 4. A domain score is the equal average of its three lens scores,
 * and is only ever produced when all three lenses are complete. A partial
 * domain score is never returned, by design.
 */
export function domainResult(domain: Domain, ratings: Ratings): DomainResult {
  const scores = domain.lenses.map((lens) => lensScore(lens, ratings));
  const complete = scores.every((score) => score !== null);

  if (!complete) {
    return {
      domainId: domain.id,
      lenses: domain.lenses.map((lens, index) => ({
        lensId: lens.id,
        score: scores[index],
        complete: scores[index] !== null,
        gap: false,
      })) as [LensResult, LensResult, LensResult],
      score: null,
      tier: null,
      gapLenses: [],
      complete: false,
    };
  }

  const present = scores as number[];
  const score = roundToOneDecimal(
    (present[0] + present[1] + present[2]) / 3,
  );

  // The flag is measured against the rounded domain score, which is the number
  // the principal actually sees, so a reader can verify the flag from the
  // printed figures alone.
  const lenses = domain.lenses.map((lens, index) => ({
    lensId: lens.id,
    score: present[index],
    complete: true,
    gap: score - present[index] >= GAP_THRESHOLD - EPSILON,
  })) as [LensResult, LensResult, LensResult];

  return {
    domainId: domain.id,
    lenses,
    score,
    tier: tierFor(score),
    gapLenses: lenses.filter((lens) => lens.gap).map((lens) => lens.lensId),
    complete: true,
  };
}

export function allDomainResults(ratings: Ratings): DomainResult[] {
  return DOMAINS.map((domain) => domainResult(domain, ratings));
}

/** How many of the 21 lens sections have both questions answered. */
export function sectionsComplete(ratings: Ratings): number {
  return DOMAINS.reduce(
    (total, domain) =>
      total +
      domain.lenses.filter((lens) => lensScore(lens, ratings) !== null).length,
    0,
  );
}

/** How many of the 42 questions carry a rating. */
export function questionsAnswered(ratings: Ratings): number {
  return DOMAINS.reduce(
    (total, domain) =>
      total +
      domain.lenses.reduce(
        (lensTotal, lens) =>
          lensTotal +
          lens.questions.filter((question) => ratings[question.id] != null)
            .length,
        0,
      ),
    0,
  );
}
