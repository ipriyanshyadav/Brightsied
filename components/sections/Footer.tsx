import { nav, site } from "@/lib/content";
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

// Sits behind the rounded bottom edge of <main> and is revealed as the page scrolls past it.
export function Footer() {
  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative z-0 scroll-mt-24 bg-mist px-4 pb-8 pt-20 sm:px-8 md:sticky md:bottom-0">
      <div className="mx-auto max-w-[1180px]">
        <h2 id="contact-title" className="sr-only">Contact</h2>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <Col title="On this page">
            {nav.map((n) => (
              <li key={n.href}><a className={link} href={n.href}>{n.label}</a></li>
            ))}
          </Col>
          <Col title="Elsewhere">
            {site.socials.map((s) => (
              <li key={s.label}><a className={link} href={s.href} target="_blank" rel="me noopener">{s.label}</a></li>
            ))}
          </Col>
          <Col title="Contact">
            <li><a className={`${link} break-all`} href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a className={link} href={site.resume}>Résumé (PDF)</a></li>
          </Col>
          <Col title="Based in">
            <li className="text-ink/80"><LocalTime /></li>
          </Col>
        </div>

        <p
          aria-hidden="true"
          className="relative mt-16 select-none whitespace-nowrap text-center text-[clamp(4.5rem,20vw,17rem)] font-black italic leading-[1.05] tracking-[-0.07em]"
        >
          <span className="wm-back">priyansh.</span>
          <span className="wm-front absolute inset-0">
            priyansh<span className="wm-dot">.</span>
          </span>
        </p>

        <div className="mt-10 flex flex-wrap justify-between gap-3 text-xs text-muted">
          <span>© {site.name}</span>
          <span>Built with Next.js, GSAP and Lenis</span>
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
            0 0.09em 0.1em rgba(59, 91, 255, 0.45),
            0 0.14em 0.22em rgba(124, 77, 255, 0.35),
            0 0.2em 0.35em rgba(255, 92, 138, 0.25);
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
