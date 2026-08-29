import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { TOTAL_QUESTIONS } from "@/content/assessment";
import {
  ReportDocument,
  type ReportData,
} from "@/components/report/ReportDocument";
import { prisma } from "@/lib/prisma";
import {
  domainName,
  formatReportDate,
  lowestScoringDomain,
  reportFilename,
  selectVariant,
} from "@/lib/report";
import { registerReportFonts } from "@/lib/report-fonts";
import {
  allDomainResults,
  byPriority,
  questionsAnswered,
  type Ratings,
} from "@/lib/scoring";

// The PDF is built with Node libraries and reads font files from disk, so it
// cannot run on the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    select: {
      fullName: true,
      schoolName: true,
      schoolType: true,
      enrolment: true,
      region: true,
      createdAt: true,
      completedAt: true,
    },
  });

  if (!assessment) {
    return new Response("Not found", { status: 404 });
  }

  const responses = await prisma.response.findMany({
    where: { assessmentId: id },
    select: { questionId: true, rating: true },
  });

  const ratings: Ratings = {};
  for (const response of responses) {
    ratings[response.questionId] = response.rating;
  }

  // A report is only produced for a finished assessment, since a partial one
  // would carry domains with no score at all.
  if (questionsAnswered(ratings) !== TOTAL_QUESTIONS) {
    return Response.redirect(new URL(`/a/${id}/results`, _request.url), 303);
  }

  const results = byPriority(allDomainResults(ratings));
  const lowest = lowestScoringDomain(results);
  const assessmentDate = assessment.completedAt ?? assessment.createdAt;

  const data: ReportData = {
    schoolName: assessment.schoolName,
    principalName: assessment.fullName,
    schoolType: assessment.schoolType,
    enrolment: assessment.enrolment,
    region: assessment.region,
    assessmentDate: formatReportDate(assessmentDate),
    results,
    variant: selectVariant(results),
    lowestDomainName: lowest ? domainName(lowest.domainId) : "your lowest scoring domain",
  };

  registerReportFonts();

  // ReportDocument returns a <Document>, but its own props are the report
  // data, so the element is retyped for the renderer.
  const element = createElement(ReportDocument, {
    data,
  }) as unknown as ReactElement<DocumentProps>;

  const pdf = await renderToBuffer(element);
  const filename = reportFilename(assessment.schoolName, assessmentDate);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": "no-store",
    },
  });
}
