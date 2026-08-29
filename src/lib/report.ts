import { DOMAINS } from "@/content/assessment";
import { LENS_REPORT_LABELS, type VariantId } from "@/content/report";
import { byPriority, type DomainResult, type TierId } from "@/lib/scoring";

export const DOMAIN_BY_ID = new Map(DOMAINS.map((domain) => [domain.id, domain]));

export function domainName(domainId: string): string {
  return DOMAIN_BY_ID.get(domainId)?.name ?? domainId;
}

export type TierCounts = Record<TierId, number>;

export function countTiers(results: DomainResult[]): TierCounts {
  const counts: TierCounts = { critical: 0, high: 0, moderate: 0, sustain: 0 };
  for (const result of results) {
    if (result.tier) counts[result.tier.id] += 1;
  }
  return counts;
}

export type VariantChoice = {
  id: VariantId;
  /** Plain English account of why this variant was chosen, for the admin view. */
  reason: string;
  /** True when no rule matched and the fallback was used. */
  fellBack: boolean;
};

/**
 * Chooses the Patterns and Reflection narrative.
 *
 *   A   two or more domains are Critical Priority
 *   B   fewer than two Critical, and four or more High or Moderate
 *   C   four or more Moderate or Sustain
 *   B wins when both B and C apply.
 *
 * The three rules do not cover every possible spread. One Critical, three
 * High and three Sustain, for example, satisfies none of them. Rather than
 * print no narrative at all, such a school gets Variant B, which is the
 * mixed picture the other two rules are describing either side of.
 */
export function selectVariant(results: DomainResult[]): VariantChoice {
  const counts = countTiers(results);
  const highOrModerate = counts.high + counts.moderate;
  const moderateOrSustain = counts.moderate + counts.sustain;

  if (counts.critical >= 2) {
    return {
      id: "A",
      reason: `${counts.critical} domains at Critical Priority`,
      fellBack: false,
    };
  }

  if (highOrModerate >= 4) {
    return {
      id: "B",
      reason: `${counts.critical} Critical and ${highOrModerate} at High or Moderate`,
      fellBack: false,
    };
  }

  if (moderateOrSustain >= 4) {
    return {
      id: "C",
      reason: `${moderateOrSustain} domains at Moderate or Sustain`,
      fellBack: false,
    };
  }

  return {
    id: "B",
    reason: `no rule matched this spread (${counts.critical} Critical, ${counts.high} High, ${counts.moderate} Moderate, ${counts.sustain} Sustain), so the mixed picture was used`,
    fellBack: true,
  };
}

/**
 * The domain a school should act on first. Where two domains tie on score,
 * the one appearing earlier in the assessment wins, so the choice is stable
 * from one run to the next.
 */
export function lowestScoringDomain(
  results: DomainResult[],
): DomainResult | null {
  const scored = results.filter((result) => result.complete);
  if (scored.length === 0) return null;
  return byPriority(scored)[0];
}

/** Turns ["A", "C"] into "Intent and Outcomes". */
export function lensList(lensIds: ("A" | "B" | "C")[]): string {
  const names = lensIds.map((id) => LENS_REPORT_LABELS[id]);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Replaces {{TOKEN}} placeholders in report copy. */
export function fillTokens(
  text: string,
  tokens: Record<string, string>,
): string {
  return Object.entries(tokens).reduce(
    (result, [token, value]) =>
      result.replaceAll(`{{${token}}}`, value),
    text,
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** For example "29 August 2026". Uses UTC so the date cannot shift by server. */
export function formatReportDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function twoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

/** For example "2026-08-29". */
export function isoDate(date: Date): string {
  return `${date.getUTCFullYear()}-${twoDigits(date.getUTCMonth() + 1)}-${twoDigits(date.getUTCDate())}`;
}

/**
 * Linchpin_Assessment_[SchoolName]_[YYYY-MM-DD].pdf
 *
 * Anything that is not a letter or a digit becomes an underscore, so the name
 * is safe on Windows, macOS and Linux alike and survives being emailed.
 */
export function reportFilename(schoolName: string, date: Date): string {
  const safeName =
    schoolName
      .trim()
      .replace(/[^A-Za-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "School";

  return `Linchpin_Assessment_${safeName}_${isoDate(date)}.pdf`;
}
