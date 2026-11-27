"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox, View } from "@react-three/drei";
import { easing } from "maath";
import { palettes, STILL_POSE, type TileKind } from "@/components/ui/GlossyTile";
import { STAGE_H, flowEnds, type CastMember } from "@/lib/scenes";
import { FOV, MAX_DT, Studio, Tile, cameraDistance, useIdleClock } from "./shared";
import { Stroke, White } from "./Glyph3D";
import { pointer } from "./pointer";
import { isMotionPaused } from "@/lib/motion";

// A product step's scene in live 3D, drawn by the shared LiveLayer canvas into the stage's
// box. Each actor eases toward its pose for the active step, so scrolling from one step to
// the next moves the scene on; packets of light travel along the step's flows.

const SMOOTH = 0.35;
const DIM_SCALE = 0.85;
const DIM_Z = -0.5;
const HIDDEN = 0.001;
const BOB = 0.025;
const TILT_X = 0.08;
const TILT_Y = 0.14;
const GEAR_SPEED = 0.7;
const PACKETS = 3;
const PACKET_SPEED = 0.45;
const PACKET_R = 0.05;
const PACKET_Z = 0.3;
const BOW = 0.18;
const PACKET_COLOR = "#7f9bff";
/** Cards and badges turn slightly, like the tiles, so they read as solid objects. */
const FLAT_POSE: [number, number] = [STILL_POSE[0] * 0.6, STILL_POSE[1] * 0.6];
const CRATE_POSE: [number, number] = [0.42, -0.62];
const BODY_DEPTH = 0.4;
const LINE_GREY = "#d5d8df";

function Body({ tone }: { tone: TileKind }) {
  const p = palettes[tone];
  const color = useMemo(() => new THREE.Color(p.base).lerp(new THREE.Color(p.deep), BODY_DEPTH), [p.base, p.deep]);
  return <meshPhysicalMaterial color={color} roughness={0.26} clearcoat={1} clearcoatRoughness={0.08} sheen={0.4} sheenColor={p.hi} />;
}

function Card({ tone }: { tone: TileKind }) {
  return (
    <group>
      <RoundedBox args={[1, 1.3, 0.08]} radius={0.035} smoothness={4}>
        <meshPhysicalMaterial color="#ffffff" roughness={0.32} clearcoat={1} clearcoatRoughness={0.1} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.26, 0.05]} radius={0.02} smoothness={3} position={[0, 0.43, 0.05]}>
        <Body tone={tone} />
      </RoundedBox>
      {[0.66, 0.48, 0.58].map((w, i) => (
        <mesh key={i} position={[-0.41 + w / 2, 0.08 - i * 0.2, 0.05]}>
          <boxGeometry args={[w, 0.07, 0.02]} />
          <meshStandardMaterial color={LINE_GREY} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

const ICONS: Record<NonNullable<CastMember["icon"]>, [number, number][][]> = {
  check: [[[30, 52], [44, 66], [70, 38]]],
  alert: [[[50, 26], [50, 56]]],
  lock: [[[38, 50], [38, 36], [62, 36], [62, 50]]],
  clock: [[[50, 32], [50, 52], [63, 60]]],
};

function Badge({ tone, icon }: { tone: TileKind; icon: CastMember["icon"] }) {
  const face = 0.09;
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.16, 48]} />
        <Body tone={tone} />
      </mesh>
      {icon &&
        ICONS[icon].map((pts, i) => (
          <Stroke key={i} points={pts} radius={0.055} z={face}>
            <White />
          </Stroke>
        ))}
      {icon === "alert" && (
        <mesh position={[0, -0.22, face]}>
          <sphereGeometry args={[0.065, 16, 12]} />
          <White />
        </mesh>
      )}
      {icon === "lock" && (
        <RoundedBox args={[0.44, 0.32, 0.06]} radius={0.05} smoothness={3} position={[0, -0.12, face]}>
          <White />
        </RoundedBox>
      )}
      {icon === "clock" && (
        <mesh position={[0, 0, face]}>
          <torusGeometry args={[0.3, 0.04, 12, 48]} />
          <White />
        </mesh>
      )}
    </group>
  );
}

