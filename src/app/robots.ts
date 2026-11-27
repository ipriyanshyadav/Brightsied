import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSettings();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dev/", "/studio"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
