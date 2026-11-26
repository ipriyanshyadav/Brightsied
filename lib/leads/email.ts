import "server-only";
import type { LeadConfig } from "@/lib/config";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type Message = { to: string; subject: string; text: string; replyTo?: string };

/** Sends a plain-text email through Resend. Throws when Resend rejects it. */
export async function sendEmail(config: LeadConfig, msg: Message) {
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: config.LEAD_FROM_EMAIL,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend rejected the email (${res.status}): ${await res.text()}`);
  }
}
