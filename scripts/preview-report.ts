/**
 * Downloads a report from the running development server and renders every
 * page to a PNG, so the design can be looked at rather than guessed at.
 *
 * Run with: npm run preview-report <assessment-id>
 * The development server must be running.
 *
 * Output goes to .preview/ in the project root, which git ignores. This is a
 * development aid and forms no part of the deployed site.
 */

import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import { PrismaClient } from "@prisma/client";
import {
  domainName,
  lowestScoringDomain,
  selectVariant,
} from "../src/lib/report";
import { allDomainResults, byPriority, type Ratings } from "../src/lib/scoring";

const SCALE = 2;
const BASE_URL = process.env.PREVIEW_BASE_URL ?? "http://localhost:3000";

async function main() {
  const prisma = new PrismaClient();
  const id = process.argv[2];

  if (!id) {
    console.log("Usage: npm run preview-report <assessment-id>");
    process.exit(1);
  }

  /* --- what the report should contain, for cross checking --------------- */

  const responses = await prisma.response.findMany({
    where: { assessmentId: id },
    select: { questionId: true, rating: true },
  });

  const ratings: Ratings = {};
  for (const response of responses) {
    ratings[response.questionId] = response.rating;
  }

  const results = byPriority(allDomainResults(ratings));
  const lowest = lowestScoringDomain(results);
  const variant = selectVariant(results);

  console.log(`Variant ${variant.id}: ${variant.reason}`);
  if (variant.fellBack) console.log("  (this used the fallback rule)");
  console.log(
    `Lowest scoring domain: ${lowest ? domainName(lowest.domainId) : "none"}`,
  );

  await prisma.$disconnect();

  /* --- fetch the real report from the running server -------------------- */

  const url = `${BASE_URL}/a/${id}/report`;
  const response = await fetch(url, { redirect: "manual" });

  if (response.status !== 200) {
    console.log(
      `${url} returned ${response.status}. Is the development server running, and is the assessment finished?`,
    );
    process.exit(1);
  }

  const disposition = response.headers.get("content-disposition") ?? "";
  const filename =
    disposition.match(/filename="([^"]+)"/)?.[1] ?? "report.pdf";

  const pdf = Buffer.from(await response.arrayBuffer());

  const outDir = path.join(process.cwd(), ".preview");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, filename), pdf);

  console.log(`Filename: ${filename}`);
  console.log(`Size: ${(pdf.length / 1024).toFixed(1)} KB`);

  /* --- rasterise every page --------------------------------------------- */

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(pdf),
    useSystemFonts: false,
  }).promise;

  console.log(`Pages: ${doc.numPages}`);

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: SCALE });
    const canvas = createCanvas(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height),
    );
    const context = canvas.getContext("2d");

    await page.render({
      // The two canvas implementations line up at runtime even though their
      // types come from different packages.
      canvasContext: context as unknown as CanvasRenderingContext2D,
      viewport,
      canvas: canvas as unknown as HTMLCanvasElement,
    }).promise;

    const imagePath = path.join(outDir, `page-${pageNumber}.png`);
    fs.writeFileSync(imagePath, canvas.toBuffer("image/png"));
    console.log(`  page ${pageNumber} -> ${path.relative(process.cwd(), imagePath)}`);
  }
}

void main();
