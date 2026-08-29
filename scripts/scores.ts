/**
 * Prints one school's results and checks the stored figures against a fresh
 * calculation.
 *
 * Run with: npm run scores <assessment-id>
 */

import { PrismaClient } from "@prisma/client";
import { DOMAINS } from "../src/content/assessment";
import {
  allDomainResults,
  byPriority,
  formatScore,
  tierById,
  type Ratings,
} from "../src/lib/scoring";

const DOMAIN_BY_ID = new Map(DOMAINS.map((domain) => [domain.id, domain]));

/**
 * Writing a number to the database and reading it back can shift it by one
 * unit in the last place, about 4e-16. The nearest rounding boundary to any
 * real domain score is 0.05 away, so a difference of this size can never move
 * a displayed score or a tier. Anything larger is a genuine fault.
 */
const STORAGE_TOLERANCE = 1e-9;

async function main() {
  const prisma = new PrismaClient();
  const id = process.argv[2];

  if (!id) {
    console.log("Usage: npm run scores <assessment-id>");
    process.exit(1);
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    select: {
      schoolName: true,
      fullName: true,
      status: true,
      completedAt: true,
    },
  });

  if (!assessment) {
    console.log(`No assessment found with id ${id}`);
    await prisma.$disconnect();
    process.exit(1);
  }

  const responses = await prisma.response.findMany({
    where: { assessmentId: id },
    select: { questionId: true, rating: true },
  });

  const ratings: Ratings = {};
  for (const response of responses) {
    ratings[response.questionId] = response.rating;
  }

  const stored = await prisma.domainScore.findMany({
    where: { assessmentId: id },
  });
  const storedById = new Map(stored.map((row) => [row.domainId, row]));

  console.log("");
  console.log(`${assessment.schoolName}  (${assessment.fullName})`);
  console.log(
    `status: ${assessment.status}${
      assessment.completedAt
        ? `, completed ${assessment.completedAt
            .toISOString()
            .slice(0, 16)
            .replace("T", " ")}`
        : ""
    }`,
  );
  console.log("");

  console.log(
    "Domain                              A     B     C  |  Score  Tier                 Gap",
  );
  console.log("-".repeat(94));

  for (const result of byPriority(allDomainResults(ratings))) {
    const domain = DOMAIN_BY_ID.get(result.domainId);
    if (!domain) continue;

    const lenses = result.lenses
      .map((lens) =>
        lens.score === null ? "   - " : formatScore(lens.score).padStart(4),
      )
      .join("  ");

    console.log(
      domain.name.padEnd(33),
      lenses,
      " | ",
      (result.displayScore === null
        ? "-"
        : formatScore(result.displayScore)
      ).padStart(5),
      " ",
      (result.tier?.label ?? "not scored").padEnd(20),
      result.gapFlag ? `lens ${result.gapLenses.join(", ")}` : "none",
    );
  }

  /* --- stored against calculated ---------------------------------------- */

  console.log("");
  console.log("Stored results checked against a fresh calculation");
  console.log("-".repeat(50));

  let mismatches = 0;

  for (const result of allDomainResults(ratings)) {
    const row = storedById.get(result.domainId);
    const name = DOMAIN_BY_ID.get(result.domainId)?.name ?? result.domainId;

    if (!result.complete) {
      if (row) {
        mismatches += 1;
        console.log(`  MISMATCH  ${name}: incomplete, but a stored row exists`);
      }
      continue;
    }

    if (!row) {
      mismatches += 1;
      console.log(`  MISMATCH  ${name}: complete, but nothing stored`);
      continue;
    }

    const problems: string[] = [];
    if (Math.abs(row.score - (result.score as number)) > STORAGE_TOLERANCE) {
      problems.push(`score stored ${row.score}, calculated ${result.score}`);
    }
    if (row.tier !== result.tier?.id) {
      problems.push(`tier stored ${row.tier}, calculated ${result.tier?.id}`);
    }
    if (row.gapFlag !== result.gapFlag) {
      problems.push(
        `gap flag stored ${row.gapFlag}, calculated ${result.gapFlag}`,
      );
    }
    if (row.gapLenses !== result.gapLenses.join(",")) {
      problems.push(
        `gap lenses stored "${row.gapLenses}", calculated "${result.gapLenses.join(",")}"`,
      );
    }

    if (problems.length > 0) {
      mismatches += 1;
      console.log(`  MISMATCH  ${name}: ${problems.join("; ")}`);
    }
  }

  if (mismatches === 0) {
    console.log(`  All ${stored.length} stored rows match the calculation.`);
    console.log("");
    console.log("  Full precision is kept in the database:");
    for (const row of stored.slice(0, 3)) {
      const tier = tierById(row.tier);
      const name = DOMAIN_BY_ID.get(row.domainId)?.name ?? row.domainId;
      console.log(
        `    ${name.padEnd(33)} stored ${String(row.score).padEnd(20)} shown ${formatScore(row.score)}  ${tier?.label ?? row.tier}`,
      );
    }
    if (stored.length > 3) console.log(`    and ${stored.length - 3} more.`);
  }

  console.log("");
  await prisma.$disconnect();
  process.exit(mismatches === 0 ? 0 : 1);
}

void main();
