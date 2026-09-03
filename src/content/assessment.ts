/* ===========================================================================
   ASSESSMENT CONTENT
   ===========================================================================

   Every word a school director reads while answering. Seven domains, each
   looked at through three lenses, one question per lens. Twenty one questions,
   about seven minutes.

   HOW TO EDIT SAFELY

   1. Only change text that sits between "double quotes".
   2. Leave the punctuation outside the quotes exactly as it is.
   3. Never change an "id" value. Ids are how answers are matched to questions.
   4. To write a double quote inside a sentence, put a backslash before it.

   A NOTE ON VOICE

   The reader is a school owner or director. Some are career educators. Many
   are entrepreneurs who bought or built a school and are now responsible for
   something they were never trained for. Every question is written to be
   answerable by both. No jargon that a business owner would have to look up.
   =========================================================================== */

export type LensId = "A" | "B" | "C";

export type Question = {
  /** Permanent database key. Never change this. */
  id: string;
  text: string;
  /** Optional one line nudge shown under the question. */
  hint?: string;
};

export type Lens = {
  id: LensId;
  /** One or more questions. A lens only scores when all of them are answered. */
  questions: Question[];
};

export type Domain = {
  /** Permanent database key. Never change this. */
  id: string;
  code: string;
  name: string;
  /** The question this domain answers, in the director's own terms. */
  question: string;
  /** Two or three sentences shown when the domain opens. */
  intro: string;
  lenses: [Lens, Lens, Lens];
};

/* ---------------------------------------------------------------------------
   THE THREE LENSES
   Deliberately named in plain business language rather than education terms.
   --------------------------------------------------------------------------- */

export const LENS_DEFINITIONS: Record<
  LensId,
  { name: string; guidingQuestion: string; description: string }
> = {
  A: {
    name: "Design",
    guidingQuestion: "What have you deliberately put in place?",
    description:
      "Rate what your school has actually set up on purpose. Not what you intend to do next term. What exists now, whether or not it is working yet.",
  },
  B: {
    name: "Delivery",
    guidingQuestion: "What happens on an ordinary Tuesday?",
    description:
      "Rate what you see with your own eyes when nobody is putting on a show. Not the policy. The practice.",
  },
  C: {
    name: "Evidence",
    guidingQuestion: "What could you prove if someone asked?",
    description:
      "Rate what you could actually show a parent, an inspector or a bank. Belief is not evidence. Records, results and feedback are.",
  },
};

/* ---------------------------------------------------------------------------
   THE RATING SCALE
   --------------------------------------------------------------------------- */

export const RATING_SCALE = [
  {
    value: 1,
    name: "Not yet",
    description: "This is not in place, or it has only just started.",
  },
  {
    value: 2,
    name: "Patchy",
    description: "This exists, but it is inconsistent or depends on who is doing it.",
  },
  {
    value: 3,
    name: "Solid",
    description: "This is in place and works reliably.",
  },
  {
    value: 4,
    name: "Strength",
    description: "This is one of the things your school is genuinely good at.",
  },
] as const;

/* ---------------------------------------------------------------------------
   THE SEVEN DOMAINS
   --------------------------------------------------------------------------- */

