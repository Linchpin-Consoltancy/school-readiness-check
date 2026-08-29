import type { TierId } from "@/lib/scoring";

/* ===========================================================================
   REPORT CONTENT
   ===========================================================================

   Every word of the PDF report lives here. Edit the text between "double
   quotes" and leave the punctuation outside the quotes alone.

   Anything still reading "[To be supplied: ...]" has not been written yet.
   Those lines print in a muted colour in the PDF, so an unfinished report
   cannot be mistaken for a finished one. Run npm run verify to count how many
   are still outstanding.
   =========================================================================== */

/** Marks text that has not been written yet. */
export const PLACEHOLDER_MARKER = "[To be supplied";

export function isPlaceholder(text: string): boolean {
  return text.trimStart().startsWith(PLACEHOLDER_MARKER);
}

/* ---------------------------------------------------------------------------
   Section 1, school profile
   --------------------------------------------------------------------------- */

export const REPORT_TITLE = "School Systems Self-Assessment";

export const DISCLAIMER =
  "This report reflects a leadership self-assessment. It is not an external audit or inspection report.";

/* ---------------------------------------------------------------------------
   Section 2, how to read this report
   --------------------------------------------------------------------------- */

export const HOW_TO_READ_HEADING = "How to Read This Report";

export const HOW_TO_READ: string[] = [
  "This report reflects your self-assessment across seven domains of school quality. Each domain has been assessed through three lenses: what your school has deliberately designed (Intent), what you observe happening in practice (Observable Practice), and what your data and results tell you (Outcomes). A domain score is only generated when all three lenses are complete, because a system is only real when it is designed, running, and accountable to evidence.",
  "Scores run from 1.0 to 4.0 and map to four priority tiers: Critical Priority, High Priority, Moderate Priority, and Sustain and Extend. These tiers are not judgements. They are a map. They tell you where to focus first.",
];

/* ---------------------------------------------------------------------------
   Section headings
   --------------------------------------------------------------------------- */

export const SUMMARY_HEADING = "Domain Score Summary";
export const FINDINGS_HEADING = "Priority Findings";
export const PATTERNS_HEADING = "Patterns and Reflection";
export const NEXT_STEPS_HEADING = "Next Steps";

/** The report names the lenses more briefly than the assessment screens do. */
export const LENS_REPORT_LABELS: Record<"A" | "B" | "C", string> = {
  A: "Intent",
  B: "Practice",
  C: "Outcomes",
};

/* ---------------------------------------------------------------------------
   Section 4, the 28 gap descriptors
   ---------------------------------------------------------------------------

   One paragraph for every combination of domain and priority tier. A school
   sees exactly one of the four lines under each domain, chosen by the tier
   their score fell into.
   --------------------------------------------------------------------------- */

export const GAP_DESCRIPTORS: Record<string, Record<TierId, string>> = {
  // D01 Instructional Leadership
  D01: {
    critical:
      "[To be supplied: Instructional Leadership at Critical Priority.]",
    high: "[To be supplied: Instructional Leadership at High Priority.]",
    moderate:
      "[To be supplied: Instructional Leadership at Moderate Priority.]",
    sustain:
      "[To be supplied: Instructional Leadership at Sustain and Extend.]",
  },

  // D02 Human Resource Management
  D02: {
    critical:
      "[To be supplied: Human Resource Management at Critical Priority.]",
    high: "[To be supplied: Human Resource Management at High Priority.]",
    moderate:
      "[To be supplied: Human Resource Management at Moderate Priority.]",
    sustain:
      "[To be supplied: Human Resource Management at Sustain and Extend.]",
  },

  // D03 School Culture and Climate
  D03: {
    critical:
      "[To be supplied: School Culture and Climate at Critical Priority.]",
    high: "[To be supplied: School Culture and Climate at High Priority.]",
    moderate:
      "[To be supplied: School Culture and Climate at Moderate Priority.]",
    sustain:
      "[To be supplied: School Culture and Climate at Sustain and Extend.]",
  },

  // D04 Classroom Practice
  D04: {
    critical: "[To be supplied: Classroom Practice at Critical Priority.]",
    high: "[To be supplied: Classroom Practice at High Priority.]",
    moderate: "[To be supplied: Classroom Practice at Moderate Priority.]",
    sustain: "[To be supplied: Classroom Practice at Sustain and Extend.]",
  },

  // D05 Student Wellbeing and SEL
  D05: {
    critical:
      "[To be supplied: Student Wellbeing and SEL at Critical Priority.]",
    high: "[To be supplied: Student Wellbeing and SEL at High Priority.]",
    moderate:
      "[To be supplied: Student Wellbeing and SEL at Moderate Priority.]",
    sustain:
      "[To be supplied: Student Wellbeing and SEL at Sustain and Extend.]",
  },

  // D06 Parent and Community Engagement
  D06: {
    critical:
      "[To be supplied: Parent and Community Engagement at Critical Priority.]",
    high: "[To be supplied: Parent and Community Engagement at High Priority.]",
    moderate:
      "[To be supplied: Parent and Community Engagement at Moderate Priority.]",
    sustain:
      "[To be supplied: Parent and Community Engagement at Sustain and Extend.]",
  },

  // D07 Technology in Education
  D07: {
    critical: "[To be supplied: Technology in Education at Critical Priority.]",
    high: "[To be supplied: Technology in Education at High Priority.]",
    moderate: "[To be supplied: Technology in Education at Moderate Priority.]",
    sustain: "[To be supplied: Technology in Education at Sustain and Extend.]",
  },
};

