import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/prisma";

/** Placeholder. The 42 question flow is built in Stage 2. */
export default async function AssessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    select: { schoolName: true },
  });

  if (!assessment) notFound();

  return (
    <PageShell eyebrow="Assessment">
      <div className="mx-auto w-full max-w-2xl px-6 py-20 text-center">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.26em] text-amber">
          Stage 2
        </p>
        <h1 className="mt-6 font-display text-[2.2rem] leading-tight text-onyx sm:text-4xl">
          The questions go here
        </h1>
        <p className="mx-auto mt-6 max-w-[46ch] text-[0.96rem] leading-[1.75] text-charcoal/85">
          Your session for {assessment.schoolName} has been created and saved.
          The 42 question flow is the next stage of the build, so this page is a
          placeholder for now.
        </p>
        <Link
          href={`/a/${id}/welcome`}
          className="mt-10 inline-block text-[0.78rem] font-medium uppercase tracking-[0.18em] text-onyx underline decoration-amber decoration-2 underline-offset-[6px] transition-colors hover:text-amber"
        >
          Back to instructions
        </Link>
      </div>
    </PageShell>
  );
}
