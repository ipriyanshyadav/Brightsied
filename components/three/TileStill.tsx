"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { STILL_FILL, STILL_POSE, type TileKind } from "@/components/ui/GlossyTile";
import { EXPOSURE, FOV, GL_PROPS, Studio, Tile, cameraDistance } from "./shared";

// Renders one tile, centred and lit exactly like the live scenes, on a transparent
// background. scripts/render-tile-stills.mjs screenshots it into public/tiles/<kind>[-glass].png.

const SETTLE_FRAMES = 12;

function Ready() {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current === SETTLE_FRAMES) document.body.dataset.stillReady = "1";
  });
  return null;
}

export function TileStill({ kind, glass }: { kind: TileKind; glass: boolean }) {
  return (
    <Canvas
      dpr={1}
      camera={{ fov: FOV, position: [0, 0, cameraDistance(STILL_FILL)], near: 0.1, far: 50 }}
      gl={{ ...GL_PROPS, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = EXPOSURE;
      }}
      style={{ width: "100vw", height: "100vh", background: "transparent" }}
    >
      <Studio />
      <group rotation={STILL_POSE}>
        <Tile kind={kind} glass={glass} />
      </group>
      <Ready />
    </Canvas>
  );
}
