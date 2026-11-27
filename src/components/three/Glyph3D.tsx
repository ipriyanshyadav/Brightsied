"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { palettes, type TileKind } from "@/components/ui/GlossyTile";

// 3D versions of the GlossyTile glyphs, built from primitives so they catch the same studio
// light as the tile body. Coordinates are authored in the SVG's 0–100 space and mapped onto
// a unit tile face (x right, y up), so the 2D and 3D icons line up.

export const TILE_DEPTH = 0.3;
const FACE = TILE_DEPTH / 2;

const px = (v: number) => (v - 50) / 100;
const py = (v: number) => (50 - v) / 100;
const v3 = (x: number, y: number, z = 0) => new THREE.Vector3(px(x), py(y), z);

export function White() {
  return <meshPhysicalMaterial color="#ffffff" roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} />;
}

function Gloss({ color, roughness = 0.3 }: { color: string; roughness?: number }) {
  return <meshPhysicalMaterial color={color} roughness={roughness} clearcoat={1} clearcoatRoughness={0.1} />;
}

/** A rounded tube along straight segments, with ball joints so corners and ends stay round. Points are in the glyphs' 0–100 face space. */
export function Stroke({ points, radius, z, children }: { points: [number, number][]; radius: number; z: number; children: React.ReactNode }) {
  const { path, joints } = useMemo(() => {
    const pts = points.map(([x, y]) => v3(x, y, z));
    const curve = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 1; i < pts.length; i++) curve.add(new THREE.LineCurve3(pts[i - 1], pts[i]));
    return { path: curve, joints: pts };
  }, [points, z]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[path, 48, radius, 12, false]} />
        {children}
      </mesh>
      {joints.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[radius, 16, 12]} />
          {children}
        </mesh>
      ))}
    </group>
  );
}

/** A rounded tube along a smooth curve (used for the API braces). */
function Curve({ curve, radius, children }: { curve: THREE.Curve<THREE.Vector3>; radius: number; children: React.ReactNode }) {
  return (
    <mesh>
      <tubeGeometry args={[curve, 96, radius, 12, false]} />
      {children}
    </mesh>
  );
}

function Brace({ mirror, z }: { mirror: boolean; z: number }) {
  const curve = useMemo(() => {
    const m = (x: number) => (mirror ? 100 - x : x);
    const c = new THREE.CurvePath<THREE.Vector3>();
    const p = (x: number, y: number) => v3(m(x), y, z);
    c.add(new THREE.CubicBezierCurve3(p(46, 31), p(40, 31), p(38, 33), p(38, 39)));
    c.add(new THREE.LineCurve3(p(38, 39), p(38, 45)));
    c.add(new THREE.CubicBezierCurve3(p(38, 45), p(38, 48), p(36, 50), p(31, 50)));
    c.add(new THREE.CubicBezierCurve3(p(31, 50), p(36, 50), p(38, 52), p(38, 55)));
    c.add(new THREE.LineCurve3(p(38, 55), p(38, 61)));
    c.add(new THREE.CubicBezierCurve3(p(38, 61), p(38, 67), p(40, 69), p(46, 69)));
    return c;
  }, [mirror, z]);
  return (
    <Curve curve={curve} radius={0.034}>
      <White />
    </Curve>
  );
}

/** Spheres placed on a tilted orbit ring. */
function Orbit({ rotation, radius, sats, faint }: { rotation: [number, number, number]; radius: number; sats: [number, number][]; faint?: boolean }) {
  return (
    <group rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, faint ? 0.006 : 0.009, 10, 96]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.3} transparent opacity={faint ? 0.45 : 0.8} />
      </mesh>
      {sats.map(([angle, r]) => (
        <mesh key={angle} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
          <sphereGeometry args={[r, 24, 16]} />
          <White />
        </mesh>
      ))}
    </group>
  );
}

