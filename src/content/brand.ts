/* ===========================================================================
   BRAND AND CONTACT
   ===========================================================================

   The details that sit in the frame around the tool, visible on every screen.

   THREE VALUES BELOW ARE PLACEHOLDERS AND NEED YOUR REAL DETAILS.
   Look for "REPLACE ME". Everything else is ready to go.
   =========================================================================== */

export const CONTACT = {
  /** Shown as the link text and used as the address. */
  website: "linchpineducation.com",
  websiteUrl: "https://linchpineducation.com",

  /** REPLACE ME with the address you want school directors to write to. */
  email: "hello@linchpineducation.com",

  /** REPLACE ME. How the number should read on screen. */
  whatsappDisplay: "+254 700 000 000",

  /** REPLACE ME. The same number in international format with no spaces,
   *  plus or leading zeros. For example 254712345678. This one builds the
   *  click to chat link, so it has to be exact or the link will not open. */
  whatsappNumber: "254700000000",

  /** The message already typed for them when they tap WhatsApp. */
  whatsappMessage:
    "Hello Linchpin, I have just completed the School Readiness Check and would like to talk about my school.",

  personName: "Joseph Omondi",
} as const;

export function whatsappLink(message: string = CONTACT.whatsappMessage): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** True while the placeholders above are still in place, so the tool can warn
 *  you rather than quietly publish a number that does not work. */
export const CONTACT_NEEDS_REAL_DETAILS =
  CONTACT.whatsappNumber === "254700000000" ||
  CONTACT.email === "hello@linchpineducation.com";

/* ---------------------------------------------------------------------------
   The line that sits in the frame on every screen
   --------------------------------------------------------------------------- */

export const FRAME_TAGLINE = "School systems that hold under pressure";

export const FRAME_BLURB =
  "Linchpin works with school owners and heads across Kenya to turn good intentions into systems that run without you in the room.";
