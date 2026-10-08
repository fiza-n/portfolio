"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { terminal } from "@/lib/terminal/instance";
import { CRTScreen } from "./CRTScreen";

/**
 * A late-80s desktop built from primitives: pizza-box case, CRT monitor,
 * keyboard and mouse. No GLB to download, so it appears instantly.
 */
export function Workstation() {
  const m = useMemo(
    () => ({
      plastic: new THREE.MeshStandardMaterial({ color: "#e6dfcc", roughness: 0.62, metalness: 0.02 }),
      shade: new THREE.MeshStandardMaterial({ color: "#c8bea6", roughness: 0.7 }),
      dark: new THREE.MeshStandardMaterial({ color: "#2a2724", roughness: 0.5 }),
      keycap: new THREE.MeshStandardMaterial({ color: "#ece5d4", roughness: 0.55 }),
      orange: new THREE.MeshStandardMaterial({ color: "#d9531c", roughness: 0.5 }),
      led: new THREE.MeshBasicMaterial({ color: "#5fd068" }),
    }),
    [],
  );
  useEffect(() => () => Object.values(m).forEach((mat) => mat.dispose()), [m]);

  const glow = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (glow.current) glow.current.intensity = terminal.power ? 4 + Math.sin(state.clock.elapsedTime * 9) * 0.2 : 0;
    m.led.color.set(terminal.power ? "#5fd068" : "#3a3a3a");
  });

  return (
    <group>
      {/* desktop case */}
      <RoundedBox args={[3.9, 0.6, 3.4]} radius={0.1} smoothness={4} position={[0, 0.3, 0]} material={m.plastic} />
      <mesh position={[0.95, 0.33, 1.71]} material={m.dark}>
        <boxGeometry args={[1.15, 0.07, 0.04]} />
      </mesh>
      <mesh position={[1.75, 0.33, 1.71]} material={m.led}>
        <boxGeometry args={[0.06, 0.06, 0.03]} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-1.6 + i * 0.1, 0.3, 1.705]} material={m.shade}>
          <boxGeometry args={[0.035, 0.32, 0.03]} />
        </mesh>
      ))}

      {/* monitor */}
      <group position={[0, 0, -0.15]}>
        <RoundedBox args={[1.3, 0.12, 1.2]} radius={0.04} position={[0, 0.66, 0]} material={m.shade} />
        <RoundedBox args={[3.35, 2.8, 2.7]} radius={0.2} smoothness={4} position={[0, 2.1, 0]} material={m.plastic} />
        <RoundedBox args={[2.8, 2.15, 0.12]} radius={0.05} position={[0, 2.22, 1.32]} material={m.shade} />
        <CRTScreen />
        <pointLight ref={glow} position={[0, 2.1, 2.4]} color="#ffa640" distance={6} decay={2} />
        <mesh position={[1.3, 0.95, 1.36]} material={m.led}>
          <boxGeometry args={[0.07, 0.07, 0.03]} />
        </mesh>
        <mesh position={[1.08, 0.95, 1.36]} rotation={[Math.PI / 2, 0, 0]} material={m.shade}>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 20]} />
        </mesh>
        <Badge />
      </group>

      <Keyboard keycap={m.keycap} plastic={m.plastic} orange={m.orange} />

      {/* mouse */}
      <RoundedBox args={[0.4, 0.15, 0.62]} radius={0.07} position={[2.45, 0.075, 2.95]} material={m.plastic} />
    </group>
  );
}

/** Model plate with a striped logo, drawn to a tiny canvas. */
function Badge() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 48;
    const ctx = c.getContext("2d")!;
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-plex").trim() || "monospace";
    ctx.fillStyle = "#6b6352";
    ctx.font = `500 30px ${mono}`;
    ctx.textBaseline = "middle";
    ctx.fillText("FN-26", 4, 26);
    ["#e0402a", "#f08a24", "#f2c230", "#4fa84a", "#2f7ec9"].forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(132 + i * 18, 14, 14, 22);
    });
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[-1.0, 0.95, 1.36]}>
      <planeGeometry args={[0.75, 0.14]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

const COLS = 15;
const ROWS = 4;

/** Instanced keycaps; one random cap dips each time the visitor types. */
function Keyboard({ keycap, plastic, orange }: { keycap: THREE.Material; plastic: THREE.Material; orange: THREE.Material }) {
  const caps = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const base = useMemo(() => {
    const out: THREE.Vector3[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) out.push(new THREE.Vector3(-1.575 + c * 0.225 + (r % 2) * 0.05, 0.22, -0.42 + r * 0.24));
    return out;
  }, []);
  const press = useRef({ i: -1, t: 0 });

  useEffect(
    () =>
      terminal.onKey(() => {
        press.current = { i: Math.floor(Math.random() * base.length), t: performance.now() };
      }),
    [base],
  );

  useFrame(() => {
    const mesh = caps.current;
    if (!mesh) return;
    const now = performance.now();
    base.forEach((p, i) => {
      const dip = i === press.current.i ? Math.max(0, 1 - (now - press.current.t) / 120) * 0.05 : 0;
      dummy.position.set(p.x, p.y - dip, p.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 2.85]} rotation={[0.06, 0, 0]}>
      <RoundedBox args={[3.7, 0.18, 1.3]} radius={0.06} position={[0, 0.09, 0]} material={plastic} />
      <instancedMesh ref={caps} args={[undefined, undefined, base.length]} material={keycap}>
        <boxGeometry args={[0.19, 0.09, 0.19]} />
      </instancedMesh>
      <RoundedBox args={[1.4, 0.09, 0.19]} radius={0.03} position={[0, 0.22, 0.54]} material={keycap} />
      <mesh position={[1.62, 0.22, 0.54]} material={orange}>
        <boxGeometry args={[0.19, 0.09, 0.19]} />
      </mesh>
    </group>
  );
}
