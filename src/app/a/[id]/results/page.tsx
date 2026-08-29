import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import {
  ProgressBar,
  contextText,
  eyebrowText,
  primaryButton,
  secondaryButton,
} from "@/components/assessment/ui";
import {
  DOMAINS,
  LENS_DEFINITIONS,
  TOTAL_QUESTIONS,
  TOTAL_SECTIONS,
} from "@/content/assessment";
import { prisma } from "@/lib/prisma";
import {
  allDomainResults,
  byPriority,
  formatScore,
  questionsAnswered,
  sectionsComplete,
  type DomainResult,
  type Ratings,
} from "@/lib/scoring";
import { STEPS, stepHref } from "@/lib/steps";

const DOMAIN_BY_ID = new Map(DOMAINS.map((domain) => [domain.id, domain]));

function DomainRow({ result }: { result: DomainResult }) {
  const domain = DOMAIN_BY_ID.get(result.domainId);
  if (!domain || !result.tier || result.displayScore === null) return null;

  const tier = result.tier;

  return (
    <li className="relative border-b border-onyx/10">
      <span
        aria-hidden
        className="absolute top-0 left-0 h-full w-[3px]"
        style={{ backgroundColor: tier.color }}
      />

      <div className="grid gap-x-8 gap-y-5 py-7 pl-6 sm:grid-cols-[1fr_auto] sm:items-center sm:pl-7">
        <div>
          <p className={contextText}>{domain.code}</p>

          <h3 className="mt-2 font-display text-[1.4rem] leading-tight text-onyx sm:text-[1.55rem]">
            {domain.name}
          </h3>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span
                className="text-[0.68rem] font-medium uppercase tracking-[0.16em]"
                style={{ color: tier.color }}
              >
                {tier.label}
              </span>
            </span>

            <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
              {result.lenses.map((lens) => (
                <span
                  key={lens.lensId}
                  className={`text-[0.7rem] uppercase tracking-[0.14em] ${
                    lens.gap ? "font-medium text-amber" : "text-dusk"
                  }`}
                  title={`Lens ${lens.lensId}: ${
                    LENS_DEFINITIONS[lens.lensId].name
                  }${lens.gap ? ", flagged as a lens gap" : ""}`}
                >
                  {lens.lensId} {formatScore(lens.score as number)}
                </span>
              ))}
            </span>
          </div>
        </div>

        <p className="flex items-baseline gap-2.5 sm:justify-end">
          <span className="font-display text-[2.6rem] leading-none text-onyx">
            {formatScore(result.displayScore)}
          </span>
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-dusk">
            of 4.0
          </span>
        </p>
      </div>
    </li>
  );
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    select: { fullName: true, schoolName: true },
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

  if (!finished) {
    return (
      <PageShell eyebrow="Results">
        <div className="mx-auto w-full max-w-2xl px-6 py-16 lg:py-24">
          <p className={eyebrowText}>Not finished yet</p>

          <h1 className="mt-6 font-display text-[2.2rem] leading-tight font-normal text-onyx sm:text-[2.7rem]">
            Your results are not ready
          </h1>

          <p className="mt-6 max-w-[50ch] text-[0.98rem] leading-[1.75] text-charcoal/85">
            You have answered {answered} of the {TOTAL_QUESTIONS} questions. A
            domain is only scored once all three of its lenses are complete, so
            the summary appears when the last answer is in.
          </p>

          <div className="mt-12">
            <ProgressBar
              complete={sectionsComplete(ratings)}
              total={TOTAL_SECTIONS}
            />
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href={`/a/${id}/assess`} className={primaryButton}>
              Continue where I left off
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const results = allDomainResults(ratings);
  const ordered = byPriority(results);
  const flagged = results.filter((result) => result.gapFlag);

  return (
    <PageShell eyebrow="Results">
      <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:py-20">
        <p className={eyebrowText}>Assessment complete</p>

        <h1 className="mt-6 font-display text-[2.4rem] leading-[1.1] font-normal text-onyx sm:text-[3rem]">
          Your results
        </h1>

        <p className="mt-4 text-[1.05rem] text-dusk">{assessment.schoolName}</p>

        <div aria-hidden className="mt-8 h-px w-14 bg-amber" />

        <p className="mt-8 max-w-[52ch] text-[0.98rem] leading-[1.75] text-charcoal/85">
          Every domain below is scored out of 4.0 and placed in a priority
          tier. They are ordered with the most urgent first, so the domain at
          the top is where your attention is worth the most right now.
        </p>

        <ol className="mt-12 border-t border-onyx/10">
          {ordered.map((result) => (
            <DomainRow key={result.domainId} result={result} />
          ))}
        </ol>

        <div className="mt-8 space-y-2.5">
          <p className="text-[0.78rem] leading-relaxed text-dusk">
            The three figures beside each tier are your lens scores: A for
            intent and design, B for observable practice, C for data and
            outcomes.
          </p>
          {flagged.length > 0 ? (
            <p className="text-[0.78rem] leading-relaxed text-dusk">
              A lens shown in amber differs from its domain score by a full
              point or more. That gap is often more useful than the score
              itself, and your report examines each one.
            </p>
          ) : null}
        </div>

        <div className="mt-14 rounded-[4px] border border-onyx/10 bg-ivory p-7 sm:p-9">
          <p className={eyebrowText}>Your full report</p>
          <h2 className="mt-4 font-display text-[1.6rem] leading-tight text-onyx">
            Download the PDF
          </h2>
          <p className="mt-4 max-w-[50ch] text-[0.94rem] leading-[1.7] text-charcoal/85">
            The full report sets out each domain in turn, the patterns across
            them, and where to start. It is yours to keep and to share with
            your leadership team.
          </p>
          <a
            href={`/a/${id}/report`}
            className={`${primaryButton} mt-7 w-full sm:w-auto`}
          >
            Download my report
          </a>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href={stepHref(id, STEPS[0])} className={secondaryButton}>
            Review my answers
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
