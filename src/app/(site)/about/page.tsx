import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Principles } from "@/components/sections/Principles";
import { Process } from "@/components/sections/Process";
import { CtaBand } from "@/components/sections/CtaBand";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { getHome, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Brightseid is a software studio in Gurgaon that builds products, business software and AI for startups, growing businesses and agencies.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [site, home] = await Promise.all([getSettings(), getHome()]);
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A small studio with big-company habits."
        intro={`${site.name} is a software engineering studio based in ${site.location}. We plan, build and run software for teams that need it to work on day one and keep working on day one thousand.`}
        tiles={["docs", "agents", "terminal"]}
      />

      <section aria-labelledby="audience-title" className="bg-ground px-4 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1180px]">
          <p className="eyebrow">Who we work with</p>
          <BlurReveal id="audience-title" className="mt-4 max-w-[22ch] text-section font-medium">
            Teams that need software to carry real weight.
          </BlurReveal>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {home.audiences.map((a) => (
              <li key={a.title} className="card-soft rounded-[24px] p-7">
                <h3 className="text-xl font-medium tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Principles items={home.principles} eyebrow="How we work" />
      <Process steps={home.process} />
      <CtaBand site={site} />
    </>
  );
}
