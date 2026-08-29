import { PrismaClient } from "@prisma/client";
import { DOMAINS } from "../src/content/assessment";
import { domainResult, formatScore } from "../src/lib/scoring";

async function main() {
  const prisma = new PrismaClient();
  const id = process.argv[2];
  if (!id) {
    console.log("Usage: npx tsx scripts/checkall.ts <assessment-id>");
    process.exit(1);
  }

  const rows = await prisma.response.findMany({
    where: { assessmentId: id },
    select: { questionId: true, rating: true },
  });
  const ratings: Record<string, number | null> = {};
  for (const row of rows) ratings[row.questionId] = row.rating;

  console.log("Domain                              A     B     C  |  Score  Tier                 Gap");
  console.log("-".repeat(92));
  for (const domain of DOMAINS) {
    const result = domainResult(domain, ratings);
    const lenses = result.lenses
      .map((lens) => (lens.score === null ? "   - " : formatScore(lens.score).padStart(4)))
      .join("  ");
    console.log(
      domain.name.padEnd(33),
      lenses,
      " | ",
      (result.score === null ? "-" : formatScore(result.score)).padStart(5),
      " ",
      (result.tier?.label ?? "-").padEnd(20),
      result.gapLenses.length ? "lens " + result.gapLenses.join(", ") : "none",
    );
  }

  await prisma.$disconnect();
}

void main();
