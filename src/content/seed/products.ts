import type { Product } from "@/lib/content/types";

// Written for the people who run purchasing and planning, not for engineers. Each step's
// scene is a key into lib/scenes.ts.
export const products: Product[] = [
  {
    slug: "s2p",
    name: "Brightseid Source-to-Pay",
    shortName: "Source-to-Pay",
    tile: "audit",
    tagline: "Buying, from the first request to the paid invoice, with every decision on the record.",
    summary:
      "One place for the whole buying process: purchase requests, approvals, vendors, quotes, purchase orders, contracts and invoice checks. Less chasing, fewer mistakes and a clear answer to who approved what.",
    status: "Demo available",
    audience: ["Manufacturers", "Distributors", "Purchase teams in growing businesses"],
    features: [
      { title: "Approvals without email chains", body: "The right people sign off automatically, based on amount, category and department." },
      { title: "Fair, sealed quotes", body: "Vendor bids stay locked until the deadline, so every supplier gets an equal chance." },
      { title: "Like-for-like comparison", body: "Quotes in different units, currencies and tax treatments, compared in one table." },
      { title: "Invoices checked for you", body: "Each invoice is matched against the order and the delivery. You only review the ones that don't match." },
      { title: "Two people on every decision", body: "Nothing moves forward on one person's say-so, and every decision is on the record." },
      { title: "Your data stays yours", body: "Each company's data is kept completely separate and private." },
    ],
    rules: [
      "Every approval recorded: who, when and why",
      "No one person can push a purchase through alone",
      "Your data kept separate from every other company's",
    ],
    steps: [
      {
        title: "Someone asks for what they need",
        body: "A department raises a purchase request in a minute. The system already knows who has to approve it.",
        scene: "request-create",
      },
      {
        title: "Vendors quote, sealed",
        body: "Shortlisted vendors are invited to quote. Bids stay locked until the deadline, so the process is fair.",
        scene: "rfq-sealed",
      },
      {
        title: "Compare like for like",
        body: "Quotes in different units, currencies and taxes are lined up in one table, so you compare real costs.",
        scene: "compare-normalise",
      },
      {
        title: "Approve and send the order",
        body: "The winning quote becomes a purchase order. A second person checks it before it goes to the vendor.",
        scene: "po-check",
      },
      {
        title: "Pay only for what arrived",
        body: "Each invoice is checked against the order and the delivery. Clean ones go to payment; the rest wait for review.",
        scene: "invoice-match",
      },
    ],
    modules: [
      {
        id: "purchase-requests",
        name: "Purchase requests",
        summary: "Anyone can ask for what they need in a minute, from a phone or a laptop.",
        steps: [
          {
            title: "Ask for what you need",
            body: "Pick items from your catalogue or describe something new, choose the budget and attach a quote if you have one. Nothing to print, no email chains.",
            scene: "request-create",
          },
          {
            title: "Budget checked as you type",
            body: "Each request is checked against the department's budget before it's sent, so overspending is caught at the start, not at the end of the quarter.",
            scene: "request-budget",
          },
          {
            title: "Always know where it is",
            body: "Every request shows its status and who has it right now. No more chasing people to find out what happened.",
            scene: "request-track",
          },
        ],
      },
      {
        id: "approvals",
        name: "Approval workflows",
        summary: "The right people approve, in the right order. You set the rules once.",
        steps: [
          {
            title: "Rules you set once",
            body: "Decide who approves what by amount, category and department. When your policy changes, change the rules yourself.",
            scene: "approval-rules",
          },
          {
            title: "Approve from anywhere",
            body: "Approvers are notified and can approve or reject in one tap, with the full request and its quotes in front of them.",
            scene: "approval-tap",
          },
          {
            title: "Four eyes on every decision",
            body: "Whoever makes a change can't also approve it. Each decision is saved with who made it, when and why.",
            scene: "approval-record",
          },
        ],
      },
      {
        id: "vendors",
        name: "Vendor management",
        summary: "One trusted list of suppliers, with their documents, ratings and history.",
        steps: [
          {
            title: "Vendors sign themselves up",
            body: "Suppliers fill in their own details and upload GST, PAN and bank documents through a secure link.",
            scene: "vendor-onboard",
          },
          {
            title: "Checked before they're approved",
            body: "Your team reviews each document before a vendor can be asked to quote, so no unchecked supplier ever gets an order.",
            scene: "vendor-verify",
          },
          {
            title: "Ratings from real orders",
            body: "Delivery times, quality and prices are scored from actual orders, so your best suppliers rise to the top.",
            scene: "vendor-rate",
          },
        ],
      },
      {
        id: "quotes",
        name: "Quotes and sealed bids",
        summary: "Ask several vendors to quote, and keep every bid sealed until the deadline.",
        steps: [
          {
            title: "Invite vendors in one click",
            body: "Turn an approved request into a request for quotation and send it to all your shortlisted vendors at once.",
            scene: "rfq-invite",
          },
          {
            title: "Sealed until the deadline",
            body: "Bids arrive locked. Nobody can open them before the closing time, so every vendor gets a fair chance.",
            scene: "rfq-sealed",
          },
          {
            title: "Opened together, on the record",
            body: "At the deadline every bid opens at once, and the opening is recorded, ready for comparison.",
            scene: "rfq-open",
          },
        ],
      },
      {
        id: "quote-comparison",
        name: "Quote comparison",
        summary: "Every quote side by side in one table, compared like for like.",
        steps: [
          {
            title: "Different formats, one table",
            body: "Quotes in different units, currencies and tax treatments are converted automatically, so you compare real costs.",
            scene: "compare-normalise",
          },
          {
            title: "The full cost, not just the price",
            body: "Freight, taxes, payment terms and delivery time are counted in, so the cheapest quote on paper isn't mistaken for the best deal.",
            scene: "compare-total",
          },
          {
            title: "A decision you can explain",
            body: "The chosen vendor and the reason are saved with the comparison, ready for a manager's or an auditor's question.",
            scene: "compare-decide",
          },
        ],
      },
      {
        id: "purchase-orders",
        name: "Purchase orders and contracts",
        summary: "Approved quotes become purchase orders and contracts without retyping anything.",
        steps: [
          {
            title: "Made from the winning quote",
            body: "Prices, quantities and terms carry straight over from the chosen bid into the purchase order.",
            scene: "po-create",
          },
          {
            title: "Checked, then sent",
            body: "A second person checks every purchase order before it goes out. The vendor receives it by email and confirms it online.",
            scene: "po-check",
          },
          {
            title: "Contracts with reminders",
            body: "Rate contracts and agreements are kept with every version, and you're reminded well before they expire.",
            scene: "po-contract",
          },
        ],
      },
      {
        id: "invoice-matching",
        name: "Invoice matching",
        summary: "Invoices are checked against the order and the delivery. You only see the ones that don't match.",
        steps: [
          {
            title: "Deliveries recorded",
            body: "The store records what actually arrived, including short or damaged deliveries.",
            scene: "invoice-receive",
          },
          {
            title: "Order, delivery and invoice compared",
            body: "Each invoice is checked against its purchase order and its delivery: quantity, price and tax.",
            scene: "invoice-match",
          },
          {
            title: "Clean invoices go to payment",
            body: "Invoices that match move straight to payment. Ones that don't are held, with the difference highlighted for review.",
            scene: "invoice-pay",
          },
        ],
      },
      {
        id: "spend-analytics",
        name: "Spend analytics",
        summary: "See where the money goes, by vendor, category and department.",
        steps: [
          {
            title: "All your spending in one view",
            body: "Every order and invoice adds up into live dashboards. No more month-end spreadsheets.",
            scene: "spend-rollup",
          },
          {
            title: "Spot where to save",
            body: "See which categories are growing, where you buy the same thing from many vendors and where prices have crept up.",
            scene: "spend-savings",
          },
          {
            title: "Reports when you need them",
            body: "Download to Excel or PDF, or have a summary emailed to leadership every week.",
            scene: "spend-report",
          },
        ],
      },
    ],
    window: {
      path: "source-to-pay / quotes",
      sidebar: ["Purchase requests", "Quotes", "Bids", "Quote comparison", "Purchase orders", "Invoices", "Vendors", "History"],
      activeItem: "Quotes",
      title: "Open requests for quotation",
      action: "New request",
      columns: ["Number", "Item", "Bids", "Status"],
      rows: [
        { id: "RFQ-0142", item: "Hot-rolled steel coils", qty: "4", state: "Sealed", tone: "neutral" },
        { id: "RFQ-0139", item: "Industrial fasteners", qty: "6", state: "Comparing", tone: "amber" },
        { id: "RFQ-0137", item: "Packaging film, 40 µm", qty: "3", state: "Approved", tone: "mint" },
        { id: "RFQ-0131", item: "Servo motors, 2 kW", qty: "5", state: "Order sent", tone: "blue" },
      ],
    },
  },
  {
    slug: "mrp",
    name: "Brightseid MRP",
    shortName: "MRP",
    tile: "db",
    tagline: "Material planning for manufacturers, fast enough to re-plan every time the plan changes.",
    summary:
      "Plan what to buy and what to make, and when. Product recipes, customer demand, stock and machines in one place, with a planning run that takes seconds instead of a night.",
    status: "Demo available",
    audience: ["Manufacturers", "Contract manufacturers", "Operations and planning teams"],
    features: [
      { title: "Recipes for every product", body: "Multi-level bills of materials with versions, start dates, substitutes and scrap." },
      { title: "A full plan in seconds", body: "Re-plan the whole factory whenever an order changes. The same inputs always give the same answer." },
      { title: "Know why every order exists", body: "Each suggested purchase or job links back to the customer order that caused it." },
      { title: "Always up to date", body: "Stock and order changes reach the plan straight away, so it matches what's really on the floor." },
      { title: "Nothing slips through", body: "Approvals and releases pick up exactly where they left off, even after an interruption." },
      { title: "The right access for each person", body: "Planners, buyers and managers each see and change only what they should." },
    ],
    rules: [
      "Same inputs, same plan, every time",
      "Quantities exact to the unit, never rounded",
      "Your data kept separate from every other company's",
    ],
    steps: [
      {
        title: "Know what's coming",
        body: "Customer orders and forecasts come together in one place, week by week.",
        scene: "demand-collect",
      },
      {
        title: "Break products into parts",
        body: "Each product's recipe lists every part and material it takes to make it.",
        scene: "bom-tree",
      },
      {
        title: "Work out only what's missing",
        body: "The plan subtracts what's in stock and already on order, so you never buy twice.",
        scene: "mrp-net",
      },
      {
        title: "A full plan in seconds",
        body: "Re-plan the whole factory whenever something changes, and get the same answer from the same inputs.",
        scene: "mrp-run",
      },
      {
        title: "Release work to the floor",
        body: "Jobs go to the shop floor only when their materials are ready, and every change is recorded.",
        scene: "wo-release",
      },
    ],
    modules: [
      {
        id: "demand-planning",
        name: "Demand planning",
        summary: "Know what customers will order before they order it.",
        steps: [
          {
            title: "Orders and forecasts together",
            body: "Confirmed customer orders and forecasts sit in one place, by product and by week.",
            scene: "demand-collect",
          },
          {
            title: "Forecasts that learn",
            body: "Forecasts are built from your sales history and seasons, and get sharper as more orders come in.",
            scene: "demand-forecast",
          },
          {
            title: "Plan for the unusual",
            body: "Add a festive-season rush or a big one-off order and see its effect on the whole plan straight away.",
            scene: "demand-spike",
          },
        ],
      },
      {
        id: "bills-of-materials",
        name: "Bills of materials",
        summary: "Every product broken down into the parts and materials it takes to make it.",
        steps: [
          {
            title: "Down to the last screw",
            body: "Build multi-level recipes: a product, its sub-assemblies and their parts, with quantities and expected scrap.",
            scene: "bom-tree",
          },
          {
            title: "Changes without confusion",
            body: "A design change creates a new version with a start date, so the shop floor always builds the right one.",
            scene: "bom-version",
          },
          {
            title: "Substitutes ready",
            body: "Mark alternative parts, so a shortage of one part doesn't stop production.",
            scene: "bom-substitute",
          },
        ],
      },
      {
        id: "inventory",
        name: "Inventory",
        summary: "Live stock across every store and warehouse.",
        steps: [
          {
            title: "Stock you can trust",
            body: "Every receipt, issue and transfer updates stock straight away, across every store and warehouse.",
            scene: "stock-live",
          },
          {
            title: "Reorder before you run out",
            body: "Safety stock and reorder levels flag items before they run short.",
            scene: "stock-reorder",
          },
          {
            title: "Less money stuck on shelves",
            body: "See slow-moving and excess stock, so you can stop buying what you don't need.",
            scene: "stock-excess",
          },
        ],
      },
      {
        id: "material-planning",
        name: "Material planning",
        summary: "Turns demand into exactly what to buy and make, and when.",
        steps: [
          {
            title: "Demand meets the recipe",
            body: "The plan multiplies every order through its bill of materials to work out the total parts needed.",
            scene: "mrp-explode",
          },
          {
            title: "Only what's missing",
            body: "It subtracts stock in hand and orders already placed, then times each purchase by its supplier's lead time.",
            scene: "mrp-net",
          },
          {
            title: "A full plan in seconds",
            body: "Re-plan the whole factory whenever an order changes. The same inputs always give the same plan.",
            scene: "mrp-run",
          },
        ],
      },
      {
        id: "production-scheduling",
        name: "Production scheduling",
        summary: "A realistic schedule for every machine and line.",
        steps: [
          {
            title: "Know your capacity",
            body: "Set up machines, lines and shifts once, and see how busy each one is, week by week.",
            scene: "cap-load",
          },
          {
            title: "Schedule in a few clicks",
            body: "Jobs are placed on machines by due date and priority. Drag one to adjust and the plan updates.",
            scene: "cap-schedule",
          },
          {
            title: "Delivery dates you can keep",
            body: "Sales can see a realistic delivery date before they promise one to a customer.",
            scene: "cap-promise",
          },
        ],
      },
      {
        id: "work-orders",
        name: "Work orders and shop floor",
        summary: "Release jobs to the floor and follow them step by step.",
        steps: [
          {
            title: "Released with materials ready",
            body: "Jobs are released only when their materials are available, with a pick list for the store.",
            scene: "wo-release",
          },
          {
            title: "Progress from the floor",
            body: "Operators record start, finish, output and scrap from a tablet or phone at the machine.",
            scene: "wo-progress",
          },
          {
            title: "The real cost of every job",
            body: "Material and time actually used are compared with the plan, job by job.",
            scene: "wo-cost",
          },
        ],
      },
      {
        id: "quality",
        name: "Quality control",
        summary: "Inspections built into receiving and production, not added on later.",
        steps: [
          {
            title: "Inspect at every stage",
            body: "Incoming goods, parts in production and finished products each get the checklist that suits them.",
            scene: "qc-gates",
          },
          {
            title: "Hold what fails",
            body: "Rejected lots are blocked automatically, so they can't be used or shipped by mistake.",
            scene: "qc-hold",
          },
          {
            title: "Fix the cause",
            body: "Each failure links back to the supplier, the machine or the batch, so the problem is fixed where it started.",
            scene: "qc-cause",
          },
        ],
      },
      {
        id: "reports-alerts",
        name: "Reports and alerts",
        summary: "Know what needs attention today, without digging through screens.",
        steps: [
          {
            title: "One screen for the day",
            body: "Shortages, late orders and overloaded machines are listed in order of urgency.",
            scene: "alert-list",
          },
          {
            title: "Alerts that reach people",
            body: "The right person is notified by email or in the app as soon as something slips.",
            scene: "alert-notify",
          },
          {
            title: "Numbers for leadership",
            body: "On-time delivery, stock value and machine use are tracked over time, ready for the weekly review.",
            scene: "kpi-trend",
          },
        ],
      },
    ],
    window: {
      path: "mrp / suggested-orders",
      sidebar: ["Items", "Product recipes", "Demand", "Planning runs", "Suggested orders", "Needs attention", "Machines", "History"],
      activeItem: "Suggested orders",
      title: "Suggested orders",
      action: "Re-plan",
      columns: ["Number", "Item", "Qty", "Status"],
      rows: [
        { id: "PLN-2211", item: "Gearbox housing, cast", qty: "1,200", state: "Suggested", tone: "neutral" },
        { id: "PLN-2208", item: "Drive shaft, 32 mm", qty: "800", state: "Needs a look", tone: "amber" },
        { id: "PLN-2203", item: "Bearing kit, sealed", qty: "2,400", state: "Confirmed", tone: "mint" },
        { id: "PLN-2197", item: "Motor mount bracket", qty: "600", state: "Released", tone: "blue" },
      ],
    },
  },
];
