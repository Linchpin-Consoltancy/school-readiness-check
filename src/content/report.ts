import type { TierId } from "@/lib/scoring";

/* ===========================================================================
   REPORT CONTENT
   ===========================================================================

   Every word of the results screen and the PDF report. Edit the text between
   "double quotes" and leave the punctuation outside the quotes alone.

   This is a first draft written to be edited. It is in your voice as far as
   anyone can write in someone else's voice, aimed at a school owner rather
   than an education specialist, and deliberately commercial: it names what a
   score costs or protects, not just what it means.
   =========================================================================== */

/** Marks text that has not been written yet. Nothing uses it at present. */
export const PLACEHOLDER_MARKER = "[To be supplied";

export function isPlaceholder(text: string): boolean {
  return text.trimStart().startsWith(PLACEHOLDER_MARKER);
}

/* ---------------------------------------------------------------------------
   Section 1, school profile
   --------------------------------------------------------------------------- */

export const REPORT_TITLE = "School Readiness Check";

export const DISCLAIMER =
  "This report reflects a leadership self-assessment. It is not an external audit or inspection report.";

/* ---------------------------------------------------------------------------
   Section 2, how to read this report
   --------------------------------------------------------------------------- */

export const HOW_TO_READ_HEADING = "How to Read This Report";

export const HOW_TO_READ: string[] = [
  "This report reflects your own assessment of your school across seven areas. Each area was looked at three ways: what your school has deliberately designed, what actually happens on an ordinary day, and what you could prove if someone asked. An area is only scored when all three are answered, because a system is only real when it is designed, running, and backed by evidence.",
  "Scores run from 1.0 to 4.0 and map to four priority tiers: Critical Priority, High Priority, Moderate Priority, and Sustain and Extend. These tiers are not judgements. They are a map. They tell you where to focus first.",
];

/* ---------------------------------------------------------------------------
   Section headings
   --------------------------------------------------------------------------- */

export const SUMMARY_HEADING = "Where Your School Stands";
export const FINDINGS_HEADING = "Area by Area";
export const PATTERNS_HEADING = "The Pattern";
export const NEXT_STEPS_HEADING = "Next Steps";

/** Short labels used in the report and on the results screen. */
export const LENS_REPORT_LABELS: Record<"A" | "B" | "C", string> = {
  A: "Design",
  B: "Delivery",
  C: "Evidence",
};

/* ---------------------------------------------------------------------------
   The 28 area descriptors
   ---------------------------------------------------------------------------
   One paragraph for every combination of area and priority tier. A school
   sees exactly one of the four under each area, chosen by their score.
   --------------------------------------------------------------------------- */

export const GAP_DESCRIPTORS: Record<string, Record<TierId, string>> = {
  // D01 Leading the Change
  D01: {
    critical:
      "Nobody currently owns this. That is not a judgement on your team, it is a structural gap, and it is the most expensive one on this list because every other area depends on it. Until one person is accountable for how your school teaches, improvement will keep arriving as individual effort and leaving with individual teachers.",
    high: "There is intent here, and probably a document, but the driving is intermittent. What usually follows is that your strongest teachers carry the standard while the rest drift, and that shows up later as parents comparing two classes in the same grade.",
    moderate:
      "The change is being led rather than hoped for. The gain available now is consistency: making the leadership rhythm predictable enough to survive a busy term, a sick week, or a change of deputy.",
    sustain:
      "Leadership of teaching is a genuine strength here. The value in it now is external. This is the part of your school most worth documenting and showing, because it is what a serious parent and a quality assurance officer are both really assessing.",
  },

  // D02 Teachers Who Can Deliver
  D02: {
    critical:
      "Your teachers are being asked to deliver something they have not been equipped for, and they know it. This is where staff quietly lose confidence and where your best people start listening to other offers. It is also the fastest area to move, because teachers want the help.",
    high: "Some of your teachers do this well and some are managing. The risk is that the distance between them becomes visible to parents long before it becomes visible to you, usually through a comparison between two classes in the same year.",
    moderate:
      "You have a team that can deliver. The next gain is not more training, it is making growth deliberate and recorded, so that capability stays with the school when an individual leaves.",
    sustain:
      "Your teaching team is an asset, and an unusual one. Schools lose this quietly through turnover rather than dramatically. Protecting it is worth more right now than any new initiative you could start.",
  },

  // D03 Teaching That Builds Competence
  D03: {
    critical:
      "What happens in your classrooms has probably not changed as much as the paperwork suggests. This is common and it is fixable, but while it stands you are carrying all of the cost of a new curriculum without yet holding any of its benefit.",
    high: "Real change is happening in some rooms and not others. Parents notice this faster than school leaders do, because a parent only sees one classroom and then compares notes with other parents.",
    moderate:
      "Teaching here is genuinely different from the old model. The remaining gain is depth rather than coverage: fewer things done better, with the difference visible to a visitor within ten minutes of walking in.",
    sustain:
      "Classroom practice is a strength. This is the most persuasive thing you own and most schools that have it never show it. A parent who sits in on one of your lessons is most of the way to enrolling.",
  },

  // D04 Proof of Learning
  D04: {
    critical:
      "You cannot currently prove progress to a parent who asks, and sooner or later one will. This is the area that decides fee renewal, because a parent who cannot see growth will assume there is none. It is also where the smallest system produces the fastest gain in trust.",
    high: "You can show some evidence, but it depends on which teacher a family happens to ask. Inconsistent proof reads to parents as inconsistent quality, whether or not that is fair.",
    moderate:
      "You can answer a parent honestly and with evidence. The gain now is making that routine and visible rather than something assembled on request.",
    sustain:
      "You can prove learning, which most schools cannot. This deserves to be a marketing position rather than an internal system, because it answers the question every parent is now actually asking.",
  },

  // D05 Talent and Pathways
  D05: {
    critical:
      "Beyond academics, your school is currently offering less than families believe they are paying for. This is where fee resistance begins. It is also where a school with modest results can win a family outright, which makes it an opportunity as much as a risk.",
    high: "There is provision, but it runs on enthusiasm rather than structure. That works until the teacher who ran it leaves, and it rarely produces the records a family needs when senior school choices arrive.",
    moderate:
      "You are more than an exam factory and families can see it. The next step is connecting provision to pathway: being able to tell a parent not only what their child enjoys, but where it could lead.",
    sustain:
      "Talent provision is a strength and a real differentiator. Schools that can name a child's direction and evidence it are the ones parents recommend without being asked.",
  },

  // D06 Parents as Partners
  D06: {
    critical:
      "Parents are currently an audience rather than a partner. Under the old system that was survivable. Now, when learning continues at home and progress is harder to read from outside, it costs you both trust and word of mouth.",
    high: "You communicate, but mostly outward and mostly about logistics. The relationship is functional rather than warm, which gives you compliance from parents where you want advocacy.",
    moderate:
      "Parents are genuinely involved and you listen to them. The remaining gain is visibility: making it obvious that their input changed something, which is what turns a satisfied parent into a recommending one.",
    sustain:
      "Your parent relationships are a real asset. This is the cheapest enrolment engine a school can own and it is worth protecting more carefully than any advertising budget.",
  },

  // D07 Character and Trust
  D07: {
    critical:
      "The values your school claims and the experience it delivers are not yet the same thing, and children report that difference at home. This damages a school faster and more quietly than anything else on this list, because it travels by conversation rather than by complaint.",
    high: "The intent is right and the practice is uneven. A culture tolerates unevenness for a while and then stops, usually at the point where one incident is handled badly in public.",
    moderate:
      "Your school feels like a place a family can trust, and that is not an accident. The gain now is making it deliberate enough to survive growth, new staff and a difficult term.",
    sustain:
      "Trust is a strength here. It is the hardest thing on this list to build and the easiest to lose, so it is worth treating as infrastructure rather than as a happy accident.",
  },
};

