import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCaseStudies, getCaseStudy, getProduct, getSettings } from "@/lib/content";

export async function generateStaticParams() {
  const cases = await getCaseStudies();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const item = await getCaseStudy((await params).slug);
  if (!item) return {};
  return {
    title: `${item.tab} case study`,
    description: item.body,
    alternates: { canonical: `/work/${item.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const [site, item] = await Promise.all([getSettings(), getCaseStudy(slug)]);
  if (!item?.caseStudy) notFound();
  const cs = item.caseStudy;
  const product = cs.product ? await getProduct(cs.product) : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.body,
    url: `${site.url}/work/${item.slug}`,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <PageHero eyebrow={`Case study · ${item.tab}`} title={item.title} intro={item.body} tiles={item.tiles}>
        {product && (
          <Link href={`/products/${product.slug}#demo`} className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">
            Request a demo
          </Link>
        )}
        <Link href="/work" className="glass rounded-xl px-5 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:text-ink">
          All work
        </Link>
      </PageHero>

      <section aria-labelledby="cs-facts" className="bg-ground px-4 pt-20 sm:px-8 sm:pt-28">
        <h2 id="cs-facts" className="sr-only">
          At a glance
        </h2>
        <dl className="mx-auto grid max-w-[1180px] gap-4 sm:grid-cols-2">
          <div className="card-soft rounded-[24px] p-6">
            <dt className="eyebrow">For</dt>
            <dd className="mt-3 text-lg font-medium tracking-tight">{cs.client}</dd>
          </div>
          <div className="card-soft rounded-[24px] p-6">
            <dt className="eyebrow">Our role</dt>
            <dd className="mt-3 text-lg font-medium tracking-tight">{cs.role}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="cs-challenge" className="bg-ground px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <p className="eyebrow">The challenge</p>
            <BlurReveal id="cs-challenge" className="mt-4 text-section font-medium">
              What needed solving.
            </BlurReveal>
          </div>
          <p className="self-end text-lg leading-relaxed text-ink/70">{cs.challenge}</p>
        </div>
      </section>

      <section aria-labelledby="cs-approach" className="bg-ground px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow">Our approach</p>
          <BlurReveal id="cs-approach" className="mt-4 max-w-[22ch] text-section font-medium">
            How we built it.
          </BlurReveal>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2">
            {cs.approach.map((a, i) => (
              <li key={a.title} className="card-soft rounded-[24px] p-7">
                <span className="font-mono text-xs text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-medium tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="cs-decisions" className="px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="panel-3d mx-auto max-w-[1180px] rounded-[32px] p-6 text-white sm:p-12">
          <p className="eyebrow text-white/45">Key decisions</p>
          <h2 id="cs-decisions" className="mt-4 max-w-[24ch] text-section font-medium">
            The choices that keep it dependable.
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {cs.decisions.map((d) => (
              <li key={d.title} className="panel-cell rounded-[20px] p-6">
                <h3 className="text-base font-medium">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cs-outcome" className="bg-ground px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <p className="eyebrow">Where it stands</p>
            <h2 id="cs-outcome" className="mt-4 text-section font-medium">
              The result.
            </h2>
          </div>
          <ul className="flex flex-col gap-3 self-end">
            {cs.outcome.map((o) => (
              <li key={o} className="flex gap-3 text-lg text-ink/75">
                <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        site={site}
        title="Want something built like this?"
        body="We bring the same approach to client work: a clear understanding of the problem, the reliability decisions made early, and software you own."
      />
      <JsonLd data={articleLd} />
    </>
  );
}
