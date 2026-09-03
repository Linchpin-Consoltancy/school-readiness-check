/**
 * Checks the content, the scoring rules and the report logic.
 *
 * Run with: npm run verify
 *
 * This does not replace testing the tool by hand. It is here to prove the
 * arithmetic, because the scores drive the report and a quiet mistake in them
 * would be invisible on screen.
 */

import {
  ALL_QUESTION_IDS,
  DOMAINS,
  LENS_DEFINITIONS,
  RATING_SCALE,
  TOTAL_QUESTIONS,
  TOTAL_SECTIONS,
} from "../src/content/assessment";
import {
  CONTACT,
  emailIsWellFormed,
  whatsappLink,
  whatsappNumberIsWellFormed,
} from "../src/content/brand";
import {
  GAP_DESCRIPTORS,
  GAP_NOTE,
  HOW_TO_READ,
  NEXT_STEPS,
  PATTERN_VARIANTS,
  isPlaceholder,
} from "../src/content/report";
import { CAPTURE_INDEX, RESULTS_INDEX, STEPS } from "../src/lib/experience";
import {
  countTiers,
  lensList,
  lowestScoringDomain,
  reportFilename,
  selectVariant,
} from "../src/lib/report";
import {
  allDomainResults,
  byPriority,
  domainResult,
  formatScore,
  GAP_THRESHOLD,
  lensScore,
  roundToOneDecimal,
  sectionsComplete,
  tierFor,
  TIERS,
  type DomainResult,
  type Ratings,
  type TierId,
} from "../src/lib/scoring";

let failures = 0;
let checks = 0;
const warnings: string[] = [];

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

check("seven areas", DOMAINS.length === 7, `found ${DOMAINS.length}`);
check("21 sections", TOTAL_SECTIONS === 21, `found ${TOTAL_SECTIONS}`);
check("21 questions", TOTAL_QUESTIONS === 21, `found ${TOTAL_QUESTIONS}`);
check(
  "question ids are unique",
  new Set(ALL_QUESTION_IDS).size === ALL_QUESTION_IDS.length,
);
check("four rating options", RATING_SCALE.length === 4);
check(
  "lenses are named in plain language",
  LENS_DEFINITIONS.A.name === "Design" &&
    LENS_DEFINITIONS.B.name === "Delivery" &&
    LENS_DEFINITIONS.C.name === "Evidence",
);

for (const domain of DOMAINS) {
  check(`${domain.id} has three lenses`, domain.lenses.length === 3);
  check(
    `${domain.id} lenses are A, B, C`,
    domain.lenses.map((lens) => lens.id).join("") === "ABC",
  );
  check(
    `${domain.id} has a director's question`,
    domain.question.trim().length > 10 && domain.question.includes("?"),
  );
  check(`${domain.id} has an intro`, domain.intro.trim().length > 40);
  check(`${domain.id} name has no em dash`, !domain.name.includes("—"));

  for (const lens of domain.lenses) {
    check(
      `${domain.id} lens ${lens.id} has at least one question`,
      lens.questions.length >= 1,
    );
    for (const question of lens.questions) {
      check(
        `${question.id} has text`,
        question.text.trim().length > 30,
        question.text.slice(0, 40),
      );
      check(
        `${question.id} contains no em dash`,
        !question.text.includes("—"),
      );
    }
  }
}

console.log(
  `  ${DOMAINS.length} areas, ${TOTAL_QUESTIONS} questions, about ${Math.round(
    (TOTAL_QUESTIONS * 20) / 60,
  )} minutes of tapping.`,
);

/* -------------------------------------------------------------------------
   The single screen sequence
   ------------------------------------------------------------------------- */

heading("Screen sequence");

