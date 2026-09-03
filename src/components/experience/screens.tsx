"use client";

import {
  DOMAINS,
  LENS_DEFINITIONS,
  RATING_SCALE,
  TOTAL_QUESTIONS,
  type Domain,
  type Question,
} from "@/content/assessment";
import { contextText, eyebrowText, primaryButton, quietButton } from "./ui";

/* ===========================================================================
   Intro
   =========================================================================== */

const FACTS = [
  { value: "21", label: "Questions" },
  { value: "7", label: "Areas" },
  { value: "7", label: "Minutes" },
];

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
      <p className={eyebrowText}>For school owners and heads</p>

      <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] font-normal text-onyx sm:text-[3.1rem]">
        Is your school ready for what parents are about to ask?
      </h1>

      <div aria-hidden className="mt-8 h-px w-14 bg-amber" />

      <p className="mt-8 max-w-[54ch] text-[1rem] leading-[1.75] text-charcoal/85">
        Competency based education changed what a good school looks like, and it
        changed it faster than most schools could rebuild. Parents can no longer
        read a rank and relax. They want to know their child is growing, that
        talent is being noticed, that the fees are buying something real.
      </p>

      <p className="mt-5 max-w-[54ch] text-[1rem] leading-[1.75] text-charcoal/85">
        This check takes seven minutes and tells you, plainly, which parts of
        your school can already answer that and which cannot yet. It is built
        for the person carrying the risk, whether or not you came up through a
        classroom.
      </p>

      <dl className="mt-11 grid max-w-md grid-cols-3 border-t border-onyx/10">
        {FACTS.map((fact) => (
          <div key={fact.label} className="pt-5">
            <dt className="sr-only">{fact.label}</dt>
            <dd>
              <span className="block font-display text-3xl leading-none text-onyx">
                {fact.value}
              </span>
              <span className="mt-2 block text-[0.62rem] uppercase tracking-[0.2em] text-dusk">
                {fact.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-14">
        <h2 className="font-display text-[1.5rem] leading-tight text-onyx">
          Three questions about every part of your school
        </h2>
        <p className="mt-3 max-w-[52ch] text-[0.92rem] leading-relaxed text-dusk">
          Most school reviews ask what you have. This one asks three different
          things, because a school can look excellent on paper and thin in the
          corridor. The distance between them is where the money leaks.
        </p>

        <ul className="mt-8 border-t border-onyx/10">
          {(["A", "B", "C"] as const).map((letter) => (
            <li
              key={letter}
              className="flex gap-5 border-b border-onyx/10 py-6 sm:gap-8"
            >
              <span
                aria-hidden
                className="w-8 shrink-0 font-display text-[1.9rem] leading-none text-amber"
              >
                {letter}
              </span>
              <div>
                <h3 className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-onyx">
                  {LENS_DEFINITIONS[letter].name}
                </h3>
                <p className="mt-2 font-display text-[1.2rem] leading-snug text-dusk">
                  {LENS_DEFINITIONS[letter].guidingQuestion}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ScaleLegend className="mt-12" />

      <div className="mt-12">
        <button type="button" onClick={onStart} className={`${primaryButton} w-full sm:w-auto`}>
          Start the check
        </button>
        <p className="mt-5 max-w-[46ch] text-[0.8rem] leading-relaxed text-dusk">
          No sign up. Nothing to install. We ask who you are at the end, and
          only so we can put your name on the report and send it to you.
        </p>
      </div>
    </div>
  );
}

/* ===========================================================================
   Rating scale legend, shown where a reminder helps
   =========================================================================== */

export function ScaleLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[4px] border border-onyx/10 bg-ivory p-6 sm:p-7 ${className}`}>
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-onyx">
        How to answer
      </p>
      <ul className="mt-4 space-y-3">
        {RATING_SCALE.map((option) => (
          <li key={option.value} className="flex gap-4">
            <span
              aria-hidden
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-onyx/20 font-display text-[0.95rem] leading-none text-onyx"
            >
              {option.value}
            </span>
            <p className="text-[0.88rem] leading-[1.6] text-charcoal/85">
              <span className="font-medium text-onyx">{option.name}.</span>{" "}
              {option.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ===========================================================================
   Domain opener
   =========================================================================== */

export function DomainScreen({
  domain,
  domainIndex,
  onContinue,
  onBack,
}: {
  domain: Domain;
  domainIndex: number;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:px-6 sm:py-20">
      <p className={contextText}>
        Area {domainIndex + 1} of {DOMAINS.length}
      </p>

      <h1 className="mt-5 font-display text-[2.1rem] leading-[1.12] font-normal text-onyx sm:text-[2.7rem]">
        {domain.name}
      </h1>

      <div aria-hidden className="mt-7 h-px w-14 bg-amber" />

      <p className="mt-7 font-display text-[1.4rem] leading-snug text-dusk sm:text-[1.65rem]">
        {domain.question}
      </p>

      <p className="mt-6 max-w-[54ch] text-[0.98rem] leading-[1.75] text-charcoal/85">
        {domain.intro}
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row-reverse sm:items-center sm:justify-end sm:gap-6">
        <button
          type="button"
          onClick={onContinue}
          className={`${primaryButton} w-full sm:w-auto`}
        >
          Continue
        </button>
        <button type="button" onClick={onBack} className={quietButton}>
          Back
        </button>
      </div>
    </div>
  );
}

/* ===========================================================================
   A single question
   =========================================================================== */

export function QuestionScreen({
  domain,
  lensId,
  question,
  questionNumber,
  value,
  onAnswer,
  onBack,
}: {
  domain: Domain;
  lensId: "A" | "B" | "C";
  question: Question;
  questionNumber: number;
  value: number | null;
  onAnswer: (rating: number) => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-6 sm:py-16">
      <p className={contextText}>
        <span className="text-amber">{domain.code}</span>
        <span className="px-2 text-dusk/50">/</span>
        {domain.name}
        <span className="px-2 text-dusk/50">/</span>
        {LENS_DEFINITIONS[lensId].name}
      </p>

      <p className={`mt-5 ${contextText}`}>
        Question {questionNumber} of {TOTAL_QUESTIONS}
      </p>

      <h1 className="mt-5 font-display text-[1.5rem] leading-[1.4] font-normal text-onyx sm:text-[1.9rem] sm:leading-[1.35]">
        {question.text}
      </h1>

      {question.hint ? (
        <p className="mt-4 max-w-[48ch] text-[0.86rem] leading-relaxed text-dusk">
          {question.hint}
        </p>
      ) : null}

      <fieldset className="mt-10">
        <legend className="sr-only">Choose a rating</legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {RATING_SCALE.map((option) => {
            const selected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onAnswer(option.value)}
                aria-pressed={selected}
                title={option.description}
                className={`flex items-center gap-4 rounded-[3px] border px-5 py-4 text-left transition-colors sm:flex-col sm:items-start sm:gap-2 sm:py-5 ${
                  selected
                    ? "border-onyx bg-onyx text-ivory"
                    : "border-dusk/30 bg-ivory text-onyx hover:border-amber/70"
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-parchment`}
              >
                <span className="font-display text-[1.5rem] leading-none">
                  {option.value}
                </span>
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em]">
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className={quietButton}>
          Back
        </button>
        <p className="text-[0.78rem] text-dusk">
          {value === null ? "Choose one to continue" : "Saved"}
        </p>
      </div>
    </div>
  );
}
