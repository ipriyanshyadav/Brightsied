import { Suspense } from "react";
import { connection } from "next/server";
import { NextStudio } from "next-sanity/studio";
import { sanityProject } from "@/sanity/env";
import { studioConfig } from "@/sanity.config";

export { metadata, viewport } from "next-sanity/studio";

// Studio paths (/studio/structure/…) are only known at request time. This marker tells Next
// the route renders per request, which is fine for an editors-only tool.
async function RequestTime() {
  await connection();
  return null;
}

// The embedded Sanity Studio. Outside the (site) group, so none of the site chrome loads here.
export default function StudioPage() {
  return (
    <>
      <Suspense>
        <RequestTime />
      </Suspense>
      {sanityProject && studioConfig ? <NextStudio config={studioConfig} /> : <NotConnected />}
    </>
  );
}

function NotConnected() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ground px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-medium tracking-tight">The content studio isn&apos;t connected yet</h1>
        <p className="mt-3 text-ink/60">
          Set <code className="font-mono text-sm">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code className="font-mono text-sm">NEXT_PUBLIC_SANITY_DATASET</code>, then restart. Until then the site uses
          the seed content in <code className="font-mono text-sm">content/seed/</code>.
        </p>
      </div>
    </main>
  );
}