/* ---------------------------------------------------------------------------
   The note printed when one view of an area sits far from the others
   ---------------------------------------------------------------------------
   Tokens available:
     {{LENSES}}     the names, for example "Delivery" or "Design and Evidence"
     {{LENS_WORD}}  "view" or "views"
     {{VERB}}       "differs" or "differ"
   --------------------------------------------------------------------------- */

export const GAP_NOTE_HEADING = "Worth a closer look";

export const GAP_NOTE =
  "{{LENSES}} {{VERB}} sharply from the rest of this area. That distance usually means one of two things: something well designed that has not reached the classroom, or something working well that nobody has captured as evidence. Both are worth attention, and both close faster than they look.";

/* ---------------------------------------------------------------------------
   The three narratives
   ---------------------------------------------------------------------------
     Variant A   two or more areas at Critical Priority
     Variant B   fewer than two Critical, and four or more High or Moderate
     Variant C   four or more Moderate or Sustain
     If B and C both apply, B is used.
   --------------------------------------------------------------------------- */

export type VariantId = "A" | "B" | "C";

export const PATTERN_VARIANTS: Record<VariantId, string[]> = {
  A: [
    "Several parts of your school are carrying more weight than they can hold. That is not unusual at the moment and it is not a verdict on your leadership. The curriculum changed faster than most schools could rebuild, and the schools feeling it hardest are often the ones that took it most seriously.",
    "What matters now is sequence. Trying to lift every area at once is how schools exhaust their staff and finish the year no further forward. Start at the top of your list, because the areas below it will move more easily once it does.",
    "You do not have a motivation problem. You have a load bearing problem, and those are solvable.",
  ],
  B: [
    "Your school is doing a lot of things properly and a few things by force of personality. That is the most common pattern we see, and it is the one that quietly limits a good school.",
    "The areas sitting in the middle of your list are not broken. They work when the right person is in the room and wobble when that person is not. That is the difference between a school that is good and a school that is reliably good, and parents feel it long before they can name it.",
    "The work here is not dramatic. It is turning three or four things that depend on individuals into things that depend on systems.",
  ],
  C: [
    "Your school is in better shape than most, and you probably already knew that. The risk at this level is different from the risk lower down. It is not collapse, it is drift.",
    "Schools that score like yours usually have real strengths that nobody outside the school knows about. That is a commercial problem as much as an educational one, because a family choosing between you and a competitor chooses on what they can see.",
    "The work here is consolidation and proof: protecting what is strong against growth and turnover, and making the quality you already have legible to the families you want.",
  ],
};

/* ---------------------------------------------------------------------------
   Next steps
   ---------------------------------------------------------------------------
   Item two names the lowest scoring area, so keep the {{DOMAIN}} token.
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
