/**
 * Every school that has completed the check, with their contact details and
 * their headline result.
 *
 *   npm run leads            a readable table
 *   npm run leads -- --csv   the same thing as CSV, for a spreadsheet
 *
 * This is the interim answer until the admin screen is built. Nothing here
 * recalculates anything: it reads what was stored at the time, which is the
 * same data the report is built from.
 */

import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { ALL_QUESTION_IDS, DOMAINS } from "../src/content/assessment";
import { formatScore, tierById } from "../src/lib/scoring";

const DOMAIN_BY_ID = new Map(DOMAINS.map((domain) => [domain.id, domain]));
const CURRENT_QUESTIONS = new Set(ALL_QUESTION_IDS);

function csvCell(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function main() {
  const prisma = new PrismaClient();
  const asCsv = process.argv.includes("--csv");

  const assessments = await prisma.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      domainScores: true,
      responses: { select: { questionId: true } },
    },
  });

  if (assessments.length === 0) {
    console.log("No checks completed yet.");
    await prisma.$disconnect();
    return;
  }

  const rows = assessments.map((assessment) => {
    // A record taken before the questions changed still holds its answers,
    // but they no longer line up with the current check, so its stored
    // scores describe an instrument that no longer exists. Say so rather
    // than let old figures pass for current ones.
    const stale =
      assessment.responses.length > 0 &&
      !assessment.responses.some((response) =>
        CURRENT_QUESTIONS.has(response.questionId),
      );

    const scored = [...assessment.domainScores].sort((a, b) => a.score - b.score);
    const lowest = scored[0];

    const counts = { critical: 0, high: 0, moderate: 0, sustain: 0 } as Record<
      string,
      number
    >;
    for (const row of assessment.domainScores) counts[row.tier] += 1;

    return {
      date: assessment.completedAt ?? assessment.createdAt,
      status: stale ? "earlier version" : assessment.status,
      stale,
      name: assessment.fullName,
      school: assessment.schoolName,
      email: assessment.email,
      phone: assessment.phone,
      county: assessment.region ?? "",
      schoolType: assessment.schoolType,
      enrolment: assessment.enrolment,
      answered: assessment.responses.length,
      areasScored: assessment.domainScores.length,
      lowestArea: lowest
        ? (DOMAIN_BY_ID.get(lowest.domainId)?.name ?? lowest.domainId)
        : "",
      lowestScore: lowest ? formatScore(lowest.score) : "",
      lowestTier: lowest ? (tierById(lowest.tier)?.label ?? lowest.tier) : "",
      spread: `${counts.critical}C ${counts.high}H ${counts.moderate}M ${counts.sustain}S`,
      reportLink: `/a/${assessment.id}/report`,
      id: assessment.id,
    };
  });

  if (asCsv) {
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(",")];
    for (const row of rows) {
      lines.push(
        headers
          .map((key) => {
            const value = (row as Record<string, unknown>)[key];
            return csvCell(
              value instanceof Date ? value.toISOString() : (value as string),
            );
          })
          .join(","),
      );
    }
    const out = lines.join("\n");
    fs.writeFileSync("leads.csv", out, "utf8");
    console.log(`Wrote ${rows.length} rows to leads.csv`);
    await prisma.$disconnect();
    return;
  }

  const complete = rows.filter((row) => row.status === "complete").length;
  console.log("");
  console.log(
    `${rows.length} school${rows.length === 1 ? "" : "s"}, ${complete} completed the whole check.`,
  );
  console.log("");

  for (const row of rows) {
    const stamp = row.date.toISOString().slice(0, 10);
    console.log(`${stamp}  ${row.school}`);
    console.log(
      `            ${row.name}  |  ${row.email}  |  ${row.phone}${row.county ? `  |  ${row.county}` : ""}`,
    );
    console.log(`            ${row.schoolType}, ${row.enrolment}`);
    if (row.stale) {
      console.log(
        `            Taken on an earlier version of the check. ${row.answered} answers kept, but they do not match the current questions, so no current score.`,
      );
    } else if (row.status === "complete") {
      console.log(
        `            Weakest: ${row.lowestArea} ${row.lowestScore} (${row.lowestTier})   Spread: ${row.spread}`,
      );
    } else {
      console.log(
        `            Not finished. ${row.answered} of 21 answered, ${row.areasScored} areas scored.`,
      );
    }
    console.log(`            Report: ${row.reportLink}`);
    console.log("");
  }

  console.log("Run with --csv to write leads.csv for a spreadsheet.");
  console.log("");

  await prisma.$disconnect();
}

void main();
