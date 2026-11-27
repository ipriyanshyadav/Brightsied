"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { palettes, type TileKind } from "@/components/ui/GlossyTile";

const TileStill = dynamic(() => import("@/components/three/TileStill").then((m) => m.TileStill), { ssr: false });

const isKind = (v: string | null): v is TileKind => v !== null && v in palettes;

export function StillPage() {
  const params = useSearchParams();
  const requested = params.get("kind");
  const glass = params.get("glass") === "1";

  return (
    <>
      {/* Transparent page with no grain overlay or dev-tools badge, so the capture is the tile alone. */}
      <style>{`html, body { background: transparent !important; } body::after, nextjs-portal { display: none !important; }`}</style>
      {isKind(requested) ? (
        <TileStill kind={requested} glass={glass} />
      ) : (
        <p role="alert">{`Unknown tile kind "${requested}". Use ?kind=${Object.keys(palettes).join("|")}[&glass=1]`}</p>
      )}
    </>
  );
}
