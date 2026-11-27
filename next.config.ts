import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Agent instructions live in .claude/CLAUDE.md; stop `next dev` from writing AGENTS.md.
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
