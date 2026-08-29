import { DOMAINS, TOTAL_QUESTIONS } from "@/content/assessment";
import { prisma } from "./prisma";
import {
  allDomainResults,
  questionsAnswered,
  type Ratings,
} from "./scoring";

/** Reads one assessment's answers into the shape the scoring engine expects. */
export async function loadRatings(assessmentId: string): Promise<Ratings> {
  const responses = await prisma.response.findMany({
    where: { assessmentId },
    select: { questionId: true, rating: true },
  });

  const ratings: Ratings = {};
  for (const response of responses) {
    ratings[response.questionId] = response.rating;
  }
  return ratings;
}

/**
 * Recalculates every domain and writes the results away.
 *
 * This runs after each answer is saved rather than only at the end, so that a
 * principal who abandons the assessment still leaves behind usable scores for
 * the domains they did finish.
 *
 * Domains that are not yet complete have no row at all. That is deliberate:
 * an absent row cannot be mistaken for a partial score.
 */
export async function refreshResults(assessmentId: string): Promise<void> {
  const ratings = await loadRatings(assessmentId);
  const results = allDomainResults(ratings);

  for (const result of results) {
    if (!result.complete || result.score === null || result.tier === null) {
      await prisma.domainScore.deleteMany({
        where: { assessmentId, domainId: result.domainId },
      });
      continue;
    }

    const record = {
      lensAScore: result.lenses[0].score as number,
      lensBScore: result.lenses[1].score as number,
      lensCScore: result.lenses[2].score as number,
      score: result.score,
      tier: result.tier.id,
      gapFlag: result.gapFlag,
      gapLenses: result.gapLenses.join(","),
    };

    await prisma.domainScore.upsert({
      where: {
        assessmentId_domainId: { assessmentId, domainId: result.domainId },
      },
      create: { assessmentId, domainId: result.domainId, ...record },
      update: record,
    });
  }

  await updateCompletion(assessmentId, ratings);
}

/**
 * Marks an assessment finished once all 42 questions carry a rating. The
 * completion time is set once and then left alone, so that editing an answer
 * afterwards does not rewrite history.
 */
async function updateCompletion(
  assessmentId: string,
  ratings: Ratings,
): Promise<void> {
  const finished = questionsAnswered(ratings) === TOTAL_QUESTIONS;

  const current = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { status: true, completedAt: true },
  });
  if (!current) return;

  if (finished && current.status !== "complete") {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: "complete",
        completedAt: current.completedAt ?? new Date(),
      },
    });
    return;
  }

  if (!finished && current.status === "complete") {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: "in_progress" },
    });
  }
}

/** The domains in content order, keyed by id, for joining stored rows back. */
export const DOMAIN_BY_ID = new Map(
  DOMAINS.map((domain) => [domain.id, domain]),
);
