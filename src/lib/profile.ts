import { z } from "zod";

/* ---------------------------------------------------------------------------
   Two separate things are collected, and the split matters.

   The school context is asked for before the results appear. It describes an
   institution, not a person, so it carries no data protection weight and can
   safely be required.

   The contact details are offered afterwards, once the director already has
   their results and owes us nothing. They are optional throughout, and are
   only ever stored alongside an explicit tick of the consent box.

   These live here rather than beside the server action because a file marked
   "use server" may only export async functions. Anything else exported from
   one arrives in the browser as a stub rather than the value itself.
   --------------------------------------------------------------------------- */

export const SCHOOL_TYPES = [
  "Pre-primary and Primary",
  "Primary and Junior School",
  "Junior and Senior School",
  "All through, Pre-primary to Senior",
  "Other",
] as const;

export const ENROLMENT_BANDS = [
  "Under 200 learners",
  "200 to 500 learners",
  "500 to 1000 learners",
  "Over 1000 learners",
] as const;

/* --- the school ---------------------------------------------------------- */

export const contextSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(2, "Please enter your school name.")
    .max(160, "That school name is longer than we can store."),
  schoolType: z.enum(SCHOOL_TYPES, {
    error: "Please choose the option closest to your school.",
  }),
  enrolment: z.enum(ENROLMENT_BANDS, {
    error: "Please choose your approximate enrolment.",
  }),
  region: z
    .string()
    .trim()
    .max(120, "That entry is longer than we can store.")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type SchoolContext = z.infer<typeof contextSchema>;

/* --- the person ---------------------------------------------------------- */

/**
 * Kenyan numbers arrive in many shapes: 0712..., +254 712..., 254712...
 * All are accepted and stored as typed. The only thing rejected is something
 * that could not be a phone number at all.
 */
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Please enter a number we can reach you on.")
  .max(24, "That number is longer than we can store.")
  .refine(
    (value) => (value.match(/\d/g) ?? []).length >= 7,
    "Please enter a number we can reach you on.",
  );

/**
 * Email is the second way to reach someone, not the first. A director who
 * gives a WhatsApp number and leaves this blank is a complete record.
 */
const optionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "That email address is longer than we can store.")
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "Please enter a valid email address.",
  )
  .transform((value) => (value === "" ? undefined : value));

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "That name is longer than we can store."),
  phone: phoneSchema,
  email: optionalEmailSchema,
  /** The consent record. Nothing is written unless this is true. */
  consent: z
    .boolean()
    .refine(
      (value) => value === true,
      "Please tick the box so we know we may contact you.",
    ),
});

export type Contact = z.infer<typeof contactSchema>;

/* --- what the actions hand back ------------------------------------------ */

type Errors = Record<string, string[] | undefined>;

export type SubmitResult =
  | { ok: true; assessmentId: string }
  | { ok: false; errors: Errors };

export type ContactResult = { ok: true } | { ok: false; errors: Errors };
