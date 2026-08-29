/**
 * Checks the assessment content and the scoring rules.
 *
 * Run with: npm run verify
 *
 * This is not a substitute for testing the tool by hand. It is here to prove
 * the arithmetic, because the scores drive the report and a quiet mistake in
 * them would be invisible on screen.
 */

import {
  ALL_QUESTION_IDS,
  DOMAINS,
  RATING_SCALE,
  TOTAL_QUESTIONS,
  TOTAL_SECTIONS,
} from "../src/content/assessment";
import {
  allDomainResults,
  byPriority,
  domainResult,
  formatScore,
  lensScore,
  roundToOneDecimal,
  sectionsComplete,
  tierFor,
  TIERS,
  type Ratings,
} from "../src/lib/scoring";
import { STEPS } from "../src/lib/steps";

let failures = 0;
let checks = 0;

function check(label: string, condition: boolean, detail = "") {
  checks += 1;
  if (!condition) {
    failures += 1;
    console.log(`  FAIL  ${label}${detail ? ` :: ${detail}` : ""}`);
  }
}

function heading(text: string) {
  console.log(`\n${text}`);
  console.log("-".repeat(text.length));
}

/* -------------------------------------------------------------------------
   Content
   ------------------------------------------------------------------------- */

heading("Content");

check("seven domains", DOMAINS.length === 7, `found ${DOMAINS.length}`);
check("21 sections", TOTAL_SECTIONS === 21, `found ${TOTAL_SECTIONS}`);
check("42 questions", TOTAL_QUESTIONS === 42, `found ${TOTAL_QUESTIONS}`);
check(
  "question ids are unique",
  new Set(ALL_QUESTION_IDS).size === ALL_QUESTION_IDS.length,
);
check("four rating options", RATING_SCALE.length === 4);

for (const domain of DOMAINS) {
  check(
    `${domain.id} has three lenses`,
    domain.lenses.length === 3,
    `found ${domain.lenses.length}`,
  );
  check(
    `${domain.id} lenses are A, B, C`,
    domain.lenses.map((lens) => lens.id).join("") === "ABC",
  );
  for (const lens of domain.lenses) {
    check(
      `${domain.id} lens ${lens.id} has two questions`,
      lens.questions.length === 2,
    );
    for (const question of lens.questions) {
      check(
        `${question.id} has text`,
        question.text.trim().length > 20,
        question.text.slice(0, 30),
      );
      check(
        `${question.id} contains no em dash`,
        !question.text.includes("—"),
      );
    }
  }
}

console.log(`  ${DOMAINS.length} domains, ${TOTAL_QUESTIONS} questions read.`);

/* -------------------------------------------------------------------------
   Screen sequence
   ------------------------------------------------------------------------- */

heading("Screen sequence");

const expectedSteps = TOTAL_SECTIONS * 4 + DOMAINS.length;
check(
  `${expectedSteps} screens in the flow`,
  STEPS.length === expectedSteps,
  `found ${STEPS.length}`,
);
check(
  "screen addresses are unique",
  new Set(STEPS.map((step) => step.slug)).size === STEPS.length,
);
check("flow opens on a lens introduction", STEPS[0]?.kind === "lens-intro");
check(
  "flow closes on a domain summary",
  STEPS[STEPS.length - 1]?.kind === "domain-review",
);
check(
  "42 question screens",
  STEPS.filter((step) => step.kind === "question").length === 42,
);

console.log(`  ${STEPS.length} screens, first is "${STEPS[0]?.slug}".`);

/* -------------------------------------------------------------------------
   Scoring, worked examples
   ------------------------------------------------------------------------- */

heading("Scoring, worked examples");

const domain = DOMAINS[0];
const [lensA, lensB, lensC] = domain.lenses;

