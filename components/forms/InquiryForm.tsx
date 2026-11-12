"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";
import { CONSENT_HEADING, CONSENT_TEXT } from "@/lib/consent";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "qr"];

function ConsentText() {
  const [before, rest] = CONSENT_TEXT.split("Privacy Policy");
  const [middle, after] = (rest ?? "").split("Terms of Use");
  return (
    <>
      {before}
      <Link href="/privacy" target="_blank" className="font-medium text-navy-800 underline underline-offset-2">
        Privacy Policy
      </Link>
      {middle}
      <Link href="/terms" target="_blank" className="font-medium text-navy-800 underline underline-offset-2">
        Terms of Use
      </Link>
      {after}
    </>
  );
}

const inputClass =
  "block w-full rounded-sm border border-sand-300 bg-white px-4 py-3.5 text-base text-ink placeholder:text-muted/60 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50 aria-[invalid=true]:border-red-500";

export function InquiryForm({
  projects,
  defaultProject,
  heading = "Request Information",
  dark = false,
}: {
  projects: { slug: string; name: string }[];
  defaultProject?: string;
  heading?: string;
  dark?: boolean;
}) {
  const id = useId();
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const submit = (formData: FormData) => {
    const params = new URLSearchParams(window.location.search);
    formData.set("pageUrl", window.location.href);
    formData.set("referrer", document.referrer);
    formData.set("startedAt", String(mountedAt.current));
    for (const key of UTM_KEYS) {
      const v = params.get(key);
      if (v) formData.set(key, v);
    }
    action(formData);
  };

  if (state.status === "success") {
    return (
      <div role="status" className={`rounded-sm p-8 text-center ${dark ? "bg-white/5 text-white" : "bg-white"}`}>
        <CheckCircle2 className="mx-auto size-10 text-gold-500" strokeWidth={1.25} />
        <p className={`mt-4 font-display text-3xl ${dark ? "text-white" : "text-navy-900"}`}>Thank you.</p>
        <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-white/75" : "text-muted"}`}>
          {state.message ?? "Your inquiry has been received."}
        </p>
      </div>
    );
  }

  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};
  const label = `mb-1.5 block text-[0.68rem] font-semibold tracking-[0.18em] uppercase ${dark ? "text-white/70" : "text-navy-800"}`;

  return (
    <form key={JSON.stringify(state.values ?? {})} action={submit} noValidate className="space-y-5" aria-describedby={state.message ? `${id}-status` : undefined}>
      {heading && <p className={`font-display text-3xl ${dark ? "text-white" : "text-navy-900"}`}>{heading}</p>}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-first`} className={label}>
            First name
          </label>
          <input
            id={`${id}-first`}
            name="firstName"
            defaultValue={v.firstName}
            autoComplete="given-name"
            required
            aria-invalid={Boolean(err.firstName)}
            className={inputClass}
          />
          {err.firstName && <p className="mt-1 text-sm text-red-600">{err.firstName}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-last`} className={label}>
            Last name
          </label>
          <input
            id={`${id}-last`}
            name="lastName"
            defaultValue={v.lastName}
            autoComplete="family-name"
            required
            aria-invalid={Boolean(err.lastName)}
            className={inputClass}
          />
          {err.lastName && <p className="mt-1 text-sm text-red-600">{err.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={label}>
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          defaultValue={v.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(err.email)}
          className={inputClass}
        />
        {err.email && <p className="mt-1 text-sm text-red-600">{err.email}</p>}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className={label}>
          Mobile phone
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          defaultValue={v.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          aria-invalid={Boolean(err.phone)}
          className={inputClass}
        />
        {err.phone && <p className="mt-1 text-sm text-red-600">{err.phone}</p>}
      </div>

      <div>
        <label htmlFor={`${id}-project`} className={label}>
          Project of interest
        </label>
        <select
          id={`${id}-project`}
          name="project"
          required
          defaultValue={v.project || defaultProject || ""}
          aria-invalid={Boolean(err.project)}
          className={inputClass}
        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
          <option value="general">Not sure yet / all projects</option>
        </select>
        {err.project && <p className="mt-1 text-sm text-red-600">{err.project}</p>}
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={label}>
          Message <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
        </label>
        <textarea id={`${id}-message`} name="message" rows={3} defaultValue={v.message} className={inputClass} />
      </div>

      <fieldset className={`rounded-sm border p-4 ${dark ? "border-white/15 bg-white/5" : "border-sand-300 bg-sand-100/60"}`}>
        <legend className={`px-1 text-[0.68rem] font-semibold tracking-[0.18em] ${dark ? "text-white/80" : "text-navy-800"}`}>
          {CONSENT_HEADING} <span className="font-normal tracking-normal normal-case opacity-70">(optional)</span>
        </legend>
        <div className="flex items-start gap-3">
          <input
            id={`${id}-consent`}
            name="marketingConsent"
            type="checkbox"
            value="yes"
            defaultChecked={false}
            className="mt-1 size-5 shrink-0 cursor-pointer accent-gold-500"
          />
          <label
            htmlFor={`${id}-consent`}
            className={`cursor-pointer text-[0.875rem] leading-relaxed ${dark ? "text-white/80" : "text-ink/85"}`}
          >
            <ConsentText />
          </label>
        </div>
      </fieldset>

      {state.status === "error" && state.message && (
        <p id={`${id}-status`} role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-70">
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {pending ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
