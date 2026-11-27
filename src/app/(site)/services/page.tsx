import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Capabilities } from "@/components/sections/Capabilities";
import { Process } from "@/components/sections/Process";
import { Packages } from "@/components/sections/Packages";
import { CtaBand } from "@/components/sections/CtaBand";
import { getHome, getPackages, getServices, getSettings } from "@/lib/content";
import { briefHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product engineering, forward-deployed engineers, AI systems, architecture audits and white-label engineering from Brightseid.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [site, home, services, packages] = await Promise.all([getSettings(), getHome(), getServices(), getPackages()]);
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Build with us, or bring us into your team."
        intro="Five practices, one standard of engineering. Most clients start with a product build or an embedded engineer, and pull in AI and audits as the work grows."
        tiles={["api", "agents", "terminal"]}
      >
        <Link href={briefHref()} className="btn-3d rounded-xl px-5 py-2.5 text-sm font-medium">
          Start a project
        </Link>
        <a href="#packages" className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">
          Engagement models
        </a>
      </PageHero>
      <Capabilities services={services} eyebrow="Practices" withIntro={false} />
      <Process steps={home.process} />
      <Packages items={packages} />
      <CtaBand site={site} />
    </>
  );
}
