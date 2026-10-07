"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ui } from "@/lib/store";
import { getLenis } from "@/lib/scroll";

const BASE = { pos: new THREE.Vector3(0, 3.4, 11.5), look: new THREE.Vector3(0, 1.45, 0.9) };
const FOCUS = { pos: new THREE.Vector3(0, 2.1, 5.15), look: new THREE.Vector3(0, 2.08, 1.2) };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** Frame-rate independent smoothing factor: same feel at 60Hz and 120Hz. */
const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

type Props = { stageRef: RefObject<HTMLDivElement | null>; children: ReactNode };

/**
 * Turns the machine with the cursor, hero scroll progress and Lenis scroll velocity,
 * and flies the camera up to the CRT while the terminal is focused.
 */
export function Rig({ stageRef, children }: Props) {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const look = useRef(BASE.look.clone());
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { focused } = ui.get();
    const p = pointer.current;
    p.sx += (p.x - p.sx) * damp(3, dt);
    p.sy += (p.y - p.sy) * damp(3, dt);

    const rect = stageRef.current?.getBoundingClientRect();
    const scrollP = rect ? clamp(-rect.top / Math.max(1, rect.height), 0, 1) : 0;
    const velocity = clamp(getLenis()?.velocity ?? 0, -40, 40);
    const idle = reduce.current ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.07;

    const targetY = focused ? 0 : -0.35 + idle + p.sx * 0.28 + scrollP * 0.9;
    const targetX = focused ? 0 : p.sy * 0.06 + velocity * 0.002;
    g.rotation.y += (targetY - g.rotation.y) * damp(4, dt);
    g.rotation.x += (targetX - g.rotation.x) * damp(4, dt);

    const goal = focused ? FOCUS : BASE;
    const k = reduce.current ? 1 : damp(3.5, dt);
    camera.position.lerp(goal.pos, k);
    look.current.lerp(goal.look, k);
    camera.lookAt(look.current);

    // pull back on narrow screens so the whole desk fits
    const fov = state.size.width / Math.max(1, state.size.height) < 0.9 ? 42 : 30;
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return <group ref={group}>{children}</group>;
}
