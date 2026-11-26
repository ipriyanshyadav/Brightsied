import { defineType } from "sanity";
import { order, required, slug, strings, text } from "./fields";

export const engagementPackage = defineType({
  name: "engagementPackage",
  title: "Engagement package",
  type: "document",
  fields: [
    order(),
    required("name", "Name"),
    slug(),
    required("duration", "Typical duration", "string", { description: "e.g. 6–10 weeks. No prices." }),
    text("summary", "Summary"),
    strings("includes", "What's included"),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "duration" } },
});