const expected = 1 + DOMAINS.length + TOTAL_QUESTIONS + 2;
check(`${expected} steps in the flow`, STEPS.length === expected, `found ${STEPS.length}`);
check("keys are unique", new Set(STEPS.map((s) => s.key)).size === STEPS.length);
check("opens on the introduction", STEPS[0]?.kind === "intro");
check("ends on results", STEPS[STEPS.length - 1]?.kind === "results");
check("capture sits before results", CAPTURE_INDEX === RESULTS_INDEX - 1);
check(
  `${TOTAL_QUESTIONS} question steps`,
  STEPS.filter((step) => step.kind === "question").length === TOTAL_QUESTIONS,
);
check(
  "question numbers run 1 to 21 in order",
  STEPS.filter((step) => step.kind === "question").every(
    (step, index) =>
      step.kind === "question" && step.questionNumber === index + 1,
  ),
);

console.log(`  ${STEPS.length} steps, all inside one page.`);

/* -------------------------------------------------------------------------
   Scoring, worked examples
   ------------------------------------------------------------------------- */

heading("Scoring, worked examples");

const domain = DOMAINS[0];

function ratingsFor(a: number, b: number, c: number): Ratings {
  return {
    [domain.lenses[0].questions[0].id]: a,
    [domain.lenses[1].questions[0].id]: b,
    [domain.lenses[2].questions[0].id]: c,
  };
}

type Example = {
  label: string;
  lenses: [number, number, number];
  domain: number;
  tier: string;
  gaps: string[];
};

const examples: Example[] = [
  { label: "all threes", lenses: [3, 3, 3], domain: 3.0, tier: "Moderate Priority", gaps: [] },
  { label: "all ones", lenses: [1, 1, 1], domain: 1.0, tier: "Critical Priority", gaps: [] },
  { label: "all fours", lenses: [4, 4, 4], domain: 4.0, tier: "Sustain and Extend", gaps: [] },
  {
    label: "designed well, no evidence",
    lenses: [4, 4, 1],
    domain: 3.0,
    tier: "Moderate Priority",
    gaps: ["C"],
  },
  {
    label: "design far ahead of the rest",
    lenses: [4, 1, 2],
    domain: 2.3,
    tier: "High Priority",
    gaps: ["A"],
  },
  {
    label: "one point apart, not flagged",
    lenses: [4, 2, 3],
    domain: 3.0,
    tier: "Moderate Priority",
    gaps: [],
  },
  { label: "mixed, rounds up", lenses: [2, 3, 2], domain: 2.3, tier: "High Priority", gaps: [] },
  { label: "just into Moderate", lenses: [3, 3, 2], domain: 2.7, tier: "Moderate Priority", gaps: [] },
  { label: "struggling", lenses: [2, 2, 1], domain: 1.7, tier: "Critical Priority", gaps: [] },
];

for (const example of examples) {
  const result = domainResult(
    domain,
    ratingsFor(example.lenses[0], example.lenses[1], example.lenses[2]),
  );

  check(
    `${example.label}: displayed score`,
    result.displayScore === example.domain,
    `expected ${example.domain}, got ${result.displayScore}`,
  );
  check(
    `${example.label}: stored score rounds to it`,
    roundToOneDecimal(result.score as number) === example.domain,
    `stored ${result.score}`,
  );
  check(
    `${example.label}: tier`,
    result.tier?.label === example.tier,
    `expected ${example.tier}, got ${result.tier?.label}`,
  );
  check(
    `${example.label}: gaps`,
    JSON.stringify(result.gapLenses) === JSON.stringify(example.gaps),
    `expected ${JSON.stringify(example.gaps)}, got ${JSON.stringify(result.gapLenses)}`,
  );

  console.log(
    `  ${example.label.padEnd(28)} ${example.lenses.join(" / ")}  ->  ${formatScore(
      result.displayScore as number,
    )}  ${result.tier?.label}${
      result.gapLenses.length ? `  (gap: ${result.gapLenses.join(", ")})` : ""
    }`,
  );
}

/* -------------------------------------------------------------------------
   A partial area never produces a score
   ------------------------------------------------------------------------- */

