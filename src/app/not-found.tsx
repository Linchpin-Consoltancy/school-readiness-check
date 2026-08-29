import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-amber">
          Page not found
        </p>
        <h1 className="mt-6 font-display text-[2.2rem] leading-tight text-onyx sm:text-4xl">
          We could not find that page
        </h1>
        <p className="mx-auto mt-6 max-w-[44ch] text-[0.96rem] leading-[1.75] text-charcoal/85">
          The link may be incomplete, or the assessment it points to may no
          longer exist. You can start a new assessment from the beginning.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-[3px] bg-onyx px-8 py-4 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-onyx/90"
        >
          Start again
        </Link>
      </div>
    </PageShell>
  );
}
