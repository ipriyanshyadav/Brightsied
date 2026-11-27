import type { Testimonial } from "@/lib/content/types";
import { BlurReveal } from "@/components/ui/BlurReveal";

// Renders nothing until at least one real, published testimonial exists.
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title" className="bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow text-center">Clients</p>
        <BlurReveal id="testimonials-title" className="mt-4 text-center text-section font-medium">
          In their words.
        </BlurReveal>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <li key={`${t.name}-${t.company}`}>
              <figure className="card-soft flex h-full flex-col rounded-[24px] p-7 sm:p-9">
                <blockquote className="text-lg leading-relaxed tracking-tight text-ink/85">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-auto pt-6 text-sm">
                  <span className="block font-medium">{t.name}</span>
                  <span className="block text-ink/65">
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
