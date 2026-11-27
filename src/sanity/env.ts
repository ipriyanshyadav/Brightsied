import { z } from "zod";

// Sanity connection, shared by the site (server) and the embedded Studio (browser), so it
// reads only public variables. With no project id the site runs on the seed content.

const schema = z.object({
  projectId: z.string().regex(/^[a-z0-9-]+$/, "NEXT_PUBLIC_SANITY_PROJECT_ID looks wrong"),
  dataset: z.string().regex(/^[a-z0-9_-]+$/, "Set NEXT_PUBLIC_SANITY_DATASET (usually production)"),
});

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const sanityProject = projectId
  ? schema.parse({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET })
  : null;

/** Pinned Content Lake API version (a date). Bump deliberately, not automatically. */
export const SANITY_API_VERSION = "2026-11-01";

/** Documents edited as a single page rather than a list. */
export const SINGLETONS = { siteSettings: "siteSettings", homePage: "homePage" } as const;
