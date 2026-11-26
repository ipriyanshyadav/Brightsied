import type { Testimonial, WorkItem } from "@/lib/content/types";

// Only Brightera's own work belongs here. Client case studies are added with kind "client"
// and a caseStudy once the client has agreed to be named (or to an anonymised write-up).
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
    caseStudy: {
      client: "In-house product",
      role: "Product design, architecture and engineering",
      challenge:
        "Procurement in growing manufacturers and distributors usually runs on spreadsheets, email approvals and a vendor's word. Nobody can say who approved a purchase, why one quote beat another, or whether an invoice matches what arrived. We set out to build a suite that keeps every step on the record without slowing buyers down.",
      approach: [
        { title: "Model the lifecycle first", body: "We mapped the path from requisition to paid invoice as explicit states, so each module owns one stage and hands off through events." },
        { title: "Rules, not email chains", body: "Approvals are decided by a rules engine that reads amount, category and cost centre, so policy changes are configuration, not code." },
        { title: "Normalise before comparing", body: "Quotes arrive in different units, currencies and tax treatments. A worker normalises them before buyers ever see the comparative statement." },
        { title: "Match automatically, review exceptions", body: "Invoices are matched three ways against the PO and goods receipt, so people only handle the mismatches." },
      ],
      decisions: [
        { title: "Maker-checker on every state change", body: "No single person can move a document forward alone, which is what auditors ask about first." },
        { title: "An immutable audit log", body: "Every decision is appended, never edited, so the history of a purchase can be replayed." },
        { title: "Documents out of the database", body: "Bids and contracts live in object storage, keeping the database small and sealed bids genuinely sealed." },
        { title: "Tenancy in the database", body: "Each organisation's data is isolated at the database level rather than trusted to application code." },
      ],
      outcome: [
        "More than 22 modules covering the full source-to-pay lifecycle",
        "Event-driven workers on RabbitMQ, traced end to end with Jaeger",
        "Available today as Brightera Source-to-Pay, with guided demos",
      ],
      stack: ["FastAPI", "PostgreSQL", "RabbitMQ", "MinIO", "Kong", "Jaeger", "Grafana + Loki", "K3s", "Next.js"],
      product: "s2p",
    },
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
    caseStudy: {
      client: "In-house product",
      role: "Product design, architecture and engineering",
      challenge:
        "Discrete manufacturers re-plan constantly: an order changes, a supplier slips, stock is miscounted. Most planning tools run overnight and produce a plan that is already stale. We wanted a planning run fast and predictable enough to repeat whenever the floor changes.",
      approach: [
        { title: "A dedicated planning engine", body: "BOM explosion, netting and lead-time offsetting run in a Rust engine, separate from the web services, so heavy runs never slow the app." },
        { title: "Start from the real state of the floor", body: "Inventory and order changes are captured from the database and streamed through Kafka, so each run begins from current data." },
        { title: "Workflows that survive restarts", body: "Re-plans, approvals and releases run as Temporal workflows, so a deploy or a crash never loses a half-finished run." },
        { title: "Peg every suggestion to its demand", body: "Each planned purchase or production order points back to the demand that caused it, so planners can see why it exists." },
      ],
      decisions: [
        { title: "Deterministic runs", body: "The same snapshot always produces the same plan, which makes runs testable and differences explainable." },
        { title: "Exact decimals for quantities", body: "Quantities and money are never floating point, so totals reconcile to the unit." },
        { title: "Policy as code", body: "Keycloak handles sign-in and OPA decides who can see and change what, in one place rather than scattered checks." },
        { title: "Tenant isolation in the database", body: "Row-level security keeps each manufacturer's data separate even if application code makes a mistake." },
      ],
      outcome: [
        "Multi-level BOMs with versions, effectivity dates and alternates",
        "Planned purchase and production orders pegged back to demand",
        "Available today as Brightera MRP, with guided demos",
      ],
      stack: ["FastAPI", "SQLAlchemy", "Rust", "Apache Arrow", "PostgreSQL", "Kafka", "Debezium", "Temporal", "Keycloak", "OPA"],
      product: "mrp",
    },
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
