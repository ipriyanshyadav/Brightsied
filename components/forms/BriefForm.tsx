"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitBrief } from "@/lib/leads/actions";
import { NOT_SURE, budgets, initialFormState, limits, timelines } from "@/lib/leads/options";
import { BotFields, FormStatus, SelectField, SubmitButton, SuccessPanel, TextArea, TextField } from "./Fields";

type Props = { packages: { slug: string; name: string }[]; requested?: string | null };

/** The brief with ?interest=<package> (from "Get a quote" links) preselected. Needs a Suspense boundary. */
export function BriefFormFromUrl({ packages }: Props) {
  return <BriefForm packages={packages} requested={useSearchParams().get("interest")} />;
}

export function BriefForm({ packages, requested }: Props) {
  const [state, action, pending] = useActionState(submitBrief, initialFormState);
  const interestOptions = [...packages.map((p) => ({ value: p.slug, label: p.name })), { value: NOT_SURE, label: "Not sure yet" }];
  const preselect = interestOptions.some((o) => o.value === requested) ? (requested ?? undefined) : undefined;

  if (state.status === "success") return <SuccessPanel message={state.message} />;

  return (
    <form action={action} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <TextField name="name" label="Your name" state={state} required autoComplete="name" maxLength={limits.name} />
      <TextField name="email" label="Work email" type="email" state={state} required autoComplete="email" />
      <TextField name="company" label="Company" state={state} autoComplete="organization" maxLength={limits.company} />
      <TextField name="phone" label="Phone or WhatsApp" type="tel" state={state} autoComplete="tel" maxLength={limits.phone} />
      <SelectField name="interest" label="What would you like to start with?" state={state} required options={interestOptions} defaultValue={preselect} className="sm:col-span-2" />
      <SelectField name="budget" label="Budget" state={state} required options={budgets} />
      <SelectField name="timeline" label="Timeline" state={state} required options={timelines} />
      <TextArea
        name="message"
        label="What are you building?"
        hint="The problem, who it's for, and anything already in place."
        state={state}
        required
        minLength={limits.messageMin}
        maxLength={limits.message}
        className="sm:col-span-2"
      />
      <BotFields />
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormStatus state={state} />
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton pending={pending} label="Send brief" pendingLabel="Sending…" />
          <p className="text-xs text-ink/50">
            We use your details only to reply. See our <a href="/privacy" className="underline underline-offset-2">privacy policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
}
