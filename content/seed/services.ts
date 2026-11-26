import type { EngagementPackage, Service } from "@/lib/content/types";

export const services: Service[] = [
  {
    slug: "product-engineering",
    tile: "api",
    name: "Product engineering",
    summary: "MVPs, SaaS platforms and internal tools, planned, built and shipped end to end.",
    headline: "From an idea on a page to a product in production.",
    intro:
      "We take a product from first spec to running software: discovery, data model, API, interface, deployment and the monitoring that keeps it healthy. One team owns the whole path, so nothing falls between vendors.",
    outcomes: [
      { title: "A clear, written scope", body: "User flows, data model and API contract agreed before the build, so the estimate holds." },
      { title: "Working software every week", body: "Short iterations deployed to a staging environment you can click through." },
      { title: "A system you can grow", body: "Typed services, migrations and tests that a future in-house team can pick up without a rewrite." },
    ],
    deliverables: [
      "Product spec, data model and OpenAPI contract",
      "FastAPI and PostgreSQL backend with migrations and tests",
      "Next.js or React front end on a typed, generated client",
      "Authentication, roles and multi-tenant data where needed",
      "CI/CD, containerised deployment and monitoring",
      "Handover documentation and a recorded walkthrough",
    ],
    idealFor: [
      "Founders who need an MVP in front of users",
      "Businesses replacing spreadsheets with a real system",
      "Teams rebuilding a product that has outgrown its first version",
    ],
    faqs: [
      {
        q: "Do you work with a fixed scope or by the hour?",
        a: "Most builds start with a short discovery sprint that produces a written scope. After that we work to that scope, in weekly iterations you can see.",
      },
      {
        q: "Who owns the code?",
        a: "You do, from the first commit. Repositories, cloud accounts and credentials are set up in your name.",
      },
      {
        q: "Can you take over an existing codebase?",
        a: "Yes. We usually begin with a short audit so we both know what we are inheriting before committing to a plan.",
      },
    ],
    packages: ["discovery-sprint", "mvp-build"],
  },
  {
    slug: "forward-deployed-engineering",
    tile: "terminal",
    name: "Forward-deployed engineering",
    summary: "Senior engineers embedded in your team, shipping inside your stack.",
    headline: "An engineer inside your team, shipping in your stack.",
    intro:
      "When the work lives in your codebase and your processes, we join you there: your repositories, your standups, your chat and your deploy pipeline. Remote across India, or on-site in Delhi NCR.",
    outcomes: [
      { title: "Velocity without hiring", body: "Production-grade engineering capacity from the first week, without a recruiting cycle." },
      { title: "Hard problems unblocked", body: "AI integrations, data pipelines and backend bottlenecks taken on by someone who has built them before." },
      { title: "Knowledge that stays", body: "Pairing, reviews and documentation so your team owns what was built after we step back." },
    ],
    deliverables: [
      "Work in your repositories, tickets and review process",
      "Daily presence in your standups and team chat",
      "Architecture notes and decision records as we go",
      "Pairing and code review with your engineers",
      "A written handover at the end of the engagement",
    ],
    idealFor: [
      "Product teams that need senior backend or AI capacity now",
      "Companies adding AI features to an existing product",
      "Teams in Delhi NCR that want someone on-site",
    ],
    faqs: [
      {
        q: "Remote or on-site?",
        a: "Either. Most engagements are remote with overlap on Indian working hours; on-site days in Delhi NCR are available.",
      },
      {
        q: "How long is a typical engagement?",
        a: "Usually a few months at a time, reviewed monthly. We agree goals up front so progress is measurable.",
      },
    ],
    packages: ["fde-embed"],
  },
  {
    slug: "ai-systems",
    tile: "agents",
    name: "AI systems",
    summary: "RAG, tool-calling and multi-agent workflows that hold up in production.",
    headline: "AI features that cite their sources and stay inside the guard rails.",
    intro:
      "We build the engineering around the model: retrieval tuned on your real questions, tool-calling with typed and validated arguments, agent workflows with explicit state, and evaluations that tell you whether a change made things better.",
    outcomes: [
      { title: "Answers you can trust", body: "Retrieval over your documents with citations, tuned and measured against real queries." },
      { title: "Actions that are safe", body: "Models call your APIs through typed tools, validated before anything touches your data." },
      { title: "Behaviour you can test", body: "Evaluation sets and tracing, so prompt or model changes are judged on evidence." },
    ],
    deliverables: [
      "Retrieval pipeline: chunking, embeddings, vector search and reranking",
      "LLM tool-calling against your existing services",
      "LangGraph agent workflows with explicit, traceable state",
      "Evaluation datasets and regression checks",
      "Guard rails: input validation, output checks, rate and cost limits",
      "Served through FastAPI with monitoring and logs",
    ],
    idealFor: [
      "Products adding an assistant or search over their own content",
      "Operations teams automating document-heavy workflows",
      "Teams whose AI prototype now needs to survive real users",
    ],
    faqs: [
      {
        q: "Which models do you use?",
        a: "Whichever fits the job, cost and data-residency needs. We design so the model can be swapped without rewriting the system.",
      },
      {
        q: "Will our data be used to train models?",
        a: "We configure providers so your data is not used for training, and can keep retrieval and storage inside your own cloud.",
      },
    ],
    packages: ["ai-integration", "discovery-sprint"],
  },
  {
    slug: "architecture-audit",
    tile: "audit",
    name: "Architecture & AI audits",
    summary: "An independent review of your system, with a prioritised plan to fix it.",
    headline: "A clear picture of your system, and what to do next.",
    intro:
      "Before a big build, a fundraise or a scaling push, we review your architecture, data model, security posture and AI readiness, and hand you a written report with a prioritised roadmap.",
    outcomes: [
      { title: "Risks surfaced early", body: "Security gaps, data-model problems and scaling limits found before they become incidents." },
      { title: "A plan, not just findings", body: "Each issue ranked by impact and effort, with a recommended order of work." },
      { title: "Confidence for decisions", body: "An outside view to support build-versus-buy, hiring and investment conversations." },
    ],
    deliverables: [
      "Codebase and architecture review",
      "Data model and database performance review",
      "Security and multi-tenancy review",
      "AI readiness assessment and use-case shortlist",
      "Written report and a prioritised roadmap",
      "A walkthrough call with your team",
    ],
    idealFor: [
      "Founders preparing to scale or raise",
      "Teams inheriting a codebase they didn't write",
      "Businesses deciding where AI will actually pay off",
    ],
    faqs: [
      {
        q: "What access do you need?",
        a: "Read access to the code and infrastructure configuration, plus a couple of conversations with the people who run the system.",
      },
    ],
    packages: ["architecture-audit"],
  },
  {
    slug: "white-label",
    tile: "queue",
    name: "White-label engineering",
    summary: "Backend and AI engineering for agencies, delivered under your brand.",
    headline: "Your brand on the front. Our engineering behind it.",
    intro:
      "Agencies win projects that need more than a front end: integrations, data pipelines, AI features and backends that scale. We deliver that work under your name, inside your process, with your client relationship untouched.",
    outcomes: [
      { title: "Say yes to bigger projects", body: "Take on backend and AI scope without hiring for it." },
      { title: "Invisible by default", body: "NDAs, your communication channels and your branding on every deliverable." },
      { title: "Predictable delivery", body: "Clear specs and estimates you can put in front of your client with confidence." },
    ],
    deliverables: [
      "Backend services, APIs and integrations",
      "AI features: RAG, assistants and automation",
      "Technical specs and estimates for your proposals",
      "Documentation written in your voice",
      "NDA and non-solicitation by default",
    ],
    idealFor: [
      "Design and marketing agencies with technical client asks",
      "Development shops that need AI or backend depth",
      "Consultancies that want a reliable build partner",
    ],
    faqs: [
      {
        q: "Will we ever talk to your client directly?",
        a: "Only if you want us to. By default, all communication goes through you.",
      },
    ],
    packages: ["white-label-partner"],
  },
];

