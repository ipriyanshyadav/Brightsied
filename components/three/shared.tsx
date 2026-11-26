"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { palettes, type TileKind } from "@/components/ui/GlossyTile";
import { isMotionPaused } from "@/lib/motion";
import { Glyph3D, TILE_DEPTH } from "./Glyph3D";

// Shared look for every 3D tile on the page (hero, section cards, pre-rendered stills),
// so they all sit in the same studio and read as one set of objects.

/** Narrow lens: a telephoto product-shot look rather than a game camera. */
export const FOV = 17.5;
export const EXPOSURE = 1.12;
export const GL_PROPS = { antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping } as const;
export const DPR_HIGH = 1.75;
export const DPR_LOW = 1;
export const DPR_SMALL_SCREEN = 1.25;
export const SMALL_SCREEN_PX = 640;
/** Frames to draw before telling the page the canvas is ready to cross-fade in. */
export const READY_FRAMES = 3;
export const MAX_DT = 1 / 30;

/** Distance at which a unit tile fills `fill` of a square view's height. */
export const cameraDistance = (fill: number) => 1 / fill / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));

export const initialDpr = () => (window.innerWidth < SMALL_SCREEN_PX ? DPR_SMALL_SCREEN : DPR_HIGH);

// Body colour sits between the palette's base and deep tones, so lit tiles keep the
// saturation of the 2D palette instead of washing out to pastel.
const BODY_DEPTH = 0.4;

// Glass tile: refraction quality, lowered when the device struggles.
const GLASS_TINT = 0.1;
const GLASS = { samples: 6, resolution: 512 } as const;
const GLASS_LOW = { samples: 3, resolution: 256 } as const;
const BACKDROP_PX = 128;
// What sits behind the hero, painted small: its gradient and aurora colours. The glass
// refracts this (plus any tiles behind it) instead of the transparent canvas's black.
const BACKDROP = {
  top: "#e3e4e9",
  bottom: "#f2f2f4",
  blobs: [
    { x: 0.15, y: 0.25, r: 0.4, color: "rgb(127 155 255 / 0.4)" },
    { x: 0.85, y: 0.2, r: 0.42, color: "rgb(182 155 255 / 0.38)" },
    { x: 0.45, y: 0.92, r: 0.38, color: "rgb(255 201 138 / 0.35)" },
    { x: 0.68, y: 0.55, r: 0.25, color: "rgb(142 240 200 / 0.25)" },
  ],
};

function useBackdrop() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = BACKDROP_PX;
    const g = canvas.getContext("2d");
    if (g) {
      const s = BACKDROP_PX;
      const grad = g.createLinearGradient(0, 0, 0, s);
      grad.addColorStop(0, BACKDROP.top);
      grad.addColorStop(1, BACKDROP.bottom);
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
      for (const b of BACKDROP.blobs) {
        const r = g.createRadialGradient(b.x * s, b.y * s, 0, b.x * s, b.y * s, b.r * s);
        r.addColorStop(0, b.color);
        r.addColorStop(1, "rgb(255 255 255 / 0)");
        g.fillStyle = r;
        g.fillRect(0, 0, s, s);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function GlassMaterial({ kind, low }: { kind: TileKind; low: boolean }) {
  const p = palettes[kind];
  const backdrop = useBackdrop();
  const tint = useMemo(() => new THREE.Color("#ffffff").lerp(new THREE.Color(p.base), GLASS_TINT), [p.base]);
  const q = low ? GLASS_LOW : GLASS;
  return (
    <MeshTransmissionMaterial
      background={backdrop}
      samples={q.samples}
      resolution={q.resolution}
      color={tint}
      thickness={0.7}
      roughness={0.06}
      ior={1.5}
      chromaticAberration={0.14}
      anisotropicBlur={0.08}
      distortion={0.18}
      distortionScale={0.4}
      temporalDistortion={0}
      clearcoat={1}
      clearcoatRoughness={0.05}
      attenuationColor={p.base}
      attenuationDistance={2.4}
    />
  );
}

type TileProps = {
  kind: TileKind;
  /** Clear tinted glass body instead of glossy plastic. */
  glass?: boolean;
  /** Cheaper glass refraction, for devices that are dropping frames. */
  low?: boolean;
};

export function Tile({ kind, glass = false, low = false }: TileProps) {
  const p = palettes[kind];
  const dark = kind === "agents" || kind === "terminal";
  const body = useMemo(() => new THREE.Color(p.base).lerp(new THREE.Color(p.deep), BODY_DEPTH), [p.base, p.deep]);
  return (
    <group>
      <RoundedBox args={[1, 1, TILE_DEPTH]} radius={0.2} smoothness={8} bevelSegments={6} creaseAngle={0.5}>
        {glass ? (
          <GlassMaterial kind={kind} low={low} />
        ) : (
          <meshPhysicalMaterial
            color={body}
            roughness={dark ? 0.5 : 0.24}
            clearcoat={1}
            clearcoatRoughness={dark ? 0.12 : 0.06}
            sheen={dark ? 0 : 0.4}
            sheenColor={p.hi}
            sheenRoughness={0.5}
          />
        )}
      </RoundedBox>
      <Glyph3D kind={kind} />
    </group>
  );
}

// Studio lighting made of softboxes, so reflections read as a photo shoot rather than a
// single highlight. Rims are tinted with the hero's aurora colours. No HDR download.
export function Studio() {
  return (
    <>
      <Environment resolution={256} frames={1} environmentIntensity={1.35}>
        <Lightformer form="rect" intensity={4} position={[0, 7, 5]} scale={[14, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.8} position={[0, 0, 12]} scale={[12, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" color="#8aa0ff" intensity={2.6} position={[-10, 1, 3]} scale={[2.5, 12, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" color="#c9b0ff" intensity={2.6} position={[10, 1, 3]} scale={[2.5, 12, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={5} position={[-5, 5, 9]} scale={1.6} target={[0, 0, 0]} />
        <Lightformer form="rect" color="#ffd9b0" intensity={0.8} position={[0, -8, 4]} scale={[14, 2, 1]} target={[0, 0, 0]} />
      </Environment>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-6, 8, 10]} intensity={1.4} />
    </>
  );
}

/**
 * A clock for idle motion (bobbing, drifting) that stops while the visitor has paused
 * motion. Pointer-driven movement keeps working, since the visitor causes it.
 */
export function useIdleClock() {
  const t = useRef(0);
  return (dt: number) => {
    if (!isMotionPaused()) t.current += dt;
    return t.current;
  };
}