/* ---------------------------------------------------------------------------
   Section 4, the note printed when a lens gap is flagged
   ---------------------------------------------------------------------------

   Three tokens are available, so the sentence reads correctly whether one
   lens or several triggered the flag:

     {{LENSES}}     the lens names, for example "Practice" or
                    "Intent and Outcomes"
     {{LENS_WORD}}  "lens" or "lenses"
     {{VERB}}       "differs" or "differ"

   For example: "Your {{LENS_WORD}} for {{LENSES}} {{VERB}} from this domain
   score by a full point or more."
   --------------------------------------------------------------------------- */

export const GAP_NOTE_HEADING = "Lens gap";

export const GAP_NOTE =
  "[To be supplied: the lens gap note. {{LENSES}} {{VERB}} from this domain score by a full point or more.]";

/* ---------------------------------------------------------------------------
   Section 5, the three narrative variants
   ---------------------------------------------------------------------------

   Exactly one variant is printed, chosen by the spread of tiers:

     Variant A   two or more domains are Critical Priority
     Variant B   fewer than two Critical, and four or more High or Moderate
     Variant C   four or more Moderate or Sustain
     If B and C both apply, B is used.

   Each variant is a list of paragraphs. Add or remove paragraphs freely.
   --------------------------------------------------------------------------- */

export type VariantId = "A" | "B" | "C";

export const PATTERN_VARIANTS: Record<VariantId, string[]> = {
  A: [
    "[To be supplied: Variant A, for a school with two or more domains at Critical Priority.]",
  ],
  B: [
    "[To be supplied: Variant B, for a school with fewer than two Critical domains and four or more at High or Moderate.]",
  ],
  C: [
    "[To be supplied: Variant C, for a school with four or more domains at Moderate or Sustain.]",
  ],
};

/* ---------------------------------------------------------------------------
   Section 6, next steps
   ---------------------------------------------------------------------------

   Items one and three read the same for every school. Item two names the
   lowest scoring domain, so keep the {{DOMAIN}} token in that sentence.
   --------------------------------------------------------------------------- */

export const NEXT_STEPS: { title: string; paragraphs: string[] }[] = [
  {
    title: "Make it a shared conversation",
    paragraphs: [
      "Share these findings with your senior leadership team. A self-assessment gains its greatest value when it becomes a shared leadership conversation rather than a private document.",
    ],
  },
  {
    title: "Choose one action this term",
    paragraphs: [
      "Identify one concrete action this term in {{DOMAIN}}. Start with the most foundational gap and commit to one specific, measurable step, not a project, but an action.",
    ],
  },
  {
    title: "Go further than a self-assessment",
    paragraphs: [
      "This self-assessment gives you a starting point, a leadership perspective on where your school's systems currently stand. What it cannot do is replace external observation, the voices of your teachers and students, or a facilitated conversation about what the evidence means and what to do next.",
      "The Linchpin School Diagnostic brings all of that together. It is a structured, two day process that triangulates your leadership perspective with staff and student voice, direct classroom observation, and a document review, producing a validated picture of your school's systems and a clear roadmap for improvement.",
      "If you would like to explore what that looks like for your school, contact Joseph Omondi at linchpineducation.com.",
    ],
  },
];