function Person({ tone }: { tone: TileKind }) {
  return (
    <group>
      <mesh position={[0, 0.37, 0]}>
        <sphereGeometry args={[0.25, 32, 24]} />
        <Body tone={tone} />
      </mesh>
      <RoundedBox args={[1, 0.68, 0.5]} radius={0.22} smoothness={5} position={[0, -0.28, 0]}>
        <Body tone={tone} />
      </RoundedBox>
    </group>
  );
}

function Gear({ tone }: { tone: TileKind }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.22, 48]} />
        <Body tone={tone} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <RoundedBox key={i} args={[0.19, 0.2, 0.22]} radius={0.04} smoothness={3} position={[Math.sin(a) * 0.42, Math.cos(a) * 0.42, 0]} rotation={[0, 0, -a]}>
            <Body tone={tone} />
          </RoundedBox>
        );
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.24, 32]} />
        <White />
      </mesh>
    </group>
  );
}

function Shape({ a }: { a: CastMember }) {
  switch (a.type) {
    case "tile":
      return <Tile kind={a.tone} />;
    case "card":
      return <Card tone={a.tone} />;
    case "crate":
      return (
        <RoundedBox args={[1, 1, 1]} radius={0.14} smoothness={4}>
          <Body tone={a.tone} />
        </RoundedBox>
      );
    case "bar":
      // A unit box resting on y = 0; the actor scales it to the bar's height.
      return (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <Body tone={a.tone} />
        </mesh>
      );
    case "badge":
      return <Badge tone={a.tone} icon={a.icon} />;
    case "person":
      return <Person tone={a.tone} />;
    case "gear":
      return <Gear tone={a.tone} />;
  }
}

/** A small deterministic phase per actor, so idle motion isn't in lockstep. */
const phaseOf = (key: string) => [...key].reduce((n, c) => n + c.charCodeAt(0), 0) % 628 / 100;

function restingPose(a: CastMember): [number, number] {
  if (a.type === "tile") return [STILL_POSE[0], STILL_POSE[1]];
  if (a.type === "crate") return CRATE_POSE;
  if (a.type === "bar") return [0.12, -0.35];
  return FLAT_POSE;
}

/** Where an actor is right now, for flows: its group, plus its bar body while a bar grows. */
type Placed = { group: THREE.Group; body: THREE.Group; actor: CastMember };
type Register = (key: string, placed: Placed | null) => void;

function ActorMesh({ a, register }: { a: CastMember; register: Register }) {
  const outer = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const idle = useIdleClock();
  const phase = useMemo(() => phaseOf(a.key), [a.key]);
  const bar = a.type === "bar";

  useEffect(() => {
    if (!outer.current || !body.current) return;
    register(a.key, { group: outer.current, body: body.current, actor: a });
    return () => register(a.key, null);
  }, [a, register]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, MAX_DT);
    const t = idle(dt);
    const g = outer.current;
    const b = body.current;
    if (!g || !b) return;

    const appear = a.shown ? (a.dim ? DIM_SCALE : 1) : HIDDEN;
    const bob = bar ? 0 : Math.sin(t * 1.1 + phase) * BOB;
    easing.damp3(g.position, [a.at[0], a.at[1] + bob, a.dim ? DIM_Z : 0], SMOOTH, dt);
    easing.damp3(g.scale, [appear, appear, appear], SMOOTH, dt);
    g.visible = g.scale.x > HIDDEN * 10;

    const [rx, ry] = restingPose(a);
    const sway = bar ? 0 : Math.sin(t * 0.6 + phase) * 0.12;
    easing.dampE(g.rotation, [rx + Math.cos(t * 0.5 + phase) * 0.04, ry + sway, 0], SMOOTH, dt);
    // Gears turn while they're the subject; everything else eases to its resting turn.
    if (a.type === "gear") {
      if (a.shown && !a.dim && !isMotionPaused()) b.rotation.z -= dt * GEAR_SPEED;
    } else easing.damp(b.rotation, "z", THREE.MathUtils.degToRad(a.rot ?? 0), SMOOTH, dt);

    if (bar) easing.damp3(b.scale, [a.size, a.h ?? 0, a.size], SMOOTH, dt);
    else easing.damp3(b.scale, [a.size, a.size, a.size], SMOOTH, dt);
  });

  return (
    <group ref={outer} position={[a.at[0], a.at[1], 0]} scale={HIDDEN}>
      <group ref={body}>
        <Shape a={a} />
      </group>
    </group>
  );
}

