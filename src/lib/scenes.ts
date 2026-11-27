import type { TileKind } from "@/components/ui/GlossyTile";

// The little scenes that play beside each product step: who is involved, what moves where.
// One description drives both the 2D stage (shown first, and kept on reduced-motion and
// low-power devices) and the live 3D stage drawn into the same box (StepStage.tsx).
//
// Coordinates are in stage units: the stage is STAGE_W wide and STAGE_H tall, with (0, 0) at
// its centre, x to the right and y up. Colours are tile palettes (GlossyTile.tsx), so the
// scenes share the look of every other 3D object on the site. Steps in the CMS pick a scene
// by key; an actor that keeps its id from one step to the next glides to its new place.

export const STAGE_W = 3.6;
export const STAGE_H = 2.7;

export type ActorType = "tile" | "card" | "crate" | "bar" | "badge" | "person" | "gear" | "truck" | "phone";
export type BadgeIcon = "check" | "alert" | "lock" | "clock" | "pin";

export type Actor = {
  id: string;
  type: ActorType;
  /** Centre of the actor; for bars, the middle of the bar's base. */
  at: [number, number];
  /** Width in stage units. */
  size: number;
  /** Bar height in stage units. */
  h?: number;
  /** Colour, as a tile palette. For tiles, the tile itself. */
  tone: TileKind;
  icon?: BadgeIcon;
  label?: string;
  /** Put the label beside the actor instead of under it. */
  side?: "right";
  /** Pushed back and faded: present, but not what this step is about. */
  dim?: boolean;
  /** Resting turn in degrees. */
  rot?: number;
};

export type Beat = { actors: Actor[]; flows: [string, string][] };

type Opts = Partial<Pick<Actor, "size" | "label" | "side" | "dim" | "rot">>;

const SIZE: Record<ActorType, number> = { tile: 0.7, card: 0.55, crate: 0.42, bar: 0.28, badge: 0.32, person: 0.5, gear: 0.7, truck: 0.8, phone: 0.36 };
const BADGE_TONE: Record<BadgeIcon, TileKind> = { check: "audit", alert: "queue", lock: "agents", clock: "docs", pin: "api" };

const make = (type: ActorType) => (id: string, tone: TileKind, x: number, y: number, o: Opts = {}): Actor => ({
  id,
  type,
  tone,
  at: [x, y],
  size: SIZE[type],
  ...o,
});
const tile = make("tile");
const card = make("card");
const crate = make("crate");
const person = make("person");
const gear = make("gear");
const truck = make("truck");
const phone = make("phone");
const bar = (id: string, tone: TileKind, x: number, base: number, h: number, o: Opts = {}): Actor => ({ ...make("bar")(id, tone, x, base, o), h });
const badge = (id: string, icon: BadgeIcon, x: number, y: number, o: Opts = {}): Actor => ({ ...make("badge")(id, BADGE_TONE[icon], x, y, o), icon });

const BASE = -0.8;

