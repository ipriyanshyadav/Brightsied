import { defineField, defineType } from "sanity";
import { order, required, text } from "./fields";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    order(),
    text("quote", "Quote", 4),
    required("name", "Name"),
    required("role", "Role"),
    required("company", "Company"),
    defineField({
      name: "published",
      title: "Show on the site",
      type: "boolean",
      initialValue: false,
      description: "Only turn on once the client has approved this exact wording.",
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "company" } },
});
