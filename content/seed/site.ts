import type { Audience, Hero, NavItem, Principle, ProcessStep, SiteSettings } from "@/lib/content/types";

// Seed content for Brightera. The site reads it through lib/content; once Sanity is set up,
// scripts/seed-sanity imports these files once and the CMS becomes the source.

export const settings: SiteSettings = {
  name: "Brightera",
  wordmark: "brightera",
  url: "https://brightera.in",
  tagline: "We plan, build and ship software, and the AI inside it.",
  description:
    "Brightera is a software engineering studio in Gurgaon. We plan, build and ship products, AI systems and backends for startups, growing businesses and agencies.",
  // Switch to hello@brightera.in once the domain and its mailbox are set up.
  email: "ipriyanshyadav@gmail.com",
  whatsapp: "",
  bookingUrl: "",
  location: "Gurgaon, India",
  locality: "Gurgaon",
  country: "IN",
  timeZone: "Asia/Kolkata",
  status: "Now taking new projects",
  responseTime: "We reply within one working day.",
  socials: [],
  legal: { entityName: "", cin: "", gstin: "" },
};

export const nav: NavItem[] = [
  { label: "Services", href: "/services", note: "Product builds, embedded engineers, AI and audits" },
  { label: "Products", href: "/products", note: "Source-to-Pay and MRP platforms" },
  { label: "Work", href: "/work", note: "What we've built" },
  { label: "About", href: "/about", note: "How we work and who we work with" },
  { label: "Contact", href: "/contact", note: "Tell us about your project" },
];

export const hero: Hero = {
  title: ["Software that ships.", "AI that holds up."],
  sub: "Brightera is an engineering studio in Gurgaon. We plan, design, build and run products, backends and AI systems, from the first spec to production.",
};

export const marquee = [
  "FastAPI",
  "PostgreSQL",
  "Next.js",
  "React",
  "LangGraph",
  "LangChain",
  "Pinecone",
  "FAISS",
  "Rust",
  "Kafka",
  "RabbitMQ",
  "Celery",
  "Temporal",
  "Keycloak",
  "Kubernetes",
  "Grafana",
];

export const process: ProcessStep[] = [
  {
    title: "Discover",
    body: "We start with your users, your constraints and the decision the software has to support, then agree scope in writing.",
  },
  {
    title: "Design",
    body: "Contracts first: data models, API specs and screens agreed before a line of production code.",
  },
  {
    title: "Build",
    body: "Typed services, migrations and tests from day one, with AI wired in behind validation and retries.",
  },
  {
    title: "Ship & support",
    body: "Deployed, monitored and documented, then handed over or run with you as the product grows.",
  },
];

export const principles: Principle[] = [
  {
    title: "Contracts before code",
    body: "Specs, schemas and API contracts are written and agreed first, so estimates mean something and nothing is a surprise.",
  },
  {
    title: "Production from day one",
    body: "Tests, migrations, logging and tracing ship with the first feature, not as a clean-up phase at the end.",
  },
  {
    title: "You own everything",
    body: "Code, cloud accounts, data and documentation live in your name. No lock-in and no hostage repos.",
  },
  {
    title: "Talk to the engineer",
    body: "No account managers in the middle. You speak directly with the person designing and building your system.",
  },
];

export const audiences: Audience[] = [
  {
    title: "Startups and founders",
    body: "An MVP, a platform rebuild or an AI feature, scoped tightly and shipped to real users fast.",
  },
  {
    title: "Growing businesses",
    body: "Internal tools and workflows for procurement, operations and planning that replace spreadsheets for good.",
  },
  {
    title: "Agencies",
    body: "Backend and AI engineering delivered under your brand, for clients who need more than a front end.",
  },
];
