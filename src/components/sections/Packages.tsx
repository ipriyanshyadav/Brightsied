import Link from "next/link";
import type { EngagementPackage } from "@/lib/content/types";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { briefHref } from "@/lib/contact";

type Props = { items: EngagementPackage[]; eyebrow?: string; title?: string; intro?: string };

// Named ways to work with us. Every engagement is scoped, so there are no prices here.
export function Packages({
  items,
  eyebrow = "Engagement models",
  title = "Pick a starting point. We'll scope the rest together.",
  intro = "Every engagement is quoted after a short conversation about scope, timeline and team. These are the shapes most projects take.",
}: Props) {
  return (
    <section id="packages" aria-labelledby="packages-title" className="scroll-mt-24 bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <BlurReveal id="packages-title" className="mt-4 text-section font-medium">
            {title}
          </BlurReveal>
          <p className="mt-5 text-ink/60">{intro}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.slug} className="card-soft flex flex-col rounded-[24px] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-medium tracking-tight">{p.name}</h3>
                <span className="glass shrink-0 rounded-lg px-2.5 py-1 font-mono text-[11px] text-ink/65">{p.duration}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{p.summary}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-ink/75">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link href={briefHref(p.slug)} className="btn-light mt-7 inline-block self-start rounded-xl px-4 py-2 text-sm font-medium">
                Get a quote<span className="sr-only"> for {p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
