import { defineArrayMember, defineField } from "sanity";
import type { TileKind } from "@/components/ui/GlossyTile";

// Field builders shared by the schemas, so lists of strings and title/body pairs look the
// same everywhere in the Studio.

export const TILE_KINDS = ["docs", "vectors", "agents", "queue", "audit", "api", "terminal", "db"] as const satisfies readonly TileKind[];

export const required = (name: string, title: string, type = "string", extra: Record<string, unknown> = {}) =>
  defineField({ name, title, type, validation: (r) => r.required(), ...extra });

export const optional = (name: string, title: string, type = "string", extra: Record<string, unknown> = {}) =>
  defineField({ name, title, type, ...extra });

export const text = (name: string, title: string, rows = 3) => required(name, title, "text", { rows });

export const slug = (source = "name") =>
  defineField({ name: "slug", title: "URL slug", type: "slug", options: { source }, validation: (r) => r.required() });

export const order = () =>
  defineField({ name: "order", title: "Order", type: "number", description: "Lower numbers come first.", validation: (r) => r.required().integer() });

export const tile = (name = "tile", title = "3D tile") =>
  required(name, title, "string", { options: { list: [...TILE_KINDS], layout: "dropdown" } });

export const strings = (name: string, title: string, extra: Record<string, unknown> = {}) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })], ...extra });

/** A list of { title, body } pairs (outcomes, features, principles…). */
export const titleBodies = (name: string, title: string, keys: [string, string] = ["title", "body"]) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [required(keys[0], keys[0] === "q" ? "Question" : "Title"), text(keys[1], keys[1] === "a" ? "Answer" : "Body")],
        preview: { select: { title: keys[0] } },
      }),
    ],
  });