heading("Partial areas");

const partialRatings = ratingsFor(3, 3, 3);
delete partialRatings[domain.lenses[2].questions[0].id];
const partial = domainResult(domain, partialRatings);

check("no score when a view is missing", partial.score === null);
check("no tier when a view is missing", partial.tier === null);
check("not marked complete", partial.complete === false);
check("no gap flags", partial.gapLenses.length === 0);
check("answered views still score", partial.lenses[0].score === 3);
check("missing view has no score", partial.lenses[2].score === null);
check(
  "a lens with no answer has no score",
  lensScore(domain.lenses[0], {}) === null,
);

console.log("  A score is withheld until all three views are answered.");

/* -------------------------------------------------------------------------
   Every possible combination for one area
   ------------------------------------------------------------------------- */

heading("Every possible combination for one area");

const reachable = new Map<number, string>();
let combinations = 0;
let gapCount = 0;

for (let a = 1; a <= 4; a += 1)
  for (let b = 1; b <= 4; b += 1)
    for (let c = 1; c <= 4; c += 1) {
      combinations += 1;
      const result = domainResult(domain, ratingsFor(a, b, c));
      if (result.displayScore === null || result.tier === null) {
        check("every full area produces a score and a tier", false);
        continue;
      }
      if (result.gapFlag) gapCount += 1;
      reachable.set(result.displayScore, result.tier.label);
    }

check("64 combinations tested", combinations === 64);
const ordered = [...reachable.keys()].sort((x, y) => x - y);
console.log(`  ${combinations} combinations, ${ordered.length} distinct scores.`);
console.log(
  `  ${gapCount} of ${combinations} raise a gap flag (${Math.round(
    (gapCount / combinations) * 100,
  )} per cent), at a threshold of ${GAP_THRESHOLD}.`,
);

for (const tier of TIERS) {
  const inTier = ordered.filter((score) => reachable.get(score) === tier.label);
  console.log(
    `  ${tier.label.padEnd(20)} ${tier.min.toFixed(1)} to ${tier.max.toFixed(1)}   reachable: ${
      inTier.map((score) => score.toFixed(1)).join(", ") || "none"
    }`,
  );
}

/* -------------------------------------------------------------------------
   Tier bands and colours
   ------------------------------------------------------------------------- */

heading("Tier bands and colours");

for (let tenths = 10; tenths <= 40; tenths += 1) {
  check(`${(tenths / 10).toFixed(1)} falls in a tier`, tierFor(tenths / 10) !== null);
}

check("1.9 is Critical", tierFor(1.9)?.id === "critical");
check("2.0 is High", tierFor(2.0)?.id === "high");
check("2.5 is High", tierFor(2.5)?.id === "high");
check("2.6 is Moderate", tierFor(2.6)?.id === "moderate");
check("3.2 is Moderate", tierFor(3.2)?.id === "moderate");
check("3.3 is Sustain", tierFor(3.3)?.id === "sustain");

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
}

console.log("  Every value from 1.0 to 4.0 in tenths belongs to one tier.");

/* -------------------------------------------------------------------------
   Progress counting
   ------------------------------------------------------------------------- */

heading("Progress counting");

check("no answers means no sections", sectionsComplete({}) === 0);
check(
  "one answered view counts as one section",
  sectionsComplete({ [domain.lenses[0].questions[0].id]: 3 }) === 1,
);

const everything: Ratings = Object.fromEntries(
  ALL_QUESTION_IDS.map((id) => [id, 3]),
);
check("all answers means 21 sections", sectionsComplete(everything) === 21);

/* -------------------------------------------------------------------------
   Report content
   ------------------------------------------------------------------------- */

heading("Report content");

let descriptorCount = 0;
let outstanding = 0;

