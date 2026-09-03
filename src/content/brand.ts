/* ===========================================================================
   BRAND AND CONTACT
   ===========================================================================

   The details that sit in the frame around the tool, visible on every screen.

   All values here are live. If a detail changes, change it here and it
   updates everywhere it appears, on screen and in the report.
   =========================================================================== */

export const CONTACT = {
  /** Shown as the link text and used as the address. */
  website: "linchpineducation.com",
  websiteUrl: "https://linchpineducation.com",

  email: "linchpineducation.ke@gmail.com",

  /** How the number reads on screen. Change freely, it is only a label. */
  whatsappDisplay: "0702 760 471",

  /** The same number in international form, no spaces, no plus, no leading
   *  zero. This builds the click to chat link, so it has to stay exact. */
  whatsappNumber: "254702760471",

  /** The message already typed for them when they tap WhatsApp. */
  whatsappMessage:
    "Hello Linchpin, I have just completed the School Readiness Check and would like to talk about my school.",

  personName: "Joseph Omondi",
} as const;

export function whatsappLink(message: string = CONTACT.whatsappMessage): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** The WhatsApp link only works if the number is digits alone, in
 *  international form. npm run verify checks this. */
export function whatsappNumberIsWellFormed(): boolean {
  return /^\d{9,15}$/.test(CONTACT.whatsappNumber);
}

export function emailIsWellFormed(): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT.email);
}

/* ---------------------------------------------------------------------------
   The logo
   ---------------------------------------------------------------------------
   The mark is drawn from the same geometry as linchpin-mark-onyx.svg rather
   than loaded as a file, so it stays crisp at any size, needs no network
   request, and can be recoloured for a dark background. The wordmark is set
   in real Jost rather than as SVG text, so it renders with the typeface the
   page has already loaded instead of whatever the viewer happens to have.

   The original files are in public/brand if you need them for anything else.
   --------------------------------------------------------------------------- */

export const MARK = {
  /** The artwork sits on this grid. */
  viewBox: "0 0 54 72",
  strokeWidth: 2.5,
  ring: { cx: 27, cy: 19, r: 14.5 },
  core: { cx: 27, cy: 19, r: 5 },
  stem: { x1: 27, y1: 33.5, x2: 27, y2: 56 },
  legLeft: "M27 56 L14 70",
  legRight: "M27 56 L40 70",
} as const;

/* ---------------------------------------------------------------------------
   The line that sits in the frame on every screen
   --------------------------------------------------------------------------- */

export const FRAME_TAGLINE = "School systems that hold under pressure";

export const FRAME_BLURB =
  "Linchpin works with school owners and heads across Kenya to turn good intentions into systems that run without you in the room.";
