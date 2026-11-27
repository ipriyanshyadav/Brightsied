import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Brightseid collects and uses personal data shared through this website.",
  alternates: { canonical: "/privacy" },
};

// Plain-language draft written for India's Digital Personal Data Protection Act, 2023.
// Have it reviewed before launch, and update the date whenever it changes.
const UPDATED = "26 November 2026";

export default async function PrivacyPage() {
  const site = await getSettings();
  const owner = site.legal.entityName || site.name;
  return (
    <LegalPage title="Privacy policy" updated={UPDATED}>
      <p>
        This policy explains what personal data {owner} (&ldquo;we&rdquo;) collects through this website, why, and
        what you can do about it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>What you type into our forms: your name, email, company, phone number, role and project details.</li>
        <li>What you send us by email, WhatsApp or during a call.</li>
        <li>Basic technical data our hosting provider records to keep the site running and secure, such as IP address and browser type.</li>
      </ul>
      <p>We don&apos;t use advertising trackers, and we don&apos;t sell personal data.</p>
      <h2>Why we use it</h2>
      <p>
        Only to reply to your enquiry, prepare a proposal, arrange a demo or call, and keep a record of our
        conversation. We rely on your consent, which you give by sending the form, and you can withdraw it at any
        time.
      </p>
      <h2>Who processes it for us</h2>
      <ul>
        <li>Our hosting provider, which serves this website.</li>
        <li>Our email delivery provider, which carries form submissions to our inbox.</li>
      </ul>
      <p>These providers may store data outside India, under their own security and privacy commitments.</p>
      <h2>How long we keep it</h2>
      <p>
        As long as we need it to respond and for our business records. If we don&apos;t end up working together,
        ask us and we&apos;ll delete your enquiry.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your personal data, or withdraw consent, by emailing{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-2">{site.email}</a>. You can also raise a
        complaint with the Data Protection Board of India.
      </p>
      <h2>Contact</h2>
      <p>
        {owner}, {site.location}. Email <a href={`mailto:${site.email}`} className="underline underline-offset-2">{site.email}</a>.
      </p>
    </LegalPage>
  );
}
