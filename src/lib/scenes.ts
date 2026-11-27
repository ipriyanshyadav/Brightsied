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

export type ActorType = "tile" | "card" | "crate" | "bar" | "badge" | "person" | "gear";
export type BadgeIcon = "check" | "alert" | "lock" | "clock";

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

const SIZE: Record<ActorType, number> = { tile: 0.7, card: 0.55, crate: 0.42, bar: 0.28, badge: 0.32, person: 0.5, gear: 0.7 };
const BADGE_TONE: Record<BadgeIcon, TileKind> = { check: "audit", alert: "queue", lock: "agents", clock: "docs" };

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
} satisfies Record<string, Beat>;

export type SceneKey = keyof typeof beats;

export const SCENES: Record<SceneKey, Beat> = beats;

/** Every scene key, for the CMS's scene picker. */
export const SCENE_KEYS = Object.keys(beats) as SceneKey[];

export const isSceneKey = (key: string): key is SceneKey => key in beats;

/** Height of each actor type as a multiple of its width (bars use their own height). */
export const ASPECT: Record<ActorType, number> = { tile: 1, card: 1.3, crate: 1, bar: 1, badge: 1, person: 1.24, gear: 1 };

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
