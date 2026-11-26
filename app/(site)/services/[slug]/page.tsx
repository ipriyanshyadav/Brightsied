import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Packages } from "@/components/sections/Packages";
import { Tuning } from "@/components/sections/Tuning";
import { CtaBand } from "@/components/sections/CtaBand";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPackages, getService, getServices, getSettings } from "@/lib/content";
import { briefHref } from "@/lib/contact";
import type { TileKind } from "@/components/ui/GlossyTile";

// Services with a live demo of their own, shown under the deliverables.
const DEMOS: Record<string, React.ReactNode> = { "ai-systems": <Tuning /> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = await getService((await params).slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [site, service, services] = await Promise.all([getSettings(), getService(slug), getServices()]);
  if (!service) notFound();
  const packages = await getPackages(service.packages);
  const others = services.filter((s) => s.slug !== service.slug);
  const tiles: [TileKind, TileKind, TileKind] = [others[0].tile, service.tile, others[1].tile];

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: `${site.url}/services/${service.slug}`,
    areaServed: "IN",
    provider: { "@type": "ProfessionalService", name: site.name, url: site.url },
  };

  return (
    <>
      <PageHero eyebrow={service.name} title={service.headline} intro={service.intro} tiles={tiles}>
        <Link href={briefHref(service.packages[0])} className="btn-3d rounded-xl px-5 py-2.5 text-sm font-medium">
          Start a project
        </Link>
        <a href="#deliverables" className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">
          What you get
        </a>
      </PageHero>

      <section aria-labelledby="outcomes-title" className="bg-ground px-4 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow">Outcomes</p>
          <BlurReveal id="outcomes-title" className="mt-4 max-w-[24ch] text-section font-medium">
            What changes when we&apos;re done.
          </BlurReveal>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {service.outcomes.map((o, i) => (
              <li key={o.title} className="card-soft rounded-[24px] p-7">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-medium tracking-tight">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="deliverables" aria-labelledby="deliverables-title" className="scroll-mt-24 bg-ground px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="mx-auto grid max-w-[1180px] gap-4 lg:grid-cols-[7fr_5fr]">
          <div className="panel-3d rounded-[28px] p-7 text-white sm:p-10">
            <h2 id="deliverables-title" className="font-mono text-sm text-white/50">Deliverables</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {service.deliverables.map((d) => (
                <li key={d} className="panel-cell flex gap-3 rounded-xl px-4 py-3 text-sm text-white/85">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9fb2ff] shadow-[0_0_6px_1px_rgba(111,139,255,0.8)]" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-soft rounded-[28px] p-7 sm:p-10">
            <h2 className="font-mono text-sm text-muted">A good fit for</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {service.idealFor.map((d) => (
                <li key={d} className="text-lg leading-snug tracking-tight">{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {DEMOS[service.slug]}

      {packages.length > 0 && (
        <Packages
          items={packages}
          eyebrow="How to engage"
          title={packages.length > 1 ? "Ways to get started." : "How this engagement works."}
          intro="Every engagement is quoted after a short conversation about scope, timeline and team."
        />
      )}

      {service.faqs.length > 0 && (
        <section aria-labelledby="faq-title" className="bg-ground px-4 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto max-w-[820px]">
            <h2 id="faq-title" className="text-section font-medium">Questions</h2>
            <div className="mt-8 flex flex-col gap-3">
              {service.faqs.map((f) => (
                <details key={f.q} className="card-soft group rounded-2xl px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="text-muted transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="related-title" className="bg-ground px-4 pb-16 sm:px-8">
        <div className="mx-auto max-w-[1180px]">
          <h2 id="related-title" className="eyebrow">Other services</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className="glass block rounded-xl px-4 py-2 text-sm text-ink/80 transition-colors hover:text-ink">
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand site={site} />
      <JsonLd data={serviceLd} />
    </>
  );
}
