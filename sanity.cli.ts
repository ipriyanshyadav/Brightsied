import { existsSync } from "node:fs";
import { defineCliConfig } from "sanity/cli";

// The Sanity CLI (seeding, dataset tools) reads the same env files as Next.js.
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
