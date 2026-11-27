import { defineArrayMember, defineField, defineType, type ArrayRule } from "sanity";
import { SCENE_KEYS } from "@/lib/scenes";
import { order, required, slug, strings, text, tile, titleBodies } from "./fields";

const TONES = ["neutral", "amber", "mint", "blue"];

/** Steps that each play a scene beside them (lib/scenes.ts). */
const walkthrough = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [
          required("title", "Title"),
          text("body", "Body"),
          required("scene", "Scene", "string", { description: "The picture shown beside this step.", options: { list: SCENE_KEYS, layout: "dropdown" } }),
        ],
        preview: { select: { title: "title", subtitle: "scene" } },
      }),
    ],
  });

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
    walkthrough("steps", "Home page journey", "The end-to-end story shown when this product is featured on the home page."),
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            required("id", "Anchor id", "string", { description: "Lower case with dashes, e.g. invoice-matching. Used in links to the module." }),
            required("name", "Name"),
            required("summary", "One-line summary", "string"),
            walkthrough("steps", "Steps"),
          ],
          preview: { select: { title: "name", subtitle: "summary" } },
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
