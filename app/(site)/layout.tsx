import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/sections/Footer";
import { LiveProvider } from "@/components/three/LiveProvider";
import { SiteControls } from "@/components/ui/SiteControls";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNav, getServices, getSettings } from "@/lib/content";
import { bookingHref } from "@/lib/contact";

// Chrome shared by every public page: nav, the rounded <main> sheet, the footer it reveals,
// the live 3D tile layer and the corner controls.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, nav, services] = await Promise.all([getSettings(), getNav(), getServices()]);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    description: site.description,
    areaServed: "IN",
    address: { "@type": "PostalAddress", addressLocality: site.locality, addressCountry: site.country },
    ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${site.url}/services/${s.slug}` },
      })),
    },
  };

  return (
    <LiveProvider>
      <Nav site={site} items={nav} bookHref={bookingHref(site)} />
      <main
        id="main"
        className="relative z-10 min-h-[100svh] overflow-x-clip rounded-b-[40px] bg-ground shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]"
      >
        {children}
      </main>
      <Footer site={site} nav={nav} services={services} />
      <SiteControls />
      <JsonLd data={orgLd} />
    </LiveProvider>
  );
}
