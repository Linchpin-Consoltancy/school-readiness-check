"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { z } from "zod";
import { DOMAINS, TOTAL_QUESTIONS } from "@/content/assessment";
import {
  CAPTURE_INDEX,
  RESULTS_INDEX,
  STEPS,
  firstUnansweredIndex,
  questionAt,
} from "@/lib/experience";
import { recordAnonymous } from "@/lib/submissions";
import { contextSchema } from "@/lib/profile";
import { allDomainResults, type DomainResult } from "@/lib/scoring";
import { CaptureScreen, EMPTY_CONTEXT, type ContextDraft } from "./CaptureScreen";
import { Frame } from "./Frame";
import { ResultsScreen } from "./ResultsScreen";
import { DomainScreen, IntroScreen, QuestionScreen } from "./screens";

/** How long a chosen answer stays on screen before the next question arrives.
 *  Long enough to see the choice register, short enough to feel instant. */
const ADVANCE_DELAY_MS = 260;

// Bumped when the shape below changed, so a half finished session saved
// under the old shape is ignored rather than half restored.
const STORAGE_KEY = "linchpin.readiness.v2";

/** Everything worth remembering between visits, held together so it can be
 *  restored in one move. */
type Session = {
  stepIndex: number;
  answers: Record<string, number>;
  context: ContextDraft;
};

const NEW_SESSION: Session = {
  stepIndex: 0,
  answers: {},
  context: EMPTY_CONTEXT,
};

/** Browser storage never changes underneath us, so there is nothing to
 *  subscribe to. */
const NO_SUBSCRIPTION = () => () => {};

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parseSession(raw: string | null): Session | null {
  try {
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (typeof parsed !== "object" || parsed === null) return null;

    return {
      // Never resume straight into results. Those only exist once the
      // assessment has been saved on the server.
      stepIndex: Math.min(
        typeof parsed.stepIndex === "number" ? parsed.stepIndex : 0,
        CAPTURE_INDEX,
      ),
      answers:
        typeof parsed.answers === "object" && parsed.answers !== null
          ? (parsed.answers as Record<string, number>)
          : {},
      context: { ...EMPTY_CONTEXT, ...(parsed.context ?? {}) },
    };
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // A browser with storage switched off still works. It just cannot
    // remember progress between visits.
  }
}

export function Experience() {
  /* --- pick up where they left off --------------------------------------
     Storage cannot be read while rendering and does not exist on the server
     at all. Reading it through this hook gives the server a null and the
     browser the real value, and React reconciles the two itself, so there is
     no flash of the wrong screen and no state seeded from inside an effect. */
  const storedRaw = useSyncExternalStore(
    NO_SUBSCRIPTION,
    readStored,
    () => null,
  );

  const restoredSession = useMemo(
    () => parseSession(storedRaw) ?? NEW_SESSION,
    [storedRaw],
  );

  /** Null until the director does something. Until then the restored copy
   *  stands, and nothing is written back over it. */
  const [touched, setTouched] = useState<Session | null>(null);
  const session = touched ?? restoredSession;

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [results, setResults] = useState<DomainResult[] | null>(null);
  /** Once the results are on screen the browser copy must stay gone, or a
   *  returning visitor would land back on the form and start again. */
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSession = useCallback(
    (update: (current: Session) => Session) => {
      setTouched((current) => update(current ?? restoredSession));
    },
    [restoredSession],
  );

  /* --- keep the browser copy current ------------------------------------ */

  useEffect(() => {
    if (touched === null || submitted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(touched));
    } catch {
      // Storage unavailable. Progress simply is not remembered.
    }
  }, [touched, submitted]);

  /* --- move the reader to the top of each new screen --------------------- */

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [session.stepIndex]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const goTo = useCallback(
    (next: number) => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
      }
      setSession((current) => ({
        ...current,
        stepIndex: Math.max(0, Math.min(next, STEPS.length - 1)),
      }));
    },
    [setSession],
  );

  const step = STEPS[session.stepIndex];
  const answeredCount = Object.keys(session.answers).length;

  const progress =
    step.kind === "intro"
      ? null
      : step.kind === "results"
        ? 1
        : Math.min(answeredCount / TOTAL_QUESTIONS, 1);

  /* --- answering --------------------------------------------------------- */

  function answer(questionId: string, rating: number) {
    // The screen the answer was given on. The move forward is tied to it, so
    // a timer that fires late can never push the reader on from somewhere
    // else, and firing twice can never skip a question.
    const from = session.stepIndex;

    setSession((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: rating },
    }));

    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setSession((current) =>
        current.stepIndex === from
          ? { ...current, stepIndex: Math.min(from + 1, CAPTURE_INDEX) }
          : current,
      );
    }, ADVANCE_DELAY_MS);
  }

  /* --- submitting -------------------------------------------------------- */

  function submit() {
    setErrors({});

    if (firstUnansweredIndex(session.answers) !== null) {
      setErrors({
        form: ["Some answers are missing. Use Back to finish them."],
      });
      return;
    }

    const { context, answers } = session;
    const parsed = contextSchema.safeParse({
      ...context,
      region: context.region.trim() === "" ? undefined : context.region,
    });

    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    const computed = allDomainResults(answers);

    startTransition(async () => {
      // The anonymous record is ours, not theirs. If it fails to send, the
      // results still appear exactly as they would have.
      await recordAnonymous(parsed.data, answers, computed);

      setSubmitted(true);
      setResults(computed);
      setSession((current) => ({ ...current, stepIndex: RESULTS_INDEX }));

      // Nothing is held anywhere else, so the browser copy goes once the
      // results are on screen rather than being restored on a later visit.
      clearSession();
    });
  }

  function restart() {
    clearSession();
    setErrors({});
    setResults(null);
    setSubmitted(false);
    setTouched(NEW_SESSION);
  }

  /* --- render ------------------------------------------------------------ */

  function renderStep() {
    switch (step.kind) {
      case "intro":
        return <IntroScreen onStart={() => goTo(session.stepIndex + 1)} />;

      case "domain":
        return (
          <DomainScreen
            domain={DOMAINS[step.domainIndex]}
            domainIndex={step.domainIndex}
            onContinue={() => goTo(session.stepIndex + 1)}
            onBack={() => goTo(session.stepIndex - 1)}
          />
        );

      case "question": {
        const { domain, lens, question } = questionAt(step);
        return (
          <QuestionScreen
            domain={domain}
            lensId={lens.id}
            question={question}
            questionNumber={step.questionNumber}
            value={session.answers[question.id] ?? null}
            onAnswer={(rating) => answer(question.id, rating)}
            onBack={() => goTo(session.stepIndex - 1)}
          />
        );
      }

      case "capture":
        return (
          <CaptureScreen
            context={session.context}
            errors={errors}
            pending={pending}
            onChange={(context) =>
              setSession((current) => ({ ...current, context }))
            }
            onSubmit={submit}
            onBack={() => goTo(session.stepIndex - 1)}
          />
        );

      case "results": {
        if (!results) return null;
        const parsed = contextSchema.safeParse({
          ...session.context,
          region:
            session.context.region.trim() === ""
              ? undefined
              : session.context.region,
        });
        if (!parsed.success) return null;
        return (
          <ResultsScreen
            context={parsed.data}
            answers={session.answers}
            results={results}
            onRestart={restart}
          />
        );
      }
    }
  }

  return (
    <Frame progress={progress}>
      <div key={step.key} className="animate-step">
        {renderStep()}
      </div>
    </Frame>
  );
}
