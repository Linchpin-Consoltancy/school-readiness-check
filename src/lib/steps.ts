import {
  DOMAINS,
  type Domain,
  type Lens,
  type Question,
} from "@/content/assessment";
import type { Ratings } from "./scoring";

/**
 * The assessment is a fixed sequence of screens. For each of the 21 lens
 * sections a principal sees an introduction, two questions, and a review.
 * After the third lens of a domain they see a domain summary.
 *
 * 21 sections x 4 screens, plus 7 domain summaries, is 91 screens.
 */
export type Step =
  | {
      kind: "lens-intro";
      slug: string;
      domainIndex: number;
      lensIndex: number;
      sectionNumber: number;
    }
  | {
      kind: "question";
      slug: string;
      domainIndex: number;
      lensIndex: number;
      sectionNumber: number;
      questionIndex: number;
    }
  | {
      kind: "lens-review";
      slug: string;
      domainIndex: number;
      lensIndex: number;
      sectionNumber: number;
    }
  | { kind: "domain-review"; slug: string; domainIndex: number };

function buildSteps(): Step[] {
  const steps: Step[] = [];
  let sectionNumber = 0;

  DOMAINS.forEach((domain, domainIndex) => {
    domain.lenses.forEach((lens, lensIndex) => {
      sectionNumber += 1;
      const base = `${domain.id}-${lens.id}`.toLowerCase();

      steps.push({
        kind: "lens-intro",
        slug: base,
        domainIndex,
        lensIndex,
        sectionNumber,
      });

      lens.questions.forEach((_question, questionIndex) => {
        steps.push({
          kind: "question",
          slug: `${base}-${questionIndex + 1}`,
          domainIndex,
          lensIndex,
          sectionNumber,
          questionIndex,
        });
      });

      steps.push({
        kind: "lens-review",
        slug: `${base}-review`,
        domainIndex,
        lensIndex,
        sectionNumber,
      });
    });

    steps.push({
      kind: "domain-review",
      slug: `${domain.id}-review`.toLowerCase(),
      domainIndex,
    });
  });

  return steps;
}

export const STEPS: readonly Step[] = buildSteps();

const STEP_INDEX_BY_SLUG = new Map(
  STEPS.map((step, index) => [step.slug, index]),
);

export function stepBySlug(slug: string): Step | undefined {
  const index = STEP_INDEX_BY_SLUG.get(slug);
  return index === undefined ? undefined : STEPS[index];
}

export function previousStep(step: Step): Step | undefined {
  const index = STEP_INDEX_BY_SLUG.get(step.slug);
  return index === undefined || index === 0 ? undefined : STEPS[index - 1];
}

export function nextStep(step: Step): Step | undefined {
  const index = STEP_INDEX_BY_SLUG.get(step.slug);
  return index === undefined ? undefined : STEPS[index + 1];
}

export function domainOf(step: Step): Domain {
  return DOMAINS[step.domainIndex];
}

export function lensOf(step: Exclude<Step, { kind: "domain-review" }>): Lens {
  return DOMAINS[step.domainIndex].lenses[step.lensIndex];
}

export function questionOf(
  step: Extract<Step, { kind: "question" }>,
): Question {
  return DOMAINS[step.domainIndex].lenses[step.lensIndex].questions[
    step.questionIndex
  ];
}

/** Web address of a given screen within one principal's assessment. */
export function stepHref(assessmentId: string, step: Step): string {
  return `/a/${assessmentId}/assess/${step.slug}`;
}

/**
 * Where to send someone who returns to the assessment. They land on the first
 * question they have not yet rated. If they have not started that lens at all
 * they get its introduction screen first, which reorients them after a break.
 * Returns null once every question is answered.
 */
export function resumeSlug(ratings: Ratings): string | null {
  const step = STEPS.find(
    (candidate) =>
      candidate.kind === "question" &&
      ratings[questionOf(candidate).id] == null,
  );

  if (!step || step.kind !== "question") return null;

  const lens = lensOf(step);
  const lensStarted = lens.questions.some(
    (question) => ratings[question.id] != null,
  );

  return lensStarted
    ? step.slug
    : `${DOMAINS[step.domainIndex].id}-${lens.id}`.toLowerCase();
}