function ratingsFor(
  a: [number, number],
  b: [number, number],
  c: [number, number],
): Ratings {
  return {
    [lensA.questions[0].id]: a[0],
    [lensA.questions[1].id]: a[1],
    [lensB.questions[0].id]: b[0],
    [lensB.questions[1].id]: b[1],
    [lensC.questions[0].id]: c[0],
    [lensC.questions[1].id]: c[1],
  };
}

type Example = {
  label: string;
  a: [number, number];
  b: [number, number];
  c: [number, number];
  lenses: [number, number, number];
  domain: number;
  tier: string;
  gaps: string[];
};

const examples: Example[] = [
  {
    label: "all threes",
    a: [3, 3],
    b: [3, 3],
    c: [3, 3],
    lenses: [3, 3, 3],
    domain: 3.0,
    tier: "Moderate Priority",
    gaps: [],
  },
  {
    label: "all ones",
    a: [1, 1],
    b: [1, 1],
    c: [1, 1],
    lenses: [1, 1, 1],
    domain: 1.0,
    tier: "Critical Priority",
    gaps: [],
  },
  {
    label: "all fours",
    a: [4, 4],
    b: [4, 4],
    c: [4, 4],
    lenses: [4, 4, 4],
    domain: 4.0,
    tier: "Sustain and Extend",
    gaps: [],
  },
  {
    label: "strong design, no evidence",
    a: [4, 4],
    b: [4, 4],
    c: [1, 1],
    lenses: [4, 4, 1],
    domain: 3.0,
    tier: "Moderate Priority",
    gaps: ["A", "B", "C"],
  },
  {
    label: "mixed, rounds up",
    a: [2, 2],
    b: [2, 3],
    c: [2, 2],
    lenses: [2, 2.5, 2],
    domain: 2.2,
    tier: "High Priority",
    gaps: [],
  },
  {
    label: "top of High Priority band",
    a: [2, 3],
    b: [2, 3],
    c: [2, 3],
    lenses: [2.5, 2.5, 2.5],
    domain: 2.5,
    tier: "High Priority",
    gaps: [],
  },
  {
    label: "just into Moderate",
    a: [3, 3],
    b: [3, 3],
    c: [2, 2],
    lenses: [3, 3, 2],
    domain: 2.7,
    tier: "Moderate Priority",
    gaps: [],
  },
  {
    label: "brief worked example, domain 3",
    a: [3, 2],
    b: [3, 2],
    c: [2, 1],
    lenses: [2.5, 2.5, 1.5],
    domain: 2.2,
    tier: "High Priority",
    gaps: [],
  },
  {
    label: "one lens above the domain",
    a: [3, 4],
    b: [2, 2],
    c: [2, 2],
    lenses: [3.5, 2, 2],
    domain: 2.5,
    tier: "High Priority",
    gaps: ["A"],
  },
  {
    label: "practice lags design and data",
    a: [4, 4],
    b: [2, 2],
    c: [4, 3],
    lenses: [4, 2, 3.5],
    domain: 3.2,
    tier: "Moderate Priority",
    gaps: ["B"],
  },
];

for (const example of examples) {
  const ratings = ratingsFor(example.a, example.b, example.c);
  const result = domainResult(domain, ratings);

  const actualLenses = result.lenses.map((lens) => lens.score);
  check(
    `${example.label}: lens scores`,
    JSON.stringify(actualLenses) === JSON.stringify(example.lenses),
    `expected ${JSON.stringify(example.lenses)}, got ${JSON.stringify(actualLenses)}`,
  );
  check(
    `${example.label}: displayed domain score`,
    result.displayScore === example.domain,
    `expected ${example.domain}, got ${result.displayScore}`,
  );
  check(
    `${example.label}: stored score rounds to the displayed one`,
    roundToOneDecimal(result.score as number) === example.domain,
    `stored ${result.score}`,
  );
  check(
    `${example.label}: tier`,
    result.tier?.label === example.tier,
    `expected ${example.tier}, got ${result.tier?.label}`,
  );
  check(
    `${example.label}: lens gaps`,
    JSON.stringify(result.gapLenses) === JSON.stringify(example.gaps),
    `expected ${JSON.stringify(example.gaps)}, got ${JSON.stringify(result.gapLenses)}`,
  );

  console.log(
    `  ${example.label.padEnd(30)} lenses ${example.lenses
      .map((value) => value.toFixed(1))
      .join(" / ")}  ->  ${formatScore(result.score as number)}  ${
      result.tier?.label
    }${result.gapLenses.length ? `  (gap: lens ${result.gapLenses.join(", ")})` : ""}`,
  );
}

