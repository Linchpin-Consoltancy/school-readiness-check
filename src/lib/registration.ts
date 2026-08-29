import { z } from "zod";

/** Dropdown options. The stored value is the label itself, which keeps the
 *  admin export readable without a lookup table. */
export const SCHOOL_TYPES = [
  "Private Primary",
  "Private Secondary",
  "Private Combined",
] as const;

export const ENROLMENT_BANDS = [
  "Under 200",
  "200 to 500",
  "500 to 1000",
  "Over 1000",
] as const;

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "That name is longer than we can store."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(254, "That email address is longer than we can store.")
    .toLowerCase()
    .pipe(z.email("Please enter a valid email address.")),
  schoolName: z
    .string()
    .trim()
    .min(2, "Please enter your school name.")
    .max(160, "That school name is longer than we can store."),
  schoolType: z.enum(SCHOOL_TYPES, {
    error: "Please select your school type.",
  }),
  enrolment: z.enum(ENROLMENT_BANDS, {
    error: "Please select your approximate enrolment.",
  }),
  // Optional. An empty box is stored as nothing rather than an empty string.
  region: z
    .string()
    .trim()
    .max(120, "That entry is longer than we can store.")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

/** Field-level errors keyed by input name, plus the values the principal
 *  typed so the form can be redrawn without losing their work. */
export type RegistrationState = {
  errors?: Partial<Record<keyof RegistrationInput | "form", string[]>>;
  values?: Record<string, string>;
};
