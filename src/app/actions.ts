"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { registrationSchema, type RegistrationState } from "@/lib/registration";

/** The assessment id is also the private link a principal uses to reach
 *  their own session, so it is generated with cryptographic randomness
 *  rather than a guessable counter. */
function newAssessmentId(): string {
  return randomBytes(18).toString("base64url");
}

export async function registerAssessment(
  _previous: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const submitted = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    schoolName: String(formData.get("schoolName") ?? ""),
    schoolType: String(formData.get("schoolType") ?? ""),
    enrolment: String(formData.get("enrolment") ?? ""),
    region: String(formData.get("region") ?? ""),
  };

  const parsed = registrationSchema.safeParse(submitted);

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      values: submitted,
    };
  }

  let assessmentId: string;

  try {
    const assessment = await prisma.assessment.create({
      data: { id: newAssessmentId(), ...parsed.data },
      select: { id: true },
    });
    assessmentId = assessment.id;
  } catch {
    return {
      errors: {
        form: ["We could not save your details just now. Please try again."],
      },
      values: submitted,
    };
  }

  // Kept outside the try block: redirect works by throwing a control-flow
  // signal that a catch block would otherwise swallow.
  redirect(`/a/${assessmentId}/welcome`);
}
