import Link from "next/link";
import type { SiteSettings } from "@/lib/content/types";
import { bookingHref, isExternal, whatsappHref } from "@/lib/contact";

type Props = { site: SiteSettings; title?: string; body?: string };

// The closing call to action on every page: call, brief, WhatsApp or email.
export function CtaBand({
  site,
  title = "Have something to build?",
  body = "Tell us what you're working on. We'll come back with questions, a rough shape and an honest view of whether we're the right team.",
}: Props) {
  const book = bookingHref(site);
  const wa = whatsappHref(site, `Hi ${site.name}, I'd like to talk about a project.`);
  return (
    <section aria-labelledby="cta-title" className="bg-ground px-4 pb-28 pt-8 sm:px-8 sm:pb-36">
      <div className="panel-3d relative isolate mx-auto max-w-[1180px] overflow-hidden rounded-[32px] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <div aria-hidden="true" className="aurora left-[12%] top-[-20%] -z-10 h-[70%] w-[40%] bg-[#3b5bff] opacity-30" />
        <div aria-hidden="true" className="aurora bottom-[-30%] right-[10%] -z-10 h-[70%] w-[40%] bg-[#7c4dff] opacity-20" />
        <h2 id="cta-title" className="mx-auto max-w-[18ch] text-section font-medium">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-white/60">{body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          {isExternal(book) ? (
            <a href={book} target="_blank" rel="noopener" className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">
              Book a call
            </a>
          ) : (
            <Link href={book} className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">
              Book a call
            </Link>
          )}
          <Link href="/contact#brief" className="panel-cell rounded-xl px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-white">
            Send a project brief
          </Link>
          {wa && (
            <a href={wa} target="_blank" rel="noopener" className="panel-cell rounded-xl px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-white">
              WhatsApp us
            </a>
          )}
        </div>
        <p className="mt-6 text-sm text-white/45">
          Or email <a className="text-white/75 underline-offset-4 hover:underline" href={`mailto:${site.email}`}>{site.email}</a>. {site.responseTime}
        </p>
      </div>
    </section>
  );
}