const beats = {
  // Source-to-Pay · purchase requests
  "request-create": {
    actors: [person("you", "docs", -1.1, 0.1, { label: "You" }), card("req", "docs", 0.7, 0.1, { size: 0.62, label: "Purchase request" })],
    flows: [["you", "req"]],
  },
  "request-budget": {
    actors: [
      card("req", "docs", -1.0, 0.1, { label: "Purchase request" }),
      bar("budget", "db", 0.5, BASE, 1.5, { label: "Budget" }),
      bar("used", "audit", 1.1, BASE, 1.0, { label: "Used" }),
      badge("ok", "check", 1.1, 0.55),
    ],
    flows: [["req", "used"]],
  },
  "request-track": {
    actors: [
      person("manager", "vectors",-1.2, 0.45, { size: 0.42, label: "Manager" }),
      person("finance", "docs", 0, 0.45, { size: 0.42, label: "Finance" }),
      person("buyer", "db", 1.2, 0.45, { size: 0.42, label: "Buyer", dim: true }),
      badge("ok", "check", -1.2, 1.05),
      badge("wait", "clock", 0, 1.05),
      card("req", "docs", 0, -0.65, { size: 0.42, label: "Your request" }),
    ],
    flows: [["manager", "finance"]],
  },

  // Source-to-Pay · approvals
  "approval-rules": {
    actors: [
      card("policy", "vectors", -1.0, 0.1, { size: 0.62, label: "Your rules" }),
      person("manager", "docs", 0.9, 0.85, { size: 0.38, label: "Manager" }),
      person("finance", "vectors", 0.9, 0, { size: 0.38, label: "Finance" }),
      person("director", "agents", 0.9, -0.85, { size: 0.38, label: "Director" }),
    ],
    flows: [
      ["policy", "manager"],
      ["policy", "finance"],
      ["policy", "director"],
    ],
  },
  "approval-tap": {
    actors: [
      card("req", "docs", -1.0, 0.1, { label: "Request" }),
      person("manager", "docs", 0.7, 0.1, { size: 0.56, label: "Manager" }),
      badge("ok", "check", 1.05, 0.6),
    ],
    flows: [["req", "manager"]],
  },
  "approval-record": {
    actors: [
      person("maker", "db", -1.3, 0.15, { label: "Made by" }),
      person("manager", "docs", -0.1, 0.15, { label: "Checked by" }),
      badge("ok", "check", -0.1, 0.75),
      tile("log", "audit", 1.15, 0.15, { label: "Permanent record" }),
    ],
    flows: [
      ["maker", "manager"],
      ["manager", "log"],
    ],
  },

  // Source-to-Pay · vendors
  "vendor-onboard": {
    actors: [
      person("vendor", "queue", -1.3, 0.1, { label: "Vendor" }),
      card("gst", "docs", -0.1, 0.75, { size: 0.34, label: "GST" }),
      card("pan", "vectors", -0.1, 0.05, { size: 0.34, label: "PAN" }),
      card("bank", "audit", -0.1, -0.65, { size: 0.34, label: "Bank" }),
      tile("list", "db", 1.2, 0.1, { label: "Vendor list" }),
    ],
    flows: [
      ["vendor", "pan"],
      ["pan", "list"],
    ],
  },
  "vendor-verify": {
    actors: [
      card("gst", "docs", -1.1, -0.15, { size: 0.5, label: "GST" }),
      card("pan", "vectors", 0, -0.15, { size: 0.5, label: "PAN" }),
      card("bank", "audit", 1.1, -0.15, { size: 0.5, label: "Bank" }),
      badge("c1", "check", -1.1, 0.55),
      badge("c2", "check", 0, 0.55),
      badge("c3", "alert", 1.1, 0.55),
    ],
    flows: [],
  },
  "vendor-rate": {
    actors: [
      bar("ra", "audit", -0.8, BASE, 1.5, { label: "Vendor A" }),
      bar("rb", "docs", 0, BASE, 1.0, { label: "Vendor B" }),
      bar("rc", "db", 0.8, BASE, 0.6, { label: "Vendor C" }),
      badge("c1", "check", -0.8, 0.98),
    ],
    flows: [],
  },

  // Source-to-Pay · quotes and sealed bids
  "rfq-invite": {
    actors: [
      card("rfq", "api", -1.0, 0.1, { size: 0.62, label: "Request for quote" }),
      person("va", "queue", 0.9, 0.85, { size: 0.38, label: "Vendor A" }),
      person("vb", "vectors", 0.9, 0, { size: 0.38, label: "Vendor B" }),
      person("vc", "audit", 0.9, -0.85, { size: 0.38, label: "Vendor C" }),
    ],
    flows: [
      ["rfq", "va"],
      ["rfq", "vb"],
      ["rfq", "vc"],
    ],
  },
  "rfq-sealed": {
    actors: [
      card("ba", "queue", -1.1, -0.1, { size: 0.5, label: "Bid A" }),
      card("bb", "vectors", 0, -0.1, { size: 0.5, label: "Bid B" }),
      card("bc", "audit", 1.1, -0.1, { size: 0.5, label: "Bid C" }),
      badge("la", "lock", -1.1, 0.6),
      badge("lb", "lock", 0, 0.6),
      badge("lc", "lock", 1.1, 0.6),
    ],
    flows: [],
  },
  "rfq-open": {
    actors: [
      card("ba", "queue", -1.35, 0, { size: 0.44, label: "Bid A" }),
      card("bb", "vectors", -0.55, 0, { size: 0.44, label: "Bid B" }),
      card("bc", "audit", 0.25, 0, { size: 0.44, label: "Bid C" }),
      badge("la", "check", -1.35, 0.6),
      badge("lb", "check", -0.55, 0.6),
      badge("lc", "check", 0.25, 0.6),
      tile("log", "audit", 1.35, 0, { size: 0.6, label: "Opening logged" }),
    ],
    flows: [["bc", "log"]],
  },

  // Source-to-Pay · quote comparison
  "compare-normalise": {
    actors: [
      card("qa", "api", -1.35, 0.6, { size: 0.4, rot: -8, label: "₹ per kg" }),
      card("qb", "vectors", -1.25, -0.55, { size: 0.4, rot: 6, label: "$ per tonne" }),
      card("qc", "queue", -0.3, 0.05, { size: 0.4, rot: -3, label: "₹ per piece" }),
      card("table", "docs", 1.05, 0.05, { size: 0.72, label: "One comparison" }),
    ],
    flows: [
      ["qa", "table"],
      ["qb", "table"],
      ["qc", "table"],
    ],
  },
  "compare-total": {
    actors: [
      card("table", "docs", -1.25, 0.1, { size: 0.55, label: "Comparison" }),
      bar("va", "api", -0.2, BASE, 1.3, { label: "Vendor A" }),
      bar("vb", "audit", 0.5, BASE, 0.9, { label: "Vendor B" }),
      bar("vc", "vectors", 1.2, BASE, 1.1, { label: "Vendor C" }),
    ],
    flows: [],
  },
  "compare-decide": {
    actors: [
      tile("log", "audit", -1.15, 0.1, { label: "Reason saved" }),
      bar("va", "api", -0.2, BASE, 1.3, { label: "Vendor A", dim: true }),
      bar("vb", "audit", 0.5, BASE, 0.9, { label: "Vendor B" }),
      bar("vc", "vectors", 1.2, BASE, 1.1, { label: "Vendor C", dim: true }),
      badge("ok", "check", 0.5, 0.4),
    ],
    flows: [["vb", "log"]],
  },

  // Source-to-Pay · purchase orders and contracts
  "po-create": {
    actors: [card("quote", "vectors", -1.0, 0.1, { label: "Winning quote" }), card("po", "docs", 0.9, 0.1, { size: 0.66, label: "Purchase order" })],
    flows: [["quote", "po"]],
  },
  "po-check": {
    actors: [
      card("po", "docs", -1.25, 0.1, { label: "Purchase order" }),
      person("checker", "vectors", 0, 0.1, { label: "Checker" }),
      badge("ok", "check", 0, 0.72),
      person("vendor", "queue", 1.25, 0.1, { label: "Vendor" }),
    ],
    flows: [
      ["po", "checker"],
      ["checker", "vendor"],
    ],
  },
  "po-contract": {
    actors: [
      card("v1", "db", -1.25, 0.3, { size: 0.5, dim: true }),
      card("v2", "db", -0.9, 0.12, { size: 0.5, dim: true }),
      card("v3", "docs", -0.55, -0.06, { size: 0.5, label: "Current contract" }),
      badge("remind", "clock", 1.0, 0.1, { size: 0.5, label: "Renewal reminder" }),
    ],
    flows: [["v3", "remind"]],
  },

  // Source-to-Pay · invoice matching
  "invoice-receive": {
    actors: [
      crate("c1", "queue", -1.35, -0.35),
      crate("c2", "queue", -0.9, -0.35, { label: "Goods delivered" }),
      crate("c3", "queue", -1.12, 0.08),
      card("grn", "audit", 0.95, 0.05, { label: "Goods receipt" }),
    ],
    flows: [["c2", "grn"]],
  },
  "invoice-match": {
    actors: [
      card("po", "docs", -1.15, 0.1, { label: "Order" }),
      card("grn", "audit", 0, 0.1, { label: "Receipt" }),
      card("inv", "api", 1.15, 0.1, { label: "Invoice" }),
    ],
    flows: [
      ["po", "grn"],
      ["inv", "grn"],
    ],
  },
  "invoice-pay": {
    actors: [
      card("po", "docs", -1.45, 0.05, { size: 0.46, dim: true }),
      card("grn", "audit", -1.15, 0.05, { size: 0.46, dim: true }),
      card("inv", "api", -0.85, 0.05, { size: 0.46, label: "Matched invoice" }),
      badge("ok", "check", -0.85, 0.6),
      tile("pay", "audit", 0.95, 0.05, { label: "Sent for payment" }),
    ],
    flows: [["inv", "pay"]],
  },

  // Source-to-Pay · spend analytics
  "spend-rollup": {
    actors: [
      card("pos", "docs", -1.4, 0.55, { size: 0.36, label: "Orders" }),
      card("invs", "api", -1.4, -0.4, { size: 0.36, label: "Invoices" }),
      bar("m1", "docs", -0.3, BASE, 0.6, { label: "Aug" }),
      bar("m2", "docs", 0.2, BASE, 0.9, { label: "Sep" }),
      bar("m3", "docs", 0.7, BASE, 0.8, { label: "Oct" }),
      bar("m4", "docs", 1.2, BASE, 1.15, { label: "Nov" }),
    ],
    flows: [
      ["pos", "m1"],
      ["invs", "m1"],
    ],
  },
  "spend-savings": {
    actors: [
      bar("m1", "docs", -0.9, BASE, 0.6, { label: "Office", dim: true }),
      bar("m2", "docs", -0.3, BASE, 0.9, { label: "Travel", dim: true }),
      bar("m3", "docs", 0.3, BASE, 0.8, { label: "Packing", dim: true }),
      bar("m4", "queue", 0.9, BASE, 1.5, { label: "Steel" }),
      badge("alert", "alert", 0.9, 0.98),
    ],
    flows: [],
  },
  "spend-report": {
    actors: [
      card("report", "docs", -0.9, 0.1, { size: 0.62, label: "Weekly summary" }),
      person("lead", "agents", 0.9, 0.6, { size: 0.4, label: "Leadership" }),
      person("fin", "vectors", 0.9, -0.45, { size: 0.4, label: "Finance" }),
    ],
    flows: [
      ["report", "lead"],
      ["report", "fin"],
    ],
  },

  // MRP · demand planning
  "demand-collect": {
    actors: [
      card("o1", "docs", -1.35, 0.55, { size: 0.36, rot: -6 }),
      card("o2", "docs", -1.25, -0.35, { size: 0.36, rot: 4, label: "Sales orders" }),
      bar("w1", "vectors", -0.2, BASE, 0.6, { label: "W1" }),
      bar("w2", "vectors", 0.3, BASE, 0.85, { label: "W2" }),
      bar("w3", "vectors", 0.8, BASE, 0.7, { label: "W3" }),
      bar("w4", "vectors", 1.3, BASE, 1.0, { label: "W4" }),
    ],
    flows: [["o2", "w1"]],
  },
  "demand-forecast": {
    actors: [
      tile("model", "vectors", -1.3, 0.2, { size: 0.6, label: "Forecast" }),
      bar("w1", "vectors", -0.5, BASE, 0.6, { label: "W1" }),
      bar("w2", "vectors", -0.1, BASE, 0.85, { label: "W2" }),
      bar("w3", "vectors", 0.3, BASE, 0.7, { label: "W3" }),
      bar("w4", "vectors", 0.7, BASE, 1.0, { label: "W4" }),
      bar("w5", "db", 1.1, BASE, 1.05, { label: "W5" }),
      bar("w6", "db", 1.5, BASE, 1.15, { label: "W6" }),
    ],
    flows: [["model", "w5"]],
  },
  "demand-spike": {
    actors: [
      bar("w1", "vectors", -1.2, BASE, 0.6, { label: "W1", dim: true }),
      bar("w2", "vectors", -0.7, BASE, 0.85, { label: "W2", dim: true }),
      bar("w3", "vectors", -0.2, BASE, 0.7, { label: "W3", dim: true }),
      bar("w4", "vectors", 0.3, BASE, 1.0, { label: "W4", dim: true }),
      bar("w5", "queue", 0.8, BASE, 1.6, { label: "Festive" }),
      bar("w6", "db", 1.3, BASE, 1.15, { label: "W6", dim: true }),
      badge("alert", "alert", 0.8, 1.05),
    ],
    flows: [],
  },

  // MRP · bills of materials
  "bom-tree": {
    actors: [
      crate("prod", "docs", 0, 0.8, { size: 0.5, label: "Pump" }),
      crate("a", "vectors", -0.8, 0, { size: 0.4, label: "Motor" }),
      crate("b", "audit", 0.8, 0, { size: 0.4, label: "Housing" }),
      crate("l1", "db", -1.25, -0.85, { size: 0.3, label: "Coil" }),
      crate("l2", "db", -0.35, -0.85, { size: 0.3, label: "Shaft" }),
      crate("l3", "db", 0.8, -0.85, { size: 0.3, label: "Casting" }),
    ],
    flows: [
      ["prod", "a"],
      ["prod", "b"],
      ["a", "l1"],
      ["a", "l2"],
      ["b", "l3"],
    ],
  },
  "bom-version": {
    actors: [
      card("v1", "db", -0.75, 0.1, { size: 0.6, label: "Version 1", dim: true }),
      card("v2", "docs", 0.6, 0.1, { size: 0.66, label: "Version 2, from Monday" }),
      badge("ok", "check", 0.6, 0.75),
    ],
    flows: [["v1", "v2"]],
  },
  "bom-substitute": {
    actors: [
      crate("pa", "api", -0.9, 0.05, { size: 0.5, label: "Part A, short" }),
      badge("short", "alert", -0.9, 0.6),
      crate("pb", "audit", 0.9, 0.05, { size: 0.5, label: "Substitute B" }),
      badge("ok", "check", 0.9, 0.6),
    ],
    flows: [["pa", "pb"]],
  },

  // MRP · inventory
  "stock-live": {
    actors: [
      crate("s1", "queue", -1.35, -0.25),
      crate("s2", "queue", -0.9, -0.25, { label: "Store A" }),
      crate("s3", "queue", -1.12, 0.18),
      crate("w1", "docs", 0.85, -0.25),
      crate("w2", "docs", 1.3, -0.25, { label: "Warehouse B" }),
    ],
    flows: [["s2", "w1"]],
  },
  "stock-reorder": {
    actors: [
      bar("i1", "docs", -0.9, BASE, 1.2, { label: "Bolts" }),
      bar("i2", "docs", -0.3, BASE, 1.0, { label: "Bearings" }),
      bar("i3", "queue", 0.3, BASE, 0.3, { label: "Seals" }),
      bar("i4", "docs", 0.9, BASE, 0.9, { label: "Belts" }),
      badge("alert", "alert", 0.3, -0.25),
    ],
    flows: [],
  },
  "stock-excess": {
    actors: [
      crate("s1", "queue", -1.1, -0.45, { dim: true }),
      crate("s2", "queue", -0.65, -0.45, { dim: true, label: "Unused for 6 months" }),
      crate("s3", "queue", -0.87, -0.02, { dim: true }),
      badge("alert", "alert", -0.87, 0.48),
      crate("w1", "docs", 0.75, -0.45),
      crate("w2", "docs", 1.2, -0.45, { label: "Moving fast" }),
      badge("ok", "check", 0.97, 0.05),
    ],
    flows: [],
  },

  // MRP · material planning
  "mrp-explode": {
    actors: [
      card("demand", "docs", -1.35, 0.1, { size: 0.5, label: "100 pumps ordered" }),
      crate("prod", "docs", 0.25, 0.7, { size: 0.45, label: "100 pumps" }),
      crate("m1", "vectors", -0.35, -0.4, { size: 0.36, label: "100 motors" }),
      crate("m2", "audit", 0.5, -0.4, { size: 0.36, label: "200 seals" }),
      crate("m3", "db", 1.35, -0.4, { size: 0.36, label: "800 screws" }),
    ],
    flows: [
      ["demand", "prod"],
      ["prod", "m1"],
      ["prod", "m2"],
      ["prod", "m3"],
    ],
  },
  "mrp-net": {
    actors: [
      bar("need", "docs", -0.9, BASE, 1.5, { label: "Needed" }),
      bar("have", "audit", -0.3, BASE, 0.85, { label: "In stock" }),
      bar("open", "db", 0.3, BASE, 0.35, { label: "On order" }),
      bar("buy", "queue", 0.9, BASE, 0.3, { label: "To buy" }),
      badge("ok", "check", 0.9, -0.2),
    ],
    flows: [],
  },
  "mrp-run": {
    actors: [
      gear("engine", "docs", -0.65, 0.1, { size: 0.8, label: "Planning run" }),
      badge("time", "clock", -0.65, 0.85, { size: 0.28 }),
      card("plan", "audit", 0.95, 0.1, { size: 0.6, label: "Plan ready" }),
      badge("ok", "check", 0.95, 0.75),
    ],
    flows: [["engine", "plan"]],
  },

  // MRP · production scheduling
  "cap-load": {
    actors: [
      bar("m1", "docs", -0.9, BASE, 0.8, { label: "Press 1" }),
      bar("m2", "docs", -0.3, BASE, 1.2, { label: "Press 2" }),
      bar("m3", "api", 0.3, BASE, 1.7, { label: "Lathe" }),
      bar("m4", "docs", 0.9, BASE, 0.5, { label: "Paint" }),
      badge("alert", "alert", 0.3, 1.15),
    ],
    flows: [],
  },
  "cap-schedule": {
    actors: [
      gear("g1", "docs", -0.8, 0.45, { size: 0.55, label: "Press 1" }),
      gear("g2", "api", 0.8, 0.45, { size: 0.55, label: "Lathe" }),
      card("j1", "vectors", -0.8, -0.65, { size: 0.32, label: "Job 14" }),
      card("j3", "db", 0, -0.65, { size: 0.32, label: "Job 16", dim: true }),
      card("j2", "queue", 0.8, -0.65, { size: 0.32, label: "Job 15" }),
    ],
    flows: [
      ["j1", "g1"],
      ["j2", "g2"],
    ],
  },
  "cap-promise": {
    actors: [
      card("order", "docs", -1.15, 0.1, { label: "Customer order" }),
      badge("date", "clock", 0.05, 0.1, { size: 0.5, label: "Realistic date" }),
      person("customer", "queue", 1.25, 0.1, { label: "Customer" }),
      badge("ok", "check", 1.25, 0.72),
    ],
    flows: [
      ["order", "date"],
      ["date", "customer"],
    ],
  },

  // MRP · work orders
  "wo-release": {
    actors: [
      card("wo", "docs", -1.0, 0.1, { size: 0.6, label: "Work order" }),
      crate("k1", "queue", 0.6, -0.3),
      crate("k2", "queue", 1.05, -0.3, { label: "Materials ready" }),
      crate("k3", "queue", 0.82, 0.13),
      badge("ok", "check", 0.82, 0.62),
    ],
    flows: [["k1", "wo"]],
  },
  "wo-progress": {
    actors: [
      gear("machine", "api", -0.95, 0.15, { size: 0.75, label: "Machine" }),
      person("op", "docs", 0.3, 0.15, { label: "Operator" }),
      card("wo", "docs", 1.35, 0.15, { size: 0.44, label: "Updated" }),
    ],
    flows: [
      ["machine", "op"],
      ["op", "wo"],
    ],
  },
  "wo-cost": {
    actors: [
      bar("p1", "db", -0.9, BASE, 1.0, { label: "Plan" }),
      bar("a1", "queue", -0.45, BASE, 1.25, { label: "Actual" }),
      badge("over", "alert", -0.45, 0.7),
      bar("p2", "db", 0.55, BASE, 0.9, { label: "Plan" }),
      bar("a2", "audit", 1.0, BASE, 0.85, { label: "Actual" }),
      badge("ok", "check", 1.0, 0.3),
    ],
    flows: [],
  },

  // MRP · quality
  "qc-gates": {
    actors: [
      crate("q1", "queue", -1.3, -0.1, { size: 0.46, label: "Incoming" }),
      crate("q2", "docs", 0, -0.1, { size: 0.46, label: "In process" }),
      crate("q3", "audit", 1.3, -0.1, { size: 0.46, label: "Finished" }),
      badge("c1", "check", -1.3, 0.5),
      badge("c2", "check", 0, 0.5),
      badge("c3", "check", 1.3, 0.5),
    ],
    flows: [
      ["q1", "q2"],
      ["q2", "q3"],
    ],
  },
  "qc-hold": {
    actors: [
      crate("q2", "api", -0.45, -0.05, { size: 0.6, label: "Rejected lot" }),
      badge("c2", "lock", -0.45, 0.65),
      crate("q3", "audit", 1.0, -0.1, { size: 0.46, label: "Cleared", dim: true }),
    ],
    flows: [],
  },
  "qc-cause": {
    actors: [
      crate("q2", "api", -1.15, 0.05, { size: 0.5, label: "Rejected lot" }),
      person("supplier", "queue", 0.7, 0.7, { size: 0.4, label: "Supplier" }),
      gear("machine", "docs", 0.7, -0.5, { size: 0.48, label: "Machine 3" }),
      badge("found", "alert", 1.25, 0.85),
    ],
    flows: [
      ["q2", "supplier"],
      ["q2", "machine"],
    ],
  },

  // MRP · reports and alerts
  "alert-list": {
    actors: [
      badge("a1", "alert", -1.4, 0.75, { label: "Seals running short", side: "right" }),
      badge("a2", "clock", -1.4, 0.05, { label: "Order 112 running late", side: "right" }),
      badge("a3", "alert", -1.4, -0.65, { label: "Lathe overloaded", side: "right" }),
      card("today", "docs", 1.2, 0.05, { size: 0.6, label: "Today" }),
    ],
    flows: [],
  },
  "alert-notify": {
    actors: [
      badge("a1", "alert", -1.0, 0.1, { size: 0.5, label: "Seals running short" }),
      person("buyer", "docs", 0.9, 0.65, { size: 0.4, label: "Buyer" }),
      person("planner", "vectors", 0.9, -0.45, { size: 0.4, label: "Planner" }),
    ],
    flows: [
      ["a1", "buyer"],
      ["a1", "planner"],
    ],
  },
  "kpi-trend": {
    actors: [
      bar("k1", "audit", -1.0, BASE, 0.5, { label: "Jul" }),
      bar("k2", "audit", -0.5, BASE, 0.7, { label: "Aug" }),
      bar("k3", "audit", 0, BASE, 0.8, { label: "Sep" }),
      bar("k4", "audit", 0.5, BASE, 1.0, { label: "Oct" }),
      bar("k5", "audit", 1.0, BASE, 1.35, { label: "Nov" }),
      badge("ok", "check", 1.0, 0.8),
    ],
    flows: [],
  },

  // Logistics Suite · bookings
  "lg-book-in": {
    actors: [
      person("customer", "docs", -1.35, 0.1, { label: "Customer" }),
      card("booking", "queue", -0.05, 0.7, { size: 0.36, label: "Booking" }),
      card("sheet", "audit", -0.05, -0.55, { size: 0.36, label: "Bulk upload" }),
      tile("orders", "queue", 1.25, 0.1, { label: "Orders" }),
    ],
    flows: [
      ["customer", "booking"],
      ["booking", "orders"],
      ["sheet", "orders"],
    ],
  },
  "lg-book-assign": {
    actors: [
      card("order", "queue", -1.2, 0.1, { size: 0.5, label: "Order" }),
      truck("truck", "queue", 0.6, 0.1, { size: 1.0, label: "32 ft truck" }),
      badge("ok", "check", 1.0, 0.65),
    ],
    flows: [["order", "truck"]],
  },
  "lg-book-log": {
    actors: [
      person("planner", "docs", -1.3, 0.1, { label: "Planner" }),
      card("order", "queue", 0, 0.1, { size: 0.5, label: "Order" }),
      tile("history", "audit", 1.25, 0.1, { label: "Order history" }),
    ],
    flows: [
      ["planner", "order"],
      ["order", "history"],
    ],
  },

  // Logistics Suite · trips and tracking
  "lg-trip-live": {
    actors: [
      badge("from", "pin", -1.4, -0.45, { label: "Panipat" }),
      truck("truck", "queue", 0, 0.35, { size: 0.9, label: "On the way, ETA 6 pm" }),
      badge("to", "pin", 1.4, -0.45, { label: "Lucknow" }),
    ],
    flows: [
      ["from", "truck"],
      ["truck", "to"],
    ],
  },
  "lg-trip-stages": {
    actors: [
      truck("truck", "queue", -0.45, 0.55, { size: 0.7 }),
      badge("loading", "check", -1.35, -0.45, { label: "Loading" }),
      badge("transit", "clock", -0.45, -0.45, { label: "In transit" }),
      badge("unloading", "pin", 0.45, -0.45, { label: "Unloading", dim: true }),
      badge("done", "check", 1.35, -0.45, { label: "Delivered", dim: true }),
    ],
    flows: [
      ["loading", "transit"],
      ["transit", "unloading"],
      ["unloading", "done"],
    ],
  },
  "lg-trip-late": {
    actors: [
      truck("truck", "queue", -0.85, 0.1, { size: 0.9, label: "Trip 1124" }),
      badge("late", "alert", -0.45, 0.6, { label: "Running late", side: "right" }),
      person("ops", "docs", 1.25, 0.1, { label: "Operations" }),
    ],
    flows: [["truck", "ops"]],
  },

  // Logistics Suite · proof of delivery
  "lg-pod-scan": {
    actors: [
      truck("truck", "queue", -1.05, 0.1, { size: 0.85, label: "Delivered" }),
      phone("phone", "docs", 0.25, 0.1, { label: "Driver's phone" }),
      card("pod", "audit", 1.35, 0.1, { size: 0.45, label: "Signed proof" }),
    ],
    flows: [
      ["truck", "phone"],
      ["phone", "pod"],
    ],
  },
  "lg-pod-stages": {
    actors: [
      card("soft", "docs", -1.2, 0.1, { size: 0.45, label: "Photo copy" }),
      badge("c1", "check", -0.95, 0.55, { size: 0.26 }),
      card("hard", "vectors", 0, 0.1, { size: 0.45, label: "Original received" }),
      badge("c2", "check", 0.25, 0.55, { size: 0.26 }),
      person("customer", "audit", 1.25, 0.1, { label: "Sent to customer" }),
    ],
    flows: [
      ["soft", "hard"],
      ["hard", "customer"],
    ],
  },
  "lg-pod-pending": {
    actors: [
      bar("pending", "queue", -1.05, BASE, 1.2, { label: "Pending" }),
      bar("soft", "docs", -0.35, BASE, 0.8, { label: "Photo copy" }),
      bar("hard", "vectors", 0.35, BASE, 0.6, { label: "Original" }),
      bar("sent", "audit", 1.05, BASE, 1.5, { label: "With customer" }),
      badge("chase", "alert", -1.05, 0.75),
    ],
    flows: [],
  },

  // Logistics Suite · vehicles, drivers and brokers
  "lg-veh-check": {
    actors: [
      truck("truck", "queue", -0.95, 0.1, { size: 0.95, label: "Hired truck" }),
      card("rc", "docs", 0.45, 0.8, { size: 0.3, label: "Registration", side: "right" }),
      card("insurance", "vectors", 0.45, 0.05, { size: 0.3, label: "Insurance", side: "right" }),
      card("licence", "audit", 0.45, -0.7, { size: 0.3, label: "Driving licence", side: "right" }),
    ],
    flows: [
      ["truck", "rc"],
      ["truck", "insurance"],
      ["truck", "licence"],
    ],
  },
  "lg-veh-verify": {
    actors: [
      card("licence", "audit", -1.1, 0.1, { size: 0.5, label: "Driving licence" }),
      tile("records", "db", 0.85, 0.1, { label: "Government records" }),
      badge("ok", "check", 1.2, 0.6),
    ],
    flows: [["licence", "records"]],
  },
  "lg-veh-bid": {
    actors: [
      person("b1", "docs", -1.2, 0.8, { size: 0.3, label: "₹41,000", side: "right" }),
      person("b2", "vectors", -1.2, 0.05, { size: 0.3, label: "₹38,500", side: "right" }),
      person("b3", "queue", -1.2, -0.7, { size: 0.3, label: "₹43,200", side: "right" }),
      card("approved", "audit", 1.1, 0.1, { size: 0.5, label: "Approved bid" }),
      badge("ok", "check", 1.35, 0.55),
    ],
    flows: [["b2", "approved"]],
  },

  // Logistics Suite · contracts and rates
  "lg-rate-card": {
    actors: [
      card("contract", "docs", -1.1, 0.1, { label: "Contract" }),
      card("rates", "queue", 0.95, 0.1, { label: "Rate card" }),
      badge("sealed", "lock", 1.25, 0.6),
    ],
    flows: [["contract", "rates"]],
  },
  "lg-rate-lanes": {
    actors: [
      badge("delhi", "pin", -1.3, 0.75, { label: "Delhi" }),
      badge("mumbai", "pin", 1.3, 0.75, { label: "Mumbai" }),
      badge("kolkata", "pin", -1.3, -0.55, { label: "Kolkata" }),
      badge("chennai", "pin", 1.3, -0.55, { label: "Chennai" }),
      card("rates", "queue", 0, 0.1, { size: 0.5, label: "Rate per lane" }),
    ],
    flows: [
      ["delhi", "rates"],
      ["mumbai", "rates"],
      ["kolkata", "rates"],
      ["chennai", "rates"],
    ],
  },
  "lg-rate-apply": {
    actors: [
      truck("truck", "queue", -1.15, 0.1, { size: 0.8, label: "Trip" }),
      card("rates", "queue", 0.1, 0.1, { size: 0.45, label: "Agreed rate" }),
      card("bill", "docs", 1.3, 0.1, { size: 0.45, label: "Freight bill" }),
    ],
    flows: [
      ["truck", "rates"],
      ["rates", "bill"],
    ],
  },

  // Logistics Suite · billing and collections
  "lg-bill-bundle": {
    actors: [
      truck("t1", "queue", -1.05, 0.8, { size: 0.55 }),
      truck("t2", "queue", -1.05, 0.05, { size: 0.55, label: "Finished trips", side: "right" }),
      truck("t3", "queue", -1.05, -0.7, { size: 0.55 }),
      card("invoice", "docs", 1.05, 0.1, { size: 0.58, label: "GST invoice" }),
    ],
    flows: [
      ["t1", "invoice"],
      ["t3", "invoice"],
    ],
  },
  "lg-bill-collect": {
    actors: [
      card("invoice", "docs", -1.15, 0.1, { size: 0.5, label: "Invoice" }),
      person("customer", "audit", 0.2, 0.1, { label: "Customer" }),
      tile("bank", "audit", 1.35, 0.1, { size: 0.55, label: "Paid in" }),
    ],
    flows: [
      ["invoice", "customer"],
      ["customer", "bank"],
    ],
  },
  "lg-bill-owed": {
    actors: [
      bar("c1", "docs", -1.05, BASE, 0.7, { label: "Customer A" }),
      bar("c2", "docs", -0.35, BASE, 1.5, { label: "Customer B" }),
      bar("c3", "docs", 0.35, BASE, 0.5, { label: "Customer C" }),
      bar("c4", "docs", 1.05, BASE, 0.95, { label: "Customer D" }),
      badge("overdue", "alert", -0.35, 1.05),
    ],
    flows: [],
  },

  // Logistics Suite · payments
  "lg-pay-advance": {
    actors: [
      card("advance", "queue", -1.2, 0.1, { size: 0.5, label: "Advance request" }),
      person("approver", "docs", 0.1, 0.1, { label: "Approver" }),
      badge("ok", "check", 0.1, 0.7),
      tile("paid", "audit", 1.35, 0.1, { size: 0.55, label: "Paid" }),
    ],
    flows: [
      ["advance", "approver"],
      ["approver", "paid"],
    ],
  },
  "lg-pay-driver": {
    actors: [
      person("driver", "queue", -1.3, 0.1, { label: "Driver" }),
      card("fuel", "docs", 0, 0.75, { size: 0.3, label: "Fuel" }),
      card("tolls", "vectors", 0, -0.5, { size: 0.3, label: "Tolls" }),
      card("settlement", "audit", 1.25, 0.1, { size: 0.5, label: "Settlement" }),
    ],
    flows: [
      ["driver", "fuel"],
      ["driver", "tolls"],
      ["fuel", "settlement"],
      ["tolls", "settlement"],
    ],
  },
  "lg-pay-bank": {
    actors: [
      card("statement", "docs", -1.25, 0.1, { size: 0.5, label: "Bank statement" }),
      gear("match", "audit", 0, 0.1, { size: 0.55, label: "Matching" }),
      tile("books", "audit", 1.3, 0.1, { size: 0.6, label: "Your books" }),
      badge("ok", "check", 1.6, 0.5, { size: 0.26 }),
    ],
    flows: [
      ["statement", "match"],
      ["match", "books"],
    ],
  },

  // Logistics Suite · fleet costs
  "lg-cost-km": {
    actors: [
      truck("truck", "queue", -1.0, 0.1, { size: 0.95, label: "Cost per km" }),
      bar("fuel", "queue", 0.35, BASE, 1.4, { label: "Fuel" }),
      bar("tolls", "docs", 0.85, BASE, 0.7, { label: "Tolls" }),
      bar("repairs", "api", 1.35, BASE, 0.45, { label: "Repairs" }),
    ],
    flows: [],
  },
  "lg-cost-repair": {
    actors: [
      truck("truck", "queue", -1.0, 0.1, { size: 0.95, label: "Truck 14" }),
      gear("service", "docs", 0.85, 0.1, { size: 0.55, label: "Service due" }),
      badge("due", "clock", 1.25, 0.6),
    ],
    flows: [["truck", "service"]],
  },
  "lg-cost-toll": {
    actors: [
      truck("truck", "queue", -1.2, 0.1, { size: 0.8, label: "On the highway" }),
      card("toll", "vectors", 0.15, 0.1, { size: 0.42, label: "Toll charge" }),
      card("trip", "audit", 1.3, 0.1, { size: 0.42, label: "Matched trip" }),
      badge("ok", "check", 1.55, 0.5, { size: 0.26 }),
    ],
    flows: [
      ["truck", "toll"],
      ["toll", "trip"],
    ],
  },

  // Logistics Suite · safety alerts and rules
  "lg-alert-route": {
    actors: [
      badge("from", "pin", -1.4, -0.55, { label: "Start" }),
      badge("to", "pin", 1.4, -0.55, { label: "Destination" }),
      truck("truck", "queue", 0.15, 0.6, { size: 0.75 }),
      badge("off", "alert", 0.6, 1.0, { size: 0.26, label: "Off route", side: "right" }),
    ],
    flows: [["from", "to"]],
  },
  "lg-alert-stop": {
    actors: [
      truck("truck", "queue", -0.95, 0.1, { size: 0.9, label: "Trip 1124" }),
      badge("stopped", "clock", -0.55, 0.62, { label: "Stopped 40 min", side: "right" }),
      person("ops", "docs", 1.3, 0.1, { label: "Operations" }),
    ],
    flows: [["truck", "ops"]],
  },
  "lg-alert-rules": {
    actors: [
      card("rules", "docs", -1.15, 0.1, { label: "Company rules" }),
      badge("r1", "lock", 0.15, 0.8, { label: "Advance before closing", side: "right" }),
      badge("r2", "pin", 0.15, 0.05, { label: "Start where it ended", side: "right" }),
      badge("r3", "check", 0.15, -0.7, { label: "Tax taken at advance", side: "right" }),
    ],
    flows: [
      ["rules", "r1"],
      ["rules", "r2"],
      ["rules", "r3"],
    ],
  },

  // Logistics Suite · profit, reports and assistant
  "lg-pnl": {
    actors: [
      bar("revenue", "audit", -0.75, BASE, 1.6, { label: "Revenue" }),
      bar("cost", "api", 0, BASE, 0.6, { label: "Costs" }),
      bar("profit", "docs", 0.75, BASE, 1.0, { label: "Profit" }),
      badge("ok", "check", 0.75, 0.55),
    ],
    flows: [],
  },
  "lg-report": {
    actors: [
      card("trips", "docs", -1.1, 0.1, { size: 0.42, label: "Trips" }),
      card("profit", "audit", 0, 0.1, { size: 0.42, label: "Profit and loss" }),
      card("payments", "queue", 1.1, 0.1, { size: 0.42, label: "Payments" }),
    ],
    flows: [],
  },
  "lg-ask": {
    actors: [
      person("owner", "docs", -1.25, 0.1, { label: "You" }),
      tile("assistant", "agents", 0, 0.1, { label: "Assistant" }),
      card("answer", "audit", 1.25, 0.1, { size: 0.45, label: "Answer" }),
    ],
    flows: [
      ["owner", "assistant"],
      ["assistant", "answer"],
    ],
  },

  // Institute Management · school ERP
  "edu-erp-admit": {
    actors: [
      person("parent", "vectors", -1.3, 0.1, { label: "Parent" }),
      card("form", "docs", 0, 0.1, { label: "Admission form" }),
      tile("records", "docs", 1.25, 0.1, { label: "Student records" }),
    ],
    flows: [
      ["parent", "form"],
      ["form", "records"],
    ],
  },
  "edu-erp-attendance": {
    actors: [
      person("teacher", "audit", -1.3, 0.1, { label: "Teacher" }),
      phone("app", "docs", -0.2, 0.1, { label: "Class 8B" }),
      person("s1", "vectors", 0.55, 0.8, { size: 0.3 }),
      person("s2", "docs", 0.55, 0.05, { size: 0.3 }),
      person("s3", "queue", 0.55, -0.7, { size: 0.3 }),
      badge("p1", "check", 0.95, 0.8, { size: 0.26, label: "Present", side: "right" }),
      badge("p2", "check", 0.95, 0.05, { size: 0.26 }),
      badge("p3", "clock", 0.95, -0.7, { size: 0.26, label: "Late", side: "right" }),
    ],
    flows: [["teacher", "app"]],
  },
  "edu-erp-fees": {
    actors: [
      card("fee", "queue", -1.2, 0.1, { size: 0.5, label: "Fee due" }),
      phone("pay", "audit", 0, 0.1, { label: "Paid online" }),
      badge("ok", "check", 0.3, 0.6),
      card("receipt", "audit", 1.2, 0.1, { size: 0.45, label: "Receipt" }),
    ],
    flows: [
      ["fee", "pay"],
      ["pay", "receipt"],
    ],
  },

  // Institute Management · college
  "edu-college-courses": {
    actors: [
      tile("dept", "vectors", -1.25, 0.1, { label: "Departments" }),
      card("sem", "docs", 0.1, 0.7, { size: 0.36, label: "Semester 3" }),
      card("elective", "vectors", 0.1, -0.55, { size: 0.36, label: "Electives" }),
      person("student", "audit", 1.3, 0.1, { label: "Student" }),
    ],
    flows: [
      ["dept", "sem"],
      ["dept", "elective"],
      ["sem", "student"],
      ["elective", "student"],
    ],
  },
  "edu-college-credits": {
    actors: [
      person("student", "audit", -1.2, 0.1, { label: "Student" }),
      bar("needed", "db", 0.3, BASE, 1.6, { label: "Credits needed" }),
      bar("earned", "audit", 1.1, BASE, 1.15, { label: "Earned" }),
      badge("ok", "clock", 1.1, 0.7),
    ],
    flows: [["student", "earned"]],
  },
  "edu-college-campus": {
    actors: [
      person("student", "audit", -1.2, 0.1, { label: "Student" }),
      crate("hostel", "docs", 0.7, 0.7, { size: 0.42, label: "Hostel room" }),
      card("placement", "vectors", 0.7, -0.55, { size: 0.4, label: "Placement drive" }),
    ],
    flows: [
      ["student", "hostel"],
      ["student", "placement"],
    ],
  },

  // Institute Management · coaching and training institutes
  "edu-inst-batches": {
    actors: [
      tile("batches", "queue", -1.15, 0.1, { label: "Your courses" }),
      card("b1", "docs", 0.4, 0.8, { size: 0.3, label: "Morning batch", side: "right" }),
      card("b2", "vectors", 0.4, 0.05, { size: 0.3, label: "Evening batch", side: "right" }),
      card("b3", "audit", 0.4, -0.7, { size: 0.3, label: "Weekend batch", side: "right" }),
    ],
    flows: [
      ["batches", "b1"],
      ["batches", "b2"],
      ["batches", "b3"],
    ],
  },
  "edu-inst-instalments": {
    actors: [
      card("plan", "queue", -1.2, 0.1, { size: 0.5, label: "Fee plan" }),
      bar("i1", "audit", 0.2, BASE, 0.9, { label: "Paid" }),
      bar("i2", "audit", 0.75, BASE, 0.9, { label: "Paid" }),
      bar("i3", "db", 1.3, BASE, 0.9, { label: "Due" }),
      badge("c1", "check", 0.2, 0.45, { size: 0.26 }),
      badge("c2", "check", 0.75, 0.45, { size: 0.26 }),
      badge("c3", "clock", 1.3, 0.45, { size: 0.26 }),
    ],
    flows: [["plan", "i1"]],
  },
  "edu-inst-progress": {
    actors: [
      person("student", "vectors", -1.3, 0.1, { label: "Student" }),
      bar("t1", "vectors", -0.3, BASE, 0.6, { label: "Test 1" }),
      bar("t2", "vectors", 0.25, BASE, 0.85, { label: "Test 2" }),
      bar("t3", "vectors", 0.8, BASE, 1.05, { label: "Test 3" }),
      bar("t4", "audit", 1.35, BASE, 1.4, { label: "Test 4" }),
    ],
    flows: [],
  },

  // Institute Management · online assessment
  "edu-cbt-bank": {
    actors: [
      tile("bank", "vectors", -1.15, 0.1, { label: "Question bank" }),
      card("a", "docs", 0.75, 0.65, { size: 0.36, label: "Paper A" }),
      card("b", "audit", 0.75, -0.6, { size: 0.36, label: "Paper B" }),
    ],
    flows: [
      ["bank", "a"],
      ["bank", "b"],
    ],
  },
  "edu-cbt-take": {
    actors: [
      person("student", "vectors", -1.25, 0.1, { label: "Student" }),
      card("test", "docs", 0.15, 0.1, { size: 0.6, label: "Online test" }),
      badge("timer", "clock", 0.5, 0.65),
      badge("secure", "lock", 1.35, 0.1, { label: "Secure mode" }),
    ],
    flows: [["student", "test"]],
  },
  "edu-cbt-mark": {
    actors: [
      card("answers", "docs", -1.25, 0.1, { size: 0.5, label: "Answers" }),
      gear("marking", "audit", 0, 0.1, { size: 0.56, label: "Auto-marking" }),
      card("score", "audit", 1.25, 0.1, { size: 0.5, label: "Score card" }),
      badge("ok", "check", 1.5, 0.55),
    ],
    flows: [
      ["answers", "marking"],
      ["marking", "score"],
    ],
  },

  // Institute Management · exams
  "edu-exam-schedule": {
    actors: [
      card("datesheet", "docs", -1.15, 0.1, { label: "Date sheet" }),
      crate("r1", "vectors", 0.4, 0.8, { size: 0.32, label: "Room 101", side: "right" }),
      crate("r2", "vectors", 0.4, 0.05, { size: 0.32, label: "Room 102", side: "right" }),
      crate("r3", "vectors", 0.4, -0.7, { size: 0.32, label: "Hall tickets", side: "right" }),
    ],
    flows: [
      ["datesheet", "r1"],
      ["datesheet", "r2"],
      ["datesheet", "r3"],
    ],
  },
  "edu-exam-marks": {
    actors: [
      person("teacher", "audit", -1.3, 0.1, { label: "Teacher" }),
      card("marks", "docs", 0, 0.1, { label: "Marks entry" }),
      person("checker", "vectors", 1.3, 0.1, { label: "Checked by" }),
      badge("ok", "check", 1.3, 0.7),
    ],
    flows: [
      ["teacher", "marks"],
      ["marks", "checker"],
    ],
  },
  "edu-exam-report": {
    actors: [
      card("report", "audit", -0.9, 0.1, { size: 0.62, label: "Report card" }),
      phone("parent", "vectors", 0.9, 0.1, { size: 0.42, label: "Parent's phone" }),
    ],
    flows: [["report", "parent"]],
  },

  // Institute Management · CBSE result analysis
  "edu-cbse-import": {
    actors: [
      card("results", "docs", -1.15, 0.1, { label: "Board results" }),
      tile("analysis", "db", 0.95, 0.1, { label: "Result analysis" }),
    ],
    flows: [["results", "analysis"]],
  },
  "edu-cbse-subjects": {
    actors: [
      bar("maths", "vectors", -1.2, BASE, 1.05, { label: "Maths" }),
      bar("science", "docs", -0.6, BASE, 1.3, { label: "Science" }),
      bar("english", "audit", 0, BASE, 1.5, { label: "English" }),
      bar("hindi", "docs", 0.6, BASE, 1.2, { label: "Hindi" }),
      bar("social", "queue", 1.2, BASE, 0.7, { label: "Social sc." }),
      badge("weak", "alert", 1.2, 0.25),
    ],
    flows: [],
  },
  "edu-cbse-compare": {
    actors: [
      bar("sa", "vectors", -0.9, BASE, 1.25, { label: "Section A" }),
      bar("sb", "vectors", -0.3, BASE, 1.0, { label: "Section B" }),
      bar("sc", "vectors", 0.3, BASE, 1.45, { label: "Section C" }),
      bar("last", "db", 0.9, BASE, 1.1, { label: "Last year", dim: true }),
      badge("up", "check", 0.3, 0.95),
    ],
    flows: [],
  },

  // Institute Management · AI assistant
  "edu-ai-ask": {
    actors: [
      person("principal", "docs", -1.25, 0.1, { label: "Principal" }),
      tile("ai", "agents", 0, 0.1, { label: "AI assistant" }),
      card("answer", "audit", 1.25, 0.1, { size: 0.45, label: "Answer" }),
    ],
    flows: [
      ["principal", "ai"],
      ["ai", "answer"],
    ],
  },
  "edu-ai-alerts": {
    actors: [
      tile("ai", "agents", -1.1, 0.1, { label: "AI assistant" }),
      badge("a1", "alert", 0.2, 0.8, { label: "Attendance falling", side: "right" }),
      badge("a2", "clock", 0.2, 0.05, { label: "Fees overdue", side: "right" }),
      badge("a3", "alert", 0.2, -0.7, { label: "Scores dropping", side: "right" }),
    ],
    flows: [["ai", "a2"]],
  },
  "edu-ai-draft": {
    actors: [
      tile("ai", "agents", -1.25, 0.1, { label: "AI assistant" }),
      card("notice", "docs", 0.05, 0.1, { label: "Draft notice" }),
      badge("ok", "check", 0.35, 0.6),
      phone("parents", "vectors", 1.3, 0.1, { label: "Parents" }),
    ],
    flows: [
      ["ai", "notice"],
      ["notice", "parents"],
    ],
  },

  // Institute Management · school mobile app
  "edu-app-parents": {
    actors: [
      phone("app", "vectors", -0.8, 0.1, { size: 0.42, label: "School app" }),
      card("homework", "docs", 0.5, 0.8, { size: 0.3, label: "Homework", side: "right" }),
      card("attendance", "audit", 0.5, 0.05, { size: 0.3, label: "Attendance", side: "right" }),
      card("fees", "queue", 0.5, -0.7, { size: 0.3, label: "Fees", side: "right" }),
    ],
    flows: [
      ["app", "homework"],
      ["app", "attendance"],
      ["app", "fees"],
    ],
  },
  "edu-app-notify": {
    actors: [
      tile("school", "docs", -1.2, 0.1, { label: "School" }),
      phone("p1", "vectors", 0.3, 0.1, { size: 0.3 }),
      phone("p2", "vectors", 0.85, 0.1, { size: 0.3, label: "Parents" }),
      phone("p3", "vectors", 1.4, 0.1, { size: 0.3 }),
      badge("new", "alert", 0.85, 0.8, { size: 0.26 }),
    ],
    flows: [["school", "p1"]],
  },
  "edu-app-pay": {
    actors: [
      phone("app", "audit", -0.95, 0.1, { size: 0.42, label: "Pay fees" }),
      badge("ok", "check", -0.6, 0.6),
      card("receipt", "audit", 0.95, 0.1, { size: 0.5, label: "Receipt" }),
    ],
    flows: [["app", "receipt"]],
  },

  // Institute Management · visitors and enquiries
  "edu-lead-capture": {
    actors: [
      person("walkin", "vectors", -1.3, 0.7, { size: 0.38, label: "Walk-in" }),
      card("web", "docs", -1.3, -0.55, { size: 0.34, label: "Website" }),
      tile("leads", "vectors", 0.95, 0.1, { label: "Enquiries" }),
    ],
    flows: [
      ["walkin", "leads"],
      ["web", "leads"],
    ],
  },
  "edu-lead-follow": {
    actors: [
      tile("leads", "vectors", -1.15, 0.1, { label: "Enquiries" }),
      person("counsellor", "docs", 0.25, 0.1, { label: "Counsellor" }),
      badge("due", "clock", 0.6, 0.7, { label: "Call back today", side: "right" }),
    ],
    flows: [["leads", "counsellor"]],
  },
  "edu-lead-convert": {
    actors: [
      bar("enquiries", "vectors", -0.8, BASE, 1.6, { label: "Enquiries" }),
      bar("visits", "docs", 0, BASE, 1.05, { label: "Campus visits" }),
      bar("admitted", "audit", 0.8, BASE, 0.65, { label: "Admissions" }),
      badge("ok", "check", 0.8, 0.2),
    ],
    flows: [],
  },

  // Institute Management · Blogary
  "edu-blog-write": {
    actors: [
      person("writer", "docs", -1.2, 0.1, { label: "Writer" }),
      card("post", "vectors", 0.25, 0.1, { label: "New post" }),
      person("editor", "audit", 1.4, 0.1, { size: 0.4, label: "Editor" }),
      badge("ok", "check", 1.4, 0.62, { size: 0.26 }),
    ],
    flows: [
      ["writer", "post"],
      ["post", "editor"],
    ],
  },
  "edu-blog-publish": {
    actors: [
      card("post", "vectors", -1.15, 0.1, { label: "Post" }),
      tile("site1", "docs", 0.35, 0.8, { size: 0.36, label: "School site", side: "right" }),
      tile("site2", "vectors", 0.35, 0.05, { size: 0.36, label: "College site", side: "right" }),
      tile("site3", "audit", 0.35, -0.7, { size: 0.36, label: "Group site", side: "right" }),
    ],
    flows: [
      ["post", "site1"],
      ["post", "site2"],
      ["post", "site3"],
    ],
  },
  "edu-blog-track": {
    actors: [
      bar("v1", "docs", -0.8, BASE, 0.95, { label: "School site" }),
      bar("v2", "vectors", 0, BASE, 1.45, { label: "College site" }),
      bar("v3", "audit", 0.8, BASE, 0.75, { label: "Group site" }),
      badge("top", "check", 0, 0.9),
    ],
    flows: [],
  },
} satisfies Record<string, Beat>;

