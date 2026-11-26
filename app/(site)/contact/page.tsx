import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { BriefForm, BriefFormFromUrl } from "@/components/forms/BriefForm";
import { getPackages, getSettings } from "@/lib/content";
import { isExternal, whatsappHref } from "@/lib/contact";
import { LocalTime } from "@/components/sections/LocalTime";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell Brightseid about your project: book a call, send a brief, or message us on WhatsApp.",
  alternates: { canonical: "/contact" },
};

const NEXT_STEPS = [
  "We read your brief and reply with a few questions.",
  "A 30-minute call to understand the problem and constraints.",
  "A written proposal: scope, approach, timeline and quote.",
];

export default async function ContactPage() {
  const [site, packages] = await Promise.all([getSettings(), getPackages()]);
  const wa = whatsappHref(site, `Hi ${site.name}, I'd like to talk about a project.`);
  const pkgOptions = packages.map((p) => ({ slug: p.slug, name: p.name }));

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you're building."
        intro={`Send a short brief, book a call, or message us directly. ${site.responseTime}`}
      />
      <section className="bg-ground px-4 pb-28 sm:px-8 sm:pb-36">
        <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[7fr_4fr]">
          <div id="brief" className="card-soft scroll-mt-28 rounded-[28px] p-6 sm:p-10">
            <h2 className="text-2xl font-medium tracking-tight">Project brief</h2>
            <p className="mt-2 text-sm text-ink/65">Five minutes now saves a week of back-and-forth later.</p>
            <div className="mt-8">
              {/* The form reads ?interest= from the URL; the fallback is the same form without a preselection. */}
              <Suspense fallback={<BriefForm packages={pkgOptions} />}>
                <BriefFormFromUrl packages={pkgOptions} />
              </Suspense>
            </div>
          </div>

          <aside className="flex flex-col gap-4" aria-label="Other ways to reach us">
            <div className="panel-3d rounded-[28px] p-7 text-white">
              <h2 className="font-mono text-sm text-white/50">Talk to us</h2>
              <ul className="mt-5 flex flex-col gap-2">
                {site.bookingUrl && isExternal(site.bookingUrl) && (
                  <li>
                    <a href={site.bookingUrl} target="_blank" rel="noopener" className="btn-light block rounded-xl px-4 py-3 text-center text-sm font-medium">
                      Book a call
                    </a>
                  </li>
                )}
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener" className="panel-cell block rounded-xl px-4 py-3 text-center text-sm text-white/90 hover:text-white">
                      WhatsApp us
                    </a>
                  </li>
                )}
                <li>
                  <a href={`mailto:${site.email}`} className="panel-cell block break-all rounded-xl px-4 py-3 text-center text-sm text-white/90 hover:text-white">
                    {site.email}
                  </a>
                </li>
              </ul>
              <p className="mt-5 text-sm text-white/45">
                <LocalTime location={site.location} timeZone={site.timeZone} />
              </p>
            </div>
            <div className="card-soft rounded-[28px] p-7">
              <h2 className="font-mono text-sm text-muted">What happens next</h2>
              <ol className="mt-5 flex flex-col gap-4">
                {NEXT_STEPS.map((s, i) => (
                  <li key={s} className="flex gap-3 text-sm text-ink/75">
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
