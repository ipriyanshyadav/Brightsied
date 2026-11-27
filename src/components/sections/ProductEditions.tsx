import type { Product } from "@/lib/content/types";
import { BlurReveal } from "@/components/ui/BlurReveal";

// The ways a product can be bought, side by side, each listing the modules it includes.
// Module chips link to the module's walkthrough further down the page.
export function ProductEditions({ product }: { product: Product }) {
  const { editions, modules } = product;
  if (editions.length === 0) return null;
  const nameOf = new Map(modules.map((m) => [m.id, m.name]));

  return (
    <section aria-labelledby={`${product.slug}-editions-title`} className="bg-ground px-4 pt-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow">Editions</p>
        <BlurReveal id={`${product.slug}-editions-title`} className="mt-4 max-w-[22ch] text-section font-medium">
          Pick the edition that fits your business.
        </BlurReveal>
        <ul className={`mt-12 grid gap-4 ${editions.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {editions.map((e, i) => (
            <li key={e.name} className="card-soft flex flex-col rounded-[28px] p-8 sm:p-10">
              <span className="font-mono text-xs text-ink/60">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-tight tracking-tight">{e.name}</h3>
              <p className="mt-2 font-medium text-ink/75">{e.bestFor}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{e.summary}</p>
              <p className="eyebrow mt-8">Includes</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${e.name} modules`}>
                {e.modules.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} className="btn-light inline-block rounded-lg px-2.5 py-1 text-[13px] text-ink/75 transition-colors hover:text-ink">
                      {nameOf.get(id) ?? id}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#demo" className="mt-8 self-start text-sm text-brand transition-colors hover:text-ink">
                Ask for a demo of the {e.name.toLowerCase()} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