export type SceneKey = keyof typeof beats;

export const SCENES: Record<SceneKey, Beat> = beats;

/** Every scene key, for the CMS's scene picker. */
export const SCENE_KEYS = Object.keys(beats) as SceneKey[];

export const isSceneKey = (key: string): key is SceneKey => key in beats;

/** Height of each actor type as a multiple of its width (bars use their own height). */
export const ASPECT: Record<ActorType, number> = { tile: 1, card: 1.3, crate: 1, bar: 1, badge: 1, person: 1.24, gear: 1, truck: 0.62, phone: 1.9 };

/** Where flows attach: the middle of the shape (bars are placed by their base). */
export const flowPoint = (a: Pick<Actor, "type" | "at" | "h">): [number, number] =>
  a.type === "bar" ? [a.at[0], a.at[1] + (a.h ?? 0) / 2] : a.at;

const FLOW_GAP = 0.08;
const LABEL_CLEARANCE = 0.3;

/** How far from its middle a flow leaving `a` in direction (dx, dy) should start, so it clears the shape and its label. */
function flowInset(a: Actor, dx: number, dy: number) {
  const halfW = a.size / 2;
  const halfH = a.type === "bar" ? (a.h ?? 0) / 2 : (a.size * ASPECT[a.type]) / 2;
  const below = a.label && !a.side && a.type !== "bar" && dy < 0 ? LABEL_CLEARANCE : 0;
  return (Math.abs(dx) > Math.abs(dy) ? halfW : halfH + below) + FLOW_GAP;
}

