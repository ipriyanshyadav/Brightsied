// Uploads the seed content in content/seed/ to Sanity, once, so the CMS starts with what the
// site shows today. Documents get stable ids, so running it again overwrites them with the
// seed version: only re-run it on purpose. Ids use dashes: Sanity treats ids containing a
// dot as private, so public reads would not see them.
//
//   npm run cms:seed            write to the dataset (needs `npx sanity login`)
//   npm run cms:seed -- --dry   print the documents instead

import { getCliClient } from "sanity/cli";
import { settings, hero, marquee, process as steps, principles, audiences } from "../content/seed/site";
import { packages, services } from "../content/seed/services";
import { products } from "../content/seed/products";
import { testimonials, work } from "../content/seed/work";
import { SANITY_API_VERSION, SINGLETONS } from "../sanity/env";

type Doc = { _id: string; _type: string; [key: string]: unknown };

// Arrays of objects need a stable _key in Sanity.
const keyed = <T extends object>(items: T[]) => items.map((item, i) => ({ _key: `k${i}`, ...item }));
const slugOf = (current: string) => ({ _type: "slug", current });
// Unset optional values are left out, not stored as "" (the queries coalesce them back).
const compact = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== ""));
const ref = (id: string, i: number) => ({ _key: `r${i}`, _type: "reference", _ref: id });

const docs: Doc[] = [
  {
    _id: SINGLETONS.siteSettings,
    _type: "siteSettings",
    ...compact(settings),
    socials: keyed(settings.socials),
    legal: compact(settings.legal),
  },
  {
    _id: SINGLETONS.homePage,
    _type: "homePage",
    hero,
    marquee,
    process: keyed(steps),
    principles: keyed(principles),
    audiences: keyed(audiences),
  },
  ...packages.map((p, i) => ({ _id: `package-${p.slug}`, _type: "engagementPackage", order: i, ...p, slug: slugOf(p.slug) })),
  ...services.map((s, i) => ({
    _id: `service-${s.slug}`,
    _type: "service",
    order: i,
    ...s,
    slug: slugOf(s.slug),
    outcomes: keyed(s.outcomes),
    faqs: keyed(s.faqs),
    packages: s.packages.map((p, j) => ref(`package-${p}`, j)),
  })),
  ...products.map((p, i) => ({
    _id: `product-${p.slug}`,
    _type: "product",
    order: i,
    ...p,
    slug: slugOf(p.slug),
    features: keyed(p.features),
    components: keyed(p.components),
    steps: keyed(p.steps),
    window: { ...p.window, rows: keyed(p.window.rows) },
  })),
  ...work.map(({ caseStudy, ...w }, i) => ({
    _id: `work-${w.slug}`,
    _type: "workItem",
    order: i,
    ...w,
    slug: slugOf(w.slug),
    ...(caseStudy && {
      caseStudy: {
        ...caseStudy,
        approach: keyed(caseStudy.approach),
        decisions: keyed(caseStudy.decisions),
        product: caseStudy.product ? { _type: "reference", _ref: `product-${caseStudy.product}` } : undefined,
      },
    }),
  })),
  // Placeholders stay out of the CMS: only real, approved quotes belong there.
  ...testimonials
    .filter((t) => t.published)
    .map((t, i) => ({ _id: `testimonial-${i}`, _type: "testimonial", order: i, ...t })),
];

async function main() {
  if (process.argv.includes("--dry")) {
    console.log(JSON.stringify(docs, null, 2));
    console.log(`\n${docs.length} documents (dry run, nothing written)`);
    return;
  }
  const client = getCliClient({ apiVersion: SANITY_API_VERSION });
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  const result = await tx.commit();
  console.log(`Seeded ${result.results.length} documents into ${client.config().projectId}/${client.config().dataset}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
