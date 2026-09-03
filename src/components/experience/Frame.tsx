import { Brandmark } from "@/components/Brandmark";
import { CONTACT, whatsappLink } from "@/content/brand";

/**
 * The frame that never moves. The tool changes inside it, so the brand and
 * the ways to reach Linchpin are on screen from the first second to the last,
 * without a single page reload.
 */
export function Frame({
  progress,
  children,
}: {
  /** 0 to 1, or null to hide the bar entirely. */
  progress: number | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-parchment">
      <header className="sticky top-0 z-20 border-b border-onyx/10 bg-parchment">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <Brandmark />
          <span className="hidden text-[0.62rem] uppercase tracking-[0.22em] text-dusk sm:block">
            School Readiness Check
          </span>
        </div>

        {/* The progress line sits on the bar itself so it never takes space
            away from the question. */}
        <div className="h-[2px] w-full bg-onyx/8">
          <div
            className="h-full bg-amber transition-[width] duration-500 ease-out"
            style={{ width: `${Math.round((progress ?? 0) * 100)}%` }}
            role={progress === null ? undefined : "progressbar"}
            aria-valuenow={
              progress === null ? undefined : Math.round(progress * 100)
            }
            aria-valuemin={progress === null ? undefined : 0}
            aria-valuemax={progress === null ? undefined : 100}
            aria-label={progress === null ? undefined : "Progress"}
          />
        </div>
      </header>

      <main className="flex-1 pb-24 sm:pb-28">{children}</main>

      <ContactBar />
    </div>
  );
}

function ContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-onyx/10 bg-ivory/95 backdrop-blur-[2px]">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <a
          href={CONTACT.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-2 text-dusk transition-colors hover:text-onyx"
        >
          <GlobeIcon />
          <span className="truncate text-[0.68rem] tracking-[0.06em] sm:text-[0.74rem]">
            {CONTACT.website}
          </span>
        </a>

        <a
          href={`mailto:${CONTACT.email}`}
          className="flex min-w-0 items-center gap-2 text-dusk transition-colors hover:text-onyx"
        >
          <MailIcon />
          <span className="hidden truncate text-[0.74rem] tracking-[0.06em] sm:block">
            {CONTACT.email}
          </span>
          <span className="text-[0.68rem] tracking-[0.06em] sm:hidden">
            Email
          </span>
        </a>

        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-2 text-onyx transition-colors hover:text-amber"
        >
          <WhatsAppIcon />
          <span className="hidden truncate text-[0.74rem] font-medium tracking-[0.06em] sm:block">
            {CONTACT.whatsappDisplay}
          </span>
          <span className="text-[0.68rem] font-medium tracking-[0.06em] sm:hidden">
            WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}

/* --- icons, drawn inline so the page carries no external requests -------- */

function GlobeIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <circle cx="8" cy="8" r="6.4" />
      <ellipse cx="8" cy="8" rx="2.7" ry="6.4" />
      <path d="M1.9 6h12.2M1.9 10h12.2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <rect x="1.6" y="3.4" width="12.8" height="9.2" rx="1.2" />
      <path d="m1.9 4.4 6.1 4.2 6.1-4.2" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="currentColor"
    >
      <path d="M8.02 1.6a6.36 6.36 0 0 0-5.4 9.72L1.7 14.4l3.16-.9a6.36 6.36 0 1 0 3.16-11.9Zm0 1.24a5.11 5.11 0 1 1-2.6 9.51l-.2-.12-1.87.53.54-1.82-.13-.2A5.11 5.11 0 0 1 8.02 2.84Zm-2.3 2.6c-.12 0-.3.04-.46.22-.16.18-.6.59-.6 1.43 0 .85.61 1.66.7 1.78.09.12 1.2 1.9 2.95 2.6 1.45.57 1.75.46 2.07.43.31-.03 1-.4 1.15-.8.14-.4.14-.73.1-.8-.04-.08-.16-.12-.34-.2-.18-.1-1-.5-1.16-.55-.15-.06-.27-.09-.38.08-.11.18-.43.55-.53.66-.1.12-.2.13-.37.05-.18-.09-.75-.28-1.43-.89-.53-.47-.89-1.05-.99-1.23-.1-.17-.01-.27.08-.35.08-.08.18-.21.27-.32.09-.1.12-.18.18-.3.06-.12.03-.22-.01-.31-.05-.09-.38-.94-.53-1.28-.14-.33-.28-.29-.38-.29Z" />
    </svg>
  );
}
