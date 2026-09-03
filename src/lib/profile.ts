import { z } from "zod";

/* ---------------------------------------------------------------------------
   What the capture form collects.

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

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "That name is longer than we can store."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(254, "That email address is longer than we can store.")
    .toLowerCase()
    .pipe(z.email("Please enter a valid email address.")),
  phone: phoneSchema,
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

export type Profile = z.infer<typeof profileSchema>;

export type SubmitResult =
  | { ok: true; assessmentId: string }
  | { ok: false; errors: Record<string, string[] | undefined> };