export const packages: EngagementPackage[] = [
  {
    slug: "discovery-sprint",
    name: "Discovery Sprint",
    duration: "1–2 weeks",
    summary: "Turn an idea or a problem into a written scope, an architecture and a reliable estimate.",
    includes: ["User flows and requirements", "Data model and API outline", "Architecture and stack decision", "Fixed estimate for the build"],
  },
  {
    slug: "mvp-build",
    name: "MVP Build",
    duration: "6–10 weeks",
    summary: "A production-ready first version of your product, shipped to real users.",
    includes: ["Backend, front end and admin", "Auth, roles and deployment", "Weekly demos on staging", "Handover documentation"],
  },
  {
    slug: "ai-integration",
    name: "AI Integration",
    duration: "3–6 weeks",
    summary: "An AI feature added to your product, measured, guarded and monitored.",
    includes: ["Use-case and data review", "RAG or tool-calling build", "Evaluation set and tracing", "Cost and safety guard rails"],
  },
  {
    slug: "fde-embed",
    name: "FDE Embed",
    duration: "Monthly",
    summary: "A senior engineer working inside your team, your stack and your process.",
    includes: ["Joins your standups and chat", "Ships in your repositories", "Pairing and code review", "Monthly goals and review"],
  },
  {
    slug: "architecture-audit",
    name: "Architecture Audit",
    duration: "1–2 weeks",
    summary: "An independent review of your system with a prioritised plan to act on.",
    includes: ["Code and infrastructure review", "Security and data review", "AI readiness assessment", "Written report and walkthrough"],
  },
  {
    slug: "white-label-partner",
    name: "White-label Partner",
    duration: "Per project or retainer",
    summary: "Backend and AI delivery for agencies, under your brand.",
    includes: ["Specs for your proposals", "Delivery in your process", "Your branding throughout", "NDA by default"],
  },
];
