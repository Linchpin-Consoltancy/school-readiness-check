"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { ALL_QUESTION_IDS, TOTAL_QUESTIONS } from "@/content/assessment";
import { prisma } from "@/lib/prisma";
import { profileSchema, type SubmitResult } from "@/lib/profile";
import { refreshResults } from "@/lib/results";

/** The id doubles as the private link to the report, so it is generated with
 *  cryptographic randomness rather than a guessable counter. */
function newAssessmentId(): string {
  return randomBytes(18).toString("base64url");
}

const VALID_QUESTION_IDS = new Set(ALL_QUESTION_IDS);

/**
 * Everything is written in one go, at the end, because that is when the
 * director hands over their details. Until then the answers live only in
 * their own browser.
 */
export async function submitAssessment(
  rawProfile: unknown,
  rawAnswers: unknown,
): Promise<SubmitResult> {
  const parsed = profileSchema.safeParse(rawProfile);

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  /* --- the answers have to be complete and in range --------------------- */

  if (typeof rawAnswers !== "object" || rawAnswers === null) {
    return {
      ok: false,
      errors: { form: ["Your answers did not arrive. Please try again."] },
    };
  }

  const answers = rawAnswers as Record<string, unknown>;

  for (const key of Object.keys(answers)) {
    if (!VALID_QUESTION_IDS.has(key)) {
      return {
        ok: false,
        errors: { form: ["Your answers did not arrive. Please try again."] },
      };
    }
  }

  const clean: { questionId: string; rating: number }[] = [];

  for (const questionId of ALL_QUESTION_IDS) {
    const rating = answers[questionId];
    if (
      !Number.isInteger(rating) ||
      (rating as number) < 1 ||
      (rating as number) > 4
    ) {
      return {
        ok: false,
        errors: {
          form: ["Some answers are missing. Please go back and finish them."],
        },
      };
    }
    clean.push({ questionId, rating: rating as number });
  }

  if (clean.length !== TOTAL_QUESTIONS) {
    return {
      ok: false,
      errors: {
        form: ["Some answers are missing. Please go back and finish them."],
      },
    };
  }

  /* --- write it away ---------------------------------------------------- */

  const assessmentId = newAssessmentId();

  try {
    await prisma.$transaction([
      prisma.assessment.create({
        data: {
          id: assessmentId,
          ...parsed.data,
          status: "complete",
          completedAt: new Date(),
        },
      }),
      prisma.response.createMany({
        data: clean.map((answer) => ({ assessmentId, ...answer })),
      }),
    ]);

    await refreshResults(assessmentId);
  } catch {
    return {
      ok: false,
      errors: {
        form: ["We could not save your results just now. Please try again."],
      },
    };
  }

  return { ok: true, assessmentId };
}
