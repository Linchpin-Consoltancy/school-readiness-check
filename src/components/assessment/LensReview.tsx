import Link from "next/link";
import { LENS_DEFINITIONS, RATING_SCALE } from "@/content/assessment";
import { formatScore, lensScore, type Ratings } from "@/lib/scoring";
import {
  domainOf,
  lensOf,
  nextStep,
  previousStep,
  stepHref,
  type Step,
} from "@/lib/steps";
import {
  ContextLine,
  contextText,
  eyebrowText,
  primaryButton,
  secondaryButton,
} from "./ui";

function ratingName(value: number): string {
  return RATING_SCALE.find((option) => option.value === value)?.name ?? "";
}

export function LensReview({
  assessmentId,
  step,
  ratings,
}: {
  assessmentId: string;
  step: Extract<Step, { kind: "lens-review" }>;
  ratings: Ratings;
}) {
  const domain = domainOf(step);
  const lens = lensOf(step);
  const definition = LENS_DEFINITIONS[lens.id];
  const score = lensScore(lens, ratings);
  const previous = previousStep(step);
  const next = nextStep(step);

  const editHref = (questionIndex: number) =>
    `/a/${assessmentId}/assess/${`${domain.id}-${lens.id}-${
      questionIndex + 1
    }`.toLowerCase()}`;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14 lg:py-20">
      <ContextLine domainCode={domain.code} domainName={domain.name} />

      <p className={`mt-8 ${eyebrowText}`}>Section complete</p>

      <h1 className="mt-5 font-display text-[2rem] leading-[1.15] font-normal text-onyx sm:text-[2.4rem]">
        Lens {lens.id}: {definition.name}
      </h1>

      <p className="mt-5 max-w-[52ch] text-[0.95rem] leading-[1.7] text-charcoal/80">
        Here is what you recorded. Change either answer if it does not reflect
        your school, then confirm to continue.
      </p>

      <ul className="mt-11 border-t border-onyx/10">
        {lens.questions.map((question, index) => {
          const value = ratings[question.id];

          return (
            <li key={question.id} className="border-b border-onyx/10 py-7">
              <div className="flex items-start justify-between gap-5">
                <p className={contextText}>Question {index + 1}</p>
                <Link
                  href={editHref(index)}
                  className="shrink-0 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-onyx underline decoration-amber decoration-2 underline-offset-[5px] transition-colors hover:text-amber"
                >
                  Edit
                </Link>
              </div>

              <p className="mt-3.5 text-[0.98rem] leading-[1.7] text-charcoal/85">
                {question.text}
              </p>

              {value == null ? (
                <p className="mt-5 text-[0.85rem] text-critical">
                  Not yet answered.
                </p>
              ) : (
                <p className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-[1.9rem] leading-none text-onyx">
                    {value}
                  </span>
                  <span className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-dusk">
                    {ratingName(value)}
                  </span>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-10 rounded-[4px] border border-onyx/10 bg-ivory p-7 sm:p-8">
        <p className={contextText}>Lens score</p>
        {score === null ? (
          <p className="mt-4 text-[0.92rem] leading-relaxed text-charcoal/85">
            A lens score needs both questions answered. Use the Edit links above
            to complete this section.
          </p>
        ) : (
          <div className="mt-4 flex items-baseline gap-4">
            <span className="font-display text-[3rem] leading-none text-onyx">
              {formatScore(score)}
            </span>
            <span className="text-[0.72rem] uppercase tracking-[0.16em] text-dusk">
              Average of your two ratings
            </span>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
        {next ? (
          <Link
            href={stepHref(assessmentId, next)}
            aria-disabled={score === null}
            className={`${primaryButton} ${
              score === null ? "pointer-events-none bg-onyx/30" : ""
            }`}
          >
            Confirm and continue
          </Link>
        ) : null}
        {previous ? (
          <Link
            href={stepHref(assessmentId, previous)}
            className={secondaryButton}
          >
            Back
          </Link>
        ) : null}
      </div>
    </div>
  );
}
