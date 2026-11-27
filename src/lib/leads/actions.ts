"use server";

import { z } from "zod";
import { getLeadConfig } from "@/lib/config";
import { getPackages, getProducts, getSettings } from "@/lib/content";
import { sendEmail } from "./email";
import {
  NOT_SURE,
  MIN_FILL_MS,
  budgets,
  companySizes,
  labelOf,
  limits,
  timelines,
  type FormState,
} from "./options";

const values = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as [string, ...string[]];

const trimmed = (max: number, message: string) => z.string().trim().min(1, message).max(max, `Please keep this under ${max} characters.`);
const optionalText = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().default("");
const email = z.string().trim().pipe(z.email("Please enter a valid email address."));
const phone = z
  .string()
  .trim()
  .max(limits.phone)
  .regex(/^[+\d][\d\s-]*$|^$/, "Use digits, spaces, + or - only.")
  .optional()
  .default("");

const pick = (data: FormData, keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, typeof data.get(k) === "string" ? (data.get(k) as string) : ""]));

/** Bots fill the hidden field or submit instantly. Returns true when the submission looks automated. */
function looksAutomated(data: FormData) {
  const honeypot = data.get("website");
  const startedAt = Number(data.get("startedAt"));
  return (typeof honeypot === "string" && honeypot.length > 0) || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS;
}

async function deliver(subject: string, text: string, visitor: { email: string; name: string }, autoReply: string) {
  const config = getLeadConfig();
  await sendEmail(config, { to: config.LEAD_INBOX_EMAIL, subject, text, replyTo: visitor.email });
  if (!config.LEAD_SEND_AUTOREPLY) return;
  // The lead is already in the inbox, so a failed confirmation is logged rather than shown as a failed submission.
  try {
    await sendEmail(config, { to: visitor.email, subject: "We've got your message", text: autoReply });
  } catch (err) {
    console.error("Lead auto-reply failed:", err instanceof Error ? err.message : err);
  }
}

async function failure(err: unknown, kept: Record<string, string>): Promise<FormState> {
  const site = await getSettings();
  console.error("Lead delivery failed:", err instanceof Error ? err.message : err);
  return {
    status: "error",
    message: `Sorry, we couldn't send that just now. Please try again, or email us at ${site.email}.`,
    values: kept,
  };
}

const BRIEF_FIELDS = ["name", "email", "company", "phone", "interest", "budget", "timeline", "message"];

export async function submitBrief(_prev: FormState, data: FormData): Promise<FormState> {
  const kept = pick(data, BRIEF_FIELDS);
  if (looksAutomated(data)) {
    return { status: "error", message: "That was quick! Please check the form and send it again.", values: kept };
  }

  const packages = await getPackages();
  const schema = z.object({
    name: trimmed(limits.name, "Please tell us your name."),
    email,
    company: optionalText(limits.company),
    phone,
    interest: z.enum([NOT_SURE, ...packages.map((p) => p.slug)], "Please choose an option."),
    budget: z.enum(values(budgets), "Please choose a budget range."),
    timeline: z.enum(values(timelines), "Please choose a timeline."),
    message: z
      .string()
      .trim()
      .min(limits.messageMin, `A sentence or two helps (at least ${limits.messageMin} characters).`)
      .max(limits.message, `Please keep this under ${limits.message} characters.`),
  });

  const parsed = schema.safeParse(kept);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: kept,
    };
  }

  const b = parsed.data;
  const interest = packages.find((p) => p.slug === b.interest)?.name ?? "Not sure yet";
  const text = [
    `New project brief`,
    ``,
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    `Company: ${b.company || "-"}`,
    `Phone / WhatsApp: ${b.phone || "-"}`,
    `Interested in: ${interest}`,
    `Budget: ${labelOf(budgets, b.budget)}`,
    `Timeline: ${labelOf(timelines, b.timeline)}`,
    ``,
    b.message,
  ].join("\n");

  const site = await getSettings();
  try {
    await deliver(
      `Brief: ${b.name}${b.company ? ` (${b.company})` : ""}, ${interest}`,
      text,
      b,
      `Hi ${b.name},\n\nThanks for telling us about your project. ${site.responseTime}\n\n${site.name}`,
    );
  } catch (err) {
    return failure(err, kept);
  }
  return { status: "success", message: `Thanks, ${b.name}. Your brief is with us. ${site.responseTime}` };
}

const DEMO_FIELDS = ["product", "name", "email", "company", "role", "size", "message"];

export async function requestDemo(_prev: FormState, data: FormData): Promise<FormState> {
  const kept = pick(data, DEMO_FIELDS);
  if (looksAutomated(data)) {
    return { status: "error", message: "That was quick! Please check the form and send it again.", values: kept };
  }

  const products = await getProducts();
  const schema = z.object({
    product: z.enum(products.map((p) => p.slug) as [string, ...string[]], "Please choose a product."),
    name: trimmed(limits.name, "Please tell us your name."),
    email,
    company: trimmed(limits.company, "Please tell us your company."),
    role: optionalText(limits.role),
    size: z.enum(values(companySizes), "Please choose a company size."),
    message: optionalText(limits.message),
  });

  const parsed = schema.safeParse(kept);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: kept,
    };
  }

  const d = parsed.data;
  const product = products.find((p) => p.slug === d.product);
  const productName = product?.name ?? d.product;
  const text = [
    `New demo request: ${productName}`,
    ``,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Company: ${d.company}`,
    `Role: ${d.role || "-"}`,
    `Company size: ${labelOf(companySizes, d.size)}`,
    ``,
    d.message || "(no message)",
  ].join("\n");

  const site = await getSettings();
  try {
    await deliver(
      `Demo: ${productName} for ${d.company}`,
      text,
      d,
      `Hi ${d.name},\n\nThanks for your interest in ${productName}. We'll be in touch to set up a time. ${site.responseTime}\n\n${site.name}`,
    );
  } catch (err) {
    return failure(err, kept);
  }
  return { status: "success", message: `Thanks, ${d.name}. We'll be in touch to set up your ${productName} demo.` };
}
