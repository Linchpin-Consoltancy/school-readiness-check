import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

const LENSES = [
  {
    letter: "A",
    title: "Intent and Design",
    body: "What your school has deliberately put in place. The policies, structures, timetables and systems that exist by design rather than by accident.",
  },
  {
    letter: "B",
    title: "Observable Practice",
    body: "What you actually witness happening. Not what the policy document says, but what you see when you walk into classrooms and along corridors.",
  },
  {
    letter: "C",
    title: "Data and Outcomes",
    body: "What your evidence tells you. The results, records, surveys and patterns that show whether the intent is landing where it matters.",
  },
];

const SCALE = [
  {
    value: "1",
    name: "Beginning",
    body: "This is not in place or is at a very early stage.",
  },
  {
    value: "2",
    name: "Developing",
    body: "This exists but is inconsistent or partial.",
  },
  {
    value: "3",
    name: "Established",
    body: "This is in place and functioning reliably.",
  },
  {
    value: "4",
    name: "Exemplary",
    body: "This is a strength. It is embedded, consistent, and improving.",
  },
];

const PREPARATION = [
  "Set aside about 25 minutes somewhere you will not be interrupted.",
  "Answer as your school is today, not as you intend it to be.",
  "There are no right answers. An honest low rating is more useful to you than a generous one.",
];

export default async function WelcomePage({
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

  const firstName = assessment.fullName.trim().split(/\s+/)[0];

  return (
    <PageShell eyebrow="Before You Begin">
      <div className="mx-auto w-full max-w-3xl px-6 py-14 lg:py-20">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-amber">
          Registration complete
        </p>

        <h1 className="mt-6 font-display text-[2.4rem] leading-[1.1] font-normal text-onyx sm:text-5xl">
          Welcome, {firstName}
        </h1>

        <p className="mt-4 text-[1.05rem] text-dusk">{assessment.schoolName}</p>

        <div aria-hidden className="mt-8 h-px w-14 bg-amber" />

        <p className="mt-8 max-w-[52ch] text-[0.98rem] leading-[1.75] text-charcoal/85">
          Before you start, here is how the assessment is built and what the
          ratings mean. It is worth two minutes of reading, because the quality
          of your report depends entirely on the honesty of your answers.
        </p>

        <section className="mt-16">
          <h2 className="font-display text-[1.75rem] leading-tight text-onyx">
            The three lenses
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.92rem] leading-relaxed text-dusk">
            Each of the seven domains is examined three times, once through
            each lens. A school can design something well and still not see it
            in practice, and that gap is exactly what this instrument is built
            to find.
          </p>

          <ul className="mt-9 border-t border-onyx/10">
            {LENSES.map((lens) => (
              <li
                key={lens.letter}
                className="flex gap-6 border-b border-onyx/10 py-7 sm:gap-9"
              >
                <span
                  aria-hidden
                  className="w-8 shrink-0 font-display text-[2.1rem] leading-none text-amber"
                >
                  {lens.letter}
                </span>
                <div>
                  <h3 className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-onyx">
                    Lens {lens.letter}: {lens.title}
                  </h3>
                  <p className="mt-2.5 text-[0.94rem] leading-[1.7] text-charcoal/80">
                    {lens.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-[1.75rem] leading-tight text-onyx">
            The rating scale
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.92rem] leading-relaxed text-dusk">
            Every question uses the same four point scale. Rate what is true
            today, not what you are working towards.
          </p>

          <ul className="mt-9 border-t border-onyx/10">
            {SCALE.map((step) => (
              <li
                key={step.value}
                className="flex gap-6 border-b border-onyx/10 py-6 sm:gap-9"
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-onyx/20 font-display text-[1.5rem] leading-none text-onyx"
                >
                  {step.value}
                </span>
                <div>
                  <h3 className="text-[0.95rem] font-medium text-onyx">
                    {step.value} = {step.name}
                  </h3>
                  <p className="mt-1.5 text-[0.94rem] leading-[1.7] text-charcoal/80">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 rounded-[4px] border border-onyx/10 bg-ivory p-7 sm:p-9">
          <h2 className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-onyx">
            Before you begin
          </h2>
          <ul className="mt-5 space-y-3.5">
            {PREPARATION.map((note) => (
              <li
                key={note}
                className="flex gap-3.5 text-[0.92rem] leading-[1.7] text-charcoal/85"
              >
                <span
                  aria-hidden
                  className="mt-2.5 block h-1 w-1 shrink-0 rounded-full bg-amber"
                />
                {note}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <Link
            href={`/a/${id}/assess`}
            className="block w-full rounded-[3px] bg-onyx px-8 py-4 text-center text-[0.78rem] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-onyx/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-parchment sm:inline-block sm:w-auto"
          >
            Begin Assessment
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
