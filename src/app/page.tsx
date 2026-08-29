import { PageShell } from "@/components/PageShell";
import { RegistrationForm } from "@/components/RegistrationForm";

const FACTS = [
  { value: "42", label: "Questions" },
  { value: "7", label: "Domains" },
  { value: "25", label: "Minutes" },
];

export default function HomePage() {
  return (
    <PageShell eyebrow="Self-Assessment">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:py-24">
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-amber">
              Linchpin Education
            </p>

            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.06] font-normal text-onyx sm:text-5xl lg:text-[3.4rem]">
              School Systems Self-Assessment
            </h1>

            <div aria-hidden className="mt-7 h-px w-14 bg-amber" />

            <p className="mt-7 font-display text-[1.4rem] leading-snug text-dusk sm:text-2xl">
              A structured diagnostic for school leaders
            </p>

            <p className="mt-6 max-w-[48ch] text-[0.98rem] leading-[1.75] text-charcoal/85">
              This assessment helps you take an honest look at the systems
              running your school. You will answer 42 questions across seven
              domains of school quality, each examined through three lenses:
              what your school has designed, what you observe in practice, and
              what your data tells you. It takes about 25 minutes. At the end
              you will receive a detailed report.
            </p>

            <dl className="mt-12 grid max-w-md grid-cols-3 border-t border-onyx/10">
              {FACTS.map((fact) => (
                <div key={fact.label} className="pt-5">
                  <dt className="sr-only">{fact.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl leading-none text-onyx">
                      {fact.value}
                    </span>
                    <span className="mt-2 block text-[0.65rem] uppercase tracking-[0.2em] text-dusk">
                      {fact.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[4px] border border-onyx/10 bg-ivory p-7 shadow-[0_1px_3px_rgba(27,48,64,0.05),0_12px_36px_-18px_rgba(27,48,64,0.28)] sm:p-9">
            <h2 className="font-display text-[1.7rem] leading-tight text-onyx">
              Begin your assessment
            </h2>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-dusk">
              A few details about you and your school. These appear on your
              report and let us send it where it needs to go.
            </p>

            <div aria-hidden className="my-7 h-px bg-onyx/10" />

            <RegistrationForm />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
