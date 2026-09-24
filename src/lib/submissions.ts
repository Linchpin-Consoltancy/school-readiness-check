import { DOMAINS } from "@/content/assessment";
import { lowestScoringDomain } from "@/lib/report";
import { formatScore, type DomainResult } from "@/lib/scoring";
import type { SchoolContext } from "@/lib/profile";

/* ---------------------------------------------------------------------------
   Netlify Forms is the only place anything is stored.

   Two records are kept, and they are deliberately separate. The anonymous one
   carries no name and no school, and exists so that patterns across Kenyan
   schools can be read. The lead one exists only because a director asked to
   be contacted, and is never sent otherwise.

   Netlify detects forms by scanning static HTML at deploy time, which never
   includes anything Next.js renders. public/__forms.html holds the field
   definitions. Field names here must match that file exactly, or the value is
   dropped without an error.
   --------------------------------------------------------------------------- */

/** The POST has to go to the static file itself. A POST to "/" is swallowed
 *  by the server side rendering handler and never reaches form processing. */
const FORMS_ENDPOINT = "/__forms.html";

/** Long enough for a slow connection, short enough that a director on a bad
 *  line is never left staring at a button. */
const TIMEOUT_MS = 8000;

async function post(fields: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetch(FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields).toString(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    // Recording a submission is our business, not the director's. If it
    // fails they still get their results and their report.
    return false;
  }
}

/** Domain id to its score, as a plain string, for every finished domain. */
function domainFields(results: DomainResult[]): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const domain of DOMAINS) {
    const result = results.find((item) => item.domainId === domain.id);
    fields[domain.id] =
      result && result.displayScore !== null
        ? formatScore(result.displayScore)
        : "";
  }
  return fields;
}

/**
 * Sent the moment the results are worked out, for every director who
 * finishes. Carries the school's shape and its scores, and nothing that
 * could identify a person or a school by name.
 */
export function recordAnonymous(
  context: SchoolContext,
  answers: Record<string, number>,
  results: DomainResult[],
): Promise<boolean> {
  const fields: Record<string, string> = {
    "form-name": "readiness-anon",
    schoolType: context.schoolType,
    enrolment: context.enrolment,
    region: context.region ?? "",
    ...domainFields(results),
  };

  for (const [questionId, rating] of Object.entries(answers)) {
    fields[questionId] = String(rating);
  }

  return post(fields);
}

/**
 * Sent only when a director fills in the contact block and ticks the box.
 * Netlify emails this one across, so it carries enough context to make the
 * follow up worth reading.
 */
export function recordLead(
  contact: { fullName: string; phone: string; email?: string },
  context: SchoolContext,
  results: DomainResult[],
): Promise<boolean> {
  const lowest = lowestScoringDomain(results);
  const lowestName = lowest
    ? (DOMAINS.find((domain) => domain.id === lowest.domainId)?.name ?? "")
    : "";

  return post({
    "form-name": "readiness-lead",
    fullName: contact.fullName,
    phone: contact.phone,
    email: contact.email ?? "",
    consent: "yes",
    schoolName: context.schoolName,
    schoolType: context.schoolType,
    enrolment: context.enrolment,
    region: context.region ?? "",
    ...domainFields(results),
    lowestDomain: lowestName,
  });
}
