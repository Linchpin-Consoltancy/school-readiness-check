/* ===========================================================================
   ASSESSMENT CONTENT
   ===========================================================================

   This file holds every word a principal reads during the assessment: the
   domain names, the lens names and their guiding questions, the rating scale,
   and all 42 questions.

   HOW TO EDIT SAFELY

   1. Only change text that sits between "double quotes".
   2. Leave the punctuation outside the quotes exactly as it is. The commas,
      braces and brackets are structure, not content.
   3. Never change an "id" value. The ids are how answers are matched to
      questions in the database. Changing one orphans every answer already
      collected against it.
   4. If your text needs a double quote inside it, write it as \" so the
      computer knows it is part of the sentence.

   The order of the domains, lenses and questions in this file is the order a
   principal meets them on screen.
   =========================================================================== */

export type LensId = "A" | "B" | "C";

export type Question = {
  /** Permanent database key. Never change this. */
  id: string;
  text: string;
};

export type Lens = {
  id: LensId;
  questions: [Question, Question];
};

export type Domain = {
  /** Permanent database key. Never change this. */
  id: string;
  /** Shown as "D01" and similar in small type above the domain name. */
  code: string;
  name: string;
  lenses: [Lens, Lens, Lens];
};

/* ---------------------------------------------------------------------------
   THE THREE LENSES
   These names and guiding questions appear before every lens section, for all
   seven domains. Changing one here changes it in all 21 places.
   --------------------------------------------------------------------------- */

export const LENS_DEFINITIONS: Record<
  LensId,
  { name: string; guidingQuestion: string; description: string }
> = {
  A: {
    name: "Intent and Design",
    guidingQuestion: "What has your school deliberately put in place?",
    description:
      "These two questions are about design rather than delivery. Rate what your school has formally established, whether or not it is working yet.",
  },
  B: {
    name: "Observable Practice",
    guidingQuestion: "What do you actually witness happening?",
    description:
      "These two questions are about what you see with your own eyes. Set aside what the policy says and rate what is actually happening in your school.",
  },
  C: {
    name: "Data and Outcomes",
    guidingQuestion: "What does your evidence tell you?",
    description:
      "These two questions are about proof. Rate what your records, results and feedback can actually demonstrate, not what you believe to be true.",
  },
};

/* ---------------------------------------------------------------------------
   THE RATING SCALE
   The same four points apply to every one of the 42 questions.
   --------------------------------------------------------------------------- */

export const RATING_SCALE = [
  {
    value: 1,
    name: "Beginning",
    description: "This is not in place or is at a very early stage.",
  },
  {
    value: 2,
    name: "Developing",
    description: "This exists but is inconsistent or partial.",
  },
  {
    value: 3,
    name: "Established",
    description: "This is in place and functioning reliably.",
  },
  {
    value: 4,
    name: "Exemplary",
    description: "This is a strength. It is embedded, consistent, and improving.",
  },
] as const;

/* ---------------------------------------------------------------------------
   THE SEVEN DOMAINS AND THEIR 42 QUESTIONS
   --------------------------------------------------------------------------- */

