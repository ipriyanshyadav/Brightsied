import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { ProductWalkthrough } from "@/components/sections/ProductWalkthrough";
import { CtaBand } from "@/components/sections/CtaBand";
import { DemoForm } from "@/components/forms/DemoForm";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProduct, getProducts, getSettings } from "@/lib/content";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [site, product] = await Promise.all([getSettings(), getProduct(slug)]);
  if (!product) notFound();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.summary,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${site.url}/products/${product.slug}`,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <PageHero eyebrow={`${product.name} · ${product.status}`} title={product.tagline} intro={product.summary} tone="dark" tiles={["api", product.tile, "queue"]}>
        <a href="#demo" className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">
          Request a demo
        </a>
        <a href={`#${product.slug}-steps`} className="panel-cell rounded-xl px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-white">
          See how it works
        </a>
      </PageHero>

      <section aria-labelledby="features-title" className="bg-ground px-4 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow">{product.shortName}</p>
          <BlurReveal id="features-title" className="mt-4 max-w-[22ch] text-section font-medium">
            Built for the way the work actually happens.
          </BlurReveal>
          <p className="mt-5 text-ink/60">Made for {product.audience.join(", ").toLowerCase()}.</p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f) => (
              <li key={f.title} className="card-soft rounded-[24px] p-7">
                <h3 className="text-lg font-medium tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProductWalkthrough product={product} variant="walkthrough" />

      <section id="demo" aria-labelledby="demo-title" className="scroll-mt-24 bg-ground px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <p className="eyebrow">Request a demo</p>
            <h2 id="demo-title" className="mt-4 text-section font-medium">See {product.shortName} on your own process.</h2>
            <p className="mt-5 max-w-md text-ink/60">
              A 30-minute guided walkthrough with the people who built it. Tell us a little about your
              team and we&apos;ll set up a time. {site.responseTime}
            </p>
          </div>
          <div className="card-soft rounded-[28px] p-6 sm:p-9">
            <DemoForm product={product.slug} productName={product.name} />
          </div>
        </div>
      </section>

      <CtaBand site={site} title="Need it built around your business?" body="We can adapt the platform, integrate it with what you run today, or build something new on the same foundations." />
      <JsonLd data={productLd} />
    </>
  );
}
