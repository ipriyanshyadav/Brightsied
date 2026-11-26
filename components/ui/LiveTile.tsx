"use client";

import dynamic from "next/dynamic";
import { GlossyTile, type TileKind } from "@/components/ui/GlossyTile";
import { useLive } from "@/components/three/LiveProvider";

// A tile that starts as its pre-rendered still and becomes live 3D when the page's
// LiveProvider switches on. The 3D part is a separate chunk, so pages only pay for
// three.js on devices that will use it.

const LiveView = dynamic(() => import("@/components/three/LiveView"), { ssr: false });

type Props = {
  kind: TileKind;
  /** Box size and position classes (width, absolute placement, float animation…). */
  className?: string;
  /** Resting rotation in degrees, applied to both the still and the 3D tile. */
  rotate?: number;
  sizes?: string;
};

export function LiveTile({ kind, className = "", rotate = 0, sizes }: Props) {
  const live = useLive();
  const position = /\babsolute\b/.test(className) ? "" : "relative";
  return (
    <span className={`${position} block aspect-square ${className}`}>
      <span className="live-poster block h-full w-full" style={{ rotate: `${rotate}deg` }}>
        <GlossyTile kind={kind} className="h-full w-full" sizes={sizes} />
      </span>
      {live && <LiveView kind={kind} rotate={rotate} />}
    </span>
  );
}