/** A flow's two ends, between the edges of its actors rather than their middles. */
export function flowEnds(a: Actor, pa: [number, number], b: Actor, pb: [number, number]): [[number, number], [number, number]] {
  const dx = pb[0] - pa[0];
  const dy = pb[1] - pa[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const ia = Math.min(flowInset(a, ux, uy), len * 0.4);
  const ib = Math.min(flowInset(b, -ux, -uy), len * 0.4);
  return [
    [pa[0] + ux * ia, pa[1] + uy * ia],
    [pb[0] - ux * ib, pb[1] - uy * ib],
  ];
}

/** An actor as placed on a stage that plays a sequence of scenes. */
export type CastMember = Actor & {
  /** Stable across the sequence: same id, type and (for tiles) kind. */
  key: string;
  /** In the active scene. Others wait, hidden, where they last were (or will next be). */
  shown: boolean;
};

const castKey = (a: Actor) => `${a.id}:${a.type}:${a.type === "tile" ? a.tone : ""}`;

/**
 * Everyone who appears anywhere in `scenes`, posed for the scene at `active`, plus the active
 * scene's flows as pairs of cast keys. Keeping the whole cast mounted is what lets an actor
 * glide between steps instead of popping in.
 */
export function stageCast(scenes: string[], active: number): { cast: CastMember[]; flows: [string, string][] } {
  const beats = scenes.map((k) => (isSceneKey(k) ? SCENES[k] : { actors: [], flows: [] }));
  const current = beats[active] ?? { actors: [], flows: [] };
  const byKey = new Map<string, CastMember>();
  // Later scenes first, then earlier ones, then the active one, so each hidden actor ends up
  // at its nearest earlier pose (or its first later one) and shown actors at the active pose.
  const order = [...beats.slice(active + 1).reverse(), ...beats.slice(0, active), current];
  for (const beat of order) {
    for (const a of beat.actors) byKey.set(castKey(a), { ...a, key: castKey(a), shown: beat === current });
  }
  const ids = new Map(current.actors.map((a) => [a.id, castKey(a)]));
  const flows = current.flows.flatMap(([from, to]): [string, string][] => {
    const a = ids.get(from);
    const b = ids.get(to);
    return a && b ? [[a, b]] : [];
  });
  return { cast: [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key)), flows };
}
