import "server-only";
import { createClient } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";
import { cmsConfig } from "@/lib/config";
import { SANITY_API_VERSION, sanityProject } from "@/sanity/env";

/** Every CMS read carries this tag; the Sanity webhook revalidates it on publish. */
export const CMS_TAG = "cms";

const client = sanityProject
  ? createClient({
      ...sanityProject,
      apiVersion: SANITY_API_VERSION,
      // Reads are cached by Next and revalidated by webhook, so skip the CDN to avoid
      // serving a stale copy right after a publish.
      useCdn: false,
      perspective: "published",
      token: cmsConfig.SANITY_API_READ_TOKEN,
    })
  : null;

export const cmsEnabled = client !== null;

/** Cached GROQ query. Throws if the CMS is not configured: callers check cmsEnabled first. */
export async function cmsQuery<T>(query: string, params: Record<string, string> = {}): Promise<T> {
  "use cache";
  cacheTag(CMS_TAG);
  // A backstop in case a webhook is missed: content is never more than a day old.
  cacheLife("hours");
  if (!client) throw new Error("cmsQuery called without a Sanity project configured");
  return client.fetch<T>(query, params);
}

/** For singletons and slug lookups that must exist once the CMS is the source. */
export async function cmsRequired<T>(query: string, params: Record<string, string>, what: string): Promise<T> {
  const doc = await cmsQuery<T | null>(query, params);
  if (doc === null) throw new Error(`Sanity has no ${what}. Run npm run cms:seed or create it in /studio.`);
  return doc;
}
