import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Ratings } from "@/lib/scoring";
import { resumeSlug } from "@/lib/steps";

/**
 * The entry point to the assessment. It holds no screen of its own. It works
 * out how far a principal has already got and sends them straight there, which
 * is what makes the link in their browser worth keeping.
 */
export default async function AssessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!assessment) notFound();

  const responses = await prisma.response.findMany({
    where: { assessmentId: id },
    select: { questionId: true, rating: true },
  });

  const ratings: Ratings = {};
  for (const response of responses) {
    ratings[response.questionId] = response.rating;
  }

  const slug = resumeSlug(ratings);

  redirect(slug ? `/a/${id}/assess/${slug}` : `/a/${id}/results`);
}
