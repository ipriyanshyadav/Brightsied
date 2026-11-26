import "server-only";
import * as seed from "@/content/seed/site";
import { packages as seedPackages, services as seedServices } from "@/content/seed/services";
import { products as seedProducts } from "@/content/seed/products";
import { testimonials as seedTestimonials, work as seedWork } from "@/content/seed/work";
import { publicConfig } from "@/lib/config";
import { cmsEnabled, cmsQuery, cmsRequired } from "@/lib/cms/client";
import * as q from "@/lib/cms/queries";
import type { Audience, EngagementPackage, Hero, Principle, ProcessStep, Product, Service, SiteSettings, Testimonial, WorkItem } from "./types";

// The only way pages and components read content. With a Sanity project configured
// (NEXT_PUBLIC_SANITY_PROJECT_ID) every getter queries the CMS; without one they serve the
// seed modules in content/seed/, which are also what `npm run cms:seed` uploads.

type Home = { hero: Hero; marquee: string[]; process: ProcessStep[]; principles: Principle[]; audiences: Audience[] };

export async function getSettings(): Promise<SiteSettings> {
  const settings = cmsEnabled ? await cmsRequired<SiteSettings>(q.settingsQuery, {}, "site settings document") : seed.settings;
  return { ...settings, url: publicConfig.siteUrl ?? settings.url };
}

/** Navigation mirrors the routes in app/(site), so it lives in code rather than the CMS. */
export async function getNav() {
  return seed.nav;
}

export async function getHome(): Promise<Home> {
  if (cmsEnabled) return cmsRequired<Home>(q.homeQuery, {}, "home page document");
  return { hero: seed.hero, marquee: seed.marquee, process: seed.process, principles: seed.principles, audiences: seed.audiences };
}

export async function getServices(): Promise<Service[]> {
  return cmsEnabled ? cmsQuery<Service[]>(q.servicesQuery) : seedServices;
}

export async function getService(slug: string): Promise<Service | null> {
  if (cmsEnabled) return cmsQuery<Service | null>(q.serviceQuery, { slug });
  return seedServices.find((s) => s.slug === slug) ?? null;
}

export async function getPackages(slugs?: string[]): Promise<EngagementPackage[]> {
  const all = cmsEnabled ? await cmsQuery<EngagementPackage[]>(q.packagesQuery) : seedPackages;
  return slugs ? all.filter((p) => slugs.includes(p.slug)) : all;
}

export async function getProducts(): Promise<Product[]> {
  return cmsEnabled ? cmsQuery<Product[]>(q.productsQuery) : seedProducts;
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (cmsEnabled) return cmsQuery<Product | null>(q.productQuery, { slug });
  return seedProducts.find((p) => p.slug === slug) ?? null;
}

export async function getWork(): Promise<WorkItem[]> {
  if (!cmsEnabled) return seedWork;
  // GROQ returns null for an absent case study or product link; the types use undefined.
  type Raw = Omit<WorkItem, "caseStudy"> & { caseStudy: (NonNullable<WorkItem["caseStudy"]> & { product: string | null }) | null };
  const rows = await cmsQuery<Raw[]>(q.workQuery);
  return rows.map(({ caseStudy, ...item }) => ({
    ...item,
    ...(caseStudy ? { caseStudy: { ...caseStudy, product: caseStudy.product ?? undefined } } : {}),
  }));
}

/** Work items with a full write-up, each published at /work/[slug]. */
export async function getCaseStudies() {
  return (await getWork()).filter((w) => w.caseStudy);
}

export async function getCaseStudy(slug: string) {
  return (await getWork()).find((w) => w.slug === slug && w.caseStudy) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return cmsEnabled ? cmsQuery<Testimonial[]>(q.testimonialsQuery) : seedTestimonials.filter((t) => t.published);
}
