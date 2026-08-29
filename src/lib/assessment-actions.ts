"use server";

import { revalidatePath } from "next/cache";
import { ALL_QUESTION_IDS } from "@/content/assessment";
import { prisma } from "@/lib/prisma";

export type SaveResult = { ok: boolean };

const VALID_QUESTION_IDS = new Set(ALL_QUESTION_IDS);
const MAX_NOTE_LENGTH = 2000;

/**
 * Anyone holding the assessment link may write to that assessment. That is the
 * design, since principals do not have passwords. What still has to be checked
 * is that the link points at a real assessment and that the payload is sane,
 * because both arrive from the browser and neither can be trusted.
 */
async function assessmentExists(assessmentId: string): Promise<boolean> {
  const found = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { id: true },
  });
  return found !== null;
}

export async function saveRating(
  assessmentId: string,
  questionId: string,
  rating: number,
): Promise<SaveResult> {
  if (!VALID_QUESTION_IDS.has(questionId)) return { ok: false };
  if (!Number.isInteger(rating) || rating < 1 || rating > 4) {
    return { ok: false };
  }
  if (!(await assessmentExists(assessmentId))) return { ok: false };

  try {
    // An update touches only the rating, so a note already written against
    // this question is left alone.
    await prisma.response.upsert({
      where: { assessmentId_questionId: { assessmentId, questionId } },
      create: { assessmentId, questionId, rating },
      update: { rating },
    });
  } catch {
    return { ok: false };
  }

  revalidatePath(`/a/${assessmentId}`, "layout");
  return { ok: true };
}

export async function saveNote(
  assessmentId: string,
  questionId: string,
  note: string,
): Promise<SaveResult> {
  if (!VALID_QUESTION_IDS.has(questionId)) return { ok: false };
  if (typeof note !== "string") return { ok: false };
  if (!(await assessmentExists(assessmentId))) return { ok: false };

  const trimmed = note.trim().slice(0, MAX_NOTE_LENGTH);
  const value = trimmed.length > 0 ? trimmed : null;

  try {
    await prisma.response.upsert({
      where: { assessmentId_questionId: { assessmentId, questionId } },
      create: { assessmentId, questionId, note: value },
      update: { note: value },
    });
  } catch {
    return { ok: false };
  }

  revalidatePath(`/a/${assessmentId}`, "layout");
  return { ok: true };
}
