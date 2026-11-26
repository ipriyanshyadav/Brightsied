import { defineArrayMember, defineField, defineType, type ArrayRule } from "sanity";
import { order, required, slug, strings, text, tile, titleBodies } from "./fields";

const TONES = ["neutral", "amber", "mint", "blue"];

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    order(),
    required("name", "Full name", "string"),
    slug(),
    required("shortName", "Short name", "string"),
    tile(),
    required("tagline", "Tagline", "string"),
    text("summary", "Summary"),
    required("status", "Status", "string", { description: "e.g. Demo available" }),
    strings("audience", "Made for"),
    titleBodies("features", "Features"),
    strings("rules", "Guarantees"),
    strings("stack", "Stack"),
    defineField({
      name: "components",
      title: "Diagram components",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [required("id", "Id"), required("label", "Label")], preview: { select: { title: "label", subtitle: "id" } } })],
    }),
    required("auditLabel", "Audit lane label", "string"),
    defineField({
      name: "steps",
      title: "Walkthrough steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            required("title", "Title"),
            text("body", "Body"),
            strings("lit", "Lit components", { description: "Component ids (or “audit”) highlighted in this step." }),
            required("event", "Event name", "string", { description: "e.g. po.approved" }),
          ],
          preview: { select: { title: "title", subtitle: "event" } },
        }),
      ],
    }),
    defineField({
      name: "window",
      title: "Illustrative app window",
      type: "object",
      description: "Sample data only; the page labels it as such.",
      fields: [
        required("path", "Path"),
        strings("sidebar", "Sidebar items"),
        required("activeItem", "Active item"),
        required("title", "Title"),
        required("action", "Action button"),
        strings("columns", "Columns", { validation: (r: ArrayRule<string[]>) => r.required().length(4) }),
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                required("id", "Id"),
                required("item", "Item"),
                required("qty", "Count / quantity"),
                required("state", "State"),
                required("tone", "Tone", "string", { options: { list: TONES } }),
              ],
              preview: { select: { title: "item", subtitle: "state" } },
            }),
          ],
        }),
      ],
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "status" } },
});
