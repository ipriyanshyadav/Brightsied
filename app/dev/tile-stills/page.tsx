import { Suspense } from "react";
import { notFound } from "next/navigation";
import { StillPage } from "./StillPage";

// Development tool: renders one 3D tile for scripts/render-tile-stills.mjs to capture.
// Not part of the site; production builds return 404.
export default function TileStillsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <Suspense>
      <StillPage />
    </Suspense>
  );
}