/* -------------------------------------------------------------------------
   The rule that a partial domain never produces a score
   ------------------------------------------------------------------------- */

heading("Partial domains");

const twoLenses = ratingsFor([3, 3], [3, 3], [3, 3]);
delete twoLenses[lensC.questions[1].id];

const partial = domainResult(domain, twoLenses);
check("no score when a lens is incomplete", partial.score === null);
check("no tier when a lens is incomplete", partial.tier === null);
check("domain is not marked complete", partial.complete === false);
check("no gap flags on an incomplete domain", partial.gapLenses.length === 0);
check("complete lenses still score", partial.lenses[0].score === 3);
check("incomplete lens has no score", partial.lenses[2].score === null);

const oneAnswerMissing = ratingsFor([3, 3], [3, 3], [3, 3]);
delete oneAnswerMissing[lensA.questions[0].id];
check(
  "a lens with one answer has no lens score",
  lensScore(lensA, oneAnswerMissing) === null,
);

console.log("  A domain score is withheld until all three lenses are done.");

/* -------------------------------------------------------------------------
   Every possible answer combination
   ------------------------------------------------------------------------- */

heading("Every possible combination for one domain");

const reachable = new Map<number, string>();
let combinations = 0;
let gapCount = 0;

for (let a1 = 1; a1 <= 4; a1++)
  for (let a2 = 1; a2 <= 4; a2++)
    for (let b1 = 1; b1 <= 4; b1++)
      for (let b2 = 1; b2 <= 4; b2++)
        for (let c1 = 1; c1 <= 4; c1++)
          for (let c2 = 1; c2 <= 4; c2++) {
            combinations += 1;
            const result = domainResult(
              domain,
              ratingsFor([a1, a2], [b1, b2], [c1, c2]),
            );

            if (result.score === null || result.tier === null) {
              check("every full domain produces a score and a tier", false);
              continue;
            }
            if (result.gapLenses.length > 0) gapCount += 1;
            reachable.set(result.score, result.tier.label);
          }

check("4096 combinations tested", combinations === 4096);
check(
  "every combination landed in a tier",
  reachable.size > 0 && [...reachable.values()].every(Boolean),
);

const ordered = [...reachable.keys()].sort((x, y) => x - y);
console.log(`  ${combinations} combinations, ${ordered.length} distinct scores.`);
console.log(
  `  ${gapCount} of ${combinations} combinations raise a lens gap flag.`,
);

for (const tier of TIERS) {
  const inTier = ordered.filter((score) => reachable.get(score) === tier.label);
  console.log(
    `  ${tier.label.padEnd(20)} ${tier.min.toFixed(1)} to ${tier.max.toFixed(
      1,
    )}   reachable: ${inTier.map((score) => score.toFixed(1)).join(", ") || "none"}`,
  );
}

/* -------------------------------------------------------------------------
   Tier bands
   ------------------------------------------------------------------------- */

heading("Tier bands");

for (let tenths = 10; tenths <= 40; tenths++) {
  const score = tenths / 10;
  const tier = tierFor(score);
  check(`${score.toFixed(1)} falls in a tier`, tier !== null);
}

