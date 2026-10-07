"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Workstation } from "./Workstation";
import { Rig } from "./Rig";
import { FallbackCRT } from "./FallbackCRT";

type Props = { stageRef: RefObject<HTMLDivElement | null>; visible: boolean };

export default function WorkstationCanvas({ stageRef, visible }: Props) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      flat // no tone mapping: keeps the beige plastic true to its color
      dpr={[1, 2]}
      frameloop={visible ? "always" : "never"}
      camera={{ fov: 30, position: [0, 3.4, 11.5], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      fallback={<FallbackCRT />}
    >
      <hemisphereLight args={["#fff6e6", "#8a8170", 1.4]} />
      <directionalLight position={[-5, 9, 7]} intensity={1.8} />
      <directionalLight position={[6, 4, -6]} intensity={0.6} color="#ffd9a8" />
      <Rig stageRef={stageRef}>
        <Workstation />
      </Rig>
      <ContactShadows position={[0, 0.001, 0.6]} scale={14} blur={2.6} far={4} opacity={0.4} />
    </Canvas>
  );
}
