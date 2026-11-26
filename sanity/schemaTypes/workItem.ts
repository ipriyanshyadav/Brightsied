import { defineArrayMember, defineField, defineType } from "sanity";
import { TILE_KINDS, optional, order, required, slug, strings, text, titleBodies } from "./fields";

export const workItem = defineType({
  name: "workItem",
  title: "Work item",
  type: "document",
  fields: [
    order(),
    required("title", "Title"),
    slug("tab"),
    required("kind", "Kind", "string", {
      options: { list: [{ title: "Brightseid product", value: "product" }, { title: "Lab", value: "lab" }, { title: "Client work", value: "client" }] },
      description: "Client work needs the client's written OK before it is published.",
    }),
    required("tab", "Tab label"),
    required("where", "Context line", "string", { description: "e.g. Brightseid product" }),
    text("body", "Summary", 4),
    strings("points", "Key points"),
    strings("tags", "Tags"),
    defineField({
      name: "tiles",
      title: "3D tiles",
      type: "array",
      of: [defineArrayMember({ type: "string", options: { list: [...TILE_KINDS] } })],
      validation: (r) => r.required().length(3),
    }),
    required("href", "Link", "string", { description: "Where “See the product” / “Try it” goes, e.g. /products/s2p" }),
    defineField({
      name: "caseStudy",
      title: "Case study",
      type: "object",
      description: "Fill this in to publish a full write-up at /work/<slug>. Plain facts only; no invented metrics.",
      options: { collapsible: true, collapsed: true },
      fields: [
        optional("client", "For", "string", { description: "In-house product, or the client's sector / name" }),
        optional("role", "Our role"),
        optional("challenge", "The challenge", "text", { rows: 5 }),
        titleBodies("approach", "Approach"),
        titleBodies("decisions", "Engineering decisions"),
        strings("outcome", "Result"),
        strings("stack", "Stack"),
        defineField({ name: "product", title: "Became this product", type: "reference", to: [{ type: "product" }] }),
      ],
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "tab", subtitle: "title" } },
});
