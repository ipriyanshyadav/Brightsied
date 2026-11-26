import Link from "next/link";
import { getSettings } from "@/lib/content";

export default async function NotFound() {
  const site = await getSettings();
  return (
    <main id="main" className="grid min-h-[100svh] place-items-center bg-ground px-4 text-center">
      <div>
        <Link href="/" className="text-[22px] font-extrabold italic tracking-[-0.04em]">
          {site.wordmark}<span className="text-brand">.</span>
        </Link>
        <p className="eyebrow mt-10">404</p>
        <h1 className="mt-3 text-section font-medium">This page doesn&apos;t exist.</h1>
        <p className="mx-auto mt-4 max-w-[40ch] text-ink/60">It may have moved, or the link may be wrong.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-3d rounded-xl px-5 py-2.5 text-sm font-medium">Go home</Link>
          <Link href="/services" className="btn-light rounded-xl px-5 py-2.5 text-sm font-medium">See our services</Link>
        </div>
      </div>
    </main>
  );
}