export function Glyph3D({ kind }: { kind: TileKind }) {
  const ink = palettes[kind].ink;
  const z = FACE + 0.02;

  switch (kind) {
    case "docs":
      return (
        <group>
          <RoundedBox args={[0.38, 0.5, 0.03]} radius={0.04} smoothness={4} position={[px(53), py(46), z]}>
            <meshPhysicalMaterial color="#dfe8ff" roughness={0.3} clearcoat={1} />
          </RoundedBox>
          <RoundedBox args={[0.38, 0.48, 0.05]} radius={0.05} smoothness={4} position={[px(43), py(53), z + 0.04]}>
            <White />
          </RoundedBox>
          {[48, 56, 64].map((y, i) => (
            <RoundedBox
              key={y}
              args={[i === 2 ? 0.15 : 0.24, 0.036, 0.016]}
              radius={0.008}
              smoothness={2}
              position={[px(i === 2 ? 38.5 : 43), py(y + 1.8), z + 0.07]}
            >
              <Gloss color={ink} />
            </RoundedBox>
          ))}
        </group>
      );

    case "vectors":
      return (
        <group position={[0, 0, FACE + 0.24]}>
          <mesh>
            <sphereGeometry args={[0.11, 32, 24]} />
            <White />
          </mesh>
          <Orbit rotation={[1.0, 0.15, -0.38]} radius={0.29} sats={[[0.3, 0.05], [2.5, 0.042], [4.3, 0.036]]} />
          <Orbit rotation={[1.1, -0.4, 0.66]} radius={0.27} sats={[[1.3, 0.04], [3.9, 0.03]]} faint />
        </group>
      );

    case "agents": {
      const nodes: [number, number][] = [[29, 50], [71, 50], [50, 71], [50, 29]];
      const zz = FACE + 0.09;
      return (
        <group>
          <Stroke points={[[29, 50], [50, 29], [71, 50], [50, 71], [29, 50]]} radius={0.014} z={zz}>
            <meshPhysicalMaterial color="#ffffff" roughness={0.35} transparent opacity={0.55} />
          </Stroke>
          <Stroke points={[[29, 50], [71, 50]]} radius={0.012} z={zz}>
            <meshPhysicalMaterial color="#ffffff" roughness={0.35} transparent opacity={0.45} />
          </Stroke>
          {nodes.map(([x, y], i) => (
            <mesh key={i} position={v3(x, y, zz)}>
              <sphereGeometry args={[i === 3 ? 0.09 : 0.075, 32, 24]} />
              <White />
            </mesh>
          ))}
          <mesh position={v3(50, 29, zz + 0.08)}>
            <sphereGeometry args={[0.034, 20, 16]} />
            <meshStandardMaterial color="#3ddc97" emissive="#3ddc97" emissiveIntensity={0.9} />
          </mesh>
        </group>
      );
    }

    case "queue":
      return (
        <group>
          <RoundedBox args={[0.66, 0.26, 0.03]} radius={0.12} smoothness={6} position={[0, 0, FACE + 0.005]}>
            <meshPhysicalMaterial color={ink} roughness={0.6} transparent opacity={0.45} />
          </RoundedBox>
          {[28.5, 42.5, 56.5, 70.5].map((x, i) => (
            <RoundedBox key={x} args={[0.11, 0.16, 0.09]} radius={0.03} smoothness={4} position={[px(x), 0, FACE + 0.06]}>
              <meshPhysicalMaterial
                color="#ffffff"
                roughness={0.22}
                clearcoat={1}
                clearcoatRoughness={0.08}
                transparent={i > 0}
                opacity={1 - i * 0.2}
              />
            </RoundedBox>
          ))}
        </group>
      );

    case "audit":
      return (
        <group>
          <RoundedBox args={[0.48, 0.56, 0.04]} radius={0.06} smoothness={4} position={[px(50), py(52), z]}>
            <White />
          </RoundedBox>
          <RoundedBox args={[0.22, 0.1, 0.07]} radius={0.035} smoothness={4} position={[px(50), py(23.5), z + 0.03]}>
            <Gloss color={ink} />
          </RoundedBox>
          {[42, 54, 66].map((y, i) => (
            <group key={y}>
              <Stroke points={[[33, y], [36.5, y + 3.5], [43.5, y - 3.5]]} radius={0.016} z={z + 0.035}>
                <Gloss color="#10a46c" />
              </Stroke>
              <RoundedBox
                args={[i === 1 ? 0.14 : 0.2, 0.034, 0.014]}
                radius={0.007}
                smoothness={2}
                position={[px(47 + (i === 1 ? 7 : 10)), py(y), z + 0.03]}
              >
                <meshPhysicalMaterial color="#8fcab0" roughness={0.4} />
              </RoundedBox>
            </group>
          ))}
        </group>
      );

    case "api":
      return (
        <group>
          <Brace mirror={false} z={FACE + 0.05} />
          <Brace mirror z={FACE + 0.05} />
        </group>
      );

    case "terminal":
      return (
        <group>
          {(
            [
              ["#ff5f57", 25],
              ["#febc2e", 33],
              ["#28c840", 41],
            ] as const
          ).map(([c, x]) => (
            <mesh key={c} position={v3(x, 26, FACE + 0.02)}>
              <sphereGeometry args={[0.03, 20, 16]} />
              <Gloss color={c} roughness={0.2} />
            </mesh>
          ))}
          <Stroke points={[[28, 42], [40, 53], [28, 64]]} radius={0.026} z={FACE + 0.035}>
            <meshStandardMaterial color="#3ddc97" emissive="#3ddc97" emissiveIntensity={0.55} roughness={0.25} />
          </Stroke>
          <RoundedBox args={[0.25, 0.052, 0.05]} radius={0.02} smoothness={3} position={[px(58.5), py(63.5), FACE + 0.035]}>
            <White />
          </RoundedBox>
        </group>
      );

    case "db":
      return (
        <group position={[0, 0.01, FACE + 0.22]} rotation={[0.42, 0, 0]}>
          {[0.12, 0, -0.12].map((y, i) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 48]} />
              <meshPhysicalMaterial color={i === 0 ? "#6e8bff" : "#3b5bff"} roughness={0.25} clearcoat={1} clearcoatRoughness={0.08} />
            </mesh>
          ))}
        </group>
      );
  }
}
