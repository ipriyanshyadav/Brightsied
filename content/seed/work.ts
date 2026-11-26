import type { Testimonial, WorkItem } from "@/lib/content/types";

// Only Brightera's own work belongs here. Client case studies are added with kind "client"
// once the client has agreed to be named (or to an anonymised write-up).
export const work: WorkItem[] = [
  {
    slug: "s2p",
    kind: "product",
    tab: "Source-to-Pay",
    title: "A procurement suite from purchase request to paid invoice",
    where: "Brightera product",
    body: "More than 22 modules covering requisitions, sealed-bid RFQs, comparative statements, purchase orders, contracts and three-way invoice matching, with maker-checker approval and an immutable audit trail throughout.",
    points: [
      "Approval rules engine driven by amount, category and cost centre",
      "Event-driven workers on RabbitMQ, documents in MinIO",
      "Traced with Jaeger, observed in Grafana and Loki",
    ],
    tags: ["FastAPI", "PostgreSQL", "RabbitMQ", "Multi-tenant"],
    tiles: ["audit", "api", "db"],
    href: "/products/s2p",
  },
  {
    slug: "mrp",
    kind: "product",
    tab: "MRP",
    title: "A planning platform for discrete manufacturers",
    where: "Brightera product",
    body: "Multi-level BOMs, demand and a deterministic Rust planning engine that turns them into pegged purchase and production orders, fed by live change data from the shop floor.",
    points: [
      "FastAPI and SQLAlchemy services with a Rust MRP worker",
      "Kafka and Debezium for change data, Temporal for workflows",
      "Keycloak and OPA for identity and policy",
    ],
    tags: ["Rust", "Kafka", "Temporal", "Multi-tenant"],
    tiles: ["db", "queue", "agents"],
    href: "/products/mrp",
  },
  {
    slug: "retrieval-lab",
    kind: "lab",
    tab: "Retrieval lab",
    title: "A live retrieval tuner you can play with",
    where: "Brightera lab",
    body: "A small, real retrieval demo: change the chunk size and top-k and watch which passages a RAG system would hand to the model. It's the first thing we tune on every AI build.",
    points: [
      "Chunking and scoring run in the browser",
      "The same trade-offs we tune on client data",
      "Part of our AI systems practice",
    ],
    tags: ["RAG", "Retrieval", "Evaluation"],
    tiles: ["docs", "vectors", "api"],
    href: "/services/ai-systems#lab",
  },
];

// Real testimonials only. Add one here (or in the CMS) with published: true once a client
// has approved the wording; the section stays hidden until then.
export const testimonials: Testimonial[] = [
  {
    quote: "[PLACEHOLDER] Replace with a real, approved client quote.",
    name: "[PLACEHOLDER]",
    role: "[PLACEHOLDER]",
    company: "[PLACEHOLDER]",
    published: false,
  },
];
