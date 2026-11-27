import Link from "next/link";
import type { NavItem, Service, SiteSettings } from "@/lib/content/types";
import { bookingHref, isExternal, whatsappHref } from "@/lib/contact";
import { LocalTime } from "./LocalTime";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-4 flex flex-col gap-1.5 text-sm">{children}</ul>
    </div>
  );
}

const link = "transition-colors hover:text-ink text-ink/80";

type Props = { site: SiteSettings; nav: NavItem[]; services: Service[] };

// Sits behind the rounded bottom edge of <main> and is revealed as the page scrolls past it.
export function Footer({ site, nav, services }: Props) {
  const book = bookingHref(site);
  const wa = whatsappHref(site, `Hi ${site.name}, I'd like to talk about a project.`);
  const { entityName, cin, gstin } = site.legal;
  const legal = [entityName, cin && `CIN ${cin}`, gstin && `GSTIN ${gstin}`].filter(Boolean).join(" · ");

  return (
    <footer id="contact" aria-labelledby="footer-title" className="relative z-0 bg-mist px-4 pb-8 pt-20 sm:px-8 md:sticky md:bottom-0">
      <div className="mx-auto max-w-[1180px]">
        <h2 id="footer-title" className="sr-only">Site footer</h2>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <Col title="Services">
            {services.map((s) => (
              <li key={s.slug}><Link className={link} href={`/services/${s.slug}`}>{s.name}</Link></li>
            ))}
          </Col>
          <Col title="Company">
            {nav.map((n) => (
              <li key={n.href}><Link className={link} href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className={link} href="/privacy">Privacy</Link></li>
            <li><Link className={link} href="/terms">Terms</Link></li>
          </Col>
          <Col title="Get in touch">
            <li><a className={`${link} break-all`} href={`mailto:${site.email}`}>{site.email}</a></li>
            {wa && <li><a className={link} href={wa} target="_blank" rel="noopener">WhatsApp</a></li>}
            <li>
              {isExternal(book) ? (
                <a className={link} href={book} target="_blank" rel="noopener">Book a call</a>
              ) : (
                <Link className={link} href={book}>Book a call</Link>
              )}
            </li>
            {site.socials.map((s) => (
              <li key={s.label}><a className={link} href={s.href} target="_blank" rel="noopener">{s.label}</a></li>
            ))}
          </Col>
          <Col title="Based in">
            <li className="text-ink/80"><LocalTime location={site.location} timeZone={site.timeZone} /></li>
            <li className="text-ink/60">Working with teams across India</li>
          </Col>
        </div>

        <p
          aria-hidden="true"
          className="relative mt-16 select-none whitespace-nowrap text-center text-[clamp(3.5rem,15vw,13rem)] font-black italic leading-[1.05] tracking-[-0.07em]"
        >
          <span className="wm-back">{site.wordmark}.</span>
          <span className="wm-front absolute inset-0">
            {site.wordmark}<span className="wm-dot">.</span>
          </span>
        </p>

        <div className="mt-10 flex flex-wrap justify-between gap-3 text-xs text-muted">
          <span>© {entityName || site.name}</span>
          {legal && <span>{legal}</span>}
          <span>{site.location}</span>
        </div>
      </div>
      <style>{`
        /* Extruded wordmark: a back layer stacks the depth, the front layer is the lit face */
        .wm-back {
          color: #08080a;
          text-shadow:
            0 0.006em 0 #1c1c22, 0 0.012em 0 #1a1a20, 0 0.018em 0 #18181d,
            0 0.024em 0 #16161b, 0 0.03em 0 #141418, 0 0.036em 0 #121216,
            0 0.05em 0.03em rgba(0, 0, 0, 0.35),
            0 0.09em 0.1em rgba(59, 91, 255, 0.35),
            0 0.14em 0.22em rgba(124, 77, 255, 0.22);
        }
        .wm-front {
          background: linear-gradient(180deg, #5a5a66 0%, #26262d 38%, #0d0d10 70%, #1d1d24 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .wm-dot {
          background: linear-gradient(180deg, #9fb2ff 0%, #3b5bff 60%, #2338b8 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </footer>
  );
}
