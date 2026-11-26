import { defineArrayMember, defineField, defineType } from "sanity";
import { order, required, slug, strings, text, tile, titleBodies } from "./fields";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    order(),
    required("name", "Name"),
    slug(),
    tile(),
    required("summary", "One-line summary", "string", { description: "Used on cards and in menus." }),
    required("headline", "Page headline"),
    text("intro", "Intro", 4),
    titleBodies("outcomes", "Outcomes"),
    strings("deliverables", "Deliverables"),
    strings("idealFor", "Ideal for"),
    titleBodies("faqs", "FAQs", ["q", "a"]),
    defineField({
      name: "packages",
      title: "Engagement packages",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "engagementPackage" }] })],
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "summary" } },
});