const _mid = new THREE.Vector3();
const _ctrl = new THREE.Vector3();
const _p = new THREE.Vector3();

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

/** The middle of an actor's shape in stage units, following it as it moves and scales. */
function centre(p: Placed, out: THREE.Vector3) {
  out.copy(p.group.position);
  if (p.actor.type === "bar") out.y += (p.body.scale.y / 2) * p.group.scale.y;
  return out;
}

function Packets({ from, to, actors }: { from: string; to: string; actors: React.RefObject<Map<string, Placed>> }) {
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const idle = useIdleClock();

  useFrame((_, raw) => {
    const t = idle(Math.min(raw, MAX_DT));
    const pa = actors.current.get(from);
    const pb = actors.current.get(to);
    dots.current.forEach((dot, i) => {
      if (!dot) return;
      if (!pa || !pb) {
        dot.visible = false;
        return;
      }
      const [ea, eb] = flowEnds(pa.actor, [centre(pa, _a).x, _a.y], pb.actor, [centre(pb, _b).x, _b.y]);
      const a = _a.set(ea[0], ea[1], _a.z);
      const b = _b.set(eb[0], eb[1], _b.z);
      _mid.addVectors(a, b).multiplyScalar(0.5);
      _ctrl.set(_mid.x - (b.y - a.y) * BOW, _mid.y + (b.x - a.x) * BOW, PACKET_Z * 2);
      const u = (t * PACKET_SPEED + i / PACKETS) % 1;
      const k = 1 - u;
      _p.copy(a).multiplyScalar(k * k).addScaledVector(_ctrl, 2 * k * u).addScaledVector(b, u * u);
      _p.z += PACKET_Z;
      dot.position.copy(_p);
      dot.scale.setScalar(Math.max(Math.sin(Math.PI * u), HIDDEN));
      dot.visible = true;
    });
  });

  return (
    <>
      {Array.from({ length: PACKETS }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            dots.current[i] = m;
          }}
          visible={false}
        >
          <sphereGeometry args={[PACKET_R, 16, 12]} />
          <meshBasicMaterial color={PACKET_COLOR} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function Scene({ cast, flows, track }: { cast: CastMember[]; flows: [string, string][]; track: React.RefObject<HTMLElement | THREE.Group | null> }) {
  const root = useRef<THREE.Group>(null);
  const actors = useRef(new Map<string, Placed>());
  const register = useCallback<Register>((key, placed) => {
    if (placed) actors.current.set(key, placed);
    else actors.current.delete(key);
  }, []);

  // The whole stage leans a little toward the cursor while it's over the stage.
  useFrame((_, raw) => {
    const dt = Math.min(raw, MAX_DT);
    const el = track.current;
    const g = root.current;
    if (!(el instanceof HTMLElement) || !g) return;
    const r = el.getBoundingClientRect();
    const dx = (pointer.x - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (pointer.y - (r.top + r.height / 2)) / (r.height / 2);
    const over = pointer.active && Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
    easing.dampE(g.rotation, [over ? dy * TILT_X : 0, over ? dx * TILT_Y : 0, 0], SMOOTH, dt);
  });

  return (
    <group ref={root}>
      {cast.map((a) => (
        <ActorMesh key={a.key} a={a} register={register} />
      ))}
      {flows.map(([from, to]) => (
        <Packets key={`${from}>${to}`} from={from} to={to} actors={actors} />
      ))}
    </group>
  );
}

export default function StageView({ cast, flows }: { cast: CastMember[]; flows: [string, string][] }) {
  const track = useRef<HTMLElement | THREE.Group>(null);
  return (
    <View ref={track} className="pointer-events-none absolute inset-0">
      <PerspectiveCamera makeDefault fov={FOV} position={[0, 0, cameraDistance(1 / STAGE_H)]} near={0.1} far={50} />
      <Studio />
      <pointLight intensity={3} distance={0} decay={2} position={[-1.2, 1.4, 2.5]} />
      <Scene cast={cast} flows={flows} track={track} />
    </View>
  );
}
