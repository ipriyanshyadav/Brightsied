import type { TileKind } from "@/components/ui/GlossyTile";

// The shape of everything the site says. Pages read these through the getters in
// lib/content/index.ts, so the source (seed modules today, Sanity later) can change
// without touching components.

export type Link = { label: string; href: string };

export type SiteSettings = {
  name: string;
  /** Lower-case wordmark used in the nav and footer. */
  wordmark: string;
  /** Canonical origin, no trailing slash. */
  url: string;
  tagline: string;
  description: string;
  email: string;
  /** International format, digits only (e.g. 919876543210). Empty hides WhatsApp links. */
  whatsapp: string;
  /** Cal.com / Calendly URL. Empty sends "Book a call" to the contact page instead. */
  bookingUrl: string;
  location: string;
  locality: string;
  country: string;
  timeZone: string;
  /** Short line in the hero status pill. Empty hides the pill. */
  status: string;
  responseTime: string;
  socials: Link[];
  /** Legal details, shown in the footer only once filled in. */
  legal: { entityName: string; cin: string; gstin: string };
};

export type NavItem = { label: string; href: string; note: string };

export type Hero = {
  title: string[];
  sub: string;
};

export type Service = {
  slug: string;
  tile: TileKind;
  name: string;
  /** One line for cards and menus. */
  summary: string;
  headline: string;
  intro: string;
  outcomes: { title: string; body: string }[];
  deliverables: string[];
  idealFor: string[];
  faqs: { q: string; a: string }[];
  /** Slugs of the engagement packages that usually carry this service. */
  packages: string[];
};

export type EngagementPackage = {
  slug: string;
  name: string;
  duration: string;
  summary: string;
  includes: string[];
};

export type ProductStep = {
  title: string;
  body: string;
  /** Key of the scene played beside the step (lib/scenes.ts). */
  scene: string;
};

/** One sellable part of a product, explained in a few steps. */
export type ProductModule = {
  /** Also the page anchor, e.g. /products/s2p#invoice-matching. */
  id: string;
  name: string;
  /** One plain line for the module card. */
  summary: string;
  steps: ProductStep[];
};

/** A packaged way of buying a product: who it suits and which modules it includes. */
export type ProductEdition = {
  name: string;
  /** One plain line on who it suits. */
  bestFor: string;
  summary: string;
  /** Ids of the product's modules that come with this edition. */
  modules: string[];
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  tile: TileKind;
  tagline: string;
  summary: string;
  status: string;
  audience: string[];
  features: { title: string; body: string }[];
  rules: string[];
  /** The end-to-end journey, shown for this product on the home page. */
  steps: ProductStep[];
  modules: ProductModule[];
  /** Optional ways to buy it; empty when the product comes one way. */
  editions: ProductEdition[];
  /** Illustrative app window; sample data, labelled as such on the page. */
  window: {
    path: string;
    sidebar: string[];
    activeItem: string;
    title: string;
    action: string;
    columns: [string, string, string, string];
    rows: { id: string; item: string; qty: string; state: string; tone: "neutral" | "amber" | "mint" | "blue" }[];
  };
};

export type WorkItem = {
  slug: string;
  kind: "product" | "lab" | "client";
  /** Short label for the tab bar. */
  tab: string;
  title: string;
  where: string;
  body: string;
  points: string[];
  tags: string[];
  tiles: [TileKind, TileKind, TileKind];
  href: string;
  /** A full write-up at /work/[slug]. Items without one link straight to href. */
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  /** Who it was for, e.g. "In-house product" or the client's sector. */
  client: string;
  role: string;
  challenge: string;
  approach: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  /** Plain statements of what exists today. No invented metrics. */
  outcome: string[];
  /** Slug of a Brightseid product this work became, for the demo call to action. */
  product?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Only published testimonials are shown. Never publish a placeholder. */
  published: boolean;
};

export type Principle = { title: string; body: string };

export type ProcessStep = { title: string; body: string };

export type Audience = { title: string; body: string };
