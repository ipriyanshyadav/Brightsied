import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { WorkTabs } from "@/components/sections/WorkTabs";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { getSettings, getTestimonials, getWork } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Platforms, products and experiments built by Brightera.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const [site, work, testimonials] = await Promise.all([getSettings(), getWork(), getTestimonials()]);
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="What we've built."
        intro="Our own platforms and labs, built to the same standard as client work. Client case studies are published here once the client signs off on them."
        tiles={["audit", "db", "vectors"]}
      />
      <WorkTabs items={work} eyebrow="Selected work" title="Platforms, products and labs" />
      <Testimonials items={testimonials} />
      <CtaBand site={site} />
    </>
  );
}
