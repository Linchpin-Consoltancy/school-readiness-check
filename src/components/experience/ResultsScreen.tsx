"use client";

import { DOMAINS, LENS_DEFINITIONS } from "@/content/assessment";
import { CONTACT, whatsappLink } from "@/content/brand";
import {
  GAP_NOTE,
  GAP_NOTE_HEADING,
  PATTERNS_HEADING,
  PATTERN_VARIANTS,
  SUMMARY_HEADING,
} from "@/content/report";
import { countTiers, fillTokens, lensList, lowestScoringDomain, selectVariant } from "@/lib/report";
import { byPriority, formatScore, type DomainResult } from "@/lib/scoring";
import { contextText, eyebrowText, primaryButton, secondaryButton } from "./ui";

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

      <div className="grid gap-x-8 gap-y-4 py-6 pl-5 sm:grid-cols-[1fr_auto] sm:items-center sm:pl-7">
        <div>
          <h3 className="font-display text-[1.35rem] leading-tight text-onyx sm:text-[1.5rem]">
            {domain.name}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="block h-2 w-2 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span
                className="text-[0.66rem] font-medium uppercase tracking-[0.16em]"
                style={{ color: tier.color }}
              >
                {tier.label}
              </span>
            </span>

            <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
              {result.lenses.map((lens) => (
                <span
                  key={lens.lensId}
                  className={`text-[0.68rem] uppercase tracking-[0.14em] ${
                    lens.gap ? "font-medium text-amber" : "text-dusk"
                  }`}
                  title={LENS_DEFINITIONS[lens.lensId].name}
                >
                  {LENS_DEFINITIONS[lens.lensId].name}{" "}
                  {formatScore(lens.score as number)}
                </span>
              ))}
            </span>
          </div>
        </div>

        <p className="flex items-baseline gap-2.5 sm:justify-end">
          <span className="font-display text-[2.4rem] leading-none text-onyx">
            {formatScore(result.displayScore)}
          </span>
          <span className="text-[0.66rem] uppercase tracking-[0.16em] text-dusk">
            of 4.0
          </span>
        </p>
      </div>
    </li>
  );
}

export function ResultsScreen({
  schoolName,
  firstName,
  results,
  assessmentId,
  onRestart,
}: {
  schoolName: string;
  firstName: string;
  results: DomainResult[];
  assessmentId: string;
  onRestart: () => void;
}) {
  const ordered = byPriority(results);
  const counts = countTiers(results);
  const lowest = lowestScoringDomain(results);
  const lowestName = lowest
    ? (DOMAIN_BY_ID.get(lowest.domainId)?.name ?? "your lowest area")
    : "your lowest area";

  const running = counts.moderate + counts.sustain;
  const variant = selectVariant(results);
  const flagged = results.filter((result) => result.gapFlag);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className={eyebrowText}>Your results, {firstName}</p>

      <h1 className="mt-6 font-display text-[2.2rem] leading-[1.1] font-normal text-onyx sm:text-[2.9rem]">
        {schoolName}
      </h1>

      <div aria-hidden className="mt-7 h-px w-14 bg-amber" />

      <p className="mt-8 max-w-[52ch] text-[1.05rem] leading-[1.7] text-charcoal/85">
        {running} of your seven areas are running reliably.{" "}
        <span className="text-onyx">{lowestName}</span> is where your attention
        is worth the most right now.
      </p>

      <section className="mt-14">
        <h2 className={contextText}>{SUMMARY_HEADING}</h2>
        <ol className="mt-6 border-t border-onyx/10">
          {ordered.map((result) => (
            <DomainRow key={result.domainId} result={result} />
          ))}
        </ol>

        <p className="mt-6 text-[0.78rem] leading-relaxed text-dusk">
          The three figures under each area are how it scored on design, on
          delivery, and on the evidence you could show.
          {flagged.length > 0
            ? " One shown in amber sits well away from the others in that area."
            : ""}
        </p>
      </section>

      {flagged.length > 0 ? (
        <section className="mt-12 rounded-[4px] border border-onyx/10 bg-ivory p-6 sm:p-8">
          <h2 className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-onyx">
            {GAP_NOTE_HEADING}
          </h2>
          <ul className="mt-5 space-y-4">
            {flagged.map((result) => (
              <li key={result.domainId}>
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-amber">
                  {DOMAIN_BY_ID.get(result.domainId)?.name}
                </p>
                <p className="mt-2 text-[0.92rem] leading-[1.7] text-charcoal/85">
                  {fillTokens(GAP_NOTE, {
                    LENSES: lensList(result.gapLenses),
                    LENS_WORD: result.gapLenses.length === 1 ? "view" : "views",
                    VERB: result.gapLenses.length === 1 ? "differs" : "differ",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="font-display text-[1.7rem] leading-tight text-onyx">
          {PATTERNS_HEADING}
        </h2>
        {PATTERN_VARIANTS[variant.id].map((paragraph, index) => (
          <p
            key={index}
            className="mt-5 max-w-[54ch] text-[0.98rem] leading-[1.75] text-charcoal/85"
          >
            {paragraph}
          </p>
        ))}
      </section>

      <section className="mt-14 rounded-[4px] border border-onyx/10 bg-ivory p-7 sm:p-9">
        <p className={eyebrowText}>Your full report</p>
        <h2 className="mt-4 font-display text-[1.6rem] leading-tight text-onyx">
          Take this to your leadership team
        </h2>
        <p className="mt-4 max-w-[50ch] text-[0.94rem] leading-[1.7] text-charcoal/85">
          The report sets out every area in turn, what each score means for your
          school, and where to start. It is yours to keep, print and share.
        </p>
        <a
          href={`/a/${assessmentId}/report`}
          className={`${primaryButton} mt-7 w-full sm:w-auto`}
        >
          Download my report
        </a>
      </section>

      <section className="mt-10 rounded-[4px] border border-amber/30 bg-amber/[0.05] p-7 sm:p-9">
        <h2 className="font-display text-[1.6rem] leading-tight text-onyx">
          This is the map. The journey is the harder part.
        </h2>
        <p className="mt-4 max-w-[52ch] text-[0.96rem] leading-[1.75] text-charcoal/85">
          You have just told us how your school looks from where you sit. That
          view is real and it is the right place to start, but it is one seat in
          the building. What it cannot see is what your teachers would say, what
          your learners would say, and what an experienced outsider would notice
          in a morning.
        </p>
        <p className="mt-4 max-w-[52ch] text-[0.96rem] leading-[1.75] text-charcoal/85">
          That is what we do. If any of this landed close to the bone, talk to
          us. A conversation costs nothing and you will know within twenty
          minutes whether we are the right people for your school.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={whatsappLink(
              `Hello Linchpin, I have just completed the School Readiness Check for ${schoolName} and would like to talk.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryButton} w-full sm:w-auto`}
          >
            Message us on WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
              `School Readiness Check, ${schoolName}`,
            )}`}
            className={`${secondaryButton} w-full sm:w-auto`}
          >
            Email instead
          </a>
        </div>
      </section>

      <div className="mt-12 border-t border-onyx/10 pt-8">
        <button
          type="button"
          onClick={onRestart}
          className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-dusk transition-colors hover:text-onyx"
        >
          Start a check for another school
        </button>
      </div>
    </div>
  );
}
