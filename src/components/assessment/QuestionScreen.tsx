"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RATING_SCALE } from "@/content/assessment";
import { saveNote, saveRating } from "@/lib/assessment-actions";
import { ContextLine, contextText, primaryButton, secondaryButton } from "./ui";

type SaveStatus = "idle" | "saving" | "saved" | "error";

/** How long to wait after the last keystroke before storing a note. */
const NOTE_SAVE_DELAY_MS = 800;

export function QuestionScreen({
  assessmentId,
  questionId,
  questionText,
  domainCode,
  domainName,
  lensLabel,
  questionNumber,
  questionsInLens,
  initialRating,
  initialNote,
  backHref,
  nextHref,
}: {
  assessmentId: string;
  questionId: string;
  questionText: string;
  domainCode: string;
  domainName: string;
  lensLabel: string;
  questionNumber: number;
  questionsInLens: number;
  initialRating: number | null;
  initialNote: string;
  backHref: string;
  nextHref: string;
}) {
  const router = useRouter();

  const [rating, setRating] = useState<number | null>(initialRating);
  const [note, setNote] = useState(initialNote);
  const [status, setStatus] = useState<SaveStatus>(
    initialRating === null ? "idle" : "saved",
  );
  const [isLeaving, setIsLeaving] = useState(false);

  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsavedNote = useRef<string | null>(null);

  async function storeNote(value: string) {
    unsavedNote.current = null;
    setStatus("saving");
    const result = await saveNote(assessmentId, questionId, value);
    setStatus(result.ok ? "saved" : "error");
  }

  function handleNoteChange(value: string) {
    setNote(value);
    unsavedNote.current = value;
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => {
      void storeNote(value);
    }, NOTE_SAVE_DELAY_MS);
  }

  /** Writes any note still waiting on the timer. Called before leaving the
   *  screen so a note typed a moment ago cannot be lost. */
  async function flushNote() {
    if (noteTimer.current) {
      clearTimeout(noteTimer.current);
      noteTimer.current = null;
    }
    if (unsavedNote.current !== null) {
      await storeNote(unsavedNote.current);
    }
  }

  /** The rating is written the instant it is chosen, not when Next is
   *  pressed. If the write fails the choice is rolled back, so the screen
   *  never claims to have saved something it did not. */
  async function chooseRating(value: number) {
    const previous = rating;
    setRating(value);
    setStatus("saving");

    const result = await saveRating(assessmentId, questionId, value);

    if (result.ok) {
      setStatus("saved");
    } else {
      setRating(previous);
      setStatus("error");
    }
  }

  async function leaveTo(href: string) {
    setIsLeaving(true);
    await flushNote();
    router.push(href);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14 lg:py-20">
      <ContextLine
        domainCode={domainCode}
        domainName={domainName}
        lensLabel={lensLabel}
      />

      <p className={`mt-6 ${contextText}`}>
        Question {questionNumber} of {questionsInLens}
      </p>

      <h1
        id="question-text"
        className="mt-5 font-display text-[1.5rem] leading-[1.4] font-normal text-onyx sm:text-[1.85rem] sm:leading-[1.35]"
      >
        {questionText}
      </h1>

      <fieldset className="mt-11">
        <legend className="sr-only">
          Choose a rating for this question
        </legend>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {RATING_SCALE.map((option) => (
            <label
              key={option.value}
              className="cursor-pointer"
              title={option.description}
            >
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={rating === option.value}
                onChange={() => void chooseRating(option.value)}
                className="peer sr-only"
              />
              <span className="flex items-center gap-4 rounded-[3px] border border-dusk/30 bg-ivory px-5 py-4 transition-colors hover:border-amber/70 peer-checked:border-onyx peer-checked:bg-onyx peer-checked:text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-amber peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-parchment sm:flex-col sm:items-start sm:gap-2 sm:px-5 sm:py-5">
                <span className="font-display text-[1.6rem] leading-none">
                  {option.value}
                </span>
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em]">
                  {option.name}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p
        aria-live="polite"
        className={`mt-5 min-h-5 text-[0.78rem] leading-relaxed ${
          status === "error" ? "text-critical" : "text-dusk"
        }`}
      >
        {status === "saving" ? "Saving" : null}
        {status === "saved" ? "Answer saved" : null}
        {status === "error"
          ? "We could not save that. Check your connection and choose again."
          : null}
      </p>

      <div className="mt-10">
        <label
          htmlFor="note"
          className="block text-[0.7rem] font-medium uppercase tracking-[0.16em] text-onyx/75"
        >
          Add a note
          <span className="ml-2 text-[0.68rem] tracking-normal text-dusk/70 normal-case">
            Optional
          </span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          value={note}
          onChange={(event) => handleNoteChange(event.target.value)}
          onBlur={() => void flushNote()}
          placeholder="Anything you want to remember about this answer."
          className="mt-2 w-full resize-y rounded-[3px] border border-dusk/30 bg-white px-4 py-3 text-base leading-relaxed text-charcoal outline-none transition-colors placeholder:text-dusk/50 hover:border-dusk/50 focus:border-amber focus:ring-2 focus:ring-amber/20"
        />
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
        <button
          type="button"
          onClick={() => void leaveTo(nextHref)}
          disabled={rating === null || isLeaving}
          className={primaryButton}
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => void leaveTo(backHref)}
          disabled={isLeaving}
          className={secondaryButton}
        >
          Back
        </button>
      </div>

      {rating === null ? (
        <p className="mt-5 text-[0.78rem] leading-relaxed text-dusk">
          Choose a rating to continue.
        </p>
      ) : null}
    </div>
  );
}
