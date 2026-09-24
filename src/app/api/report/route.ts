import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { ALL_QUESTION_IDS, TOTAL_QUESTIONS } from "@/content/assessment";
import {
  ReportDocument,
  type ReportData,
} from "@/components/report/ReportDocument";
import { contextSchema } from "@/lib/profile";
import {
  domainName,
  formatReportDate,
  lowestScoringDomain,
  reportFilename,
  selectVariant,
} from "@/lib/report";
import { registerReportFonts } from "@/lib/report-fonts";
import { allDomainResults, byPriority, type Ratings } from "@/lib/scoring";

// The PDF is built with Node libraries and reads font files from disk, so it
// cannot run on the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_QUESTION_IDS = new Set(ALL_QUESTION_IDS);

/**
 * Builds the report from what the browser sends and hands it straight back.
 *
 * Nothing is read from a database because there is no database. The answers
 * live in the director's own browser until this moment, and are gone again as
 * soon as the response is written.
 *
 * The request arrives as an ordinary form post rather than as JSON, so the
 * download works as a plain button with no JavaScript behind it.
 */
export async function POST(request: Request) {
  let payload: unknown;

  try {
    const form = await request.formData();
    const raw = form.get("payload");
    if (typeof raw !== "string") {
      return new Response("Bad request", { status: 400 });
    }
    payload = JSON.parse(raw);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return new Response("Bad request", { status: 400 });
  }

  const { context: rawContext, answers: rawAnswers } = payload as {
    context?: unknown;
    answers?: unknown;
  };

  const parsed = contextSchema.safeParse(rawContext);
  if (!parsed.success) {
    return new Response("Bad request", { status: 400 });
  }

  if (typeof rawAnswers !== "object" || rawAnswers === null) {
    return new Response("Bad request", { status: 400 });
  }

  /* --- the answers have to be complete and in range --------------------- */

  const answers = rawAnswers as Record<string, unknown>;
  const ratings: Ratings = {};

  for (const questionId of ALL_QUESTION_IDS) {
    const rating = answers[questionId];
    if (
      !Number.isInteger(rating) ||
      (rating as number) < 1 ||
      (rating as number) > 4
    ) {
      return new Response("Incomplete assessment", { status: 400 });
    }
    ratings[questionId] = rating as number;
  }

  for (const key of Object.keys(answers)) {
    if (!VALID_QUESTION_IDS.has(key)) {
      return new Response("Bad request", { status: 400 });
    }
  }

  if (Object.keys(ratings).length !== TOTAL_QUESTIONS) {
    return new Response("Incomplete assessment", { status: 400 });
  }

  /* --- build it --------------------------------------------------------- */

  const results = byPriority(allDomainResults(ratings));
  const lowest = lowestScoringDomain(results);
  const assessmentDate = new Date();

  const data: ReportData = {
    schoolName: parsed.data.schoolName,
    schoolType: parsed.data.schoolType,
    enrolment: parsed.data.enrolment,
    region: parsed.data.region ?? null,
    assessmentDate: formatReportDate(assessmentDate),
    results,
    variant: selectVariant(results),
    lowestDomainName: lowest
      ? domainName(lowest.domainId)
      : "your lowest scoring domain",
  };

  registerReportFonts();

  // ReportDocument returns a <Document>, but its own props are the report
  // data, so the element is retyped for the renderer.
  const element = createElement(ReportDocument, {
    data,
  }) as unknown as ReactElement<DocumentProps>;

  const pdf = await renderToBuffer(element);
  const filename = reportFilename(parsed.data.schoolName, assessmentDate);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "no-store",
    },
  });
}