export const DOMAINS: Domain[] = [
  {
    id: "D01",
    code: "D01",
    name: "Instructional Leadership",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "A1.1",
            text: "Your school has a documented instructional leadership framework that defines what quality teaching looks like and what leadership's role is in supporting it.",
          },
          {
            id: "A1.2",
            text: "There is a written schedule for lesson observations and instructional supervision that is built into the school calendar, not conducted on an ad hoc basis.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "B1.1",
            text: "You and your leadership team conduct structured lesson observations regularly, and teachers receive written feedback that connects to agreed quality standards.",
          },
          {
            id: "B1.2",
            text: "When you walk through classrooms, you consistently see teachers applying the instructional approaches your school has agreed upon.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "C1.1",
            text: "Your lesson observation records show a pattern of improvement in teaching practice over successive terms, not simply activity, but evidence of growth.",
          },
          {
            id: "C1.2",
            text: "There is measurable evidence, in student results or teacher feedback, that your instructional leadership activities are having an impact on learning quality.",
          },
        ],
      },
    ],
  },

  {
    id: "D02",
    code: "D02",
    name: "Human Resource Management",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "A2.1",
            text: "Your school has documented processes for teacher recruitment, induction, and performance management that are applied consistently and are not dependent on the preferences of individual leaders.",
          },
          {
            id: "A2.2",
            text: "There is a written professional development plan that links individual teacher growth needs to the school's priorities, not a list of training events, but a deliberate development strategy.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "B2.1",
            text: "When you observe staff in meetings, planning sessions, and informal interactions, you see a team that is professionally engaged, collaborative, and motivated.",
          },
          {
            id: "B2.2",
            text: "Performance conversations with teachers happen on the schedule your school has committed to, and they produce documented outcomes that are followed up.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "C2.1",
            text: "Your teacher retention data gives you a clear and honest picture of staff satisfaction, and you use it to make decisions, not simply to note trends.",
          },
          {
            id: "C2.2",
            text: "Performance review records show that teachers are growing professionally year on year, and that this growth is connected to the development support your school provides.",
          },
        ],
      },
    ],
  },

  {
    id: "D03",
    code: "D03",
    name: "School Culture and Climate",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "A3.1",
            text: "Your school has a clearly articulated set of values and behavioural expectations that are documented, shared with all stakeholders, and revisited regularly, not simply displayed on a wall.",
          },
          {
            id: "A3.2",
            text: "There is a structured process for monitoring school climate, including the wellbeing of staff and students, and for responding when that monitoring reveals concerns.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "B3.1",
            text: "When you move through your school, classrooms, corridors, playgrounds, staff rooms, the physical environment and the quality of interactions reflect the culture you are deliberately trying to build.",
          },
          {
            id: "B3.2",
            text: "Students and staff consistently demonstrate the school's values in their day to day conduct, not only when formal expectations are being applied.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "C3.1",
            text: "You gather structured feedback, through surveys, focus groups, or similar methods, that gives you a reliable and honest picture of how staff and students experience the school's culture.",
          },
          {
            id: "C3.2",
            text: "The evidence you have gathered over the past year indicates that your school's culture and climate are improving, or, if not, that you have a clear understanding of why and a plan to respond.",
          },
        ],
      },
    ],
  },

  {
    id: "D04",
    code: "D04",
    name: "Classroom Practice",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "A4.1",
            text: "Your school has a documented set of classroom practice standards, a teaching framework or equivalent, that all teachers understand and are expected to demonstrate.",
          },
          {
            id: "A4.2",
            text: "There is a formal system for peer observation, instructional coaching, or collaborative lesson review that is built into the school calendar and treated as a professional expectation, not a voluntary option.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "B4.1",
            text: "When you observe lessons across subjects and grade levels, you consistently see active student engagement, clearly communicated learning objectives, and purposeful instruction.",
          },
          {
            id: "B4.2",
            text: "Teachers in your school routinely use assessment data to adapt what they teach and how they teach it. This is a visible practice, not an occasional occurrence.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "C4.1",
            text: "Your student assessment results across subjects and grade levels give you a credible and honest picture of the quality and consistency of classroom practice.",
          },
          {
            id: "C4.2",
            text: "Where classroom practice has been identified as weak, there is evidence that targeted support has produced measurable improvement, not simply an acknowledgement of the problem.",
          },
        ],
      },
    ],
  },

  {
    id: "D05",
    code: "D05",
    name: "Student Wellbeing and SEL",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "A5.1",
            text: "Your school has a documented wellbeing policy or SEL framework that defines how student social and emotional needs are identified, monitored, and addressed, not left to individual teacher discretion.",
          },
          {
            id: "A5.2",
            text: "There is a clear, documented referral and support pathway for students experiencing academic, social, or emotional challenges, one that all teachers and parents know exists.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "B5.1",
            text: "Wellbeing practices are visible in the daily life of your school, in pastoral routines, how assemblies are run, how teachers talk with students, and how the school responds to difficulty.",
          },
          {
            id: "B5.2",
            text: "When students face genuine challenges, academic pressure, interpersonal conflict, or personal difficulty, the school responds in a structured and timely way, not on a case by case improvised basis.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "C5.1",
            text: "You collect and review data on student wellbeing, including attendance patterns, disciplinary incident trends, and counselling or support uptake, and this data informs decisions.",
          },
          {
            id: "C5.2",
            text: "There is evidence over time that your wellbeing and SEL systems are producing positive outcomes for students, not simply that the systems exist.",
          },
        ],
      },
    ],
  },

  {
    id: "D06",
    code: "D06",
    name: "Parent and Community Engagement",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "A6.1",
            text: "Your school has a written parent engagement policy or plan that defines how, when, and through what channels parents are formally engaged in the life and decisions of the school.",
          },
          {
            id: "A6.2",
            text: "There is a structured mechanism, a parent body, advisory forum, or equivalent, through which parent voice is formally gathered and incorporated into school decisions.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "B6.1",
            text: "Parents consistently receive meaningful communication about their child's learning progress, not only end of term reports, but timely, specific, and two way engagement throughout the year.",
          },
          {
            id: "B6.2",
            text: "When you observe or consider the quality of parent and school interactions, what you see reflects a relationship built on trust, transparency, and mutual respect, not managed distance.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "C6.1",
            text: "You gather parent feedback in a structured way and can point to specific decisions or changes that were directly informed by what parents told you.",
          },
          {
            id: "C6.2",
            text: "Your parent engagement data, attendance at school events, responsiveness to communications, participation in forums, indicates a healthy and improving relationship, not a declining or transactional one.",
          },
        ],
      },
    ],
  },

  {
    id: "D07",
    code: "D07",
    name: "Technology in Education",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "A7.1",
            text: "Your school has a documented technology integration plan that connects technology use directly to learning goals, not simply a plan for infrastructure or device procurement.",
          },
          {
            id: "A7.2",
            text: "There are clear, agreed guidelines for how technology should and should not be used in classrooms, developed with teacher input and communicated to students and parents.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "B7.1",
            text: "When you observe classrooms and school operations, technology is being used purposefully to deepen learning and improve efficiency, not simply substituting for traditional methods without adding value.",
          },
          {
            id: "B7.2",
            text: "Teachers feel confident and supported in using technology as an instructional tool. This is visible in how they plan, how they engage students, and how they seek help when they encounter challenges.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "C7.1",
            text: "There is evidence that technology use in your school is producing measurable improvements in student learning outcomes or in the efficiency of school operations.",
          },
          {
            id: "C7.2",
            text: "You review and update your approach to technology based on data and feedback. Technology decisions in your school are driven by evidence of impact, not by trend or availability.",
          },
        ],
      },
    ],
  },
];

/** Every question id in the order a principal meets them. */
export const ALL_QUESTION_IDS: string[] = DOMAINS.flatMap((domain) =>
  domain.lenses.flatMap((lens) => lens.questions.map((question) => question.id)),
);

/** 21. Seven domains seen through three lenses each. */
export const TOTAL_SECTIONS = DOMAINS.length * 3;

/** 42. */
export const TOTAL_QUESTIONS = ALL_QUESTION_IDS.length;
