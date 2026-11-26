"use client";

import { useEffect, useId, useRef } from "react";
import type { FormState } from "@/lib/leads/options";

type Base = {
  name: string;
  label: string;
  state: FormState;
  required?: boolean;
  hint?: string;
  className?: string;
};

function useFieldIds(name: string) {
  const id = `${useId()}-${name}`;
  return { id, errorId: `${id}-error`, hintId: `${id}-hint` };
}

function Label({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/80">
      {label}
      {!required && <span className="font-normal text-ink/60"> (optional)</span>}
    </label>
  );
}

function Messages({ errorId, hintId, error, hint }: { errorId: string; hintId: string; error?: string; hint?: string }) {
  return (
    <>
      {hint && !error && <p id={hintId} className="mt-1.5 text-xs text-ink/65">{hint}</p>}
      {error && <p id={errorId} className="mt-1.5 text-xs text-coral">{error}</p>}
    </>
  );
}

const describedBy = (ids: ReturnType<typeof useFieldIds>, error?: string, hint?: string) =>
  error ? ids.errorId : hint ? ids.hintId : undefined;

export function TextField({ name, label, state, required, hint, className = "", type = "text", autoComplete, maxLength }: Base & {
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  maxLength?: number;
}) {
  const ids = useFieldIds(name);
  const error = state.errors?.[name]?.[0];
  return (
    <div className={className}>
      <Label id={ids.id} label={label} required={required} />
      <input
        id={ids.id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        defaultValue={state.values?.[name]}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, error, hint)}
        className="field"
      />
      <Messages errorId={ids.errorId} hintId={ids.hintId} error={error} hint={hint} />
    </div>
  );
}

export function TextArea({ name, label, state, required, hint, className = "", maxLength, minLength }: Base & {
  maxLength?: number;
  minLength?: number;
}) {
  const ids = useFieldIds(name);
  const error = state.errors?.[name]?.[0];
  return (
    <div className={className}>
      <Label id={ids.id} label={label} required={required} />
      <textarea
        id={ids.id}
        name={name}
        rows={5}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        defaultValue={state.values?.[name]}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, error, hint)}
        className="field resize-y"
      />
      <Messages errorId={ids.errorId} hintId={ids.hintId} error={error} hint={hint} />
    </div>
  );
}

export function SelectField({ name, label, state, required, hint, className = "", options, defaultValue }: Base & {
  options: readonly { value: string; label: string }[];
  defaultValue?: string;
}) {
  const ids = useFieldIds(name);
  const error = state.errors?.[name]?.[0];
  return (
    <div className={className}>
      <Label id={ids.id} label={label} required={required} />
      <select
        id={ids.id}
        name={name}
        required={required}
        defaultValue={state.values?.[name] ?? defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, error, hint)}
        className="field"
      >
        <option value="" disabled>
          Choose one
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Messages errorId={ids.errorId} hintId={ids.hintId} error={error} hint={hint} />
    </div>
  );
}

/** Spam checks: a field people never see, and when the form appeared. */
export function BotFields() {
  const started = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (started.current) started.current.value = String(Date.now());
  }, []);
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input ref={started} type="hidden" name="startedAt" defaultValue="" />
    </>
  );
}

export function FormStatus({ state }: { state: FormState }) {
  if (state.status !== "error" || !state.message) return null;
  return (
    <p role="alert" className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-[#a3290f]">
      {state.message}
    </p>
  );
}

export function SubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className="btn-3d rounded-xl px-6 py-3 text-sm font-medium disabled:opacity-70">
      {pending ? pendingLabel : label}
    </button>
  );
}

export function SuccessPanel({ message, children }: { message?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Move focus to the confirmation so keyboard and screen-reader users hear it.
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="flex flex-col items-start gap-4 py-6 outline-none">
      <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(180deg,#45d9a0,#0e9f68)] text-xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-8px_rgba(14,159,104,0.7)]">
        ✓
      </span>
      <p className="text-xl font-medium tracking-tight">{message}</p>
      {children}
    </div>
  );
}
