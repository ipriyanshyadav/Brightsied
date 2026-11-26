import { site } from "@/lib/content";
import { Nav } from "@/components/nav/Nav";
import { Intro } from "@/components/sections/Intro";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { Statement } from "@/components/sections/Statement";
import { Capabilities } from "@/components/sections/Capabilities";
import { Tuning } from "@/components/sections/Tuning";
import { Process } from "@/components/sections/Process";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { LiveProvider } from "@/components/three/LiveProvider";
import { SiteControls } from "@/components/ui/SiteControls";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Gurgaon", addressCountry: "IN" },
  sameAs: site.socials.map((s) => s.href),
  knowsAbout: ["FastAPI", "PostgreSQL", "LangChain", "LangGraph", "RAG", "RabbitMQ", "Celery"],
};

export default function Home() {
  return (
    <LiveProvider>
      <Intro />
      <Nav />
      <main
        id="main"
        className="relative z-10 overflow-x-clip rounded-b-[40px] bg-ground shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]"
      >
        <Hero />
        <TechMarquee />
        <Statement />
        <Capabilities />
        <Tuning />
        <Process />
        <CaseStudy />
        <Projects />
        <Experience />
      </main>
      <Footer />
      <SiteControls />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
    </LiveProvider>
  );
}
