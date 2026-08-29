/**
 * Recalculates and rewrites the stored results for every assessment.
 *
 * Run with: npm run recalculate
 *
 * Normally results are written as answers are saved, so this is not needed.
 * It exists for the case where the scoring rules themselves change, so that
 * assessments taken under the old rules are brought up to date rather than
 * left holding stale figures.
 */

import { PrismaClient } from "@prisma/client";
import { refreshResults } from "../src/lib/results";

async function main() {
  const prisma = new PrismaClient();

  const assessments = await prisma.assessment.findMany({
    select: { id: true, schoolName: true },
    orderBy: { createdAt: "asc" },
  });

  if (assessments.length === 0) {
    console.log("No assessments to recalculate.");
    await prisma.$disconnect();
    return;
  }

  console.log(`Recalculating ${assessments.length} assessment(s).`);

  for (const assessment of assessments) {
    await refreshResults(assessment.id);
    const scored = await prisma.domainScore.count({
      where: { assessmentId: assessment.id },
    });
    const current = await prisma.assessment.findUnique({
      where: { id: assessment.id },
      select: { status: true },
    });
    console.log(
      `  ${assessment.schoolName.padEnd(28)} ${String(scored).padStart(2)} of 7 domains scored, status ${current?.status}`,
    );
  }

  console.log("Done.");
  await prisma.$disconnect();
}

void main();
