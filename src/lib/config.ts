import "server-only";
import { z } from "zod";

// Typed environment access. Every variable is listed in .env.example.

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const publicSchema = z.object({
  // Overrides the canonical origin in the site settings (e.g. for a preview domain).
  NEXT_PUBLIC_SITE_URL: optional(z.url().transform((u) => u.replace(/\/$/, ""))),
});

const parsedPublic = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export const publicConfig = { siteUrl: parsedPublic.NEXT_PUBLIC_SITE_URL };

const leadSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  // Where new briefs and demo requests are delivered.
  LEAD_INBOX_EMAIL: z.email(),
  // Sender, e.g. "Brightseid <hello@brightseid.in>"; the domain must be verified in Resend.
  LEAD_FROM_EMAIL: z.string().min(3),
  // Send a confirmation to the visitor. Needs a verified sending domain, so off by default.
  LEAD_SEND_AUTOREPLY: optional(z.enum(["true", "false"])).transform((v) => v === "true"),
});

const cmsSchema = z.object({
  // Only needed for a private dataset; public datasets are read without a token.
  SANITY_API_READ_TOKEN: optional(z.string().min(1)),
  // Shared secret of the Sanity webhook that calls /api/revalidate.
  SANITY_REVALIDATE_SECRET: optional(z.string().min(16, "SANITY_REVALIDATE_SECRET should be at least 16 characters")),
});

export const cmsConfig = cmsSchema.parse({
  SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
  SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
});

export type LeadConfig = z.infer<typeof leadSchema>;

/** Read when a form is submitted, so a missing key fails that request loudly, not the build. */
export function getLeadConfig(): LeadConfig {
  return leadSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    LEAD_INBOX_EMAIL: process.env.LEAD_INBOX_EMAIL,
    LEAD_FROM_EMAIL: process.env.LEAD_FROM_EMAIL,
    LEAD_SEND_AUTOREPLY: process.env.LEAD_SEND_AUTOREPLY,
  });
}
