import { defineField, defineType, type ArrayRule } from "sanity";
import { strings, text, titleBodies } from "./fields";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        strings("title", "Headline lines", { description: "Each line is set on its own; the last one is accented.", validation: (r: ArrayRule<string[]>) => r.required().min(1).max(3) }),
        text("sub", "Sub-heading"),
      ],
    }),
    strings("marquee", "Stack marquee", { description: "Technologies, not employers or clients." }),
    titleBodies("process", "How we engage (process steps)"),
    titleBodies("principles", "Principles"),
    titleBodies("audiences", "Who we work with"),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
