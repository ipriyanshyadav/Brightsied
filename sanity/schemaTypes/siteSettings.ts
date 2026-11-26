import { defineArrayMember, defineField, defineType } from "sanity";
import { optional, required, text } from "./fields";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    required("name", "Company name"),
    required("wordmark", "Wordmark", "string", { description: "Lower-case, shown in the nav and footer." }),
    required("url", "Canonical URL", "url", { description: "No trailing slash, e.g. https://brightera.in" }),
    required("tagline", "Tagline"),
    text("description", "Description (search engines)"),
    defineField({ name: "email", title: "Contact email", type: "string", validation: (r) => r.required().email() }),
    optional("whatsapp", "WhatsApp number", "string", { description: "Digits with country code, e.g. 919876543210. Empty hides WhatsApp links." }),
    optional("bookingUrl", "Booking link", "url", { description: "Cal.com or Calendly. Empty sends “Book a call” to the brief form." }),
    required("location", "Location", "string", { description: "e.g. Gurgaon, India" }),
    required("locality", "City"),
    required("country", "Country code", "string", { description: "Two letters, e.g. IN" }),
    required("timeZone", "Time zone", "string", { description: "IANA name, e.g. Asia/Kolkata" }),
    optional("status", "Hero status line", "string", { description: "Empty hides the pill." }),
    required("responseTime", "Response time promise"),
    defineField({
      name: "socials",
      title: "Social profiles",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [required("label", "Label"), required("href", "URL", "url")] })],
    }),
    defineField({
      name: "legal",
      title: "Legal details",
      type: "object",
      description: "Shown in the footer once filled in.",
      fields: [optional("entityName", "Registered name"), optional("cin", "CIN"), optional("gstin", "GSTIN")],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
