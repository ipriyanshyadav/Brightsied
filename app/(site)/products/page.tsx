import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { LiveTile } from "@/components/ui/LiveTile";
import { getProducts, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products",
  description: "Brightera Source-to-Pay and Brightera MRP: procurement and planning platforms for growing manufacturers and distributors.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [site, products] = await Promise.all([getSettings(), getProducts()]);
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Platforms we build and run ourselves."
        intro="Our own products are where we prove the engineering we sell: multi-tenant, audited, observable and fast. Both are available for a guided demo."
        tone="dark"
      />
      <section aria-label="All products" className="bg-ground px-4 py-24 sm:px-8 sm:py-32">
        <ul className="mx-auto grid max-w-[1180px] gap-4 lg:grid-cols-2">
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}`} className="panel-3d group relative isolate flex h-full flex-col overflow-hidden rounded-[32px] p-8 text-white sm:p-10">
                <div aria-hidden="true" className="aurora right-[-10%] top-[-20%] -z-10 h-[60%] w-[60%] bg-[#3b5bff] opacity-25 transition-opacity duration-500 group-hover:opacity-40" />
                <LiveTile kind={p.tile} sizes="200px" className="w-24 sm:w-28" />
                <span className="mt-10 font-mono text-xs text-white/45">{p.status}</span>
                <h2 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-tight">{p.name}</h2>
                <p className="mt-3 max-w-[46ch] text-white/60">{p.tagline}</p>
                <span className="mt-8 text-sm text-[#9fb2ff] transition-colors group-hover:text-white">
                  Explore {p.shortName} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand site={site} title="Want something like this, built for you?" body="The same team and the same engineering standards are available for your own product." />
    </>
  );
}
