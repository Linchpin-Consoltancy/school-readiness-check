"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { DOMAINS, LENS_DEFINITIONS } from "@/content/assessment";
import { CONTACT, whatsappLink } from "@/content/brand";
import {
  GAP_NOTE,
  GAP_NOTE_HEADING,
  PATTERNS_HEADING,
  PATTERN_VARIANTS,
  SUMMARY_HEADING,
} from "@/content/report";
import { contactSchema, type SchoolContext } from "@/lib/profile";
import { countTiers, fillTokens, lensList, lowestScoringDomain, selectVariant } from "@/lib/report";
import { recordLead } from "@/lib/submissions";
import { byPriority, formatScore, type DomainResult } from "@/lib/scoring";
import { contextText, eyebrowText, primaryButton, secondaryButton } from "./ui";

const fieldLabel =
  "block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-onyx/75";

// 16px stops mobile browsers zooming in when a field is focused.
const fieldBase =
  "mt-2 w-full rounded-[3px] border bg-white px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-dusk/50 focus:border-amber focus:ring-2 focus:ring-amber/20";

function fieldClass(hasError: boolean) {
  return `${fieldBase} ${
    hasError
      ? "border-critical ring-2 ring-critical/15"
      : "border-dusk/30 hover:border-dusk/50"
  }`;
}

/**
 * Offered, never required. The director already has their results on screen
 * and their report a click away. This asks for a way to send it and to follow
 * up once, and nothing is stored unless the box is ticked.
 */
function ContactBlock({
  context,
  results,
}: {
  context: SchoolContext;
  results: DomainResult[];
}) {
  const schoolName = context.schoolName;
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <section className="mt-10 rounded-[4px] border border-onyx/10 bg-ivory p-7 sm:p-9">
        <p className={eyebrowText}>Thank you</p>
        <h2 className="mt-4 font-display text-[1.5rem] leading-tight text-onyx">
          We have it.
        </h2>
        <p className="mt-4 max-w-[50ch] text-[0.94rem] leading-[1.7] text-charcoal/85">
          We will send your report across and get in touch once about what it
          shows for {schoolName}. If you would rather we did not, reply to that
          message and we will remove your details.
        </p>
      </section>
    );
  }

  function save() {
    setErrors({});

    const parsed = contactSchema.safeParse({ fullName, phone, email, consent });

    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    startTransition(async () => {
      const sent = await recordLead(parsed.data, context, results);

      if (!sent) {
        setErrors({
          form: ["We could not send that just now. Please try again."],
        });
        return;
      }
      setDone(true);
    });
  }

  const errorFor = (field: string) => errors[field]?.[0];

  return (
    <section className="mt-10 rounded-[4px] border border-onyx/10 bg-ivory p-7 sm:p-9">
      <p className={eyebrowText}>Optional</p>
      <h2 className="mt-4 font-display text-[1.6rem] leading-tight text-onyx">
        Want this sent to you?
      </h2>
      <p className="mt-4 max-w-[50ch] text-[0.94rem] leading-[1.7] text-charcoal/85">
        Leave a number and we will send the report over with a short note on the
        area that needs you first. One follow up from us, and nothing else. We
        do not sell or share your details, and you already have everything above
        whether you fill this in or not.
      </p>

      <div className="mt-8 space-y-5">
        {errors.form ? (
          <p
            role="alert"
            className="rounded-[3px] border border-critical/30 bg-critical/5 px-4 py-3 text-[0.85rem] text-critical"
          >
            {errors.form[0]}
          </p>
        ) : null}

        <div>
          <label htmlFor="contact-name" className={fieldLabel}>
            Your name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            aria-invalid={Boolean(errorFor("fullName"))}
            className={fieldClass(Boolean(errorFor("fullName")))}
          />
          {errorFor("fullName") ? (
            <p role="alert" className="mt-1.5 text-[0.8rem] text-critical">
              {errorFor("fullName")}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className={fieldLabel}>
            WhatsApp number
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="07XX XXX XXX"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={Boolean(errorFor("phone"))}
            className={fieldClass(Boolean(errorFor("phone")))}
          />
          {errorFor("phone") ? (
            <p role="alert" className="mt-1.5 text-[0.8rem] text-critical">
              {errorFor("phone")}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={fieldLabel}>
            Email
            <span className="ml-2 text-[0.66rem] tracking-normal text-dusk/70 normal-case">
              Optional
            </span>
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errorFor("email"))}
            className={fieldClass(Boolean(errorFor("email")))}
          />
          {errorFor("email") ? (
            <p role="alert" className="mt-1.5 text-[0.8rem] text-critical">
              {errorFor("email")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="contact-consent"
            className="flex items-start gap-3 text-[0.9rem] leading-[1.6] text-charcoal/85"
          >
            <input
              id="contact-consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              aria-invalid={Boolean(errorFor("consent"))}
              className="mt-1 h-4 w-4 shrink-0 accent-onyx"
            />
            <span>
              Yes, Linchpin may send me this report and contact me once about
              what it shows.
            </span>
          </label>
          {errorFor("consent") ? (
            <p role="alert" className="mt-1.5 text-[0.8rem] text-critical">
              {errorFor("consent")}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={save}
          disabled={pending}
          className={`${primaryButton} mt-2 w-full sm:w-auto`}
        >
          {pending ? "Sending" : "Send it to me"}
        </button>
      </div>
    </section>
  );
}

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
  context,
  answers,
  results,
  onRestart,
}: {
  context: SchoolContext;
  answers: Record<string, number>;
  results: DomainResult[];
  onRestart: () => void;
}) {
  const schoolName = context.schoolName;
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
      <p className={eyebrowText}>Your results</p>

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
        <form method="POST" action="/api/report" className="mt-7">
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify({ context, answers })}
          />
          <button type="submit" className={`${primaryButton} w-full sm:w-auto`}>
            Download my report
          </button>
        </form>
        <p className="mt-4 text-[0.78rem] leading-relaxed text-dusk">
          No details needed. The report is yours either way.
        </p>
      </section>

      <ContactBlock context={context} results={results} />

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

      <p className="mt-12 max-w-[54ch] text-[0.78rem] leading-relaxed text-dusk">
        We keep an anonymous record of these scores, with no name and no school
        attached, so that we can see what is true across Kenyan schools rather
        than only in one. Nothing that identifies you or your school is stored
        unless you ask us to get in touch.
      </p>

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
