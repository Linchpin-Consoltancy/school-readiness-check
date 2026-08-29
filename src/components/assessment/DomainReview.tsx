import Link from "next/link";
import { LENS_DEFINITIONS } from "@/content/assessment";
import { domainResult, formatScore, type Ratings } from "@/lib/scoring";
import {
  domainOf,
  nextStep,
  previousStep,
  stepHref,
  type Step,
} from "@/lib/steps";
import {
  ContextLine,
  TIER_STYLES,
  contextText,
  eyebrowText,
  primaryButton,
  secondaryButton,
} from "./ui";

export function DomainReview({
  assessmentId,
  step,
  ratings,
}: {
  assessmentId: string;
  step: Extract<Step, { kind: "domain-review" }>;
  ratings: Ratings;
}) {
  const domain = domainOf(step);
  const result = domainResult(domain, ratings);
  const previous = previousStep(step);
  const next = nextStep(step);

  const continueHref = next
    ? stepHref(assessmentId, next)
    : `/a/${assessmentId}/results`;

  const tierStyle = result.tier ? TIER_STYLES[result.tier.id] : null;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14 lg:py-20">
      <ContextLine domainCode={domain.code} domainName={domain.name} />

      <p className={`mt-8 ${eyebrowText}`}>Domain complete</p>

      <h1 className="mt-5 font-display text-[2.1rem] leading-[1.15] font-normal text-onyx sm:text-[2.6rem]">
        {domain.name}
      </h1>

      <ul className="mt-12 border-t border-onyx/10">
        {result.lenses.map((lensResult) => {
          const definition = LENS_DEFINITIONS[lensResult.lensId];

          return (
            <li
              key={lensResult.lensId}
              className="flex items-center justify-between gap-6 border-b border-onyx/10 py-5"
            >
              <div>
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-onyx">
                  Lens {lensResult.lensId}
                </p>
                <p className="mt-1.5 text-[0.92rem] text-dusk">
                  {definition.name}
                </p>
              </div>
              <span className="font-display text-[1.8rem] leading-none text-onyx">
                {lensResult.score === null ? "-" : formatScore(lensResult.score)}
              </span>
            </li>
          );
        })}
      </ul>

      {result.complete && result.tier && tierStyle ? (
        <>
          <div
            className={`mt-10 rounded-[4px] border p-8 sm:p-9 ${tierStyle.border} ${tierStyle.background}`}
          >
            <p className={contextText}>Domain score</p>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="font-display text-[3.6rem] leading-none text-onyx">
                {formatScore(result.score as number)}
              </span>
              <span className="text-[0.72rem] uppercase tracking-[0.16em] text-dusk">
                Out of 4.0
              </span>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <span
                aria-hidden
                className={`block h-2.5 w-2.5 rounded-full ${tierStyle.dot}`}
              />
              <span
                className={`text-[0.75rem] font-medium uppercase tracking-[0.18em] ${tierStyle.text}`}
              >
                {result.tier.label}
              </span>
            </div>
          </div>

          {result.gapLenses.length > 0 ? (
            <div className="mt-6 rounded-[4px] border border-onyx/10 bg-ivory p-7">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-onyx">
                Lens gap noted
              </p>
              <p className="mt-3.5 text-[0.92rem] leading-[1.7] text-charcoal/85">
                {result.gapLenses.length === 1
                  ? `Lens ${result.gapLenses[0]}, ${
                      LENS_DEFINITIONS[result.gapLenses[0]].name
                    }, sits a full point or more below your domain score. Your report will look at why.`
                  : `Lenses ${result.gapLenses.join(
                      " and ",
                    )} sit a full point or more below your domain score. Your report will look at why.`}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-10 rounded-[4px] border border-onyx/10 bg-ivory p-7 sm:p-8">
          <p className={contextText}>Domain score</p>
          <p className="mt-4 max-w-[52ch] text-[0.92rem] leading-[1.7] text-charcoal/85">
            A domain score is only produced once all three lenses are complete,
            so none is shown here yet. Use Back to finish the missing answers.
          </p>
        </div>
      )}

      <div className="mt-12 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
        <Link href={continueHref} className={primaryButton}>
          {next ? "Continue" : "Finish"}
        </Link>
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
