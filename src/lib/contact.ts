import type { SiteSettings } from "@/lib/content/types";

// Contact links built from the site settings. Unset channels return null so callers can
// hide them rather than render a dead link.

export const CONTACT_PATH = "/contact";

/** The project brief form, optionally with an engagement model preselected. */
export function briefHref(interest?: string) {
  return interest ? `${CONTACT_PATH}?interest=${encodeURIComponent(interest)}#brief` : `${CONTACT_PATH}#brief`;
}

/** "Book a call" goes to the booking page when there is one, otherwise to the brief form. */
export function bookingHref(s: SiteSettings) {
  return s.bookingUrl || briefHref();
}

export function whatsappHref(s: SiteSettings, text?: string) {
  if (!s.whatsapp) return null;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${s.whatsapp}${query}`;
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}
