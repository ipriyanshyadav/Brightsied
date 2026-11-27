import type { Testimonial, WorkItem } from "@/lib/content/types";

// Only Brightseid's own work belongs here. Client case studies are added with kind "client"
// and a caseStudy once the client has agreed to be named (or to an anonymised write-up).
export const work: WorkItem[] = [
  {
    slug: "s2p",
    kind: "product",
    tab: "Source-to-Pay",
    title: "Buying software, from purchase request to paid invoice",
    where: "Brightseid product",
    body: "One system for purchase requests, approvals, vendors, sealed quotes, purchase orders, contracts and invoice checks, with a second pair of eyes and a permanent record on every decision.",
    points: [
      "Approvals follow rules the customer sets: amount, category and department",
      "Vendor bids stay sealed until the deadline",
      "Invoices are checked against the order and the delivery automatically",
    ],
    tags: ["Purchasing", "Approvals", "Vendors", "Invoices"],
    tiles: ["audit", "api", "db"],
    href: "/products/s2p",
    caseStudy: {
      client: "In-house product",
      role: "Product design and development",
      challenge:
        "Purchasing in growing manufacturers and distributors usually runs on spreadsheets, email approvals and a vendor's word. Nobody can say who approved a purchase, why one quote beat another, or whether an invoice matches what arrived. We set out to build a system that keeps every step on the record without slowing buyers down.",
      approach: [
        { title: "Map the whole journey first", body: "We mapped every stage from purchase request to paid invoice, so each module owns one stage and hands over cleanly to the next." },
        { title: "Rules, not email chains", body: "Who approves what is set by rules based on amount, category and department, so a policy change is a settings change, not a software change." },
        { title: "Compare like with like", body: "Quotes arrive in different units, currencies and tax treatments. They are converted before buyers see the comparison." },
        { title: "Check automatically, review exceptions", body: "Invoices are checked against the purchase order and the delivery, so people only handle the ones that don't match." },
      ],
      decisions: [
        { title: "A second person on every change", body: "No single person can move a purchase forward alone, which is the first thing auditors ask about." },
        { title: "A record that can't be edited", body: "Every decision is added to a permanent history, so the story of any purchase can be retold step by step." },
        { title: "Documents kept apart", body: "Bids and contracts are stored separately and securely, so sealed bids really stay sealed until the deadline." },
        { title: "Each company's data kept separate", body: "Every organisation's data is walled off from every other's at the deepest level of the system." },
      ],
      outcome: [
        "Eight modules covering buying from request to payment",
        "Approvals, sealed bids and invoice checks built in from the start",
        "Available today as Brightseid Source-to-Pay, with guided demos",
      ],
      product: "s2p",
    },
  },
  {
    slug: "mrp",
    kind: "product",
    tab: "MRP",
    title: "Production planning software for manufacturers",
    where: "Brightseid product",
    body: "Product recipes, customer demand and stock in one place, with a planning run that works out what to buy and make, and when, in seconds rather than overnight.",
    points: [
      "Re-plans the whole factory in seconds whenever an order changes",
      "Every suggested order links back to the demand that caused it",
      "Stock and order changes reach the plan straight away",
    ],
    tags: ["Planning", "Inventory", "Production", "Quality"],
    tiles: ["db", "queue", "agents"],
    href: "/products/mrp",
    caseStudy: {
      client: "In-house product",
      role: "Product design and development",
      challenge:
        "Manufacturers re-plan constantly: an order changes, a supplier slips, stock is miscounted. Most planning tools run overnight and produce a plan that is already out of date by morning. We wanted a plan that is fast and predictable enough to redo whenever the floor changes.",
      approach: [
        { title: "A dedicated planning engine", body: "The heavy calculation runs separately from the screens people use, so a big planning run never slows anyone down." },
        { title: "Start from what's really on the floor", body: "Stock and order changes flow into the plan as they happen, so every run starts from today's numbers." },
        { title: "Work that survives interruptions", body: "Re-plans, approvals and releases pick up where they left off, even after an update or an outage." },
        { title: "Explain every suggestion", body: "Each suggested purchase or job points back to the customer order that caused it, so planners can see why it exists." },
      ],
      decisions: [
        { title: "Same inputs, same plan", body: "The same starting data always produces the same plan, so results can be checked and differences explained." },
        { title: "Exact quantities", body: "Quantities and money are never rounded along the way, so totals add up to the unit." },
        { title: "Access in one place", body: "Who can see and change what is decided in one place, rather than scattered through the software." },
        { title: "Each company's data kept separate", body: "Every manufacturer's data is walled off from every other's, even if something else goes wrong." },
      ],
      outcome: [
        "Eight modules from demand planning to quality control",
        "Suggested purchases and jobs, each linked to the demand behind it",
        "Available today as Brightseid MRP, with guided demos",
      ],
      product: "mrp",
    },
  },
  {
    slug: "retrieval-lab",
    kind: "lab",
    tab: "AI search lab",
    title: "See how an AI assistant finds its answers",
    where: "Brightseid lab",
    body: "A small, real demo of how an AI assistant picks the right passages from your documents before it answers. Change the settings and watch the results change. It's the first thing we tune on every AI project.",
    points: [
      "Runs right in your browser",
      "The same trade-offs we tune on real client documents",
      "Part of our AI systems work",
    ],
    tags: ["AI search", "Live demo"],
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
