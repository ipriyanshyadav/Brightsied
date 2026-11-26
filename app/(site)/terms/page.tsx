import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using the Brightera website.",
  alternates: { canonical: "/terms" },
};

// Website terms only. Client work is governed by its own signed agreement.
// Have this reviewed before launch, and update the date whenever it changes.
const UPDATED = "26 November 2026";

export default async function TermsPage() {
  const site = await getSettings();
  const owner = site.legal.entityName || site.name;
  return (
    <LegalPage title="Terms of use" updated={UPDATED}>
      <p>These terms cover your use of this website. By using it, you agree to them.</p>
      <h2>The content</h2>
      <p>
        Everything on this site is for general information. Product screens marked as illustrative use sample data.
        Descriptions of services, timelines and engagement models are not offers. Any work we do together is set out
        in a separate written agreement, which takes precedence over anything here.
      </p>
      <h2>Intellectual property</h2>
      <p>
        The text, design, graphics and code of this site belong to {owner} unless stated otherwise. Product and
        technology names belong to their owners.
      </p>
      <h2>Acceptable use</h2>
      <p>Don&apos;t misuse the site: no attempts to disrupt it, gain unauthorised access, or send spam through our forms.</p>
      <h2>Liability</h2>
      <p>
        We work to keep the site accurate and available, but we provide it as is and aren&apos;t liable for losses
        that come from relying on it, to the extent the law allows.
      </p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. The courts of Gurugram, Haryana have jurisdiction.</p>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.email}`} className="underline underline-offset-2">{site.email}</a>.
      </p>
    </LegalPage>
  );
}
