"use client";

import { useActionState } from "react";
import { requestDemo } from "@/lib/leads/actions";
import { companySizes, initialFormState, limits } from "@/lib/leads/options";
import { BotFields, FormStatus, SelectField, SubmitButton, SuccessPanel, TextArea, TextField } from "./Fields";

type Props = { product: string; productName: string };

export function DemoForm({ product, productName }: Props) {
  const [state, action, pending] = useActionState(requestDemo, initialFormState);

  if (state.status === "success") return <SuccessPanel message={state.message} />;

  return (
    <form action={action} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="product" value={product} />
      <TextField name="name" label="Your name" state={state} required autoComplete="name" maxLength={limits.name} />
      <TextField name="email" label="Work email" type="email" state={state} required autoComplete="email" />
      <TextField name="company" label="Company" state={state} required autoComplete="organization" maxLength={limits.company} />
      <TextField name="role" label="Your role" state={state} autoComplete="organization-title" maxLength={limits.role} />
      <SelectField name="size" label="Company size" state={state} required options={companySizes} className="sm:col-span-2" />
      <TextArea name="message" label="Anything we should know?" hint="Your current process, systems or must-haves." state={state} maxLength={limits.message} className="sm:col-span-2" />
      <BotFields />
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormStatus state={state} />
        <SubmitButton pending={pending} label={`Request a ${productName} demo`} pendingLabel="Sending…" />
      </div>
    </form>
  );
}
