import { notFound } from "next/navigation";
import { LENS_DEFINITIONS } from "@/content/assessment";
import { DomainReview } from "@/components/assessment/DomainReview";
import { LensIntro } from "@/components/assessment/LensIntro";
import { LensReview } from "@/components/assessment/LensReview";
import { QuestionScreen } from "@/components/assessment/QuestionScreen";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";
import type { Ratings } from "@/lib/scoring";
import {
  domainOf,
  lensOf,
  nextStep,
  previousStep,
  questionOf,
  stepBySlug,
  stepHref,
} from "@/lib/steps";

export default async function StepPage({
  params,
}: {
  params: Promise<{ id: string; step: string }>;
}) {
  const { id, step: slug } = await params;

  const step = stepBySlug(slug);
  if (!step) notFound();

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!assessment) notFound();

  const responses = await prisma.response.findMany({
    where: { assessmentId: id },
    select: { questionId: true, rating: true, note: true },
  });

  const ratings: Ratings = {};
  const notes: Record<string, string> = {};
  for (const response of responses) {
    ratings[response.questionId] = response.rating;
    if (response.note) notes[response.questionId] = response.note;
  }

  if (step.kind === "question") {
    const domain = domainOf(step);
    const lens = lensOf(step);
    const question = questionOf(step);
    const previous = previousStep(step);
    const next = nextStep(step);

    return (
      <PageShell eyebrow="Assessment">
        <QuestionScreen
          assessmentId={id}
          questionId={question.id}
          questionText={question.text}
          domainCode={domain.code}
          domainName={domain.name}
          lensLabel={`Lens ${lens.id}: ${LENS_DEFINITIONS[lens.id].name}`}
          questionNumber={step.questionIndex + 1}
          questionsInLens={lens.questions.length}
          initialRating={ratings[question.id] ?? null}
          initialNote={notes[question.id] ?? ""}
          backHref={
            previous ? stepHref(id, previous) : `/a/${id}/welcome`
          }
          nextHref={next ? stepHref(id, next) : `/a/${id}/results`}
        />
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Assessment">
      {step.kind === "lens-intro" ? (
        <LensIntro assessmentId={id} step={step} ratings={ratings} />
      ) : null}
      {step.kind === "lens-review" ? (
        <LensReview assessmentId={id} step={step} ratings={ratings} />
      ) : null}
      {step.kind === "domain-review" ? (
        <DomainReview assessmentId={id} step={step} ratings={ratings} />
      ) : null}
    </PageShell>
  );
}
