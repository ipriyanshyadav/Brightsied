import type { Metadata } from "next";
import { Intro } from "@/components/sections/Intro";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { Statement } from "@/components/sections/Statement";
import { Capabilities } from "@/components/sections/Capabilities";
import { ProductWalkthrough } from "@/components/sections/ProductWalkthrough";
import { Process } from "@/components/sections/Process";
import { Principles } from "@/components/sections/Principles";
import { Packages } from "@/components/sections/Packages";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBand } from "@/components/sections/CtaBand";
import { getHome, getPackages, getProducts, getServices, getSettings, getTestimonials } from "@/lib/content";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [site, home, services, products, packages, testimonials] = await Promise.all([
    getSettings(),
    getHome(),
    getServices(),
    getProducts(),
    getPackages(),
    getTestimonials(),
  ]);

  return (
    <>
      <Intro wordmark={site.wordmark} />
      <Hero hero={home.hero} status={site.status} />
      <TechMarquee items={home.marquee} />
      <Statement />
      <Capabilities services={services} />
      <ProductWalkthrough products={products} />
      <Process steps={home.process} />
      <Principles items={home.principles} />
      <Packages items={packages} />
      <Testimonials items={testimonials} />
      <CtaBand site={site} />
    </>
  );
}
