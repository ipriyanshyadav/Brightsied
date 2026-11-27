import type { Product } from "@/lib/content/types";

// Written for transport company owners and their operations and accounts teams. Comes in two
// editions: one for fleet owners, one for large transporters working for big shippers.
export const logistics: Product = {
  slug: "logistics",
  name: "Brightseid Logistics Suite",
  shortName: "Logistics",
  tile: "queue",
  tagline: "Every truck, trip and rupee in one place, from the booking to the payment.",
  summary:
    "Run your transport business from one screen: bookings, trips on the road, proof of delivery, billing, payments to brokers and drivers, and the cost of running every truck. Know where each truck is, what each trip earned and who still owes you money.",
  status: "Demo available",
  audience: ["Transport companies", "Fleet owners", "Transporters working for e-commerce and large shippers"],
  features: [
    { title: "Every truck on one map", body: "Live location, expected arrival and trips running late, without phoning the driver." },
    { title: "Bill the day it's delivered", body: "Proof of delivery is collected on the driver's phone, so finished trips can be billed straight away." },
    { title: "Hired trucks, checked first", body: "Registration, insurance and driving licence are checked against government records before the trip." },
    { title: "Payments with a second pair of eyes", body: "Advances, balances, settlements and salaries are approved before any money goes out." },
    { title: "Profit per trip and per month", body: "Fuel, tolls, repairs and hire costs set against what each trip earned." },
    { title: "Ask in plain words", body: "Type a question like “which trips are still waiting for proof of delivery?” and get the answer." },
  ],
  rules: [
    "Every payment approved before it's made",
    "Every change to a trip recorded: who, when and what",
    "Your data kept separate from every other company's",
  ],
  steps: [
    {
      title: "A booking comes in",
      body: "Customers' bookings arrive one at a time or as a spreadsheet, and become orders your team can plan.",
      scene: "lg-book-in",
    },
    {
      title: "The right truck, papers checked",
      body: "Pick your own truck or hire one. Registration, insurance and the driver's licence are checked before it leaves.",
      scene: "lg-veh-check",
    },
    {
      title: "Tracked all the way",
      body: "See where every truck is and when it will arrive. Trips running late show up before the customer calls.",
      scene: "lg-trip-live",
    },
    {
      title: "Proof of delivery, same day",
      body: "The driver photographs the signed delivery note. The original is tracked until it reaches the customer.",
      scene: "lg-pod-scan",
    },
    {
      title: "Billed, paid and counted",
      body: "Finished trips become GST invoices in a few clicks, and every trip's profit shows up in your monthly numbers.",
      scene: "lg-bill-bundle",
    },
  ],
  modules: [
    {
      id: "bookings",
      name: "Bookings and orders",
      summary: "Customer bookings become planned trips, one at a time or a whole sheet at once.",
      steps: [
        {
          title: "Bookings from every customer",
          body: "Take a booking in a form or upload a spreadsheet of hundreds. Origin, destination, truck type and date are filled in for you.",
          scene: "lg-book-in",
        },
        {
          title: "Give it a truck",
          body: "Assign one of your trucks or a hired one in a click. The order becomes a trip, ready to roll.",
          scene: "lg-book-assign",
        },
        {
          title: "Nothing lost, nothing changed quietly",
          body: "Cancelled and changed orders stay on record with who did it and when, so disputes are settled with facts.",
          scene: "lg-book-log",
        },
      ],
    },
    {
      id: "trips",
      name: "Trips and live tracking",
      summary: "Where every truck is, when it will arrive and which trips need attention.",
      steps: [
        {
          title: "Every truck on the map",
          body: "Location from GPS and toll crossings, with the expected arrival time, for every trip on the road.",
          scene: "lg-trip-live",
        },
        {
          title: "Each stage, as it happens",
          body: "Loading, in transit, unloading, delivered. Arrival and departure at your hubs are recorded automatically.",
          scene: "lg-trip-stages",
        },
        {
          title: "Late trips flagged early",
          body: "Trips falling behind are flagged to your operations team while there's still time to tell the customer.",
          scene: "lg-trip-late",
        },
      ],
    },
    {
      id: "proof-of-delivery",
      name: "Proof of delivery",
      summary: "Delivery proof collected, checked and handed over, so you can bill sooner.",
      steps: [
        {
          title: "Photographed on delivery",
          body: "The driver takes a photo of the signed delivery note on their phone. It's attached to the trip at once.",
          scene: "lg-pod-scan",
        },
        {
          title: "The original, tracked too",
          body: "Follow each delivery note from photo, to original received at your office, to handed over to the customer.",
          scene: "lg-pod-stages",
        },
        {
          title: "See what's holding up billing",
          body: "A count of trips at every stage shows which delivery notes to chase, so payment isn't held up.",
          scene: "lg-pod-pending",
        },
      ],
    },
    {
      id: "vehicles",
      name: "Hired trucks, drivers and brokers",
      summary: "Hire trucks with confidence: papers checked, bids compared, approvals on record.",
      steps: [
        {
          title: "Papers checked before the trip",
          body: "Registration, insurance, fitness and the driver's licence are collected for every hired truck.",
          scene: "lg-veh-check",
        },
        {
          title: "Checked against government records",
          body: "Licences and vehicle papers are verified with official records, including blacklist status and challans.",
          scene: "lg-veh-verify",
        },
        {
          title: "Compare brokers' bids",
          body: "See bids from several brokers side by side and approve the best one. Every approval is recorded.",
          scene: "lg-veh-bid",
        },
      ],
    },
    {
      id: "contracts",
      name: "Contracts and rate cards",
      summary: "Agreed rates for every customer and route, so every trip is priced the same way.",
      steps: [
        {
          title: "Contracts in one place",
          body: "Each customer's rates, payment terms and service promises are saved once and used everywhere.",
          scene: "lg-rate-card",
        },
        {
          title: "A rate for every route",
          body: "Keep rates per route and per truck type, updated month by month as fuel prices change.",
          scene: "lg-rate-lanes",
        },
        {
          title: "Priced without arguments",
          body: "Each trip picks up the agreed rate automatically, so the bill matches the contract.",
          scene: "lg-rate-apply",
        },
      ],
    },
    {
      id: "billing",
      name: "Billing and collections",
      summary: "Finished trips become GST invoices, and you always know who owes what.",
      steps: [
        {
          title: "Trips into invoices",
          body: "Pick a customer, tick the finished trips and generate a GST invoice with loading, waiting and other charges.",
          scene: "lg-bill-bundle",
        },
        {
          title: "Payments recorded against bills",
          body: "Record what each customer paid, including tax deducted, and the balance updates on its own.",
          scene: "lg-bill-collect",
        },
        {
          title: "Who still owes you",
          body: "Money owed by every customer at a glance, with overdue amounts flagged for follow-up.",
          scene: "lg-bill-owed",
        },
      ],
    },
    {
      id: "payments",
      name: "Broker, driver and staff payments",
      summary: "Advances, balances, driver settlements and salaries, each approved before it's paid.",
      steps: [
        {
          title: "Approved, then paid",
          body: "Advance and balance payments to brokers wait for approval. Once approved, they're paid and recorded.",
          scene: "lg-pay-advance",
        },
        {
          title: "Fair driver settlements",
          body: "Fuel, tolls and cash given on the road are set against each driver's trips for a clean settlement.",
          scene: "lg-pay-driver",
        },
        {
          title: "Bank statements matched",
          body: "Upload a bank statement and payments are matched to bills and trips, so the books close faster.",
          scene: "lg-pay-bank",
        },
      ],
    },
    {
      id: "fleet-costs",
      name: "Fleet costs and maintenance",
      summary: "What each of your own trucks costs to run, per trip and per kilometre.",
      steps: [
        {
          title: "Cost per kilometre",
          body: "Fuel, tolls, repairs and other spending for each truck, turned into a running cost per kilometre.",
          scene: "lg-cost-km",
        },
        {
          title: "Repairs and servicing",
          body: "Log every repair and service. Trucks due for a service are flagged before they break down.",
          scene: "lg-cost-repair",
        },
        {
          title: "Every toll matched",
          body: "FASTag toll charges are matched to the trips that caused them, so nothing is paid twice or missed.",
          scene: "lg-cost-toll",
        },
      ],
    },
    {
      id: "alerts",
      name: "Safety alerts and company rules",
      summary: "Alerts for route changes, long stops and speeding, and rules that keep everyone in line.",
      steps: [
        {
          title: "Off-route trucks flagged",
          body: "If a truck leaves its planned route, your team is alerted straight away.",
          scene: "lg-alert-route",
        },
        {
          title: "Long stops and speeding",
          body: "Stops longer than you allow and over-speeding raise an alert. You set the limits.",
          scene: "lg-alert-stop",
        },
        {
          title: "Rules for the whole company",
          body: "Switch on rules like “no trip closed before the advance is received”. They apply to every user, every time.",
          scene: "lg-alert-rules",
        },
      ],
    },
    {
      id: "profit-reports",
      name: "Profit, reports and assistant",
      summary: "Monthly profit, ready-made reports and answers to questions in plain words.",
      steps: [
        {
          title: "Profit every month",
          body: "Revenue, costs and profit for the month, split by hired trucks, your own fleet and overheads.",
          scene: "lg-pnl",
        },
        {
          title: "Reports in one click",
          body: "Trip, profit and payment reports for any date range, ready to download and share.",
          scene: "lg-report",
        },
        {
          title: "Just ask",
          body: "Ask “top five customers this month” or “trips waiting for proof of delivery” and get the answer, or be taken to the right page.",
          scene: "lg-ask",
        },
      ],
    },
  ],
  editions: [
    {
      name: "Fleet edition",
      bestFor: "Fleet owners and transport companies running their own and hired trucks.",
      summary:
        "Trips, proof of delivery, billing and payments, with running costs for your own trucks, government record checks and an assistant you can ask in plain words.",
      modules: ["trips", "proof-of-delivery", "vehicles", "billing", "payments", "fleet-costs", "alerts", "profit-reports"],
    },
    {
      name: "Enterprise edition",
      bestFor: "Large transporters moving freight for e-commerce companies and big shippers.",
      summary:
        "High-volume bookings, contracts and rate cards, hub arrival and departure tracking, broker bids, staff salaries and bank matching across many branches.",
      modules: ["bookings", "trips", "vehicles", "contracts", "billing", "payments", "fleet-costs", "alerts", "profit-reports"],
    },
  ],
  window: {
    path: "logistics / trips",
    sidebar: ["Bookings", "Trips", "Proof of delivery", "Billing", "Payments", "Trucks", "Drivers", "Reports"],
    activeItem: "Trips",
    title: "Trips on the road",
    action: "New trip",
    columns: ["Trip", "Route", "Truck", "Status"],
    rows: [
      { id: "TR-1124", item: "Panipat → Lucknow", qty: "32 ft", state: "Running late", tone: "amber" },
      { id: "TR-1123", item: "Gurgaon → Jaipur", qty: "24 ft", state: "In transit", tone: "blue" },
      { id: "TR-1121", item: "Bhiwandi → Pune", qty: "32 ft", state: "Delivered", tone: "mint" },
      { id: "TR-1118", item: "Kolkata → Ranchi", qty: "20 ft", state: "Loading", tone: "neutral" },
    ],
  },
};