check("1.9 is Critical", tierFor(1.9)?.id === "critical");
check("2.0 is High", tierFor(2.0)?.id === "high");
check("2.5 is High", tierFor(2.5)?.id === "high");
check("2.6 is Moderate", tierFor(2.6)?.id === "moderate");
check("3.2 is Moderate", tierFor(3.2)?.id === "moderate");
check("3.3 is Sustain", tierFor(3.3)?.id === "sustain");
check("4.0 is Sustain", tierFor(4.0)?.id === "sustain");
check("rounding lifts 2.55 to 2.6", roundToOneDecimal(2.55) === 2.6);
check("rounding is stable at 2.65", roundToOneDecimal(2.65) === 2.7);

console.log("  Every value from 1.0 to 4.0 in tenths belongs to one tier.");

/* -------------------------------------------------------------------------
   Progress counting
   ------------------------------------------------------------------------- */

heading("Progress counting");

check("no answers means no sections", sectionsComplete({}) === 0);

const oneSection: Ratings = {
  [lensA.questions[0].id]: 3,
  [lensA.questions[1].id]: 4,
};
check("one finished lens counts as one section", sectionsComplete(oneSection) === 1);

const halfSection: Ratings = { [lensA.questions[0].id]: 3 };
check("a half finished lens counts as none", sectionsComplete(halfSection) === 0);

const everything: Ratings = Object.fromEntries(
  ALL_QUESTION_IDS.map((id) => [id, 3]),
);
check("all answers means 21 sections", sectionsComplete(everything) === 21);

/* -------------------------------------------------------------------------
   Tier colours
   ------------------------------------------------------------------------- */

heading("Tier colours");

const EXPECTED_COLOURS: Record<string, string> = {
  critical: "#C0392B",
  high: "#C07B2A",
  moderate: "#4A6A28",
  sustain: "#2E5A7A",
};

for (const tier of TIERS) {
  check(
    `${tier.label} colour`,
    tier.color.toUpperCase() === EXPECTED_COLOURS[tier.id],
    `expected ${EXPECTED_COLOURS[tier.id]}, got ${tier.color}`,
  );
  console.log(`  ${tier.label.padEnd(20)} ${tier.color}`);
}

/* -------------------------------------------------------------------------
   Full precision is kept, display is rounded
   ------------------------------------------------------------------------- */

heading("Precision");

const precise = domainResult(domain, ratingsFor([3, 2], [3, 2], [2, 1]));
check(
  "stored score keeps full precision",
  precise.score !== null && precise.score.toFixed(10) === "2.1666666667",
  `got ${precise.score}`,
);
check("display score is rounded", precise.displayScore === 2.2);
check("formatted score reads 2.2", formatScore(precise.score as number) === "2.2");
console.log(
  `  stored ${precise.score}, displayed ${formatScore(precise.score as number)}`,
);

/* -------------------------------------------------------------------------
   Dashboard ordering
   ------------------------------------------------------------------------- */

heading("Dashboard ordering");

const spread: Ratings = {};
const wanted = [3, 1, 2, 4, 3, 2, 3];
DOMAINS.forEach((eachDomain, index) => {
  for (const lens of eachDomain.lenses) {
    for (const question of lens.questions) {
      spread[question.id] = wanted[index];
    }
  }
});

const orderedResults = byPriority(allDomainResults(spread));
const orderedScores = orderedResults.map((result) => result.displayScore);
check(
  "most urgent domain comes first",
  orderedScores[0] === 1 && orderedScores[orderedScores.length - 1] === 4,
  JSON.stringify(orderedScores),
);
check(
  "scores ascend down the table",
  orderedScores.every(
    (score, index) =>
      index === 0 || (score as number) >= (orderedScores[index - 1] as number),
  ),
  JSON.stringify(orderedScores),
);
console.log(`  order: ${orderedScores.map((s) => (s as number).toFixed(1)).join(", ")}`);

/* ------------------------------------------------------------------------- */

console.log(
  `\n${failures === 0 ? "PASSED" : "FAILED"}: ${checks - failures} of ${checks} checks passed.\n`,
);

process.exit(failures === 0 ? 0 : 1);
