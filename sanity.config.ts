"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { SINGLETONS, sanityProject } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

// The Studio embedded at /studio. Site settings and the home page are single documents;
// everything else is a list.

const singletonTypes = new Set<string>(Object.values(SINGLETONS));
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export const studioConfig = sanityProject
  ? defineConfig({
      name: "brightera",
      title: "Brightera",
      basePath: "/studio",
      ...sanityProject,
      schema: { types: schemaTypes },
      plugins: [
        structureTool({
          structure: (S) =>
            S.list()
              .title("Content")
              .items([
                S.listItem().title("Site settings").id(SINGLETONS.siteSettings).child(S.document().schemaType(SINGLETONS.siteSettings).documentId(SINGLETONS.siteSettings)),
                S.listItem().title("Home page").id(SINGLETONS.homePage).child(S.document().schemaType(SINGLETONS.homePage).documentId(SINGLETONS.homePage)),
                S.divider(),
                ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? "")),
              ]),
        }),
      ],
      document: {
        newDocumentOptions: (prev, { creationContext }) =>
          creationContext.type === "global" ? prev.filter((t) => !singletonTypes.has(t.templateId)) : prev,
        actions: (prev, { schemaType }) =>
          singletonTypes.has(schemaType) ? prev.filter(({ action }) => action && SINGLETON_ACTIONS.has(action)) : prev,
      },
    })
  : null;
