"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { registerAssessment } from "@/app/actions";
import {
  ENROLMENT_BANDS,
  SCHOOL_TYPES,
  type RegistrationState,
} from "@/lib/registration";

const labelClass =
  "block text-[0.7rem] font-medium uppercase tracking-[0.16em] text-onyx/75";

// 16px keeps mobile browsers from zooming in when a field is focused.
const controlClass =
  "mt-2 w-full rounded-[3px] border bg-white px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-dusk/50 focus:border-amber focus:ring-2 focus:ring-amber/20";

function control(hasError: boolean, extra = "") {
  const state = hasError
    ? "border-critical ring-2 ring-critical/15"
    : "border-dusk/30 hover:border-dusk/50";
  return `${controlClass} ${state} ${extra}`.trim();
}

function Field({
  name,
  label,
  optional,
  error,
  children,
}: {
  name: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {optional ? (
          <span className="ml-2 text-[0.68rem] tracking-normal text-dusk/70 normal-case">
            Optional
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1.5 text-[0.8rem] leading-snug text-critical"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const initialState: RegistrationState = {};
const NO_CORRECTIONS: ReadonlySet<string> = new Set();

export function RegistrationForm() {
  const [state, formAction, isPending] = useActionState(
    registerAssessment,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Fields the principal has started correcting, so their error message can
  // be hidden straight away rather than staying red while they retype.
  // The set is stored alongside the response it belongs to, which means a
  // fresh response from the server automatically wipes the slate clean.
  const [correction, setCorrection] = useState<{
    from: RegistrationState;
    fields: ReadonlySet<string>;
  }>({ from: initialState, fields: NO_CORRECTIONS });

  const corrected =
    correction.from === state ? correction.fields : NO_CORRECTIONS;

  function noteCorrection(event: React.FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLElement).getAttribute("name");
    if (!name || corrected.has(name)) return;
    setCorrection({ from: state, fields: new Set(corrected).add(name) });
  }

  // Move the cursor to the first field that needs attention, so a principal
  // on a phone is not left hunting for the problem.
  useEffect(() => {
    if (!state.errors) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [state]);

  const errorFor = (field: string) =>
    corrected.has(field) ? undefined : state.errors?.[field as never]?.[0];
  const valueFor = (field: string) => state.values?.[field] ?? "";
  const describedBy = (field: string) =>
    errorFor(field) ? `${field}-error` : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={noteCorrection}
      noValidate
      className="space-y-6"
    >
      {state.errors?.form ? (
        <p
          role="alert"
          className="rounded-[3px] border border-critical/30 bg-critical/5 px-4 py-3 text-[0.85rem] text-critical"
        >
          {state.errors.form[0]}
        </p>
      ) : null}

      <Field name="fullName" label="Full name" error={errorFor("fullName")}>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          defaultValue={valueFor("fullName")}
          aria-required="true"
          aria-invalid={Boolean(errorFor("fullName"))}
          aria-describedby={describedBy("fullName")}
          className={control(Boolean(errorFor("fullName")))}
        />
      </Field>

      <Field name="email" label="Email address" error={errorFor("email")}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          defaultValue={valueFor("email")}
          aria-required="true"
          aria-invalid={Boolean(errorFor("email"))}
          aria-describedby={describedBy("email")}
          className={control(Boolean(errorFor("email")))}
        />
      </Field>

      <Field name="schoolName" label="School name" error={errorFor("schoolName")}>
        <input
          id="schoolName"
          name="schoolName"
          type="text"
          autoComplete="organization"
          defaultValue={valueFor("schoolName")}
          aria-required="true"
          aria-invalid={Boolean(errorFor("schoolName"))}
          aria-describedby={describedBy("schoolName")}
          className={control(Boolean(errorFor("schoolName")))}
        />
      </Field>

      <Field name="schoolType" label="School type" error={errorFor("schoolType")}>
        <select
          id="schoolType"
          name="schoolType"
          defaultValue={valueFor("schoolType")}
          aria-required="true"
          aria-invalid={Boolean(errorFor("schoolType"))}
          aria-describedby={describedBy("schoolType")}
          className={control(Boolean(errorFor("schoolType")), "select-field")}
        >
          <option value="">Please select</option>
          {SCHOOL_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field
        name="enrolment"
        label="Approximate enrolment"
        error={errorFor("enrolment")}
      >
        <select
          id="enrolment"
          name="enrolment"
          defaultValue={valueFor("enrolment")}
          aria-required="true"
          aria-invalid={Boolean(errorFor("enrolment"))}
          aria-describedby={describedBy("enrolment")}
          className={control(Boolean(errorFor("enrolment")), "select-field")}
        >
          <option value="">Please select</option>
          {ENROLMENT_BANDS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field
        name="region"
        label="County or region"
        optional
        error={errorFor("region")}
      >
        <input
          id="region"
          name="region"
          type="text"
          autoComplete="address-level1"
          defaultValue={valueFor("region")}
          aria-invalid={Boolean(errorFor("region"))}
          aria-describedby={describedBy("region")}
          className={control(Boolean(errorFor("region")))}
        />
      </Field>

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-[3px] bg-onyx px-6 py-4 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-onyx/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Preparing your assessment" : "Continue"}
        </button>
        <p className="mt-4 text-center text-[0.75rem] leading-relaxed text-dusk">
          Takes about 25 minutes. No password needed.
        </p>
      </div>
    </form>
  );
}
