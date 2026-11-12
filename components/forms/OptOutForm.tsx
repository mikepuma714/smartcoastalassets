"use client";

import { useActionState } from "react";
import { submitOptOut, type OptOutState } from "@/app/actions/optout";

const inputClass =
  "block w-full rounded-sm border border-sand-300 bg-white px-4 py-3.5 text-base focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300/50";

export function OptOutForm() {
  const [state, action, pending] = useActionState<OptOutState, FormData>(submitOptOut, { status: "idle" });

  if (state.status === "success") {
    return (
      <p role="status" className="rounded-sm bg-white p-6 text-navy-900 ring-1 ring-sand-200">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="optout-email" className="mb-1.5 block text-[0.68rem] font-semibold tracking-[0.18em] text-navy-800 uppercase">
          Email address
        </label>
        <input id="optout-email" name="email" type="email" autoComplete="email" className={inputClass} />
      </div>
      <div>
        <label htmlFor="optout-phone" className="mb-1.5 block text-[0.68rem] font-semibold tracking-[0.18em] text-navy-800 uppercase">
          Mobile phone
        </label>
        <input id="optout-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
      </div>
      <div>
        <label htmlFor="optout-channel" className="mb-1.5 block text-[0.68rem] font-semibold tracking-[0.18em] text-navy-800 uppercase">
          Stop
        </label>
        <select id="optout-channel" name="channel" defaultValue="all" className={inputClass}>
          <option value="all">All marketing communications</option>
          <option value="sms">Text messages</option>
          <option value="phone_call">Phone calls</option>
          <option value="ai_voice">AI / prerecorded voice calls</option>
          <option value="email">Emails</option>
        </select>
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-gold w-full">
        {pending ? "Submitting…" : "Opt Out"}
      </button>
    </form>
  );
}
