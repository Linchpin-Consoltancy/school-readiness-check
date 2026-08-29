import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { primaryButton, secondaryButton } from "@/components/assessment/ui";
import { TOTAL_QUESTIONS } from "@/content/assessment";
import { prisma } from "@/lib/prisma";
import { questionsAnswered, type Ratings } from "@/lib/scoring";
import { STEPS, stepHref } from "@/lib/steps";

/** Placeholder. The full results screen and PDF report are Stages 3 and 4. */
export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    select: { schoolName: true },
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

  const answered = questionsAnswered(ratings);
  const finished = answered === TOTAL_QUESTIONS;

  return (
    <PageShell eyebrow="Results">
      <div className="mx-auto w-full max-w-2xl px-6 py-20 text-center">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-amber">
          {finished ? "Assessment complete" : "Stage 3"}
        </p>

        <h1 className="mt-6 font-display text-[2.2rem] leading-tight text-onyx sm:text-4xl">
          {finished ? "You have answered every question" : "Your results go here"}
        </h1>

        <p className="mx-auto mt-6 max-w-[46ch] text-[0.96rem] leading-[1.75] text-charcoal/85">
          {finished
            ? `All ${TOTAL_QUESTIONS} answers for ${assessment.schoolName} are saved. The results screen and the PDF report are the next stages of the build.`
            : `You have answered ${answered} of ${TOTAL_QUESTIONS} questions. The results screen and the PDF report are the next stages of the build.`}
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={
              finished ? stepHref(id, STEPS[0]) : `/a/${id}/assess`
            }
            className={primaryButton}
          >
            {finished ? "Review my answers" : "Continue the assessment"}
          </Link>
          <Link href={`/a/${id}/welcome`} className={secondaryButton}>
            Instructions
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
