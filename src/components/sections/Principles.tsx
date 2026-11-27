import type { Principle } from "@/lib/content/types";
import { BlurReveal } from "@/components/ui/BlurReveal";

const dots = ["#1fbf86", "#6f8bff", "#f59e0b", "#ff5a3c"];

type Props = { items: Principle[]; eyebrow?: string; title?: string; body?: string };

// How we work, as a lit timeline in the dark panel.
export function Principles({
  items,
  eyebrow = "Why Brightseid",
  title = "Engineering you can hand to the next team.",
  body = "A small studio with big-company habits: written contracts, real tests and nothing hidden from the people paying for it.",
}: Props) {
  return (
    <section aria-labelledby="principles-title" className="bg-ground px-4 py-28 sm:px-8 sm:py-36">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <div className="lg:self-center">
          <p className="eyebrow">{eyebrow}</p>
          <BlurReveal id="principles-title" className="mt-4 text-split font-medium">
            {title}
          </BlurReveal>
          <p className="mt-6 max-w-md text-ink/60">{body}</p>
        </div>
        <ol className="panel-3d rounded-[28px] p-3 text-white sm:p-4">
          {items.map((p, i) => (
            <li key={p.title} className="group relative rounded-2xl py-5 pl-11 pr-4 transition-[background,box-shadow] duration-300 hover:bg-[linear-gradient(180deg,#222227,#18181c)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:pr-5">
              <span aria-hidden="true" className="absolute bottom-0 left-[21px] top-0 w-px bg-white/10 group-first:top-7 group-last:bottom-[calc(100%-28px)]" />
              <span
                aria-hidden="true"
                className="absolute left-4 top-[26px] h-3 w-3 rounded-full"
                style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${dots[i % dots.length]} 60%)`, boxShadow: `0 0 12px 2px ${dots[i % dots.length]}99` }}
              />
              <h3 className="text-xl font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