export const DOMAINS: Domain[] = [
  {
    id: "D01",
    code: "01",
    name: "Leading the Change",
    question: "Is someone actually driving CBE here, or are we hoping?",
    intro:
      "Competency based education did not arrive with an instruction manual. In schools where it works, one person owns it and drives it. In schools where it stalls, everyone assumes someone else is handling it.",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "D01-A",
            text: "Your school has a written plan for how it delivers competency based education, with one named person accountable for it, rather than leaving each teacher to work it out alone.",
            hint: "A plan on a shelf still counts here. Delivery is the next question.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "D01-B",
            text: "In a normal week, you or a senior colleague spend time in classrooms looking specifically at whether teaching matches what your school agreed.",
            hint: "Walking through does not count. Looking for something specific does.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "D01-C",
            text: "If a quality assurance officer or a serious prospective parent asked how your teaching has improved this year, you could show them written evidence rather than tell them a story.",
          },
        ],
      },
    ],
  },

  {
    id: "D02",
    code: "02",
    name: "Teachers Who Can Deliver",
    question: "Can my staff actually do this, or are they bluffing?",
    intro:
      "A curriculum is only as good as the person standing in front of the class. Most teachers in Kenya were trained to deliver content and are now asked to build competence, which is a different job.",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "D02-A",
            text: "Your school has a deliberate plan for making every teacher confident with competency based teaching, including people who join mid year, rather than relying on whoever happened to attend a workshop.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "D02-B",
            text: "When teachers meet or plan together, you see them solving teaching problems with each other rather than quietly working around them.",
            hint: "Think about the last staff meeting you sat in on.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "D02-C",
            text: "You could name specific teachers who are measurably better at their job than they were a year ago, and say exactly what your school did to cause that.",
          },
        ],
      },
    ],
  },

  {
    id: "D03",
    code: "03",
    name: "Teaching That Builds Competence",
    question: "Is what happens in class genuinely different now?",
    intro:
      "This is where the curriculum either becomes real or becomes a new set of forms attached to old habits. Parents cannot see your policies. They can see whether their child is doing something or copying something.",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "D03-A",
            text: "Your school has agreed what a good lesson looks like and written it down clearly enough that a teacher joining next term could use it without being told.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "D03-B",
            text: "When you walk into classrooms unannounced, learners are usually doing something active, making, discussing, solving or presenting, rather than mostly listening and copying.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "D03-C",
            text: "Your records show which competencies your learners are strong and weak in, not only which topics have been covered.",
            hint: "Covering the syllabus and building competence are not the same measurement.",
          },
        ],
      },
    ],
  },

  {
    id: "D04",
    code: "04",
    name: "Proof of Learning",
    question: "Can I show a parent their child is actually progressing?",
    intro:
      "The old system handed you a number and a rank. The new one does not, and parents still want to know their child is getting somewhere. Schools that can answer that question keep their families. Schools that cannot lose them to schools that can.",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "D04-A",
            text: "Your school has a clear system for capturing each learner's progress, portfolios or assessment records included, that does not depend on one teacher's memory or one teacher's notebook.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "D04-B",
            text: "Teachers routinely change what they teach next based on what an assessment revealed, and you can see that happening rather than assume it.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "D04-C",
            text: "If a parent sat down today and asked you to prove their child has grown this term, you could answer with evidence rather than reassurance.",
            hint: "This is the question that decides whether they pay next term's fees.",
          },
        ],
      },
    ],
  },

  {
    id: "D05",
    code: "05",
    name: "Talent and Pathways",
    question: "Are we more than exam results?",
    intro:
      "Sport, arts, service and clubs are no longer the things you do after the real work. They are part of the offer, and they are increasingly what a family is choosing between when two schools have similar results. They are also how a child finds the pathway they will follow into senior school.",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "D05-A",
            text: "Your school has deliberately built provision beyond academics, in sport, arts, service or clubs, with real time and named staff allocated to it rather than fitting it in when the timetable allows.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "D05-B",
            text: "You can see individual learners being noticed for a talent or a strength and then given something real to develop it.",
            hint: "Spotting talent is common. Doing something about it is rarer.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "D05-C",
            text: "You keep records of learner talents, interests and strengths good enough to advise a family confidently on senior school pathway choices.",
          },
        ],
      },
    ],
  },

  {
    id: "D06",
    code: "06",
    name: "Parents as Partners",
    question: "Are parents with us, or watching us?",
    intro:
      "Competency based education asks more of parents than the old system did, and most of them were not consulted about that. Schools that bring parents in early get advocates. Schools that only contact them about fees and problems get critics.",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "D06-A",
            text: "Your school has a deliberate approach to involving parents in their child's learning, beyond fee notices, end of term reports and the annual meeting.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "D06-B",
            text: "Parents contact your school about learning, not only about problems and payments, and they get a useful answer quickly.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "D06-C",
            text: "You could name a specific decision your school changed in the last year because of something parents told you.",
            hint: "Gathering opinions is easy. Acting on them leaves a trace.",
          },
        ],
      },
    ],
  },

  {
    id: "D07",
    code: "07",
    name: "Character and Trust",
    question: "Is this a school people trust with their child?",
    intro:
      "Values, behaviour and safeguarding are written into the curriculum, but they are also the thing a parent is really assessing on the school tour. This is the domain that quietly decides whether a family recommends you at church, at work, or in a WhatsApp group.",
    lenses: [
      {
        id: "A",
        questions: [
          {
            id: "D07-A",
            text: "Your school has written expectations for behaviour, values and child safeguarding that every adult, including new staff and support staff, is properly inducted into.",
          },
        ],
      },
      {
        id: "B",
        questions: [
          {
            id: "D07-B",
            text: "The way adults speak to learners in your school on an ordinary day matches the values you put in your marketing.",
            hint: "This one is worth being honest about. Nobody else sees this answer.",
          },
        ],
      },
      {
        id: "C",
        questions: [
          {
            id: "D07-C",
            text: "You track things like attendance patterns, behaviour incidents and what learners say about the school, and you act on what they tell you rather than filing them.",
          },
        ],
      },
    ],
  },
];

/** Every question id in the order a director meets them. */
export const ALL_QUESTION_IDS: string[] = DOMAINS.flatMap((domain) =>
  domain.lenses.flatMap((lens) => lens.questions.map((question) => question.id)),
);

/** 21. Seven domains seen through three lenses each. */
export const TOTAL_SECTIONS = DOMAINS.length * 3;

/** 21. */
export const TOTAL_QUESTIONS = ALL_QUESTION_IDS.length;