for (const eachDomain of DOMAINS) {
  const set = GAP_DESCRIPTORS[eachDomain.id];
  check(`${eachDomain.id} has descriptors`, Boolean(set));
  if (!set) continue;
  for (const tier of TIERS) {
    descriptorCount += 1;
    const text = set[tier.id];
    check(
      `${eachDomain.id} ${tier.id} descriptor is written`,
      typeof text === "string" && text.trim().length > 60,
    );
    check(
      `${eachDomain.id} ${tier.id} descriptor has no em dash`,
      !text.includes("—"),
    );
    if (isPlaceholder(text)) outstanding += 1;
  }
}

check("28 descriptors", descriptorCount === 28, `found ${descriptorCount}`);
check("nothing left unwritten", outstanding === 0, `${outstanding} outstanding`);
check("two How to Read paragraphs", HOW_TO_READ.length === 2);
check("three next steps", NEXT_STEPS.length === 3);
check(
  "next step two names the lowest area",
  NEXT_STEPS[1].paragraphs.join(" ").includes("{{DOMAIN}}"),
);
check("gap note keeps its tokens", GAP_NOTE.includes("{{LENSES}}") && GAP_NOTE.includes("{{VERB}}"));
check("three narratives", Object.keys(PATTERN_VARIANTS).length === 3);
for (const variant of ["A", "B", "C"] as const) {
  check(
    `variant ${variant} is written`,
    PATTERN_VARIANTS[variant].length > 0 &&
      !PATTERN_VARIANTS[variant].some(isPlaceholder),
  );
}

check("one view reads well", lensList(["B"]) === "Delivery");
check("two views read well", lensList(["A", "C"]) === "Design and Evidence");
check(
  "three views read well",
  lensList(["A", "B", "C"]) === "Design, Delivery and Evidence",
);

console.log(`  ${descriptorCount} descriptors and 3 narratives, all written.`);

/* -------------------------------------------------------------------------
   Narrative selection
   ------------------------------------------------------------------------- */

heading("Narrative selection");

function resultsWithTiers(counts: Record<TierId, number>): DomainResult[] {
  const results: DomainResult[] = [];
  for (const tier of TIERS) {
    for (let index = 0; index < counts[tier.id]; index += 1) {
      results.push({
        domainId: `D${String(results.length + 1).padStart(2, "0")}`,
        lenses: [
          { lensId: "A", score: tier.min, complete: true, gap: false },
          { lensId: "B", score: tier.min, complete: true, gap: false },
          { lensId: "C", score: tier.min, complete: true, gap: false },
        ],
        score: tier.min,
        displayScore: tier.min,
        tier,
        gapFlag: false,
        gapLenses: [],
        complete: true,
      });
    }
  }
  return results;
}

check(
  "two Critical gives A",
  selectVariant(resultsWithTiers({ critical: 2, high: 2, moderate: 2, sustain: 1 })).id === "A",
);
check(
  "one Critical with four High gives B",
  selectVariant(resultsWithTiers({ critical: 1, high: 4, moderate: 0, sustain: 2 })).id === "B",
);
check(
  "a settled school gives C",
  selectVariant(resultsWithTiers({ critical: 0, high: 1, moderate: 2, sustain: 4 })).id === "C",
);
check(
  "B wins when B and C both apply",
  selectVariant(resultsWithTiers({ critical: 0, high: 0, moderate: 5, sustain: 2 })).id === "B",
);

let spreads = 0;
const chosen: Record<string, number> = { A: 0, B: 0, C: 0 };
const fallbacks: string[] = [];

for (let critical = 0; critical <= 7; critical += 1)
  for (let high = 0; high <= 7 - critical; high += 1)
    for (let moderate = 0; moderate <= 7 - critical - high; moderate += 1) {
      const sustain = 7 - critical - high - moderate;
      spreads += 1;
      const choice = selectVariant(
        resultsWithTiers({ critical, high, moderate, sustain }),
      );
      chosen[choice.id] += 1;
      if (choice.fellBack) {
        fallbacks.push(`${critical}C ${high}H ${moderate}M ${sustain}S`);
      }
    }

