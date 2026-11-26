// Everything on the page reads from this file. Edit here, not in components.
// Fields marked TODO are values only you know (links, dates, resume file).

export const site = {
  name: "Priyansh Yadav",
  handle: "priyansh",
  role: "Backend & GenAI engineer",
  location: "Gurgaon, India",
  timeZone: "Asia/Kolkata",
  email: "ipriyanshyadav@gmail.com",
  // TODO: set to your deployed domain (used for SEO, sitemap and OG images)
  url: "https://priyansh.dev",
  // TODO: drop your PDF at public/resume.pdf
  resume: "/resume.pdf",
  socials: [
    // TODO: replace with your real profile URLs
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  status: "Open to AI/GenAI and backend roles in Delhi NCR",
  description:
    "Backend and GenAI engineer in Gurgaon building FastAPI services, RAG pipelines and multi-agent systems that hold up in production.",
};

export const nav = [
  { label: "Work", href: "#work", note: "A procurement platform, start to finish" },
  { label: "Projects", href: "#projects", note: "Chatbots, APIs and a SaaS blueprint" },
  { label: "Process", href: "#process", note: "How I take a system to production" },
  { label: "Experience", href: "#experience", note: "Where I've shipped" },
  { label: "Contact", href: "#contact", note: "Email, résumé and links" },
];

export const hero = {
  intro: ["Hi, I'm", "Priyansh."],
  title: ["Backends built", "for AI."],
  sub: "I'm a backend and GenAI engineer in Gurgaon. I build FastAPI services, RAG pipelines and agent workflows that run in production.",
};

export const process = [
  {
    title: "Design",
    body: "Contracts first: OpenAPI specs, schemas and data models agreed before any code.",
  },
  {
    title: "Build",
    body: "FastAPI services on PostgreSQL, with migrations, tests and typed clients.",
  },
  {
    title: "Integrate",
    body: "LLMs, retrieval and tool-calling wired in behind validation and retries.",
  },
  {
    title: "Ship",
    body: "Containers on K3s, traced with Jaeger and watched in Grafana and Loki.",
  },
];

export const marquee = [
  "Zidio Development",
  "FastAPI",
  "PostgreSQL",
  "Mobifly",
  "LangChain",
  "LangGraph",
  "FAISS",
  "Pinecone",
  "Celery",
  "RabbitMQ",
  "MinIO",
  "Kong",
  "K3s",
  "Next.js",
];

export const capabilities: {
  id: string;
  tile: "docs" | "api" | "agents" | "queue";
  title: string;
  body: string;
}[] = [
  {
    id: "rag",
    tile: "docs",
    title: "RAG pipelines",
    body: "Chunking, embeddings and retrieval tuned against real questions, on FAISS or Pinecone, with answers that cite where they came from.",
  },
  {
    id: "tools",
    tile: "api",
    title: "LLM tool-calling",
    body: "Models that call your APIs with typed arguments, validated before anything touches the database.",
  },
  {
    id: "agents",
    tile: "agents",
    title: "Multi-agent workflows",
    body: "LangGraph graphs with explicit state, so each agent's handoff can be traced, retried and tested.",
  },
  {
    id: "queues",
    tile: "queue",
    title: "Async job systems",
    body: "Celery and RabbitMQ for the slow work: ingestion, notifications and anything that shouldn't block a request.",
  },
];

export const caseStudy = {
  title: "Source-to-Pay procurement platform",
  summary:
    "An enterprise procurement suite I'm architecting and building solo: more than 22 modules covering the full lifecycle from a purchase request to a paid invoice.",
  rules: [
    "Maker-checker approval on every state change",
    "Immutable audit log for each decision",
    "org_id tenancy enforced on all data",
  ],
  stack: [
    "FastAPI",
    "PostgreSQL",
    "RabbitMQ",
    "MinIO",
    "Kong",
    "Jaeger",
    "Grafana + Loki",
    "K3s",
    "Next.js",
  ],
  steps: [
    {
      title: "Requisition",
      body: "A department raises a purchase request. The approval rules engine works out who has to sign off, based on amount, category and cost centre.",
      lit: ["api", "rules", "audit"],
      event: "requisition.submitted",
    },
    {
      title: "RFQ and sealed bids",
      body: "Vendors are invited to quote. Bids stay sealed until the deadline, and their documents are stored in object storage, not the database.",
      lit: ["api", "queue", "store", "audit"],
      event: "rfq.bids_unsealed",
    },
    {
      title: "Comparative statement",
      body: "Quotes in different units, currencies and tax treatments are normalised into one table so buyers compare like with like.",
      lit: ["api", "worker", "db"],
      event: "cs.normalised",
    },
    {
      title: "Purchase order and contract",
      body: "The winning bid becomes a PO. A checker approves it before it's issued, and the contract terms are versioned alongside it.",
      lit: ["api", "rules", "db", "audit"],
      event: "po.approved",
    },
    {
      title: "Invoice three-way match",
      body: "Each invoice is matched against its PO and goods receipt. Mismatches are held for review; clean matches go straight to payment.",
      lit: ["api", "queue", "worker", "db", "audit"],
      event: "invoice.matched",
    },
  ],
};

export const projects = [
  {
    id: "rag-chatbot",
    tab: "RAG chatbot",
    where: "Zidio Development",
    title: "A production chatbot that looks things up and takes action",
    body: "I built a retrieval-augmented chatbot that answers from company documents and calls tools when a question needs live data. It ran in production, so retrieval quality and tool-call safety mattered more than demos.",
    points: [
      "Retrieval over internal documents with vector search",
      "LLM tool-calling against existing backend services",
      "Served through FastAPI",
    ],
    tags: ["LangChain", "RAG", "Tool-calling", "FastAPI"],
  },
  {
    id: "rest-apis",
    tab: "30+ REST APIs",
    where: "Mobifly",
    title: "More than thirty REST APIs for a live product",
    body: "I designed and shipped over thirty REST endpoints, covering data models, validation, error handling and the documentation other teams built against.",
    points: [
      "Resource design and request validation",
      "PostgreSQL schemas and queries",
      "Consistent errors other teams could rely on",
    ],
    tags: ["REST", "PostgreSQL", "Python"],
  },
  {
    id: "mrp-saas",
    tab: "MRP SaaS blueprint",
    where: "Personal project",
    title: "A multi-tenant MRP and procurement SaaS, planned in waves",
    body: "A full development blueprint for a manufacturing planning platform aimed at discrete manufacturers, which I'm implementing phase by phase.",
    points: [
      "FastAPI and SQLAlchemy services with a Rust MRP worker",
      "Kafka and Debezium for change data, Temporal for workflows",
      "Keycloak and OPA for identity and policy",
    ],
    tags: ["Multi-tenant", "FastAPI", "Rust", "Kafka"],
  },
];

export const experience = [
  {
    org: "Zidio Development",
    role: "Software engineer",
    // TODO: add dates, e.g. "Jan 2025 – Jun 2025"
    period: "",
    body: "Built and shipped a RAG-based chatbot with LLM tool-calling.",
  },
  {
    org: "Mobifly",
    role: "Backend developer",
    period: "",
    body: "Developed more than thirty REST APIs for production use.",
  },
  {
    org: "B.Tech",
    role: "Bachelor of Technology",
    period: "",
    body: "Engineering degree.",
  },
];
