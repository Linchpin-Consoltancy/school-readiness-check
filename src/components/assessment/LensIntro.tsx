import Link from "next/link";
import { LENS_DEFINITIONS, TOTAL_SECTIONS } from "@/content/assessment";
import { sectionsComplete, type Ratings } from "@/lib/scoring";
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
  ProgressBar,
  contextText,
  primaryButton,
  secondaryButton,
} from "./ui";

export function LensIntro({
  assessmentId,
  step,
  ratings,
}: {
  assessmentId: string;
  step: Extract<Step, { kind: "lens-intro" }>;
  ratings: Ratings;
}) {
  const domain = domainOf(step);
  const lens = lensOf(step);
  const definition = LENS_DEFINITIONS[lens.id];
  const previous = previousStep(step);
  const next = nextStep(step);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14 lg:py-20">
      <ProgressBar
        complete={sectionsComplete(ratings)}
        total={TOTAL_SECTIONS}
      />

      <div className="mt-14">
        <ContextLine domainCode={domain.code} domainName={domain.name} />

        <p className={`mt-8 ${contextText}`}>
          Section {step.sectionNumber} of {TOTAL_SECTIONS}
        </p>

        <h1 className="mt-4 font-display text-[2.1rem] leading-[1.15] font-normal text-onyx sm:text-[2.6rem]">
          Lens {lens.id}: {definition.name}
        </h1>

        <div aria-hidden className="mt-8 h-px w-14 bg-amber" />

        <p className="mt-8 font-display text-[1.45rem] leading-snug text-dusk sm:text-[1.7rem]">
          {definition.guidingQuestion}
        </p>

        <p className="mt-7 max-w-[52ch] text-[0.98rem] leading-[1.75] text-charcoal/85">
          {definition.description}
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
        {next ? (
          <Link href={stepHref(assessmentId, next)} className={primaryButton}>
            Continue
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
