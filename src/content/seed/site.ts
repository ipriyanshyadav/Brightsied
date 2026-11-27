import type { Audience, Hero, NavItem, Principle, ProcessStep, SiteSettings } from "@/lib/content/types";

// Seed content for Brightseid. The site reads it through lib/content; once Sanity is set up,
// scripts/seed-sanity imports these files once and the CMS becomes the source.

export const settings: SiteSettings = {
  name: "Brightseid",
  wordmark: "brightseid",
  url: "https://brightseid.in",
  tagline: "We plan, build and ship software, and the AI inside it.",
  description:
    "Brightseid is a software engineering studio in Gurgaon. We plan, build and ship products, AI systems and backends for startups, growing businesses and agencies.",
  // Switch to hello@brightseid.in once the domain and its mailbox are set up.
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
  sub: "Brightseid is a software studio in Gurgaon. We plan, design, build and run software and AI for growing businesses, from the first idea to launch and beyond.",
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
    body: "We start with your users, your goals and your budget, then agree the scope in writing.",
  },
  {
    title: "Design",
    body: "Screens, data and how everything fits together are agreed with you before building starts, so there are no surprises.",
  },
  {
    title: "Build",
    body: "We build in small steps and show you working software every week, with AI added only where it helps.",
  },
  {
    title: "Launch & support",
    body: "We launch, keep watch and fix issues fast, then hand it over or keep running it with you as you grow.",
  },
];

export const principles: Principle[] = [
  {
    title: "Agreed before we build",
    body: "Scope, screens and costs are written down and agreed first, so estimates mean something and nothing is a surprise.",
  },
  {
    title: "Built to last from day one",
    body: "Testing, backups and monitoring come with the very first feature, not as a clean-up at the end.",
  },
  {
    title: "You own everything",
    body: "The code, accounts, data and documents are in your name. No lock-in and no strings attached.",
  },
  {
    title: "Talk to the people building it",
    body: "No account managers in the middle. You speak directly with the people designing and building your software.",
  },
];

export const audiences: Audience[] = [
  {
    title: "Startups and founders",
    body: "A first version of your product, a rebuild or an AI feature, scoped tightly and launched to real users fast.",
  },
  {
    title: "Growing businesses",
    body: "Software for purchasing, operations and planning that replaces spreadsheets for good.",
  },
  {
    title: "Agencies",
    body: "Software and AI work delivered under your brand, for clients who need more than a website.",
  },
];
