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
  /** The single source of truth for this tier's colour. The stylesheet and
   *  the PDF report both take their value from here. */
  color: string;
};

export const TIERS: readonly Tier[] = [
  {
    id: "critical",
    label: "Critical Priority",
    min: 1.0,
    max: 1.9,
    color: "#C0392B",
  },
  {
    id: "high",
    label: "High Priority",
    min: 2.0,
    max: 2.5,
    color: "#C07B2A",
  },
  {
    id: "moderate",
    label: "Moderate Priority",
    min: 2.6,
    max: 3.2,
    color: "#4A6A28",
  },
  {
    id: "sustain",
    label: "Sustain and Extend",
    min: 3.3,
    max: 4.0,
    color: "#2E5A7A",
  },
];

/** Guards against binary floating point drift in comparisons. */
const EPSILON = 1e-9;

/** A lens is flagged when it differs from its domain score by this much. */
export const GAP_THRESHOLD = 1.0;

export function roundToOneDecimal(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

/** Formats a score the way it is displayed everywhere, for example "2.2". */
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
      (tier) => rounded >= tier.min - EPSILON && rounded <= tier.max + EPSILON,
    ) ?? null
  );
}

export function tierById(id: string): Tier | null {
  return TIERS.find((tier) => tier.id === id) ?? null;
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
  /** True when this lens differs from the domain score by a full point. */
  gap: boolean;
};

export type DomainResult = {
  domainId: string;
  lenses: [LensResult, LensResult, LensResult];
  /** Full precision, as stored. Null until all three lenses are complete. */
  score: number | null;
  /** Rounded to one decimal place, as displayed and as banded into a tier. */
  displayScore: number | null;
  tier: Tier | null;
  gapFlag: boolean;
  /** Which lenses triggered the gap flag, in lens order. */
  gapLenses: LensId[];
  complete: boolean;
};

/**
 * Steps 2 to 4. A domain score is the equal average of its three lens scores,
 * and is only ever produced when all three lenses are complete. A partial
 * domain score is never returned, by design.
 *
 * The gap flag uses the absolute difference, so a lens that sits a full point
 * ABOVE its domain score is flagged just as one that sits a full point below.
 *
 * Both the tier and the gap are measured against the rounded score, because
 * that is the number printed in the report. A reader can therefore check
 * every tier and every flag using only the figures in front of them.
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
      displayScore: null,
      tier: null,
      gapFlag: false,
      gapLenses: [],
      complete: false,
    };
  }

  const present = scores as number[];
  const score = (present[0] + present[1] + present[2]) / 3;
  const displayScore = roundToOneDecimal(score);

  const lenses = domain.lenses.map((lens, index) => ({
    lensId: lens.id,
    score: present[index],
    complete: true,
    gap:
      Math.abs(present[index] - displayScore) >= GAP_THRESHOLD - EPSILON,
  })) as [LensResult, LensResult, LensResult];

  const gapLenses = lenses.filter((lens) => lens.gap).map((lens) => lens.lensId);

  return {
    domainId: domain.id,
    lenses,
    score,
    displayScore,
    tier: tierFor(displayScore),
    gapFlag: gapLenses.length > 0,
    gapLenses,
    complete: true,
  };
}

export function allDomainResults(ratings: Ratings): DomainResult[] {
  return DOMAINS.map((domain) => domainResult(domain, ratings));
}

/**
 * The domains ordered for the results dashboard, most urgent first. Sorting on
 * the score alone achieves this, because the tiers are bands of that score.
 * Domains with equal scores keep their original order.
 */
export function byPriority(results: DomainResult[]): DomainResult[] {
  return [...results].sort((first, second) => {
    const a = first.displayScore ?? Number.POSITIVE_INFINITY;
    const b = second.displayScore ?? Number.POSITIVE_INFINITY;
    return a - b;
  });
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
