import { DOMAINS } from "@/content/assessment";

/**
 * The whole tool is one screen. This is the sequence it moves through, held
 * in the browser rather than as separate web addresses, so nothing ever
 * reloads and the frame around the content never flickers.
 */
export type Step =
  | { kind: "intro"; key: string }
  | { kind: "domain"; key: string; domainIndex: number }
  | {
      kind: "question";
      key: string;
      domainIndex: number;
      lensIndex: number;
      questionIndex: number;
      /** 1 to 21, for the progress readout. */
      questionNumber: number;
    }
  | { kind: "capture"; key: string }
  | { kind: "results"; key: string };

function buildSteps(): Step[] {
  const steps: Step[] = [{ kind: "intro", key: "intro" }];
  let questionNumber = 0;

  DOMAINS.forEach((domain, domainIndex) => {
    steps.push({
      kind: "domain",
      key: `${domain.id}-open`,
      domainIndex,
    });

    domain.lenses.forEach((lens, lensIndex) => {
      lens.questions.forEach((question, questionIndex) => {
        questionNumber += 1;
        steps.push({
          kind: "question",
          key: question.id,
          domainIndex,
          lensIndex,
          questionIndex,
          questionNumber,
        });
      });
    });
  });

  steps.push({ kind: "capture", key: "capture" });
  steps.push({ kind: "results", key: "results" });

  return steps;
}

export const STEPS: readonly Step[] = buildSteps();

export const INTRO_INDEX = 0;
export const CAPTURE_INDEX = STEPS.findIndex((step) => step.kind === "capture");
export const RESULTS_INDEX = STEPS.findIndex((step) => step.kind === "results");

export function questionAt(step: Extract<Step, { kind: "question" }>) {
  const domain = DOMAINS[step.domainIndex];
  const lens = domain.lenses[step.lensIndex];
  return {
    domain,
    lens,
    question: lens.questions[step.questionIndex],
  };
}

/** The step index of the first question with no answer yet. */
export function firstUnansweredIndex(
  answers: Record<string, number>,
): number | null {
  for (let index = 0; index < STEPS.length; index += 1) {
    const step = STEPS[index];
    if (step.kind === "question" && answers[step.key] == null) return index;
  }
  return null;
}
