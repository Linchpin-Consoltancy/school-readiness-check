import { Brandmark } from "./Brandmark";

export function PageShell({
  eyebrow,
  children,
}: {
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-onyx/10 bg-parchment">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Brandmark />
          {eyebrow ? (
            <span className="hidden text-[0.65rem] uppercase tracking-[0.24em] text-dusk sm:block">
              {eyebrow}
            </span>
          ) : null}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-onyx/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-7">
          <p className="max-w-xl text-[0.78rem] leading-relaxed text-dusk">
            Linchpin Education. Your responses are held in confidence and are
            used to prepare your report.
          </p>
        </div>
      </footer>
    </div>
  );
}