check("120 possible spreads", spreads === 120, `found ${spreads}`);
check("every spread gets a narrative", chosen.A + chosen.B + chosen.C === spreads);
check(
  "tier counting adds up",
  (() => {
    const counts = countTiers(
      resultsWithTiers({ critical: 1, high: 2, moderate: 3, sustain: 1 }),
    );
    return counts.critical === 1 && counts.high === 2 && counts.moderate === 3;
  })(),
);
check(
  "lowest scoring area comes first",
  lowestScoringDomain(
    resultsWithTiers({ critical: 1, high: 2, moderate: 3, sustain: 1 }),
  )?.tier?.id === "critical",
);
check(
  "results order ascends by score",
  (() => {
    const spread: Ratings = {};
    const wanted = [3, 1, 2, 4, 3, 2, 3];
    DOMAINS.forEach((eachDomain, index) => {
      for (const lens of eachDomain.lenses) {
        for (const question of lens.questions) spread[question.id] = wanted[index];
      }
    });
    const scores = byPriority(allDomainResults(spread)).map((r) => r.displayScore);
    return scores.every(
      (score, index) =>
        index === 0 || (score as number) >= (scores[index - 1] as number),
    );
  })(),
);

console.log(`  ${spreads} spreads: A ${chosen.A}, B ${chosen.B}, C ${chosen.C}.`);
console.log(`  ${fallbacks.length} match no rule and fall back to B: ${fallbacks.join(", ") || "none"}`);

/* -------------------------------------------------------------------------
   Report filename
   ------------------------------------------------------------------------- */

heading("Report filename");

const sampleDate = new Date(Date.UTC(2026, 7, 29));
check(
  "matches the required pattern",
  reportFilename("Riverbank Academy", sampleDate) ===
    "Linchpin_Assessment_Riverbank_Academy_2026-08-29.pdf",
  reportFilename("Riverbank Academy", sampleDate),
);
check(
  "punctuation is made safe",
  reportFilename("St. Mary's School (Nairobi)", sampleDate) ===
    "Linchpin_Assessment_St_Mary_s_School_Nairobi_2026-08-29.pdf",
  reportFilename("St. Mary's School (Nairobi)", sampleDate),
);
console.log(`  ${reportFilename("Riverbank Academy", sampleDate)}`);

/* -------------------------------------------------------------------------
   Contact details in the frame
   ------------------------------------------------------------------------- */

heading("Contact details");

check("website is set", CONTACT.website.includes("linchpineducation"));
check("email is well formed", emailIsWellFormed(), CONTACT.email);
check(
  "WhatsApp number is digits only, international form",
  whatsappNumberIsWellFormed(),
  CONTACT.whatsappNumber,
);
check(
  "the WhatsApp link opens a chat",
  whatsappLink().startsWith(`https://wa.me/${CONTACT.whatsappNumber}?text=`),
  whatsappLink(),
);
check(
  "the displayed number matches the dialling number",
  CONTACT.whatsappDisplay.replace(/\D/g, "").replace(/^0/, "254") ===
    CONTACT.whatsappNumber,
  `shown ${CONTACT.whatsappDisplay}, dialled ${CONTACT.whatsappNumber}`,
);

console.log(`  website  ${CONTACT.website}`);
console.log(`  email    ${CONTACT.email}`);
console.log(`  whatsapp ${CONTACT.whatsappDisplay}`);

/* ------------------------------------------------------------------------- */

if (warnings.length > 0) {
  console.log("\nWarnings");
  console.log("--------");
  for (const warning of warnings) console.log(`  ${warning}`);
}

console.log(
  `\n${failures === 0 ? "PASSED" : "FAILED"}: ${checks - failures} of ${checks} checks passed.\n`,
);

process.exit(failures === 0 ? 0 : 1);
