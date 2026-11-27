// Choices offered by the lead forms. Shared by the forms (labels) and the server actions
// (validation), so the two can never disagree.

export const NOT_SURE = "not-sure";

export const budgets = [
  { value: "under-5l", label: "Under ₹5 lakh" },
  { value: "5-15l", label: "₹5–15 lakh" },
  { value: "15-40l", label: "₹15–40 lakh" },
  { value: "40l-plus", label: "₹40 lakh or more" },
  { value: NOT_SURE, label: "Not sure yet" },
] as const;

export const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3m", label: "In the next 1–3 months" },
  { value: "3m-plus", label: "Later than 3 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

export const companySizes = [
  { value: "1-10", label: "1–10 people" },
  { value: "11-50", label: "11–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "201-1000", label: "201–1,000 people" },
  { value: "1000-plus", label: "More than 1,000 people" },
] as const;

/** Submissions faster than this after the form appeared are treated as automated. */
export const MIN_FILL_MS = 3000;

export const limits = {
  name: 100,
  company: 120,
  phone: 30,
  role: 100,
  message: 4000,
  messageMin: 20,
} as const;

export type FieldErrors = Partial<Record<string, string[]>>;

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  /** What the visitor typed, so a failed submission doesn't wipe the form. */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

export const labelOf = (list: readonly { value: string; label: string }[], value: string) =>
  list.find((o) => o.value === value)?.label ?? value;
