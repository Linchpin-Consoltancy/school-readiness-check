"use client";

import { useRef, useState } from "react";
import { ENROLMENT_BANDS, SCHOOL_TYPES } from "@/lib/profile";
import { eyebrowText, primaryButton, quietButton } from "./ui";

export type ProfileDraft = {
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  schoolType: string;
  enrolment: string;
  region: string;
};

export const EMPTY_PROFILE: ProfileDraft = {
  fullName: "",
  email: "",
  phone: "",
  schoolName: "",
  schoolType: "",
  enrolment: "",
  region: "",
};

const labelClass =
  "block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-onyx/75";

// 16px stops mobile browsers zooming in when a field is focused.
const controlBase =
  "mt-2 w-full rounded-[3px] border bg-white px-4 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-dusk/50 focus:border-amber focus:ring-2 focus:ring-amber/20";

function control(hasError: boolean, extra = "") {
  return `${controlBase} ${
    hasError
      ? "border-critical ring-2 ring-critical/15"
      : "border-dusk/30 hover:border-dusk/50"
  } ${extra}`.trim();
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
          <span className="ml-2 text-[0.66rem] tracking-normal text-dusk/70 normal-case">
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

export function CaptureScreen({
  profile,
  errors,
  pending,
  onChange,
  onSubmit,
  onBack,
}: {
  profile: ProfileDraft;
  errors: Record<string, string[] | undefined>;
  pending: boolean;
  onChange: (next: ProfileDraft) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [corrected, setCorrected] = useState<ReadonlySet<string>>(new Set());

  const errorFor = (field: string) =>
    corrected.has(field) ? undefined : errors[field]?.[0];

  const set = (field: keyof ProfileDraft, value: string) => {
    onChange({ ...profile, [field]: value });
    setCorrected((previous) =>
      previous.has(field) ? previous : new Set(previous).add(field),
    );
  };

  const describedBy = (field: string) =>
    errorFor(field) ? `${field}-error` : undefined;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
      <p className={eyebrowText}>Your results are ready</p>

      <h1 className="mt-6 font-display text-[2.1rem] leading-[1.12] font-normal text-onyx sm:text-[2.7rem]">
        Where should we send them?
      </h1>

      <p className="mt-6 max-w-[50ch] text-[0.98rem] leading-[1.75] text-charcoal/85">
        Your scores are worked out and waiting. Tell us who you are so we can
        put your school on the report and get a copy to you. One follow up from
        us, and nothing else. We do not sell or share your details.
      </p>

      <form
        ref={formRef}
        className="mt-11 space-y-6"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setCorrected(new Set());
          onSubmit();
        }}
      >
        {errors.form ? (
          <p
            role="alert"
            className="rounded-[3px] border border-critical/30 bg-critical/5 px-4 py-3 text-[0.85rem] text-critical"
          >
            {errors.form[0]}
          </p>
        ) : null}

        <Field name="fullName" label="Your name" error={errorFor("fullName")}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={profile.fullName}
            onChange={(event) => set("fullName", event.target.value)}
            aria-invalid={Boolean(errorFor("fullName"))}
            aria-describedby={describedBy("fullName")}
            className={control(Boolean(errorFor("fullName")))}
          />
        </Field>

        <Field name="schoolName" label="School name" error={errorFor("schoolName")}>
          <input
            id="schoolName"
            name="schoolName"
            type="text"
            autoComplete="organization"
            value={profile.schoolName}
            onChange={(event) => set("schoolName", event.target.value)}
            aria-invalid={Boolean(errorFor("schoolName"))}
            aria-describedby={describedBy("schoolName")}
            className={control(Boolean(errorFor("schoolName")))}
          />
        </Field>

        <Field name="email" label="Email" error={errorFor("email")}>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={profile.email}
            onChange={(event) => set("email", event.target.value)}
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby={describedBy("email")}
            className={control(Boolean(errorFor("email")))}
          />
        </Field>

        <Field name="phone" label="Phone or WhatsApp" error={errorFor("phone")}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="07XX XXX XXX"
            value={profile.phone}
            onChange={(event) => set("phone", event.target.value)}
            aria-invalid={Boolean(errorFor("phone"))}
            aria-describedby={describedBy("phone")}
            className={control(Boolean(errorFor("phone")))}
          />
        </Field>

        <Field name="schoolType" label="Your school covers" error={errorFor("schoolType")}>
          <select
            id="schoolType"
            name="schoolType"
            value={profile.schoolType}
            onChange={(event) => set("schoolType", event.target.value)}
            aria-invalid={Boolean(errorFor("schoolType"))}
            aria-describedby={describedBy("schoolType")}
            className={control(Boolean(errorFor("schoolType")), "select-field")}
          >
            <option value="">Please choose</option>
            {SCHOOL_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field name="enrolment" label="Roughly how many learners" error={errorFor("enrolment")}>
          <select
            id="enrolment"
            name="enrolment"
            value={profile.enrolment}
            onChange={(event) => set("enrolment", event.target.value)}
            aria-invalid={Boolean(errorFor("enrolment"))}
            aria-describedby={describedBy("enrolment")}
            className={control(Boolean(errorFor("enrolment")), "select-field")}
          >
            <option value="">Please choose</option>
            {ENROLMENT_BANDS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field name="region" label="County" optional error={errorFor("region")}>
          <input
            id="region"
            name="region"
            type="text"
            autoComplete="address-level1"
            value={profile.region}
            onChange={(event) => set("region", event.target.value)}
            aria-invalid={Boolean(errorFor("region"))}
            aria-describedby={describedBy("region")}
            className={control(Boolean(errorFor("region")))}
          />
        </Field>

        <div className="pt-2">
          <button
            type="submit"
            disabled={pending}
            className={`${primaryButton} w-full`}
          >
            {pending ? "Working out your scores" : "Show my results"}
          </button>
        </div>

        <div className="pt-1">
          <button type="button" onClick={onBack} className={quietButton}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
